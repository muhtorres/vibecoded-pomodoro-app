import { create } from 'zustand';
import { TimerPhase, TimerState } from '@/types/timer';
import { useSettingsStore } from './useSettingsStore';
import { useStatsStore } from './useStatsStore';

interface TimerActions {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
  syncWithBackground: () => void;
}

const getPhaseSeconds = (phase: TimerPhase): number => {
  const settings = useSettingsStore.getState();
  switch (phase) {
    case 'work':
      return settings.workMinutes * 60;
    case 'shortBreak':
      return settings.shortBreakMinutes * 60;
    case 'longBreak':
      return settings.longBreakMinutes * 60;
  }
};

const getNextPhase = (
  currentPhase: TimerPhase,
  currentSession: number,
  sessionsBeforeLongBreak: number
): { phase: TimerPhase; session: number } => {
  if (currentPhase === 'work') {
    if (currentSession >= sessionsBeforeLongBreak) {
      return { phase: 'longBreak', session: currentSession };
    }
    return { phase: 'shortBreak', session: currentSession };
  }
  if (currentPhase === 'longBreak') {
    return { phase: 'work', session: 1 };
  }
  return { phase: 'work', session: currentSession + 1 };
};

const initialSeconds = () => getPhaseSeconds('work');

export const useTimerStore = create<TimerState & TimerActions>()((set, get) => ({
  phase: 'work',
  remainingSeconds: initialSeconds(),
  totalSeconds: initialSeconds(),
  isRunning: false,
  isPaused: false,
  currentSession: 1,
  completedPomodoros: 0,
  startTimestamp: null,

  start: () => {
    const total = getPhaseSeconds(get().phase);
    set({
      isRunning: true,
      isPaused: false,
      remainingSeconds: total,
      totalSeconds: total,
      startTimestamp: Date.now(),
    });
  },

  pause: () => {
    set({
      isRunning: false,
      isPaused: true,
      startTimestamp: null,
    });
  },

  resume: () => {
    set({
      isRunning: true,
      isPaused: false,
      startTimestamp: Date.now() - (get().totalSeconds - get().remainingSeconds) * 1000,
    });
  },

  reset: () => {
    const total = getPhaseSeconds(get().phase);
    set({
      isRunning: false,
      isPaused: false,
      remainingSeconds: total,
      totalSeconds: total,
      startTimestamp: null,
    });
  },

  skip: () => {
    const settings = useSettingsStore.getState();
    const { phase, currentSession } = get();
    const next = getNextPhase(phase, currentSession, settings.sessionsBeforeLongBreak);
    const total = getPhaseSeconds(next.phase);

    const shouldAutoStart =
      (next.phase === 'work' && settings.autoStartWork) ||
      (next.phase !== 'work' && settings.autoStartBreak);

    set({
      phase: next.phase,
      currentSession: next.session,
      remainingSeconds: total,
      totalSeconds: total,
      isRunning: shouldAutoStart,
      isPaused: false,
      startTimestamp: shouldAutoStart ? Date.now() : null,
    });
  },

  tick: () => {
    const state = get();
    if (!state.isRunning) return;

    if (state.remainingSeconds <= 1) {
      const settings = useSettingsStore.getState();
      const wasWork = state.phase === 'work';
      const newCompletedPomodoros = wasWork
        ? state.completedPomodoros + 1
        : state.completedPomodoros;

      if (wasWork) {
        useStatsStore.getState().recordSession(settings.workMinutes);
      }

      const next = getNextPhase(
        state.phase,
        state.currentSession,
        settings.sessionsBeforeLongBreak
      );
      const total = getPhaseSeconds(next.phase);

      const shouldAutoStart =
        (next.phase === 'work' && settings.autoStartWork) ||
        (next.phase !== 'work' && settings.autoStartBreak);

      set({
        phase: next.phase,
        currentSession: next.session,
        remainingSeconds: total,
        totalSeconds: total,
        isRunning: shouldAutoStart,
        isPaused: false,
        completedPomodoros: newCompletedPomodoros,
        startTimestamp: shouldAutoStart ? Date.now() : null,
      });

      return;
    }

    set({ remainingSeconds: state.remainingSeconds - 1 });
  },

  syncWithBackground: () => {
    const state = get();
    if (!state.isRunning || !state.startTimestamp) return;

    const elapsed = Math.floor((Date.now() - state.startTimestamp) / 1000);
    const remaining = Math.max(0, state.totalSeconds - elapsed);

    if (remaining <= 0) {
      get().tick();
    } else {
      set({ remainingSeconds: remaining });
    }
  },
}));

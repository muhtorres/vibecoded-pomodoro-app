export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export interface TimerState {
  phase: TimerPhase;
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  currentSession: number;
  completedPomodoros: number;
  startTimestamp: number | null;
}

export interface SessionRecord {
  id: string;
  date: string;
  phase: TimerPhase;
  durationMinutes: number;
  completedAt: number;
}

export interface DailyStats {
  date: string;
  completedPomodoros: number;
  totalFocusMinutes: number;
}

export interface SettingsState {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartBreak: boolean;
  autoStartWork: boolean;
  keepScreenOn: boolean;
  vibrationEnabled: boolean;
  dailyGoal: number;
  theme: 'light' | 'dark' | 'system';
}

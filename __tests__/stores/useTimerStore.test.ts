import { useTimerStore } from '@/stores/useTimerStore';
import { useSettingsStore } from '@/stores/useSettingsStore';

describe('useTimerStore', () => {
  beforeEach(() => {
    useSettingsStore.getState().resetToDefaults();
    const workSeconds = useSettingsStore.getState().workMinutes * 60;
    useTimerStore.setState({
      phase: 'work',
      remainingSeconds: workSeconds,
      totalSeconds: workSeconds,
      isRunning: false,
      isPaused: false,
      currentSession: 1,
      completedPomodoros: 0,
      startTimestamp: null,
    });
  });

  describe('estado inicial', () => {
    it('inicia na fase work', () => {
      expect(useTimerStore.getState().phase).toBe('work');
    });

    it('inicia com o tempo correto baseado nas configuracoes', () => {
      const workSeconds = useSettingsStore.getState().workMinutes * 60;
      expect(useTimerStore.getState().remainingSeconds).toBe(workSeconds);
      expect(useTimerStore.getState().totalSeconds).toBe(workSeconds);
    });

    it('inicia parado', () => {
      expect(useTimerStore.getState().isRunning).toBe(false);
      expect(useTimerStore.getState().isPaused).toBe(false);
    });

    it('inicia na sessao 1', () => {
      expect(useTimerStore.getState().currentSession).toBe(1);
    });

    it('inicia com 0 pomodoros completados', () => {
      expect(useTimerStore.getState().completedPomodoros).toBe(0);
    });
  });

  describe('start', () => {
    it('inicia o timer', () => {
      useTimerStore.getState().start();
      const state = useTimerStore.getState();

      expect(state.isRunning).toBe(true);
      expect(state.isPaused).toBe(false);
      expect(state.startTimestamp).not.toBeNull();
    });

    it('define remainingSeconds e totalSeconds com base na fase atual', () => {
      useTimerStore.getState().start();
      const workSeconds = useSettingsStore.getState().workMinutes * 60;
      expect(useTimerStore.getState().remainingSeconds).toBe(workSeconds);
      expect(useTimerStore.getState().totalSeconds).toBe(workSeconds);
    });
  });

  describe('pause', () => {
    it('pausa o timer em execucao', () => {
      useTimerStore.getState().start();
      useTimerStore.getState().pause();

      const state = useTimerStore.getState();
      expect(state.isRunning).toBe(false);
      expect(state.isPaused).toBe(true);
      expect(state.startTimestamp).toBeNull();
    });
  });

  describe('resume', () => {
    it('retoma o timer pausado', () => {
      useTimerStore.getState().start();
      useTimerStore.getState().pause();
      useTimerStore.getState().resume();

      const state = useTimerStore.getState();
      expect(state.isRunning).toBe(true);
      expect(state.isPaused).toBe(false);
      expect(state.startTimestamp).not.toBeNull();
    });
  });

  describe('reset', () => {
    it('reseta o timer para o estado inicial da fase atual', () => {
      useTimerStore.getState().start();
      // Simulate some ticks
      useTimerStore.getState().tick();
      useTimerStore.getState().tick();
      useTimerStore.getState().reset();

      const state = useTimerStore.getState();
      const workSeconds = useSettingsStore.getState().workMinutes * 60;

      expect(state.isRunning).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.remainingSeconds).toBe(workSeconds);
      expect(state.totalSeconds).toBe(workSeconds);
      expect(state.startTimestamp).toBeNull();
    });
  });

  describe('tick', () => {
    it('decrementa remainingSeconds em 1', () => {
      useTimerStore.getState().start();
      const before = useTimerStore.getState().remainingSeconds;
      useTimerStore.getState().tick();
      expect(useTimerStore.getState().remainingSeconds).toBe(before - 1);
    });

    it('nao faz nada se o timer nao esta rodando', () => {
      const before = useTimerStore.getState().remainingSeconds;
      useTimerStore.getState().tick();
      expect(useTimerStore.getState().remainingSeconds).toBe(before);
    });

    it('transiciona de work para shortBreak quando o tempo acaba', () => {
      useTimerStore.getState().start();
      // Set remaining to 1 so next tick completes
      useTimerStore.setState({ remainingSeconds: 1 });
      useTimerStore.getState().tick();

      const state = useTimerStore.getState();
      expect(state.phase).toBe('shortBreak');
      expect(state.completedPomodoros).toBe(1);
    });

    it('transiciona de work para longBreak na ultima sessao', () => {
      const sessions = useSettingsStore.getState().sessionsBeforeLongBreak;
      useTimerStore.getState().start();
      useTimerStore.setState({ currentSession: sessions, remainingSeconds: 1 });
      useTimerStore.getState().tick();

      expect(useTimerStore.getState().phase).toBe('longBreak');
    });

    it('transiciona de shortBreak para work incrementando sessao', () => {
      // Move to shortBreak first
      useTimerStore.setState({
        phase: 'shortBreak',
        currentSession: 1,
        isRunning: true,
        remainingSeconds: 1,
        totalSeconds: 300,
        startTimestamp: Date.now(),
      });
      useTimerStore.getState().tick();

      const state = useTimerStore.getState();
      expect(state.phase).toBe('work');
      expect(state.currentSession).toBe(2);
    });

    it('transiciona de longBreak para work resetando sessao para 1', () => {
      useTimerStore.setState({
        phase: 'longBreak',
        currentSession: 4,
        isRunning: true,
        remainingSeconds: 1,
        totalSeconds: 900,
        startTimestamp: Date.now(),
      });
      useTimerStore.getState().tick();

      const state = useTimerStore.getState();
      expect(state.phase).toBe('work');
      expect(state.currentSession).toBe(1);
    });

    it('auto-inicia break quando autoStartBreak esta ativo', () => {
      useSettingsStore.getState().updateSetting('autoStartBreak', true);
      useTimerStore.getState().start();
      useTimerStore.setState({ remainingSeconds: 1 });
      useTimerStore.getState().tick();

      expect(useTimerStore.getState().isRunning).toBe(true);
      expect(useTimerStore.getState().phase).toBe('shortBreak');
    });

    it('nao auto-inicia work quando autoStartWork esta desativo', () => {
      useSettingsStore.getState().updateSetting('autoStartWork', false);
      useTimerStore.setState({
        phase: 'shortBreak',
        isRunning: true,
        remainingSeconds: 1,
        totalSeconds: 300,
        startTimestamp: Date.now(),
      });
      useTimerStore.getState().tick();

      expect(useTimerStore.getState().isRunning).toBe(false);
      expect(useTimerStore.getState().phase).toBe('work');
    });
  });

  describe('skip', () => {
    it('pula de work para shortBreak', () => {
      useTimerStore.getState().skip();
      expect(useTimerStore.getState().phase).toBe('shortBreak');
    });

    it('pula de shortBreak para work incrementando sessao', () => {
      useTimerStore.setState({ phase: 'shortBreak', currentSession: 1 });
      useTimerStore.getState().skip();

      expect(useTimerStore.getState().phase).toBe('work');
      expect(useTimerStore.getState().currentSession).toBe(2);
    });

    it('pula de work para longBreak na ultima sessao', () => {
      const sessions = useSettingsStore.getState().sessionsBeforeLongBreak;
      useTimerStore.setState({ currentSession: sessions });
      useTimerStore.getState().skip();

      expect(useTimerStore.getState().phase).toBe('longBreak');
    });

    it('pula de longBreak para work resetando sessao', () => {
      useTimerStore.setState({ phase: 'longBreak', currentSession: 4 });
      useTimerStore.getState().skip();

      expect(useTimerStore.getState().phase).toBe('work');
      expect(useTimerStore.getState().currentSession).toBe(1);
    });

    it('define o tempo correto para a nova fase', () => {
      useTimerStore.getState().skip();
      const shortBreakSeconds = useSettingsStore.getState().shortBreakMinutes * 60;
      expect(useTimerStore.getState().remainingSeconds).toBe(shortBreakSeconds);
      expect(useTimerStore.getState().totalSeconds).toBe(shortBreakSeconds);
    });
  });

  describe('syncWithBackground', () => {
    it('nao faz nada se o timer nao esta rodando', () => {
      const before = useTimerStore.getState().remainingSeconds;
      useTimerStore.getState().syncWithBackground();
      expect(useTimerStore.getState().remainingSeconds).toBe(before);
    });

    it('atualiza remainingSeconds baseado no tempo decorrido', () => {
      useTimerStore.getState().start();
      const total = useTimerStore.getState().totalSeconds;
      // Simulate 10 seconds elapsed
      useTimerStore.setState({ startTimestamp: Date.now() - 10000 });
      useTimerStore.getState().syncWithBackground();

      expect(useTimerStore.getState().remainingSeconds).toBe(total - 10);
    });
  });
});

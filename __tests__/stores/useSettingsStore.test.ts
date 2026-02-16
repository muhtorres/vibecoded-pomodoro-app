import { useSettingsStore } from '@/stores/useSettingsStore';
import { DEFAULT_SETTINGS } from '@/constants/defaults';

describe('useSettingsStore', () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useSettingsStore.getState().resetToDefaults();
  });

  it('inicia com os valores padrao', () => {
    const state = useSettingsStore.getState();
    expect(state.workMinutes).toBe(DEFAULT_SETTINGS.workMinutes);
    expect(state.shortBreakMinutes).toBe(DEFAULT_SETTINGS.shortBreakMinutes);
    expect(state.longBreakMinutes).toBe(DEFAULT_SETTINGS.longBreakMinutes);
    expect(state.sessionsBeforeLongBreak).toBe(DEFAULT_SETTINGS.sessionsBeforeLongBreak);
    expect(state.autoStartBreak).toBe(DEFAULT_SETTINGS.autoStartBreak);
    expect(state.autoStartWork).toBe(DEFAULT_SETTINGS.autoStartWork);
    expect(state.keepScreenOn).toBe(DEFAULT_SETTINGS.keepScreenOn);
    expect(state.vibrationEnabled).toBe(DEFAULT_SETTINGS.vibrationEnabled);
    expect(state.dailyGoal).toBe(DEFAULT_SETTINGS.dailyGoal);
    expect(state.theme).toBe(DEFAULT_SETTINGS.theme);
  });

  it('atualiza uma configuracao numerica', () => {
    useSettingsStore.getState().updateSetting('workMinutes', 30);
    expect(useSettingsStore.getState().workMinutes).toBe(30);
  });

  it('atualiza uma configuracao booleana', () => {
    useSettingsStore.getState().updateSetting('autoStartWork', true);
    expect(useSettingsStore.getState().autoStartWork).toBe(true);
  });

  it('atualiza o tema', () => {
    useSettingsStore.getState().updateSetting('theme', 'dark');
    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  it('reseta para os valores padrao', () => {
    useSettingsStore.getState().updateSetting('workMinutes', 50);
    useSettingsStore.getState().updateSetting('shortBreakMinutes', 10);
    useSettingsStore.getState().updateSetting('theme', 'dark');

    useSettingsStore.getState().resetToDefaults();

    const state = useSettingsStore.getState();
    expect(state.workMinutes).toBe(DEFAULT_SETTINGS.workMinutes);
    expect(state.shortBreakMinutes).toBe(DEFAULT_SETTINGS.shortBreakMinutes);
    expect(state.theme).toBe(DEFAULT_SETTINGS.theme);
  });

  it('atualiza multiplas configuracoes independentemente', () => {
    useSettingsStore.getState().updateSetting('workMinutes', 45);
    useSettingsStore.getState().updateSetting('dailyGoal', 12);

    expect(useSettingsStore.getState().workMinutes).toBe(45);
    expect(useSettingsStore.getState().dailyGoal).toBe(12);
    // Other settings remain default
    expect(useSettingsStore.getState().shortBreakMinutes).toBe(DEFAULT_SETTINGS.shortBreakMinutes);
  });
});

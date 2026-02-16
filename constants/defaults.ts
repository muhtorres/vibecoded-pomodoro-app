import { SettingsState } from '@/types/timer';

export const DEFAULT_SETTINGS: SettingsState = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreak: true,
  autoStartWork: false,
  keepScreenOn: true,
  vibrationEnabled: true,
  dailyGoal: 8,
  theme: 'system',
} as const;

export const TIMER_LIMITS = {
  minWork: 1,
  maxWork: 90,
  minShortBreak: 1,
  maxShortBreak: 30,
  minLongBreak: 1,
  maxLongBreak: 60,
  minSessions: 2,
  maxSessions: 8,
  minDailyGoal: 1,
  maxDailyGoal: 20,
} as const;

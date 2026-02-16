import { TimerPhase } from '@/types/timer';

export const Colors = {
  light: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#F0F0F0',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
    tabIconDefault: '#9CA3AF',
  },
  dark: {
    background: '#0F0F1A',
    surface: '#1A1A2E',
    surfaceVariant: '#252540',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    tabBar: '#1A1A2E',
    tabBarBorder: '#252540',
    tabIconDefault: '#6B7280',
  },
} as const;

export const PhaseColors: Record<TimerPhase, { primary: string; background: { light: string; dark: string } }> = {
  work: {
    primary: '#E74C3C',
    background: { light: '#FEF2F2', dark: '#1A0F0F' },
  },
  shortBreak: {
    primary: '#27AE60',
    background: { light: '#F0FDF4', dark: '#0F1A12' },
  },
  longBreak: {
    primary: '#3498DB',
    background: { light: '#EFF6FF', dark: '#0F141A' },
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  timer: 56,
} as const;

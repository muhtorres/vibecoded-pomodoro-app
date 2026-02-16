import React from 'react';
import { render } from '@testing-library/react-native';
import { CircularProgress } from '@/components/timer/CircularProgress';

// Mock useAppTheme
jest.mock('@/hooks/useAppTheme', () => ({
  useAppTheme: () => ({
    isDark: false,
    colors: {
      text: '#1A1A2E',
      textSecondary: '#6B7280',
      background: '#F5F5F5',
      surface: '#FFFFFF',
    },
    getPhaseColor: (phase: string) => {
      const colors: Record<string, string> = {
        work: '#E74C3C',
        shortBreak: '#27AE60',
        longBreak: '#3498DB',
      };
      return colors[phase] ?? '#E74C3C';
    },
    getPhaseBackground: () => '#FEF2F2',
  }),
}));

describe('CircularProgress', () => {
  it('renderiza sem erros', () => {
    const { getByLabelText } = render(
      <CircularProgress
        remainingSeconds={1500}
        totalSeconds={1500}
        phase="work"
        isRunning={false}
      />
    );

    expect(getByLabelText('Timer: 25:00 restantes')).toBeTruthy();
  });

  it('exibe o tempo formatado corretamente', () => {
    const { getByText } = render(
      <CircularProgress
        remainingSeconds={1500}
        totalSeconds={1500}
        phase="work"
        isRunning={false}
      />
    );

    expect(getByText('25:00')).toBeTruthy();
  });

  it('exibe tempo parcial corretamente', () => {
    const { getByText } = render(
      <CircularProgress
        remainingSeconds={754}
        totalSeconds={1500}
        phase="work"
        isRunning={true}
      />
    );

    expect(getByText('12:34')).toBeTruthy();
  });

  it('tem accessibilityLabel com tempo restante', () => {
    const { getByLabelText } = render(
      <CircularProgress
        remainingSeconds={300}
        totalSeconds={1500}
        phase="work"
        isRunning={true}
      />
    );

    expect(getByLabelText('Timer: 05:00 restantes')).toBeTruthy();
  });

  it('renderiza para diferentes fases', () => {
    const phases = ['work', 'shortBreak', 'longBreak'] as const;

    phases.forEach((phase) => {
      const { unmount } = render(
        <CircularProgress
          remainingSeconds={300}
          totalSeconds={300}
          phase={phase}
          isRunning={false}
        />
      );
      unmount();
    });
  });
});

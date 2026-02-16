import React from 'react';
import { render } from '@testing-library/react-native';
import { SessionIndicator } from '@/components/timer/SessionIndicator';

jest.mock('@/hooks/useAppTheme', () => ({
  useAppTheme: () => ({
    isDark: false,
    colors: {
      text: '#1A1A2E',
      textSecondary: '#6B7280',
    },
    getPhaseColor: (phase: string) => {
      const colors: Record<string, string> = {
        work: '#E74C3C',
        shortBreak: '#27AE60',
        longBreak: '#3498DB',
      };
      return colors[phase] ?? '#E74C3C';
    },
  }),
}));

describe('SessionIndicator', () => {
  it('renderiza sem erros', () => {
    const { getByText } = render(
      <SessionIndicator phase="work" currentSession={1} totalSessions={4} />
    );

    expect(getByText('Foco')).toBeTruthy();
  });

  it('exibe o label correto da fase', () => {
    const { getByText, rerender } = render(
      <SessionIndicator phase="work" currentSession={1} totalSessions={4} />
    );
    expect(getByText('Foco')).toBeTruthy();

    rerender(
      <SessionIndicator phase="shortBreak" currentSession={1} totalSessions={4} />
    );
    expect(getByText('Pausa Curta')).toBeTruthy();

    rerender(
      <SessionIndicator phase="longBreak" currentSession={4} totalSessions={4} />
    );
    expect(getByText('Pausa Longa')).toBeTruthy();
  });

  it('exibe contagem de sessao correta', () => {
    const { getByText } = render(
      <SessionIndicator phase="work" currentSession={2} totalSessions={4} />
    );

    expect(getByText('2/4')).toBeTruthy();
  });

  it('tem accessibilityLabel correto', () => {
    const { getByLabelText } = render(
      <SessionIndicator phase="work" currentSession={3} totalSessions={4} />
    );

    expect(getByLabelText('Foco, sessao 3 de 4')).toBeTruthy();
  });
});

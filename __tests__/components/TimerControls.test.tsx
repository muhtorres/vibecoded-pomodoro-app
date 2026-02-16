import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TimerControls } from '@/components/timer/TimerControls';

jest.mock('@/hooks/useAppTheme', () => ({
  useAppTheme: () => ({
    isDark: false,
    colors: {
      text: '#1A1A2E',
      textSecondary: '#6B7280',
    },
    getPhaseColor: () => '#E74C3C',
  }),
}));

jest.mock('@/stores/useSettingsStore', () => ({
  useSettingsStore: (selector: (state: { vibrationEnabled: boolean }) => boolean) =>
    selector({ vibrationEnabled: false }),
}));

describe('TimerControls', () => {
  const defaultProps = {
    isRunning: false,
    isPaused: false,
    phase: 'work' as const,
    onStart: jest.fn(),
    onPause: jest.fn(),
    onResume: jest.fn(),
    onReset: jest.fn(),
    onSkip: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza botao "Iniciar" quando parado', () => {
    const { getByText } = render(<TimerControls {...defaultProps} />);
    expect(getByText('Iniciar')).toBeTruthy();
  });

  it('chama onStart ao pressionar "Iniciar"', () => {
    const { getByText } = render(<TimerControls {...defaultProps} />);
    fireEvent.press(getByText('Iniciar'));
    expect(defaultProps.onStart).toHaveBeenCalledTimes(1);
  });

  it('renderiza "Pausar" quando rodando', () => {
    const { getByText } = render(
      <TimerControls {...defaultProps} isRunning={true} />
    );
    expect(getByText('Pausar')).toBeTruthy();
  });

  it('chama onPause ao pressionar "Pausar"', () => {
    const { getByText } = render(
      <TimerControls {...defaultProps} isRunning={true} />
    );
    fireEvent.press(getByText('Pausar'));
    expect(defaultProps.onPause).toHaveBeenCalledTimes(1);
  });

  it('renderiza "Retomar" quando pausado', () => {
    const { getByText } = render(
      <TimerControls {...defaultProps} isPaused={true} />
    );
    expect(getByText('Retomar')).toBeTruthy();
  });

  it('chama onResume ao pressionar "Retomar"', () => {
    const { getByText } = render(
      <TimerControls {...defaultProps} isPaused={true} />
    );
    fireEvent.press(getByText('Retomar'));
    expect(defaultProps.onResume).toHaveBeenCalledTimes(1);
  });

  it('exibe botoes reset e skip quando rodando', () => {
    const { getByLabelText } = render(
      <TimerControls {...defaultProps} isRunning={true} />
    );
    expect(getByLabelText('Resetar timer')).toBeTruthy();
    expect(getByLabelText('Pular para proxima fase')).toBeTruthy();
  });

  it('exibe botoes reset e skip quando pausado', () => {
    const { getByLabelText } = render(
      <TimerControls {...defaultProps} isPaused={true} />
    );
    expect(getByLabelText('Resetar timer')).toBeTruthy();
    expect(getByLabelText('Pular para proxima fase')).toBeTruthy();
  });

  it('nao exibe botoes reset e skip quando parado', () => {
    const { queryByLabelText } = render(
      <TimerControls {...defaultProps} />
    );
    expect(queryByLabelText('Resetar timer')).toBeNull();
    expect(queryByLabelText('Pular para proxima fase')).toBeNull();
  });

  it('chama onReset ao pressionar reset', () => {
    const { getByLabelText } = render(
      <TimerControls {...defaultProps} isRunning={true} />
    );
    fireEvent.press(getByLabelText('Resetar timer'));
    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });

  it('chama onSkip ao pressionar skip', () => {
    const { getByLabelText } = render(
      <TimerControls {...defaultProps} isRunning={true} />
    );
    fireEvent.press(getByLabelText('Pular para proxima fase'));
    expect(defaultProps.onSkip).toHaveBeenCalledTimes(1);
  });
});

export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const getPhaseLabel = (phase: 'work' | 'shortBreak' | 'longBreak'): string => {
  const labels = {
    work: 'Foco',
    shortBreak: 'Pausa Curta',
    longBreak: 'Pausa Longa',
  } as const;
  return labels[phase];
};

export const getTodayKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
};

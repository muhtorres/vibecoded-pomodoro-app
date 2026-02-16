import { formatTime, getPhaseLabel, getTodayKey } from '@/utils/formatTime';

describe('formatTime', () => {
  it('formata 0 segundos como 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formata segundos menores que 1 minuto', () => {
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(30)).toBe('00:30');
    expect(formatTime(59)).toBe('00:59');
  });

  it('formata minutos exatos', () => {
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(300)).toBe('05:00');
    expect(formatTime(1500)).toBe('25:00');
  });

  it('formata minutos e segundos combinados', () => {
    expect(formatTime(61)).toBe('01:01');
    expect(formatTime(125)).toBe('02:05');
    expect(formatTime(1499)).toBe('24:59');
  });

  it('formata valores grandes corretamente', () => {
    expect(formatTime(3600)).toBe('60:00');
    expect(formatTime(5400)).toBe('90:00');
  });
});

describe('getPhaseLabel', () => {
  it('retorna "Foco" para fase work', () => {
    expect(getPhaseLabel('work')).toBe('Foco');
  });

  it('retorna "Pausa Curta" para fase shortBreak', () => {
    expect(getPhaseLabel('shortBreak')).toBe('Pausa Curta');
  });

  it('retorna "Pausa Longa" para fase longBreak', () => {
    expect(getPhaseLabel('longBreak')).toBe('Pausa Longa');
  });
});

describe('getTodayKey', () => {
  it('retorna data no formato YYYY-MM-DD', () => {
    const key = getTodayKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('retorna a data de hoje', () => {
    const now = new Date();
    const expected = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    expect(getTodayKey()).toBe(expected);
  });
});

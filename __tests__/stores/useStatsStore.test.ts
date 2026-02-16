import { useStatsStore } from '@/stores/useStatsStore';
import { getTodayKey } from '@/utils/formatTime';

describe('useStatsStore', () => {
  beforeEach(() => {
    // Reset store
    useStatsStore.setState({ dailyStats: {} });
  });

  describe('recordSession', () => {
    it('registra uma sessao no dia atual', () => {
      useStatsStore.getState().recordSession(25);
      const today = getTodayKey();
      const stats = useStatsStore.getState().dailyStats[today];

      expect(stats).toBeDefined();
      expect(stats.completedPomodoros).toBe(1);
      expect(stats.totalFocusMinutes).toBe(25);
    });

    it('acumula multiplas sessoes no mesmo dia', () => {
      useStatsStore.getState().recordSession(25);
      useStatsStore.getState().recordSession(25);
      useStatsStore.getState().recordSession(25);

      const today = getTodayKey();
      const stats = useStatsStore.getState().dailyStats[today];

      expect(stats.completedPomodoros).toBe(3);
      expect(stats.totalFocusMinutes).toBe(75);
    });
  });

  describe('getTodayStats', () => {
    it('retorna stats vazias quando nao ha dados', () => {
      const stats = useStatsStore.getState().getTodayStats();

      expect(stats.completedPomodoros).toBe(0);
      expect(stats.totalFocusMinutes).toBe(0);
    });

    it('retorna stats do dia atual', () => {
      useStatsStore.getState().recordSession(25);
      const stats = useStatsStore.getState().getTodayStats();

      expect(stats.completedPomodoros).toBe(1);
      expect(stats.totalFocusMinutes).toBe(25);
    });
  });

  describe('getWeekStats', () => {
    it('retorna 7 dias de stats', () => {
      const weekStats = useStatsStore.getState().getWeekStats();
      expect(weekStats).toHaveLength(7);
    });

    it('retorna stats vazias para dias sem dados', () => {
      const weekStats = useStatsStore.getState().getWeekStats();
      weekStats.forEach((day) => {
        expect(day.completedPomodoros).toBe(0);
        expect(day.totalFocusMinutes).toBe(0);
      });
    });

    it('inclui dados do dia atual no ultimo elemento', () => {
      useStatsStore.getState().recordSession(25);
      const weekStats = useStatsStore.getState().getWeekStats();
      const lastDay = weekStats[weekStats.length - 1];

      expect(lastDay.completedPomodoros).toBe(1);
      expect(lastDay.totalFocusMinutes).toBe(25);
    });
  });

  describe('getStreak', () => {
    it('retorna 0 quando nao ha dados', () => {
      expect(useStatsStore.getState().getStreak()).toBe(0);
    });

    it('retorna 1 quando ha sessao apenas hoje', () => {
      useStatsStore.getState().recordSession(25);
      expect(useStatsStore.getState().getStreak()).toBe(1);
    });

    it('conta dias consecutivos', () => {
      const today = new Date();
      const todayKey = getTodayKey();

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;

      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoKey = `${twoDaysAgo.getFullYear()}-${(twoDaysAgo.getMonth() + 1).toString().padStart(2, '0')}-${twoDaysAgo.getDate().toString().padStart(2, '0')}`;

      useStatsStore.setState({
        dailyStats: {
          [todayKey]: { date: todayKey, completedPomodoros: 2, totalFocusMinutes: 50 },
          [yesterdayKey]: { date: yesterdayKey, completedPomodoros: 3, totalFocusMinutes: 75 },
          [twoDaysAgoKey]: { date: twoDaysAgoKey, completedPomodoros: 1, totalFocusMinutes: 25 },
        },
      });

      expect(useStatsStore.getState().getStreak()).toBe(3);
    });

    it('interrompe streak quando encontra dia sem sessoes', () => {
      const today = new Date();
      const todayKey = getTodayKey();

      // Skip yesterday, add day before
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoKey = `${twoDaysAgo.getFullYear()}-${(twoDaysAgo.getMonth() + 1).toString().padStart(2, '0')}-${twoDaysAgo.getDate().toString().padStart(2, '0')}`;

      useStatsStore.setState({
        dailyStats: {
          [todayKey]: { date: todayKey, completedPomodoros: 1, totalFocusMinutes: 25 },
          [twoDaysAgoKey]: { date: twoDaysAgoKey, completedPomodoros: 1, totalFocusMinutes: 25 },
        },
      });

      // Streak should be 1 (only today counts, yesterday breaks it)
      expect(useStatsStore.getState().getStreak()).toBe(1);
    });
  });
});

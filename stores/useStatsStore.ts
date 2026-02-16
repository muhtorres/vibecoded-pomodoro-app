import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyStats } from '@/types/timer';
import { getTodayKey } from '@/utils/formatTime';

interface StatsState {
  dailyStats: Record<string, DailyStats>;
}

interface StatsActions {
  recordSession: (durationMinutes: number) => void;
  getTodayStats: () => DailyStats;
  getWeekStats: () => DailyStats[];
  getStreak: () => number;
}

const emptyDay = (date: string): DailyStats => ({
  date,
  completedPomodoros: 0,
  totalFocusMinutes: 0,
});

export const useStatsStore = create<StatsState & StatsActions>()(
  persist(
    (set, get) => ({
      dailyStats: {},

      recordSession: (durationMinutes) => {
        const today = getTodayKey();
        const current = get().dailyStats[today] ?? emptyDay(today);

        set({
          dailyStats: {
            ...get().dailyStats,
            [today]: {
              ...current,
              completedPomodoros: current.completedPomodoros + 1,
              totalFocusMinutes: current.totalFocusMinutes + durationMinutes,
            },
          },
        });
      },

      getTodayStats: () => {
        const today = getTodayKey();
        return get().dailyStats[today] ?? emptyDay(today);
      },

      getWeekStats: () => {
        const stats: DailyStats[] = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          stats.push(get().dailyStats[key] ?? emptyDay(key));
        }

        return stats;
      },

      getStreak: () => {
        let streak = 0;
        const now = new Date();

        for (let i = 0; i < 365; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          const day = get().dailyStats[key];

          if (day && day.completedPomodoros > 0) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }

        return streak;
      },
    }),
    {
      name: 'pomodoro-stats',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

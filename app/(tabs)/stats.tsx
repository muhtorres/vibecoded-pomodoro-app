import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { useStatsStore } from '@/stores/useStatsStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useTimerStore } from '@/stores/useTimerStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getTodayKey } from '@/utils/formatTime';
import { DailyStats } from '@/types/timer';

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const emptyDay = (date: string): DailyStats => ({
  date,
  completedPomodoros: 0,
  totalFocusMinutes: 0,
});

export default function StatsScreen() {
  const { colors, getPhaseColor } = useAppTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const accentColor = getPhaseColor('work');

  const dailyStats = useStatsStore((s) => s.dailyStats);
  const dailyGoal = useSettingsStore((s) => s.dailyGoal);
  const completedToday = useTimerStore((s) => s.completedPomodoros);

  const todayStats = useMemo(() => {
    const today = getTodayKey();
    return dailyStats[today] ?? emptyDay(today);
  }, [dailyStats]);

  const weekStats = useMemo(() => {
    const stats: DailyStats[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      stats.push(dailyStats[key] ?? emptyDay(key));
    }
    return stats;
  }, [dailyStats]);

  const streak = useMemo(() => {
    let count = 0;
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const day = dailyStats[key];
      if (day && day.completedPomodoros > 0) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [dailyStats]);

  const todayPomodoros = todayStats.completedPomodoros + completedToday;
  const progress = dailyGoal > 0 ? Math.min(todayPomodoros / dailyGoal, 1) : 0;

  const maxPomodoros = Math.max(...weekStats.map((d) => d.completedPomodoros), 1);
  const barWidth = Math.max((width - Spacing.md * 4 - Spacing.sm * 6) / 7, 24);

  const weekTotalMinutes = weekStats.reduce((sum, d) => sum + d.totalFocusMinutes, 0);
  const weekTotalPomodoros = weekStats.reduce((sum, d) => sum + d.completedPomodoros, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.lg }]}
    >
      <Card style={styles.goalCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Meta de Hoje</Text>
        <View style={styles.goalRow}>
          <Text style={[styles.goalNumber, { color: accentColor }]}>
            {todayPomodoros}
          </Text>
          <Text style={[styles.goalSlash, { color: colors.textSecondary }]}>/</Text>
          <Text style={[styles.goalTotal, { color: colors.textSecondary }]}>
            {dailyGoal}
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.surfaceVariant }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: accentColor, width: `${progress * 100}%` },
            ]}
          />
        </View>
        <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>
          pomodoros completos
        </Text>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ultimos 7 Dias</Text>
        <View style={styles.chartContainer}>
          {weekStats.map((day) => {
            const dayDate = new Date(day.date + 'T12:00:00');
            const dayLabel = WEEKDAY_LABELS[dayDate.getDay()];
            const barHeight = maxPomodoros > 0
              ? Math.max((day.completedPomodoros / maxPomodoros) * 120, 4)
              : 4;

            return (
              <View key={day.date} style={styles.barColumn}>
                <Text style={[styles.barValue, { color: colors.textSecondary }]}>
                  {day.completedPomodoros > 0 ? day.completedPomodoros : ''}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      width: barWidth,
                      backgroundColor: day.completedPomodoros > 0 ? accentColor : colors.surfaceVariant,
                      opacity: day.completedPomodoros > 0 ? 1 : 0.5,
                    },
                  ]}
                />
                <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
                  {dayLabel}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <FontAwesome name="fire" size={24} color="#F59E0B" />
          <Text style={[styles.statNumber, { color: colors.text }]}>{streak}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            {streak === 1 ? 'dia seguido' : 'dias seguidos'}
          </Text>
        </Card>

        <Card style={styles.statCard}>
          <FontAwesome name="clock-o" size={24} color={accentColor} />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {Math.round(weekTotalMinutes / 60 * 10) / 10}h
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            foco na semana
          </Text>
        </Card>

        <Card style={styles.statCard}>
          <FontAwesome name="check-circle" size={24} color="#27AE60" />
          <Text style={[styles.statNumber, { color: colors.text }]}>{weekTotalPomodoros}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            na semana
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  goalCard: {
    alignItems: 'center',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  goalNumber: {
    fontSize: 48,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  goalSlash: {
    fontSize: 32,
    fontWeight: '300',
    marginHorizontal: Spacing.xs,
  },
  goalTotal: {
    fontSize: 32,
    fontWeight: '300',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  goalLabel: {
    fontSize: FontSize.sm,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 180,
    paddingTop: Spacing.md,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.xs,
  },
  barValue: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    minHeight: 16,
  },
  bar: {
    borderRadius: BorderRadius.sm,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  statNumber: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
});

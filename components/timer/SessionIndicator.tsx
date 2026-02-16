import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TimerPhase } from '@/types/timer';
import { getPhaseLabel } from '@/utils/formatTime';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface SessionIndicatorProps {
  phase: TimerPhase;
  currentSession: number;
  totalSessions: number;
}

export const SessionIndicator = ({
  phase,
  currentSession,
  totalSessions,
}: SessionIndicatorProps) => {
  const { colors, getPhaseColor } = useAppTheme();
  const phaseColor = getPhaseColor(phase);

  return (
    <View style={styles.container} accessibilityLabel={`${getPhaseLabel(phase)}, sessao ${currentSession} de ${totalSessions}`}>
      <Text style={[styles.phaseLabel, { color: phaseColor }]}>
        {getPhaseLabel(phase)}
      </Text>
      <View style={styles.dots}>
        {Array.from({ length: totalSessions }, (_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i < currentSession ? phaseColor : 'transparent',
                borderColor: phaseColor,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.sessionText, { color: colors.textSecondary }]}>
        {currentSession}/{totalSessions}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  phaseLabel: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
  },
  sessionText: {
    fontSize: FontSize.sm,
  },
});

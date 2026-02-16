import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { TimerPhase } from '@/types/timer';
import { Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useSettingsStore } from '@/stores/useSettingsStore';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  phase: TimerPhase;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const TimerControls = ({
  isRunning,
  isPaused,
  phase,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: TimerControlsProps) => {
  const { colors, getPhaseColor, isDark } = useAppTheme();
  const vibrationEnabled = useSettingsStore((s) => s.vibrationEnabled);
  const phaseColor = getPhaseColor(phase);

  const hapticFeedback = () => {
    if (vibrationEnabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleMainPress = () => {
    hapticFeedback();
    if (isRunning) {
      onPause();
    } else if (isPaused) {
      onResume();
    } else {
      onStart();
    }
  };

  const handleReset = () => {
    hapticFeedback();
    onReset();
  };

  const handleSkip = () => {
    hapticFeedback();
    onSkip();
  };

  const getMainButtonLabel = () => {
    if (isRunning) return 'Pausar';
    if (isPaused) return 'Retomar';
    return 'Iniciar';
  };

  const getMainButtonIcon = (): 'pause' | 'play' => {
    if (isRunning) return 'pause';
    return 'play';
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {(isRunning || isPaused) && (
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            accessibilityLabel="Resetar timer"
            accessibilityRole="button"
          >
            <FontAwesome name="stop" size={18} color={colors.textSecondary} />
          </Pressable>
        )}

        <Pressable
          onPress={handleMainPress}
          style={({ pressed }) => [
            styles.mainButton,
            {
              backgroundColor: phaseColor,
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
          accessibilityLabel={getMainButtonLabel()}
          accessibilityRole="button"
        >
          <FontAwesome name={getMainButtonIcon()} size={28} color="#FFFFFF" />
          <Text style={styles.mainButtonText}>{getMainButtonLabel()}</Text>
        </Pressable>

        {(isRunning || isPaused) && (
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            accessibilityLabel="Pular para proxima fase"
            accessibilityRole="button"
          >
            <FontAwesome name="forward" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    minWidth: 160,
    minHeight: 56,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

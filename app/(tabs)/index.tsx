import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, AppState, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';

import { CircularProgress } from '@/components/timer/CircularProgress';
import { SessionIndicator } from '@/components/timer/SessionIndicator';
import { TimerControls } from '@/components/timer/TimerControls';
import { useTimerStore } from '@/stores/useTimerStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/theme';
import { getPhaseLabel } from '@/utils/formatTime';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function TimerScreen() {
  const insets = useSafeAreaInsets();
  const { getPhaseBackground } = useAppTheme();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPhaseRef = useRef<string | null>(null);

  const {
    phase,
    remainingSeconds,
    totalSeconds,
    isRunning,
    isPaused,
    currentSession,
    start,
    pause,
    resume,
    reset,
    skip,
    tick,
    syncWithBackground,
  } = useTimerStore();

  const {
    sessionsBeforeLongBreak,
    keepScreenOn,
    vibrationEnabled,
  } = useSettingsStore();

  if (keepScreenOn && isRunning) {
    useKeepAwake();
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  useEffect(() => {
    if (prevPhaseRef.current !== null && prevPhaseRef.current !== phase) {
      if (vibrationEnabled && Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
    prevPhaseRef.current = phase;
  }, [phase, vibrationEnabled]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        syncWithBackground();
      }
    });
    return () => subscription.remove();
  }, [syncWithBackground]);

  const scheduleNotification = useCallback(async (seconds: number, phaseName: string) => {
    if (Platform.OS === 'web') return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pomodoro Timer',
        body: `Tempo de ${phaseName} acabou!`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
      },
    });
  }, []);

  const handleStart = useCallback(() => {
    start();
    const settings = useSettingsStore.getState();
    const seconds = settings.workMinutes * 60;
    scheduleNotification(seconds, getPhaseLabel('work'));
  }, [start, scheduleNotification]);

  const handlePause = useCallback(async () => {
    pause();
    if (Platform.OS !== 'web') {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [pause]);

  const handleResume = useCallback(() => {
    resume();
    scheduleNotification(remainingSeconds, getPhaseLabel(phase));
  }, [resume, remainingSeconds, phase, scheduleNotification]);

  const handleReset = useCallback(async () => {
    reset();
    if (Platform.OS !== 'web') {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [reset]);

  const handleSkip = useCallback(async () => {
    skip();
    if (Platform.OS !== 'web') {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [skip]);

  const phaseBackground = getPhaseBackground(phase);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: phaseBackground,
          paddingTop: insets.top + Spacing.md,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <SessionIndicator
        phase={phase}
        currentSession={currentSession}
        totalSessions={sessionsBeforeLongBreak}
      />

      <View style={styles.timerContainer}>
        <CircularProgress
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
          phase={phase}
          isRunning={isRunning}
        />
      </View>

      <TimerControls
        isRunning={isRunning}
        isPaused={isPaused}
        phase={phase}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
        onSkip={handleSkip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

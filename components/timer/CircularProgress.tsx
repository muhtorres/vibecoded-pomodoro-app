import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { formatTime } from '@/utils/formatTime';

import { useAppTheme } from '@/hooks/useAppTheme';
import { TimerPhase } from '@/types/timer';

interface CircularProgressProps {
  remainingSeconds: number;
  totalSeconds: number;
  phase: TimerPhase;
  isRunning: boolean;
}

export const CircularProgress = ({
  remainingSeconds,
  totalSeconds,
  phase,
  isRunning,
}: CircularProgressProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { colors, getPhaseColor, isDark } = useAppTheme();

  const isSmallScreen = screenWidth < 380;
  const isLandscape = screenWidth > screenHeight;
  const size = isLandscape
    ? Math.min(screenHeight * 0.5, 280)
    : isSmallScreen
      ? Math.min(screenWidth * 0.65, 240)
      : Math.min(screenWidth * 0.7, 300);

  const strokeWidth = size * 0.04;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1;
  const strokeDashoffset = circumference * (1 - progress);

  const phaseColor = getPhaseColor(phase);
  const trackColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRunning) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning, pulseAnim]);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: pulseAnim }] }]}
      accessibilityRole="timer"
      accessibilityLabel={`Timer: ${formatTime(remainingSeconds)} restantes`}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={phaseColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.timeContainer, { width: size, height: size }]}>
        <Animated.Text
          style={[
            styles.timeText,
            {
              color: colors.text,
              fontSize: size * 0.2,
            },
          ]}
        >
          {formatTime(remainingSeconds)}
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontVariant: ['tabular-nums'],
    fontWeight: '200',
    letterSpacing: 2,
  },
});

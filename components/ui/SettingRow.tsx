import React from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, FontSize } from '@/constants/theme';

interface SettingRowToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  type: 'toggle';
}

interface SettingRowValueProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  suffix?: string;
  type: 'stepper';
}

type SettingRowProps = SettingRowToggleProps | SettingRowValueProps;

export const SettingRow = (props: SettingRowProps) => {
  const { colors, getPhaseColor } = useAppTheme();
  const accentColor = getPhaseColor('work');

  if (props.type === 'toggle') {
    return (
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>{props.label}</Text>
        <Switch
          value={props.value}
          onValueChange={props.onValueChange}
          trackColor={{ false: colors.border, true: accentColor }}
          thumbColor="#FFFFFF"
          accessibilityLabel={props.label}
          accessibilityRole="switch"
          accessibilityState={{ checked: props.value }}
        />
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.text }]}>{props.label}</Text>
      <View style={styles.stepper}>
        <Pressable
          onPress={props.onDecrement}
          style={({ pressed }) => [
            styles.stepperButton,
            { backgroundColor: colors.surfaceVariant, opacity: pressed ? 0.7 : 1 },
          ]}
          accessibilityLabel={`Diminuir ${props.label}`}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text style={[styles.stepperText, { color: colors.text }]}>-</Text>
        </Pressable>
        <Text style={[styles.value, { color: colors.text }]}>
          {props.value}{props.suffix ?? ''}
        </Text>
        <Pressable
          onPress={props.onIncrement}
          style={({ pressed }) => [
            styles.stepperButton,
            { backgroundColor: colors.surfaceVariant, opacity: pressed ? 0.7 : 1 },
          ]}
          accessibilityLabel={`Aumentar ${props.label}`}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text style={[styles.stepperText, { color: colors.text }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 2,
    minHeight: 48,
  },
  label: {
    fontSize: FontSize.md,
    flex: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: FontSize.xl,
    fontWeight: '500',
    lineHeight: 28,
  },
  value: {
    fontSize: FontSize.md,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
});

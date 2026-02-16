import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { SettingRow } from '@/components/ui/SettingRow';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { TIMER_LIMITS } from '@/constants/defaults';
import { Spacing, FontSize, BorderRadius } from '@/constants/theme';

export default function SettingsScreen() {
  const { colors, getPhaseColor } = useAppTheme();
  const insets = useSafeAreaInsets();
  const accentColor = getPhaseColor('work');

  const settings = useSettingsStore();
  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const resetToDefaults = useSettingsStore((s) => s.resetToDefaults);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const handleReset = () => {
    Alert.alert(
      'Restaurar Padroes',
      'Tem certeza que deseja restaurar todas as configuracoes para os valores padrao?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restaurar', style: 'destructive', onPress: resetToDefaults },
      ]
    );
  };

  const themeOptions: Array<{ label: string; value: 'light' | 'dark' | 'system' }> = [
    { label: 'Sistema', value: 'system' },
    { label: 'Claro', value: 'light' },
    { label: 'Escuro', value: 'dark' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.lg }]}
    >
      <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>TIMER</Text>
      <Card>
        <SettingRow
          type="stepper"
          label="Foco (min)"
          value={settings.workMinutes}
          onIncrement={() =>
            updateSetting('workMinutes', clamp(settings.workMinutes + 1, TIMER_LIMITS.minWork, TIMER_LIMITS.maxWork))
          }
          onDecrement={() =>
            updateSetting('workMinutes', clamp(settings.workMinutes - 1, TIMER_LIMITS.minWork, TIMER_LIMITS.maxWork))
          }
          suffix=" min"
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <SettingRow
          type="stepper"
          label="Pausa Curta (min)"
          value={settings.shortBreakMinutes}
          onIncrement={() =>
            updateSetting('shortBreakMinutes', clamp(settings.shortBreakMinutes + 1, TIMER_LIMITS.minShortBreak, TIMER_LIMITS.maxShortBreak))
          }
          onDecrement={() =>
            updateSetting('shortBreakMinutes', clamp(settings.shortBreakMinutes - 1, TIMER_LIMITS.minShortBreak, TIMER_LIMITS.maxShortBreak))
          }
          suffix=" min"
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <SettingRow
          type="stepper"
          label="Pausa Longa (min)"
          value={settings.longBreakMinutes}
          onIncrement={() =>
            updateSetting('longBreakMinutes', clamp(settings.longBreakMinutes + 1, TIMER_LIMITS.minLongBreak, TIMER_LIMITS.maxLongBreak))
          }
          onDecrement={() =>
            updateSetting('longBreakMinutes', clamp(settings.longBreakMinutes - 1, TIMER_LIMITS.minLongBreak, TIMER_LIMITS.maxLongBreak))
          }
          suffix=" min"
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <SettingRow
          type="stepper"
          label="Sessoes antes da pausa longa"
          value={settings.sessionsBeforeLongBreak}
          onIncrement={() =>
            updateSetting('sessionsBeforeLongBreak', clamp(settings.sessionsBeforeLongBreak + 1, TIMER_LIMITS.minSessions, TIMER_LIMITS.maxSessions))
          }
          onDecrement={() =>
            updateSetting('sessionsBeforeLongBreak', clamp(settings.sessionsBeforeLongBreak - 1, TIMER_LIMITS.minSessions, TIMER_LIMITS.maxSessions))
          }
        />
      </Card>

      <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>AUTOMATICO</Text>
      <Card>
        <SettingRow
          type="toggle"
          label="Iniciar pausa automaticamente"
          value={settings.autoStartBreak}
          onValueChange={(v) => updateSetting('autoStartBreak', v)}
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <SettingRow
          type="toggle"
          label="Iniciar foco automaticamente"
          value={settings.autoStartWork}
          onValueChange={(v) => updateSetting('autoStartWork', v)}
        />
      </Card>

      <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>APARENCIA</Text>
      <Card>
        <Text style={[styles.label, { color: colors.text }]}>Tema</Text>
        <View style={styles.themeRow}>
          {themeOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => updateSetting('theme', option.value)}
              style={[
                styles.themeButton,
                {
                  backgroundColor:
                    settings.theme === option.value ? accentColor : colors.surfaceVariant,
                },
              ]}
              accessibilityLabel={`Tema ${option.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: settings.theme === option.value }}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: settings.theme === option.value ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>GERAL</Text>
      <Card>
        <SettingRow
          type="toggle"
          label="Manter tela ligada"
          value={settings.keepScreenOn}
          onValueChange={(v) => updateSetting('keepScreenOn', v)}
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <SettingRow
          type="toggle"
          label="Vibracao"
          value={settings.vibrationEnabled}
          onValueChange={(v) => updateSetting('vibrationEnabled', v)}
        />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <SettingRow
          type="stepper"
          label="Meta diaria (pomodoros)"
          value={settings.dailyGoal}
          onIncrement={() =>
            updateSetting('dailyGoal', clamp(settings.dailyGoal + 1, TIMER_LIMITS.minDailyGoal, TIMER_LIMITS.maxDailyGoal))
          }
          onDecrement={() =>
            updateSetting('dailyGoal', clamp(settings.dailyGoal - 1, TIMER_LIMITS.minDailyGoal, TIMER_LIMITS.maxDailyGoal))
          }
        />
      </Card>

      <Pressable
        onPress={handleReset}
        style={({ pressed }) => [
          styles.resetButton,
          {
            backgroundColor: colors.surface,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        accessibilityLabel="Restaurar configuracoes padrao"
        accessibilityRole="button"
      >
        <Text style={[styles.resetText, { color: '#E74C3C' }]}>Restaurar Padroes</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  sectionHeader: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  themeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  resetButton: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  resetText: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});

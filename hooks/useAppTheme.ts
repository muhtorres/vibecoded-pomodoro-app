import { useColorScheme } from 'react-native';
import { Colors, PhaseColors } from '@/constants/theme';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { TimerPhase } from '@/types/timer';

export const useAppTheme = () => {
  const systemScheme = useColorScheme();
  const themeSetting = useSettingsStore((s) => s.theme);

  const isDark =
    themeSetting === 'system' ? systemScheme === 'dark' : themeSetting === 'dark';

  const colors = isDark ? Colors.dark : Colors.light;

  const getPhaseColor = (phase: TimerPhase) => PhaseColors[phase].primary;

  const getPhaseBackground = (phase: TimerPhase) =>
    isDark ? PhaseColors[phase].background.dark : PhaseColors[phase].background.light;

  return { isDark, colors, getPhaseColor, getPhaseBackground };
};

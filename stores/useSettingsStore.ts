import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsState } from '@/types/timer';
import { DEFAULT_SETTINGS } from '@/constants/defaults';

interface SettingsActions {
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      updateSetting: (key, value) => set({ [key]: value }),

      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'pomodoro-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

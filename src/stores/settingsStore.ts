// stores/settings-store.ts
import type { SettingsState, ThemeMode } from '@/types/settings';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      autoAddEvents: false,
      phonePublic: false,
      setTheme: (theme: ThemeMode) => {
        set({ theme });
      },
      toggleAutoAddEvents: () => set((state) => ({ autoAddEvents: !state.autoAddEvents })),
      togglePhonePublic: () => set((state) => ({ phonePublic: !state.phonePublic })),
    }),
    {
      name: 'app-settings',
      getStorage: () => localStorage,
    }
  )
);
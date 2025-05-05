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
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? 'dark' 
            : 'light';
          document.documentElement.className = systemTheme;
        } else {
          document.documentElement.className = theme;
        }
        set({ theme });
      },
      toggleAutoAddEvents: () => set((state) => ({ autoAddEvents: !state.autoAddEvents })),
      togglePhonePublic: () => set((state) => ({ phonePublic: !state.phonePublic })),
    }),
    {
      name: 'app-settings',
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
              ? 'dark' 
              : 'light';
            document.documentElement.className = systemTheme;
          } else {
            document.documentElement.className = state.theme;
          }
        }
      },
    }
  )
);
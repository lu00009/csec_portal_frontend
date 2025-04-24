// types/settings.ts
export type ThemeMode = 'light' | 'dark' | 'system'

export interface SettingsState {
  theme: ThemeMode
  autoAddEvents: boolean
  phonePublic: boolean
  setTheme: (theme: ThemeMode) => void
  toggleAutoAddEvents: () => void
  togglePhonePublic: () => void
}
// components/ThemeProvider.tsx
import { useSettingsStore } from "@/stores/settingsStore"
import type { ReactNode } from 'react'
import { useEffect } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useSettingsStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const isDark = theme === 'system' ? systemDark : theme === 'dark'
    root.classList.toggle('dark', isDark)
  }, [theme])

  return <>{children}</>
}

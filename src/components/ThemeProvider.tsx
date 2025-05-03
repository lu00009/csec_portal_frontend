'use client';

import { useSettingsStore } from "@/stores/settingsStore";
import { useEffect, useState } from 'react';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = theme === 'system' ? systemDark : theme === 'dark';
    root.classList.toggle('dark', isDark);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        root.classList.toggle('dark', mediaQuery.matches);
      }
    };
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
};
// app/main/settings/page.tsx
'use client';

import { useSettingsStore } from '@/stores/settingsStore';
import { useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

const SettingsPage = () => {
  const {
    theme,
    setTheme,
    autoAddEvents,
    toggleAutoAddEvents,
    phonePublic,
    togglePhonePublic
  } = useSettingsStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        document.documentElement.className = e.matches ? 'dark' : 'light';
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  return (
    <div className="overflow-hidden mx-auto p-6 rounded-lg bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="font-semibold text-lg">Appearance</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose your preferred theme
            </p>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-3 py-1"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="font-medium">Automatically Add Events to Calendar</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Save time by auto-adding events to your calendar
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoAddEvents}
              onChange={toggleAutoAddEvents}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600 relative">
              <span className="absolute left-1 top-1 bg-white dark:bg-gray-300 w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></span>
            </div>
          </label>
        </div>

        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="font-medium">Make your Phone Public</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your phone number with event organizers
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={phonePublic}
              onChange={togglePhonePublic}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600 relative">
              <span className="absolute left-1 top-1 bg-white dark:bg-gray-300 w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
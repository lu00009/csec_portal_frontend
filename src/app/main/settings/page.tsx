'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const SettingsPage = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [autoAddToCalendar, setAutoAddToCalendar] = useState(true);
  const [isPhonePublic, setIsPhonePublic] = useState(true);

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme === 'system' ? systemTheme : savedTheme;
    } else {
      setTheme('system');
      document.documentElement.className = systemTheme;
    }
  }, []);

  useEffect(() => {
    // Handle system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        document.documentElement.className = e.matches ? 'dark' : 'light';
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const handleThemeChange = (value: Theme) => {
    setTheme(value);
    localStorage.setItem('theme', value);
    
    if (value === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.className = systemTheme;
    } else {
      document.documentElement.className = value;
    }
  };

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
            onChange={(e) => handleThemeChange(e.target.value as Theme)}
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
              checked={autoAddToCalendar}
              onChange={() => setAutoAddToCalendar(!autoAddToCalendar)}
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
              checked={isPhonePublic}
              onChange={() => setIsPhonePublic(!isPhonePublic)}
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
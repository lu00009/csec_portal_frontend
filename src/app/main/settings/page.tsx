'use client';

import { useState, useEffect } from 'react';

const SettingsPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [autoAddToCalendar, setAutoAddToCalendar] = useState(true);
  const [isPhonePublic, setIsPhonePublic] = useState(true);

  // Optional: Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleThemeChange = (value: 'light' | 'dark') => {
    setTheme(value);
    localStorage.setItem('theme', value);
    document.documentElement.className = value; // For Tailwind dark mode
  };

  return (
    <div className="overflow-hidden mx-auto p-6 rounded-lg bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="font-semibold text-lg">Appearance</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize how your theme looks on your device
            </p>
          </div>
          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-3 py-1"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="font-medium">Automatically Add Events to Calendar</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Save time by auto-adding events to your calendar, or manually enter them for more control.
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoAddToCalendar}
              onChange={() => setAutoAddToCalendar(!autoAddToCalendar)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-700 relative">
              <span className="absolute left-1 top-1 bg-white dark:bg-gray-800 w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></span>
            </div>
          </label>
        </div>

        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="font-medium">Make your Phone Public</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keep your phone private for safety, or share it for convenience.
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPhonePublic}
              onChange={() => setIsPhonePublic(!isPhonePublic)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-700 relative">
              <span className="absolute left-1 top-1 bg-white dark:bg-gray-800 w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

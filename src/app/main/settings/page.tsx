// app/settings/page.tsx
'use client';

import { useSettingsStore } from '@/stores/settingsStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Switch } from '@radix-ui/react-switch';

export default function SettingsPage() {
  const { theme, setTheme, autoAddEvents, toggleAutoAddEvents, phonePublic, togglePhonePublic } = useSettingsStore();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Settings</h1>
      
      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium text-gray-900">Appearance</h2>
              <p className="text-sm text-gray-500 mt-1">
                Customize how your theme looks on your device
              </p>
            </div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200">
                {theme}
              </DropdownMenu.Trigger>
              
              <DropdownMenu.Content 
                align="end"
                className="min-w-[200px] bg-white rounded-md shadow-lg border border-gray-100 mt-1"
              >
                <DropdownMenu.Arrow className="fill-gray-100" />
                {['Light', 'Dark', 'System'].map((option) => (
                  <DropdownMenu.Item
                    key={option}
                    onSelect={() => setTheme(option.toLowerCase() as 'light' | 'dark' | 'system')}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    {option}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>

        // Switch component fix
<Switch
  checked={phonePublic}
  onCheckedChange={togglePhonePublic}
  className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors duration-200"
>
  <span className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
</Switch>
      </div>
    </div>
  );
}
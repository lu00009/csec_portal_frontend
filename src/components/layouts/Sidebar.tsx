
'use client';

import { useUserStore } from '@/stores/userStore'; // Import your user store
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  FiLayers,
  FiSettings,
  FiSun,
  FiUsers
} from 'react-icons/fi';
import { GoMoon } from "react-icons/go";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoFolderOutline } from "react-icons/io5";
import { LuCalendarCheck, LuClock10, LuSettings2 } from "react-icons/lu";
import { MdOutlineDashboard } from 'react-icons/md';
import logo from '../../assets/logo.svg';

const navItems = [
  { name: 'Dashboard', href: 'dashboard', icon: <MdOutlineDashboard className="mr-3" /> },
  { name: 'All Members', href: 'members', icon: <FiUsers className="mr-3" /> },
  { name: 'All Divisions', href: 'divisions', icon: <FiLayers className="mr-3" /> },
  { name: 'Attendances', href: 'attendance', icon: <LuCalendarCheck className="mr-3" /> },
  { name: 'Seasons & Events', href: 'events', icon: <LuClock10 className="mr-3" /> },
  { name: 'Resources', href: 'resources', icon: <IoFolderOutline className="mr-3" /> },
  { name: 'Profile', href: 'profile', icon: <HiOutlineUsers className="mr-3" /> },
  { name: 'Administration', href: 'admin', icon: <LuSettings2 className="mr-3" />, adminOnly: true }, // Mark as admin only
  { name: 'Settings', href: 'settings', icon: <FiSettings className="mr-3" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useUserStore(); // Get current user from store

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly) {
      return user?.role === 'president'; 
    }
    return true; 
  });

  return (
    <div className="w-55 h-full flex flex-col p-4">
      <div className="flex items-center mb-8">
        <div className="flex">
          <Image className='w-7 h-10' src={logo} alt="Logoipsum" />
        </div>
        <h1 className="text-2xl font-bold ml-4">Logoipsum</h1>
      </div>
      
      <div className="flex-1">
        <nav>
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded hover:bg-[#0030870D] hover:text-[#003087] transition-colors text-[15px] ${
                    pathname.includes(item.href) 
                      ? darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-300 text-black'
                      : ''
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Theme toggle buttons at the bottom */}
      <div className="mt-6 mb-4">
        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-full py-2 px-4 rounded-md ${
              !darkMode ? 'bg-[#003087] text-white' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiSun className="mr-2" />
            Light
          </button>
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-full py-2 px-4 rounded-md ${
              darkMode ? 'bg-[#003087] text-white' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <GoMoon className="mr-2" />
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}
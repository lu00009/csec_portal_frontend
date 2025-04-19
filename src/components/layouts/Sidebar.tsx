// components/Sidebar.tsx
'use client';

import { useUserStore } from '@/stores/userStore';
import { Member } from '@/types/member';
import { isPresident } from '@/utils/roles';
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
  { name: 'Dashboard', href: '/main/dashboard', icon: <MdOutlineDashboard className="mr-3" /> },
  { name: 'All Members', href: '/main/members', icon: <FiUsers className="mr-3" /> },
  { name: 'All Divisions', href: '/main/divisions', icon: <FiLayers className="mr-3" /> },
  { name: 'Attendances', href: '/main/attendance', icon: <LuCalendarCheck className="mr-3" /> },
  { name: 'Seasons & Events', href: '/main/events', icon: <LuClock10 className="mr-3" /> },
  { name: 'Resources', href: '/main/resources', icon: <IoFolderOutline className="mr-3" /> },
  { name: 'Profile', href: '/main/profile', icon: <HiOutlineUsers className="mr-3" /> },
  { 
    name: 'Administration', 
    href: '/main/admin', // Changed to point directly to heads
    icon: <LuSettings2 className="mr-3" />, 
    adminOnly: true,
    requiredRole: 'President'
  },
  { name: 'Settings', href: '/settings', icon: <FiSettings className="mr-3" /> },
];
interface SidebarProps {
  user?: Member; // Make it optional
}

export default function Sidebar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useUserStore();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Filter nav items based on user role and permissions
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly || item.requiredRole) {
      return user && isPresident(user.clubRole);
    }
    return true;
  });

  // Check if path is active (including nested admin routes)
  const isActive = (href: string) => {
    if (href === '/admin/heads') {
      return pathname.startsWith('/admin');
    }
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <div className={`w-full md:w-55 h-full flex flex-col p-4`}>
      {/* Logo and Title */}
      <div className="flex items-center mb-4 md:mb-8">
        <div className="flex">
          <Image className='w-6 md:w-7 h-8 md:h-10' src={logo} alt="Logoipsum" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold ml-3 md:ml-4">CSEC ASTU</h1>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        <nav>
          <ul className="space-y-1 md:space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 md:px-4 py-2 rounded transition-colors text-sm md:text-[15px] ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600 font-medium' // Active state
                      : 'text-gray-600 hover:bg-gray-100' // Default/hover state
                  }`}
                >
                  <span className={`mr-2 ${
                    isActive(item.href) ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Theme toggle buttons */}
      <div className="mt-4 md:mt-6 mb-2 md:mb-4">
        <div className="flex items-center justify-between p-1 md:p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-full py-1 md:py-2 px-2 md:px-4 rounded-md text-sm md:text-base ${
              !darkMode ? 'bg-[#003087] text-white' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiSun className="mr-1 md:mr-2" />
            <span className="hidden sm:inline">Light</span>
          </button>
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-full py-1 md:py-2 px-2 md:px-4 rounded-md text-sm md:text-base ${
              darkMode ? 'bg-[#003087] text-white' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <GoMoon className="mr-1 md:mr-2" />
            <span className="hidden sm:inline">Dark</span>
          </button>
        </div>
      </div>
    </div>
  );
}
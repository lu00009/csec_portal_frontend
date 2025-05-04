// components/Sidebar.tsx
'use client';

import { Avatar } from '@/components/ui/avatar';
import { useUserStore } from '@/stores/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiLayers,
  FiSettings,
  FiUsers
} from 'react-icons/fi';
import { HiOutlineUsers } from "react-icons/hi2";
import { IoFolderOutline } from "react-icons/io5";
import { LuCalendarCheck, LuClock10, LuSettings2 } from "react-icons/lu";
import { MdOutlineDashboard } from 'react-icons/md';

const navItems = [
  { name: 'Dashboard', href: '/main/dashboard', icon: <MdOutlineDashboard className="mr-3" /> },
  { name: 'All Members', href: '/main/members', icon: <FiUsers className="mr-3" /> },
  { name: 'All Divisions', href: '/main/divisions', icon: <FiLayers className="mr-3" /> },
  { 
    name: 'Attendances', 
    href: '/main/attendance',
    headOnly: true,
    icon: <LuCalendarCheck className="mr-3" /> 
  },
  { name: 'Sessions & Events', href: '/main/events', icon: <LuClock10 className="mr-3" /> },
  { name: 'Resources', href: '/main/resources', icon: <IoFolderOutline className="mr-3" /> },
  { name: 'Profile', href: '/main/profile', icon: <HiOutlineUsers className="mr-3" /> },
  { 
    name: 'Administration', 
    href: '/main/admin',
    icon: <LuSettings2 className="mr-3" />, 
    adminOnly: true
  },
  { name: 'Settings', href: '/main/settings', icon: <FiSettings className="mr-3" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUserStore();

  // Filter nav items based on user role and permissions
  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly) {
      return user?.member?.clubRole === 'President' || user?.member?.clubRole === 'Vice President';
    }
    return true;
  });

  // Check if path is active (including nested admin routes)
  const isActive = (href: string) => {
    if (href === '/main/admin') {
      return pathname.startsWith('/main/admin');
    }
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <Link href="/main/dashboard" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="CSEC Logo" width={32} height={32} />
            <span className="text-xl font-bold text-gray-800 dark:text-white">CSEC Portal</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar size="sm" robohashSet="set3">
              <Avatar.Image
                src={user?.member?.profilePicture || `https://robohash.org/${user?.member?._id || 'default'}?set=set3&size=100x100`}
                alt="User Avatar"
                identifier={user?.member?._id || 'default'}
              />
              <Avatar.Fallback className="dark:bg-gray-600 dark:text-white">
                {user?.member?.firstName?.[0]}{user?.member?.lastName?.[0]}
              </Avatar.Fallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {user?.member?.firstName} {user?.member?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.member?.clubRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
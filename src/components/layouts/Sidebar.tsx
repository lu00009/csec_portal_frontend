// components/Sidebar.tsx
'use client';

import { useUserStore } from '@/stores/userStore';
import { Member } from '@/types/member';
import { isPresident } from '@/utils/roles';
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
import logo from '../../assets/logo.svg';

const navItems = [
  { name: 'Dashboard', href: '/main/dashboard', icon: <MdOutlineDashboard className="mr-3" /> },
  { name: 'All Members', href: '/main/members', icon: <FiUsers className="mr-3" /> },
  { name: 'All Divisions', href: '/main/divisions', icon: <FiLayers className="mr-3" /> },
  { name: 'Attendances', href: '/main/attendance',
    headOnly: true,
requiredRole: ['DivisionHead', 'President'],
     icon: <LuCalendarCheck className="mr-3" /> },
  { name: 'Sessions & Events', href: '/main/events', icon: <LuClock10 className="mr-3" /> },
  { name: 'Resources', href: '/main/resources', icon: <IoFolderOutline className="mr-3" /> },
  { name: 'Profile', href: '/main/profile', icon: <HiOutlineUsers className="mr-3" /> },
  { 
    name: 'Administration', 
    href: '/main/admin', // Changed to point directly to heads
    icon: <LuSettings2 className="mr-3" />, 
    adminOnly: true,
    requiredRole: 'President'
  },
  { name: 'Settings', href: '/main/settings', icon: <FiSettings className="mr-3" /> },
];
interface SidebarProps {
  user?: Member; // Make it optional
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUserStore();


  // Filter nav items based on user role and permissions
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly || item.requiredRole) {
      return user && isPresident(user.member.clubRole);
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
    <div className={`w-full md:w-55 h-full flex flex-col p-4 dark:bg-gray-800 dark:border-r dark:border-gray-700`}>
  {/* Logo and Title */}
  <div className="flex items-center mb-4 md:mb-8">
    <div className="flex">
      <Image className='w-6 md:w-7 h-8 md:h-10' src={logo} alt="Logoipsum" />
    </div>
    <h1 className="text-xl md:text-2xl font-bold ml-3 md:ml-4 dark:text-white">CSEC ASTU</h1>
  </div>
  
  {/* Navigation Items */}
  <div className="flex-1 overflow-y-auto dark:bg-gray-800">
    <nav>
      <ul className="space-y-1 md:space-y-2">
        {filteredNavItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center px-3 md:px-4 py-2 rounded transition-colors text-sm md:text-[15px] 
                ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/30 dark:text-blue-400' // Active state
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700' // Default/hover
                }`}
            >
              <span className={`mr-2 ${
                isActive(item.href) 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
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
</div>
  );
}
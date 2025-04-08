'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiBell, FiChevronDown, FiSearch } from 'react-icons/fi';

const TopHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    setIsDropdownOpen(false);
    router.push(path);
  };

  // Get the current page title based on the path
  const getPageTitle = () => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    switch(lastSegment) {
      case 'members':
        return 'All Members';
      case 'divisions':
        return 'All Divisions';
      case 'attendance':
        return 'Attendances';
      case 'events':
        return 'Seasons & Events';
      case 'resources':
        return 'Resources';
      case 'profile':
        return 'Profile';
      case 'admin':
        return 'Administration';
      case 'settings':
        return 'Settings';
      default:
        return 'Henok'; // Default name
    }
  };

  return (
    <header className="bg-white shadow-2xs py-0.5 px-6 ml-[30px] w-[900px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left - Greeting */}
        <div>
          <h1 className="text-lg font-bold text-gray-800">{getPageTitle()}</h1>
          <p className="text-sm text-gray-600">Good Morning</p>
        </div>

        {/* Center - Search and Notification */}
        <div className='flex'>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <FiBell className="h-6 w-6 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
          
          {/* Right - Profile with Dropdown */}
          <div className="relative flex">
            <button 
              className="flex items-center gap-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaUserCircle className="h-10 w-10 text-gray-400" />
              <div className="text-left">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Henok Assefa</p>
                    <p className="text-xs text-gray-500">WAYON RESERVER</p>
                  </div>
                  <FiChevronDown className={`h-4 w-4 ml-1 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-10">
                <button 
                  onClick={() => handleNavigation('profile')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </button>
                <button 
                  onClick={() => handleNavigation('settings')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </button>
                <button 
                  onClick={() => handleNavigation('/auth/login')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-200"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
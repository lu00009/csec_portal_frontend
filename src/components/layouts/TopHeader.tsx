"use client";

import { Avatar } from "@/components/ui/avatar"; // Import the Avatar component
import { useUserStore } from "@/stores/userStore"; // 👈 import the user store
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiBell, FiChevronDown, FiSearch } from "react-icons/fi";

const TopHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUserStore(); // 👈 use user from store

  const handleNavigation = (path: string) => {
    setIsDropdownOpen(false);
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const getPageTitle = () => {
    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    switch (lastSegment) {
      case "members":
        return "All Members";
      case "divisions":
        return "All Divisions";
      case "attendance":
        return "Attendances";
      case "events":
        return "Seasons & Events";
      case "resources":
        return "Resources";
      case "profile":
        return "Profile";
      case "admin":
        return "Administration";
      case "settings":
        return "Settings";
      default:
        return user?.member?.firstName || "Dashboard";
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        {/* Left - Greeting */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{getPageTitle()}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Good Morning</p>
        </div>
    
        {/* Right - Search, Notification and Profile */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 dark:text-gray-400 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
    
          {/* Notification */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiBell className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
    
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Avatar size="md" robohashSet="set3">
                <Avatar.Image
                  src={user?.member?.profilePicture || `https://robohash.org/${user?.member?._id || 'default'}?set=set3&size=100x100`}
                  alt="User Avatar"
                  identifier={user?.member?._id || 'default'}
                />
                <Avatar.Fallback className="dark:bg-gray-600 dark:text-white">
                  {user?.member?.firstName?.[0]}{user?.member?.lastName?.[0]}
                </Avatar.Fallback>
              </Avatar>
              <div className="text-left">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {user?.member?.firstName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.member?.clubRole || "Member"}
                    </p>
                  </div>
                  <FiChevronDown
                    className={`h-4 w-4 ml-1 text-gray-500 dark:text-gray-400 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </button>
    
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-100 dark:border-gray-700 z-10">
                <button
                  onClick={() => handleNavigation("/main/profile")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Profile
                </button>
                <button
                  onClick={() => handleNavigation("/main/settings")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-200 dark:hover:bg-red-500/20"
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

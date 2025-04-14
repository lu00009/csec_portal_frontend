'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBook, FiShield, FiUsers } from 'react-icons/fi';

export default function AdminHeader() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Heads', path: '/main/admin/heads', icon: <FiUsers /> },
    { name: 'Rules', path: '/main/admin/rules', icon: <FiBook /> },
    { name: 'Roles', path: '/main/admin/roles', icon: <FiShield /> }
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <nav className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-3 py-2 rounded-md ${
                pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {/* User controls */}
        </div>
      </div>
    </header>
  );
}
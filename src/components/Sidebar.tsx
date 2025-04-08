// components/Sidebar.tsx
'use client';

import { UserRole } from '@/stores/userStore';
import { canViewAdminPanel } from '@/utils/roles'; // Correct import

export default function Sidebar({ role }: { role: UserRole }) {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <nav>
        <ul className="space-y-2">
          <li><a href="/main/dashboard">Dashboard</a></li>
          <li><a href="/main/members">Members</a></li>
          
          {canViewAdminPanel(role) && (
            <>
              <li><a href="/main/admin">Admin Panel</a></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
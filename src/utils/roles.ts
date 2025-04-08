// utils/roles.ts
import { UserRole } from '@/stores/userStore';

// Add this function if missing
export const canViewAdminPanel = (role: UserRole) => 
  role === 'president' || role === 'divisionHead';

// Ensure all your role utilities are exported
export const isPresident = (role: UserRole) => role === 'president';
export const isDivisionHead = (role: UserRole) => role === 'divisionHead';
export const isMember = (role: UserRole) => role === 'member';
export const canEditMembers = (role: UserRole) => 
  isPresident(role) || isDivisionHead(role);
export const canDeleteMembers = (role: UserRole) => 
  isPresident(role);
// utils/roles.ts
import { UserRole } from '@/stores/userStore';

// Role check utilities
export const isPresident = (role: UserRole) => role === 'president';
export const isDivisionHead = (role: UserRole) => role === 'divisionHead';
export const isMember = (role: UserRole) => role === 'member';

// Permission utilities
export const canViewAdminPanel = (role: UserRole) => 
  isPresident(role) || isDivisionHead(role);

export const canAddMembers = (role: UserRole) => 
  isPresident(role) || isDivisionHead(role);

export const canEditMembers = (role: UserRole) => 
  isPresident(role) || isDivisionHead(role);

export const canDeleteMembers = (role: UserRole) => 
  isPresident(role); // Only presidents can delete members

export const canViewMembers = (role: UserRole) => 
  isPresident(role) || isDivisionHead(role) || isMember(role);

// Specific division permissions
export const canManageDivision = (userRole: UserRole, userDivision: string, targetDivision?: string) => {
  if (isPresident(userRole)) return true;
  if (isDivisionHead(userRole) && userDivision === targetDivision) return true;
  return false;
};
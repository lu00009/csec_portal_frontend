// utils/roles.ts
import { UserRole } from '@/stores/userStore';

export const isPresident = (role: UserRole) => role === 'President' || role === 'Vice President';
export const isDivisionHead = (role: UserRole) => role === 'CPD President' || role === 'Dev President' || role === 'CBD President' || role === 'SEC President' || role === 'DS President';
export const isMember = (role: UserRole) => role === 'Member';

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
  if (isDivisionHead(userRole) && targetDivision && userDivision === targetDivision) return true;
  return false;
};
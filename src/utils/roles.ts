// utils/roles.ts
import { UserRole } from '@/stores/userStore';

// export const isDivisionHead = (role: UserRole) => role === 'CPD President' || role === 'Dev President' || role === 'CBD President' || role === 'SEC President' || role === 'DS President';
export const isMember = (role: UserRole) => role === 'Member';
export const isCPDPresident = (role: UserRole) => role === 'Competitive Programming Division President';
export const isDevPresident = (role: UserRole) => role === 'Development Division President';
export const isCBDPresident = (role: UserRole) => role === 'Capacity Building Division President';
export const isSECPresident = (role: UserRole) => role === 'Cybersecurity Division President';
export const isDSPresident = (role: UserRole) => role === 'Data Science Division President';


// Permission utilities
export const canViewAdminPanel = (role: UserRole) => 
  isPresident(role) || isCBDPresident(role) || isSECPresident(role) || isDSPresident(role) || isCPDPresident(role) || isDevPresident(role);

export const isPresident = (role: UserRole) => 
  role === 'President' || role === 'Vice President';

export const canAddMembers = (role: UserRole) => 
  isPresident(role) || 
  role.includes('President'); // This covers all division presidents

export const canDeleteMembers = (role: UserRole) => 
  role === 'President';

export const canViewMembers = (role: UserRole) => 
  isPresident(role) || isCBDPresident(role) || isSECPresident(role) || isDSPresident(role) || isCPDPresident(role) || isDevPresident(role) || isMember(role);

// Specific division permissions
export const canManageDivision = (userRole: UserRole, userDivision: string, targetDivision?: string) => {
  if (isPresident(userRole)) return true;
  if (isCBDPresident(userRole) || isSECPresident(userRole) || isDSPresident(userRole) || isCPDPresident(userRole) || isDevPresident(userRole) && targetDivision && userDivision === targetDivision) return true;
  return false;
};
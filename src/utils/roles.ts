// utils/roles.ts
import { UserRole } from '@/stores/userStore';

export const isPresident = (role: UserRole) => role === 'President' || role === 'Vice President';
// export const isDivisionHead = (role: UserRole) => role === 'CPD President' || role === 'Dev President' || role === 'CBD President' || role === 'SEC President' || role === 'DS President';
export const isMember = (role: UserRole) => role === 'Member';
export const isCPDPresident = (role: UserRole) => role === 'CPD President';
export const isDevPresident = (role: UserRole) => role === 'Dev President';
export const isCBDPresident = (role: UserRole) => role === 'CBD President';
export const isSECPresident = (role: UserRole) => role === 'SEC President';
export const isDSPresident = (role: UserRole) => role === 'DS President';


// Permission utilities
export const canViewAdminPanel = (role: UserRole) => 
  isPresident(role) || isCBDPresident(role) || isSECPresident(role) || isDSPresident(role) || isCPDPresident(role) || isDevPresident(role);

export const canAddMembers = (role: UserRole) => 
  isPresident(role) || isCBDPresident(role) || isSECPresident(role) || isDSPresident(role) || isCPDPresident(role) || isDevPresident(role);  // Assuming Division Head is a role that can add members

export const canEditMembers = (role: UserRole) => 
  isPresident(role) || isCBDPresident(role) || isSECPresident(role) || isDSPresident(role) || isCPDPresident(role) || isDevPresident(role);
export const canDeleteMembers = (role: UserRole) => 
  isPresident(role);

export const canViewMembers = (role: UserRole) => 
  isPresident(role) || isCBDPresident(role) || isSECPresident(role) || isDSPresident(role) || isCPDPresident(role) || isDevPresident(role) || isMember(role);

// Specific division permissions
export const canManageDivision = (userRole: UserRole, userDivision: string, targetDivision?: string) => {
  if (isPresident(userRole)) return true;
  if (isCBDPresident(userRole) || isSECPresident(userRole) || isDSPresident(userRole) || isCPDPresident(userRole) || isDevPresident(userRole) && targetDivision && userDivision === targetDivision) return true;
  return false;
};
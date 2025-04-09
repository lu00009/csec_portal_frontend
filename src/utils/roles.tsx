import { UserRole } from '@/stores/userStore';

export const canViewAdminPanel = (role: UserRole): boolean => 
  role === 'president' || role === 'divisionHead';

export const isPresident = (role: UserRole) => role === 'president';
export const isDivisionLeader = (role: UserRole) => role === 'divisionHead';
export const isMember = (role: UserRole) => role === 'member';
export const canEditMembers = (role: UserRole) => 
  isPresident(role) || isDivisionLeader(role);
export const canDeleteMembers = (role: UserRole) => 
  isPresident(role);
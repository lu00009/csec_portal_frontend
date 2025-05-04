// utils/roles.ts

export type UserRole = 'President' | 'Vice President' | 'Member' | 'CPD President' | 'Dev President' | 'CBD President' | 'SEC President' | 'DS President';

export const isMember = (role: UserRole | undefined): boolean => {
  return role === 'Member';
};

export const isCPDPresident = (role: UserRole | undefined): boolean => {
  return role === 'CPD President';
};

export const isDevPresident = (role: UserRole | undefined): boolean => {
  return role === 'Dev President';
};

export const isCBDPresident = (role: UserRole | undefined): boolean => {
  return role === 'CBD President';
};

export const isSECPresident = (role: UserRole | undefined): boolean => {
  return role === 'SEC President';
};

export const isDSPresident = (role: UserRole | undefined): boolean => {
  return role === 'DS President';
};

export const isPresident = (role: UserRole | undefined): boolean => {
  return role === 'President' || role === 'Vice President';
};

export const isDivisionPresident = (role: UserRole | undefined): boolean => {
  return isCPDPresident(role) || isDevPresident(role) || isCBDPresident(role) || isSECPresident(role) || isDSPresident(role);
};

export const canViewAdminPanel = (role: UserRole | undefined): boolean => {
  return isPresident(role);
};

export const canAddMembers = (role: UserRole | undefined): boolean => {
  return isPresident(role) || isDivisionPresident(role);
};

export const canDeleteMembers = (role: UserRole | undefined): boolean => {
  return isPresident(role);
};

export const canViewMembers = (role: UserRole | undefined): boolean => {
  return true; // All roles can view members
};

export const canManageDivision = (role: UserRole | undefined, division: string): boolean => {
  if (!role) return false;
  
  switch (division) {
    case 'CPD':
      return isCPDPresident(role) || isPresident(role);
    case 'Dev':
      return isDevPresident(role) || isPresident(role);
    case 'CBD':
      return isCBDPresident(role) || isPresident(role);
    case 'SEC':
      return isSECPresident(role) || isPresident(role);
    case 'DS':
      return isDSPresident(role) || isPresident(role);
    default:
      return false;
  }
};
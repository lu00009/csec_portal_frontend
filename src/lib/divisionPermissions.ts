import { UserRole } from '@/utils/roles';

// Map of division names to their corresponding division head roles
export const DIVISION_HEADS = {
  'Data Science': 'DS President',
  'Cybersecurity': 'Cybersecurity Division President',
  'Development': 'Dev President',
  'Competitive Programming': 'CPD President',
  'Capacity Building': 'CBD President'
} as const;

// Helper function to check if a role is a division head role
export function isDivisionHead(role: UserRole | undefined): boolean {
  if (!role) return false;
  return role === 'Competitive Programming Division President' || 
         role === 'Development Division President' || 
         role === 'Capacity Building Division President' || 
         role === 'Cybersecurity Division President' || 
         role === 'Data Science Division President';
}

// Helper function to get the division from a role
export function getDivisionFromRole(role: UserRole | undefined): string | null {
  if (!role) return null;
  
  if (role === 'President' || role === 'Vice President') {
    return 'all';
  }

  switch (role) {
    case 'Competitive Programming Division President':
      return 'CPD';
    case 'Development Division President':
      return 'Dev';
    case 'Capacity Building Division President':
      return 'CBD';
    case 'Cybersecurity Division President':
      return 'SEC';
    case 'Data Science Division President':
      return 'DS';
    default:
      return null;
  }
}

// Check if a user can view a specific division
export function canViewDivision(user: { member?: { clubRole?: UserRole } } | null): boolean {
  if (!user?.member?.clubRole) return false;
  return true; // All authenticated users can view divisions
}

// Check if a user can manage a specific division
export function canManageDivision(role: UserRole | undefined, division: string): boolean {
  if (!role) return false;
  
  if (role === 'President' || role === 'Vice President') {
    return true;
  }

  const userDivision = getDivisionFromRole(role);
  return userDivision === division || division === 'all';
}

// Check if a user can manage groups in a specific division
export function canManageGroups(role: UserRole | undefined, division: string): boolean {
  if (!role) return false;
  if (role === 'President' || role === 'Vice President') return true;
  
  const userDivision = getDivisionFromRole(role);
  return userDivision === division;
}

// Check if a user can manage members in a specific division
export function canManageMembers(role: UserRole | undefined, division: string): boolean {
  if (!role) return false;
  if (role === 'President' || role === 'Vice President') return true;
  
  const userDivision = getDivisionFromRole(role);
  return userDivision === division;
}

// Check if a user can add members to a specific division
export function canAddMembersToDivision(role: UserRole | undefined, division: string): boolean {
  if (!role) return false;
  if (role === 'President' || role === 'Vice President') return true;
  
  const userDivision = getDivisionFromRole(role);
  return userDivision === division;
} 
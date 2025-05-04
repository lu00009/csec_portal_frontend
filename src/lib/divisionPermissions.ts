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
export function isDivisionHead(role: UserRole): boolean {
  return Object.values(DIVISION_HEADS).includes(role as any);
}

// Helper function to get the division from a role
export function getDivisionFromRole(role: UserRole): string | null {
  if (role === 'President' || role === 'Vice President') return 'all';
  
  for (const [division, headRole] of Object.entries(DIVISION_HEADS)) {
    if (role === headRole) return division;
  }
  
  return null;
}

// Check if a user can view a specific division
export function canViewDivision(user: { member?: { clubRole?: UserRole } } | null): boolean {
  if (!user?.member?.clubRole) return false;
  return true; // All authenticated users can view divisions
}

// Check if a user can manage a specific division
export function canManageDivision(user: { member?: { clubRole?: UserRole } } | null, divisionName: string): boolean {
  if (!user?.member?.clubRole) return false;
  
  const userRole = user.member.clubRole;
  
  // President and Vice President can manage all divisions
  if (userRole === 'President' || userRole === 'Vice President') return true;
  
  // Division heads can only manage their own division
  const userDivision = getDivisionFromRole(userRole);
  return userDivision === divisionName;
}

// Check if a user can manage groups in a specific division
export function canManageGroups(user: { member?: { clubRole?: UserRole } } | null, divisionName: string): boolean {
  return canManageDivision(user, divisionName);
}

// Check if a user can manage members in a specific division
export function canManageMembers(user: { member?: { clubRole?: UserRole } } | null, divisionName: string): boolean {
  return canManageDivision(user, divisionName);
} 
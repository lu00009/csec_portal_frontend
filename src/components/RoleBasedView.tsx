import { canAddMembersToDivision, canManageDivision, getDivisionFromRole } from '@/lib/divisionPermissions';
import { useUserStore } from '@/stores/userStore';
import { UserRole } from "@/utils/roles";
import { ReactNode } from 'react';

interface RoleBasedViewProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

interface DivisionBasedViewProps {
  children: ReactNode;
  targetDivision: string;
  fallback?: ReactNode;
}

interface MemberManagementViewProps extends DivisionBasedViewProps {
  children: ReactNode;
  targetDivision: string;
}

interface AttendanceManagementViewProps {
  targetDivision: string;
  children: ReactNode;
}

const VALID_ROLES: UserRole[] = [
  'President',
  'Vice President',
  'Competitive Programming Division President',
  'Development Division President',
  'Capacity Building Division President',
  'Cybersecurity Division President',
  'Data Science Division President',
  'Member'
];

function isValidUserRole(role: string | undefined): role is UserRole {
  if (!role) return false;
  return VALID_ROLES.includes(role as UserRole);
}

export const RoleBasedView: React.FC<RoleBasedViewProps> = ({
  allowedRoles,
  children,
  fallback,
}) => {
  const { user } = useUserStore();

  if (!user?.member?.clubRole) {
    return fallback || null;
  }

  const hasAccess = allowedRoles.includes(user.member.clubRole);
  if (!hasAccess) {
    return fallback || null;
  }

  return <>{children}</>;
};

// Admin view - only for President and Vice President
export const AdminView: React.FC<Omit<RoleBasedViewProps, 'allowedRoles'>> = ({
  children,
  fallback,
}) => {
  const { user } = useUserStore();

  if (!user?.member?.clubRole) {
    return null;
  }

  if (user.member.clubRole === 'President' || user.member.clubRole === 'Vice President') {
    return <>{children}</>;
  }

  return null;
};

// Division head view - for managing their own division
export const DivisionHeadView: React.FC<DivisionBasedViewProps> = ({
  targetDivision,
  children,
}) => {
  const { user } = useUserStore();

  if (!user?.member?.clubRole) {
    return null;
  }

  const userDivision = getDivisionFromRole(user.member.clubRole);
  if (user.member.clubRole === 'President' || user.member.clubRole === 'Vice President') {
    return <>{children}</>;
  }

  if (userDivision && userDivision === targetDivision) {
    return <>{children}</>;
  }

  return null;
};

// Member view - for viewing content
export function MemberView({ children, fallback }: Omit<RoleBasedViewProps, 'allowedRoles'>) {
  return (
    <RoleBasedView
      allowedRoles={['Member']}
      fallback={fallback}
    >
      {children}
    </RoleBasedView>
  );
}

// Member management view - for adding/deleting members
export const MemberManagementView: React.FC<MemberManagementViewProps> = ({
  targetDivision,
  children,
}) => {
  const { user } = useUserStore();

  if (!user?.member?.clubRole) {
    return null;
  }

  const userRole = user.member.clubRole;
  const hasAccess = canAddMembersToDivision(userRole, targetDivision);
  
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};

// Attendance management view - for division heads and admin
export function AttendanceManagementView({ targetDivision, children }: AttendanceManagementViewProps) {
  const { user } = useUserStore()

  if (!user?.member?.clubRole || !isValidUserRole(user.member.clubRole)) {
    return null
  }

  const userRole = user.member.clubRole
  if (!canManageDivision(userRole, targetDivision)) {
    return null
  }

  return <>{children}</>
}

// Session and Event management view - for division heads and admin
export function SessionEventManagementView({ children, targetDivision, fallback }: DivisionBasedViewProps) {
  const { user } = useUserStore();
  
  if (!user) {
    return fallback || null;
  }

  // President and Vice President have full access
  if (user.member.clubRole === 'President' || user.member.clubRole === 'Vice President') {
    return <>{children}</>;
  }

  // Division heads can only manage their own division's sessions and events
  const userDivision = getDivisionFromRole(user.member.clubRole);
  if (userDivision === targetDivision) {
    return <>{children}</>;
  }

  return fallback || null;
}

// Session and Event view - accessible to all members
export function SessionEventView({ children, fallback }: Omit<RoleBasedViewProps, 'allowedRoles'>) {
  return (
    <RoleBasedView
      allowedRoles={[
        'President',
        'Vice President',
        'CPD President',
        'Dev President',
        'CBD President',
        'SEC President',
        'DS President',
        'Member'
      ]}
      fallback={fallback}
    >
      {children}
    </RoleBasedView>
  );
}

// Member list view - accessible to all members
export function MemberListView({ children, fallback }: Omit<RoleBasedViewProps, 'allowedRoles'>) {
  return (
    <RoleBasedView
      allowedRoles={[
        'President',
        'Vice President',
        'CPD President',
        'Dev President',
        'CBD President',
        'SEC President',
        'DS President',
        'Member'
      ]}
      fallback={fallback}
    >
      {children}
    </RoleBasedView>
  );
}

export function DivisionBasedView({ children, targetDivision, fallback }: DivisionBasedViewProps) {
  const { user } = useUserStore();

  if (!user?.member?.clubRole || !isValidUserRole(user.member.clubRole)) {
    return fallback || null;
  }

  const userRole = user.member.clubRole
  if (!canManageDivision(userRole, targetDivision)) {
    return fallback || null;
  }

  return <>{children}</>;
} 
// types/member.tse
type AttendanceStatus = 'Active' | 'Inactive' | 'Needs Attention';
type CampusStatus = 'On Campus' | 'Off Campus' | 'Withdrawn';
type role = 'president' | 'divisionHead' | 'member';

export interface Member {
  id: string;
  name: string;
  memberId: string;
  division: string;
  attendance: AttendanceStatus;
  year?: string;
  group: string;
  email: string;
  password?: string;
  campusStatus: CampusStatus;
  profilePicture?: string | null;
  role:role;

   
}
export type { AttendanceStatus, CampusStatus, role };


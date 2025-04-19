import { UserRole } from "@/stores/userStore";

export interface Member {
    member: {
  _id: string;
  member_id?: string; // Optional as it might not come from backend
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  telegramHandle?: string;
  telegramUsername?: string; // Keeping both for compatibility
  graduationYear: number;
  specialization: string;
  department: string;
  universityId?: string;
  instagramHandle?: string;
  LinkedinHandle?: string;
  cv?: string;
  bio?: string;
  mentor?: string;
  division: string;
  clubRole: UserRole;
  divisionRole: string;
  group: string;
  membershipStatus: string;
  campusStatus: string;
  attendance: string;
  banned: boolean;
  mustChangePassword: boolean;
  profilePicture: string;
  leetcodeHandle?: string;
  codeforcesHandle?: string;
  createdAt?: string;
  updatedAt?: string;
  // Authentication fields (might come separately)
  token?: string;
  refreshToken?: string;
  generatedPassword?: string;
  year?: string; 
  // Optional, as it might not come from backend
}}

// For API responses where member is nested
export interface MemberApiResponse {
  member: Member;
  token?: string;
  refreshToken?: string;
}

// For lists of members
export interface MembersListResponse {
  length: number;
  members: Member[];
}
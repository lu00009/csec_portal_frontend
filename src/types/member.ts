import { UserRole } from "@/stores/userStore";

// types/member.ts
export interface Member {
    _id: string;
    member_id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    telegramUsername?: string;
    phoneNumber?: string;
    year: string;
    profilePicture: string;
    clubRole: UserRole;
    division: string;
    divisionRole?: string;
    status: string; // Adjust based on possible values
    createdAt?: string;
    Attendance?: string;
    campusStatus?: string;
    token?: string;
  }

import { UserRole } from "@/stores/userStore";

// types/member.ts
export interface Member {
    member :{
      _id: string;
      member_id: string;
      firstName: string;
      middleName?: string;
      lastName: string;
      email: string;
      telegramHandle?: string;
      phoneNumber?: string;
      graduationYear: string;
      profilePicture: string;
      clubRole: UserRole;
      division: string;
      divisionRole?: string;
      status: string; // Adjust based on possible values
      createdAt?: string;
      Attendance?: string;
      campusStatus?: string;
      token?: string;
      refreshToken?: string;
      birthDate?: string;
      gender?: string;
      universityId?: string;
      linkedinHandle?: string;
      codeforcesHandle?: string;
      leetcodeHandle?: string;
      instagramHandle ?: string;
      bio ?: string;
      cv?: string;
      role?: string;
      mentor?: string;
      specialization?: string;
      department?: string;
      github?: string;   
    }
    }
   

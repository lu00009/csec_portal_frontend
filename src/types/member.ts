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
    clubRole: string;
    division: string;
    divisionRole?: string;
    status: 'Active' | 'Inactive' | 'Pending'; // Adjust based on possible values
    createdAt?: string;
  }
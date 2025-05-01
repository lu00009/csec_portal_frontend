// components/profile/types.ts
import { Member } from "./member"; // Assuming you have a Member type

export interface Resource {
  name: string;
  link: string;
}

export interface RequiredFormProps {
  data: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    emailAddress: string;
    dateOfBirth?: Date;
    github: string;
    gender: string;
    telegramHandle: string;
    expectedGraduationYear: string;
    specialization: string;
    department: string;
    mentor: string;
  };
  onUpdate: (data: Partial<Member>) => void;
  onNext: () => void;
}

export interface OptionalFormProps {
  data: {
    universityId: string;
    linkedinAccount: string;
    codechefHandle: string;
    leetcodeHandle: string;
    instagramHandle: string;
    cv: string;
    joiningDate?: Date;
    shortBio: string;
  };
  onUpdate: (data: Partial<Member>) => void;
  onNext: () => void;
}

export interface ResourcesFormProps {
  resources: Resource[];
  onUpdate: (resources: Resource[]) => void;
}
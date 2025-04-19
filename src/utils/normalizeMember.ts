// utils/normalizeMember.ts
import { Member } from '@/types/member';
import { OptionalInfo, RequiredInfo } from '@/utils/types';

export const normalizeMember = (data: any): Member & RequiredInfo & OptionalInfo => {
  const member = data.member || data;
  
  // Required Info
  const requiredInfo: RequiredInfo = {
    firstName: member.firstName || '',
    lastName: member.lastName || '',
    phone: member.phoneNumber || member.phone || '',
    email: member.email || '',
    department: member.department || '',
    graduation: member.graduationYear?.toString() || member.graduation || '',
    birth: member.birthDate || member.birth || '',
    gender: member.gender || '',
    github: member.github || '',
    telegram: member.telegramHandle || member.telegram || '',
    specialization: member.specialization || '',
    mentor: member.mentor || ''
  };

  // Optional Info
  const optionalInfo: OptionalInfo = {
    uniId: member.universityId || member.uniId || '',
    insta: member.instagram || member.insta || '',
    linkedin: member.linkedin || '',
    codeforces: member.codeforces || '',
    leetcode: member.leetcode || '',
    joinedDate: member.createdAt || member.joinedDate || '',
    cv: member.cv || '',
    birthdate: member.birthDate || member.birthdate || '',
    shortbio: member.bio || member.shortbio || ''
  };

  // Core Member Info
  const coreMember: Member = {
    _id: member._id || '',
    member_id: member._id || member.member_id || '',
    profilePicture: member.profilePicture || '',
    clubRole: member.clubRole || 'Member',
    division: member.division || '',
    status: member.membershipStatus || member.status || 'Active',
    divisionRole: member.divisionRole || '',
    year: member.year || '',
    Attendance: member.Attendance || 'Active',
    campusStatus: member.campusStatus || '',
    token: member.token || '',
    refreshToken: member.refreshToken || '',
    group: member.group || '',  
    // Add any other fields from your Member interface
    ...member
  };

  return {
    ...coreMember,
    ...requiredInfo,
    ...optionalInfo
  };
};
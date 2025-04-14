export interface RequiredInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  department: string;
  graduation: string;
  birth: string;
  gender: string;
  github: string;
  telegram: string;
  specialization: string;
  mentor: string;
}
export interface OptionalInfo {
  uniId: string;
  insta: string;
  linkedin: string;
  codeforces: string;
  leetcode: string;
  joinedDate: string; // You can use Date if you plan to parse it
  cv: string;
  birthdate: string; // Or Date if parsing
  shortbio: string;
}
export interface Resource {
  name: string;
  link: string;
}
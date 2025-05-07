import { UserRole } from "@/stores/userStore";

export interface Role {
  id: string;
  name: UserRole;
  permissions: string[];
  status: "ACTIVE" | "INACTIVE";
} 
export interface Rule {
  id: string;
  name: string;
  description: string;
  value: number;
} 
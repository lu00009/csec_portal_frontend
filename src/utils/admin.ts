import { UserRole } from "@/stores/userStore";

export interface Role {
  id: string;
  name: UserRole;
  permissions: string[];
  status: "active" | "inactive";
} 
export interface Rule {
  id: string;
  name: string;
  description: string;
  value: number;
} 
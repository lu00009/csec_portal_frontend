// src/components/admin/AddHeadModal.tsx
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { useAdminStore } from "@/stores/adminStore";
import { toast } from "sonner";

const divisions = [
  "CPO",
  "Development",
  "Cyber",
  "Data Science",
  "Design",
  "Marketing",
  "HR",
];

export function AddHeadModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("");
  const [role, setRole] = useState("");
  const addHead = useAdminStore((state) => state.addHead);
  const token = localStorage.getItem("token"); // Get token from your auth system

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !division || !role) {
      toast.warning("All fields are required");
      return;
    }

    try {
      await addHead(
        {
          firstName,
          lastName,
          email,
          clubRole: role,
        },
        token || ""
      );
      onOpenChange(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setDivision("");
      setRole("");
    } catch (error) {
      console.error("Failed to add head:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Head</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div>
            <Label htmlFor="division">Division</Label>
            <select
              id="division"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Division</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role (e.g., Division President)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
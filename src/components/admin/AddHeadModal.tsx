"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import useMembersStore from "@/stores/membersStore";
import type { Head } from "@/types/admin";

export const AddHeadModal = ({
  open,
  onOpenChange,
  onSave,
  roles,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (head: Omit<Head, "id">) => Promise<void>;
  roles: string[];
}) => {
  const { members } = useMembersStore();
  const [division, setDivision] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

  // Filter active members
  useEffect(() => {
    setFilteredMembers(members.filter(m => m.status === "active"));
  }, [members]);

  const handleSubmit = async () => {
    if (!division || !name || !email || !role) {
      toast.error("Please fill all fields");
      return;
    }

    const selectedMember = members.find(m => m.email === email);
    if (!selectedMember) {
      toast.error("Selected member not found");
      return;
    }

    if (selectedMember.status !== "active") {
      toast.error("Only active members can be assigned as heads");
      return;
    }

    await onSave({
      division,
      name,
      email,
      role,
      permissionStatus: "active",
      avatar: selectedMember.profilePicture || "",
      permissions: [],
    });

    // Reset form
    setDivision("");
    setName("");
    setEmail("");
    setRole("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Head</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Division</Label>
            <Input
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              placeholder="Enter division name"
            />
          </div>

          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Member</Label>
            <Select
              value={email}
              onValueChange={(value) => {
                const member = members.find(m => m.email === value);
                if (member) {
                  setEmail(member.email);
                  setName(`${member.firstName} ${member.lastName}`);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {filteredMembers.map((member) => (
                  <SelectItem key={member._id} value={member.email}>
                    {member.firstName} {member.lastName} ({member.clubRole})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add Head
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
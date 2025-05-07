"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Head } from "@/types/admin";
import Input from "@/components/ui/input";
import { useState } from "react";

export const AddHeadModal = ({
  open,
  onOpenChange,
  head,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  head?: Head | null;
  onSave: (head: Omit<Head, "id">) => Promise<void>;
}) => {
  const [name, setName] = useState(head?.name || "");
  const [role, setRole] = useState(head?.role || "");
  const [email, setEmail] = useState(head?.email || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{head ? "Edit Head" : "Add New Head"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSave({ name, role, email, avatar: "", division: "", permissions: [], permissionStatus: "active" })}
            >
              {head ? "Save Changes" : "Add Head"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
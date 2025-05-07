"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import type { Role } from "@/types/admin";

export const AddRoleModal = ({
  open,
  onOpenChange,
  role,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSave: (role: Omit<Role, "id">) => Promise<void>;
}) => {
  const [name, setName] = useState(role?.role || "");
  const [permissions, setPermissions] = useState<string[]>(role?.permissions || []);
  const [permissionStatus, setStatus] = useState<"ACTIVE" | "INACTIVE">(role?.permissionStatus || "ACTIVE");

  const availablePermissions = [
    "create-post",
    "edit-post",
    "delete-post",
    "manage-members",
    "manage-events",
    "view-reports"
  ];

  const togglePermission = (permission: string) => {
    setPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Add New Role"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Role Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
            />
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="space-y-2 mt-2">
              {availablePermissions.map((permission) => (
                <div key={permission} className="flex items-center gap-2">
                  <Checkbox
                    id={permission}
                    checked={permissions.includes(permission)}
                    onCheckedChange={() => togglePermission(permission)}
                  />
                  <Label htmlFor={permission} className="capitalize">
                    {permission.replace("-", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <RadioGroup
              value={permissionStatus}
              onValueChange={(value) => setStatus(value as "ACTIVE" | "INACTIVE")}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ACTIVE" id="active" />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INACTIVE" id="inactive" />
                <Label htmlFor="inactive">Inactive</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSave({ role: name, permissions, permissionStatus })}
              disabled={!name.trim()}
            >
              {role ? "Save Changes" : "Add Role"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
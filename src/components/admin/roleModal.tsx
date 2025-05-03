// src/components/admin/AddRoleModal.tsx
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { useAdminStore } from "@/stores/adminStore";
import { toast } from "sonner";

const permissionsList = [
  "Upload Resources",
  "Create A Division",
  "Schedule Sessions",
  "Mark Attendance",
  "Manage Members",
  "View All Divisions",
];

export function AddRoleModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const addRole = useAdminStore((state) => state.addRole);
  const token = localStorage.getItem("token"); // Get token from your auth system

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.warning("Role name is required");
      return;
    }

    try {
      await addRole(
        {
          name,
          status,
          permissions,
        },
        token || ""
      );
      onOpenChange(false);
      setName("");
      setPermissions([]);
      setStatus("active");
    } catch (error) {
      console.error("Failed to add role:", error);
    }
  };

  const togglePermission = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setPermissions([]);
    } else {
      setPermissions(permissionsList);
    }
    setSelectAll(!selectAll);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
            />
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selectAll"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="selectAll">Select All</Label>
              </div>
              {permissionsList.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={permissions.includes(permission)}
                    onCheckedChange={() => togglePermission(permission)}
                  />
                  <Label htmlFor={permission}>{permission}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
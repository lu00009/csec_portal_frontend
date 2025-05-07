"use client";

import Button from "@/components/ui/button";
import { RoleCard } from "@/components/admin/role-card";
import { AddRoleModal } from "@/components/admin/AddRoleModal";
import { useState } from "react";
import type { Role } from "@/types/admin";

export const RolesTab = ({
  roles,
  onAddRole,
  onUpdateRole,
  onBanRole,
}: {
  roles: Role[];
  onAddRole: (role: Omit<Role, "id">) => Promise<void>;
  onUpdateRole: (id: string, role: Role) => Promise<void>;
  onBanRole: (roleId: string) => void;
}) => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Roles</h2>
        <Button onClick={() => setIsRoleModalOpen(true)}>
          Add Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}    />
        ))}
      </div>

      <AddRoleModal
        open={isRoleModalOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
        setIsRoleModalOpen(false);
        setEditingRole(null);
          }
        }}
        role={editingRole}
        onSave={async (role: Omit<Role, "id">) => {
          if (editingRole) {
            await onUpdateRole(editingRole.id, role as Role);
          } else {
            await onAddRole(role);
          }
          setIsRoleModalOpen(false);
          setEditingRole(null);
        }}
      />
    </div>
  );
};
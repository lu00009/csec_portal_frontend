"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { AddHeadModal } from "@/components/admin/AddHeadModal";
import { HeadsTable } from "@/components/admin/HeadsTable";
import type { Head } from "@/types/admin";
import { toast } from "sonner";

export const HeadsTab = ({
  heads,
  onAddHead,
  onUpdateHead,
  onBanHead,
}: {
  heads: Head[];
  onAddHead: (head: Omit<Head, "id">) => Promise<void>;
  onUpdateHead: (id: string, head: Head) => Promise<void>;
  onBanHead: (id: string) => void;
}) => {
  const [isAddHeadModalOpen, setIsAddHeadModalOpen] = useState(false);
  
  // Extract unique roles from existing heads
  const roles = Array.from(new Set(heads.map(head => head.role)));

  const handleAddHead = async (head: Omit<Head, "id">) => {
    try {
      await onAddHead(head);
      toast.success("Head added successfully");
      setIsAddHeadModalOpen(false);
    } catch (error) {
      toast.error("Failed to add head");
      console.error("Add head error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddHeadModalOpen(true)}>
          Add Head
        </Button>
      </div>

      <HeadsTable 
        heads={heads} 
        onEdit={(head) => {
          // Implement edit functionality if needed
        }} 
        onBan={onBanHead}
      />

      <AddHeadModal
        open={isAddHeadModalOpen}
        onOpenChange={setIsAddHeadModalOpen}
        onSave={handleAddHead}
        roles={roles}
      />
    </div>
  );
};
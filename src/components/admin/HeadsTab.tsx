"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { AddHeadModal } from "@/components/admin/AddHeadModal";
import { HeadsTable } from "@/components/admin/HeadsTable";
import type { Head } from "@/types/admin";
import { toast } from "sonner";
import {useAdminStore} from "@/stores/adminStore";

export const HeadsTab = ({
  heads,
  onBanHead,
}: {
  heads: Head[];
  onUpdateHead: (id: string, head: Head) => Promise<void>;
  onBanHead: (id: string) => void;
}) => {
  const [isAddHeadModalOpen, setIsAddHeadModalOpen] = useState(false);
  const { addHead } = useAdminStore();

  const handleAddHead = async (headData: {
    division: string;
    name: string;
    email: string;
  }) => {
    try {
      await addHead({
        division: headData.division,
        name: headData.name,
        email: headData.email,
      });
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
          console.log("Editing head:", head);
        }} 
        onBan={onBanHead}
      />

      <AddHeadModal
        open={isAddHeadModalOpen}
        onOpenChange={setIsAddHeadModalOpen}
        onSave={handleAddHead}
      />
    </div>
  );
};
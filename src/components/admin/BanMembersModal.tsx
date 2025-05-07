"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export const BanMembersModal = ({
  open,
  onOpenChange,
  memberIds,
  onBan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberIds: string[];
  onBan: (memberIds: string[]) => Promise<void>;
}) => {
  const [banSelection, setBanSelection] = useState<"specific" | "all">("specific");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <RadioGroup
            value={banSelection}
            onValueChange={(value) => setBanSelection(value as "specific" | "all")}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specific" id="specific" />
              <Label htmlFor="specific">Ban specific members</Label>
            </div>
          </RadioGroup>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => onBan(memberIds)}
              disabled={memberIds.length === 0}
            >
              Ban Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
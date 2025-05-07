"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { MembersTable } from "@/components/admin/MembersTable";
import { RuleCard } from "@/components/admin/RuleCard";
import type { ClubRules, Member } from "@/types/admin";

export const RulesTab = ({
  rules,
  members,
  onBanMembers,
}: {
  rules: ClubRules;
  members: Member[];
  onUpdateRule: (field: keyof ClubRules, value: number) => Promise<void>;
  onBanMembers: (memberIds: string[]) => Promise<void>;
}) => {
  const [showMembers, setShowMembers] = useState(false);

  return (
    <div className="space-y-4">
      {!showMembers ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <RuleCard
              title="Max Absences"
              description="Members exceeding this are flagged for review"
              value={rules.maxAbsences}
            />
            <RuleCard
              title="Warning After"
              description="Members receive a warning notification"
              value={rules.warningAfter}
            />
            <RuleCard
              title="Suspend After"
              description="Member's access suspended"
              value={rules.suspendAfter}
            />
            <RuleCard
              title="Fire After"
              description="Member removed from division"
              value={rules.fireAfter}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setShowMembers(true)}
              className="mt-4"
            >
              Manage Members
            </Button>
          </div>
        </>
      ) : (
        <MembersTable 
          members={members} 
          onBanMembers={onBanMembers}
          onBack={() => setShowMembers(false)}
        />
      )}
    </div>
  );
};
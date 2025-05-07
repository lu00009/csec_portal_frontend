"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { MembersTable } from "@/components/admin/MembersTable";
import { RuleCard } from "@/components/admin/RuleCard";
import type { ClubRules } from "@/types/admin";

export const RulesTab = ({
  rules,
  members,
  onUpdateRule,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RuleCard
          title="Max Absences"
          description="Members exceeding this are flagged for review"
          value={rules.maxAbsences}
          options={[3, 4, 5, 6, 7, 8, 9, 10]}
          onChange={(value) => onUpdateRule("maxAbsences", value)}
        />
        <RuleCard
          title="Warning After"
          description="Members receive a warning notification"
          value={rules.warningAfter}
          options={[1, 2, 3, 4, 5]}
          onChange={(value) => onUpdateRule("warningAfter", value)}
        />
        <RuleCard
          title="Suspend After"
          description="Member's access suspended"
          value={rules.suspendAfter}
          options={[3, 4, 5, 6, 7, 8]}
          onChange={(value) => onUpdateRule("suspendAfter", value)}
        />
        <RuleCard
          title="Fire After"
          description="Member removed from division"
          value={rules.fireAfter}
          options={[5, 6, 7, 8, 9, 10]}
          onChange={(value) => onUpdateRule("fireAfter", value)}
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => setShowMembers(!showMembers)}
          variant={showMembers ? "outline" : "default"}
        >
          {showMembers ? "Hide Members" : "Show Members"}
        </Button>
      </div>

      {showMembers && (
        <MembersTable 
          members={members} 
          onBanMembers={onBanMembers}
        />
      )}
    </div>
  );
};
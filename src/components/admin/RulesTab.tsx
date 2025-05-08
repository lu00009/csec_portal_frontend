"use client";

import { MembersTable } from "@/components/admin/MembersTable";
import { RuleCard } from "@/components/admin/RuleCard";
import Button from "@/components/ui/button";
import type { ClubRules, Member } from "@/types/admin";
import { useEffect, useState } from "react";

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
  useEffect(() => {
    console.log(rules);
  }, [rules]);

  return (
    <div className="space-y-4">
      {!showMembers ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            <RuleCard
              title="Max Absences"
              description="Members exceeding this are flagged for review"
              value={rules.maxAbsences}
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              onChange={(value) => onUpdateRule('maxAbsences', value)}
            />
            <RuleCard
              title="Warning After"
              description="Members receive a warning notification"
              value={rules.warningAfter}
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              onChange={(value) => onUpdateRule('warningAfter', value)}
            />
            <RuleCard
              title="Suspend After"
              description="Member's access suspended"
              value={rules.suspendAfter}
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              onChange={(value) => onUpdateRule('suspendAfter', value)}
            />
            <RuleCard
              title="Fire After"
              description="Member removed from division"
              value={rules.fireAfter}
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              onChange={(value) => onUpdateRule('fireAfter', value)}
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
          onBack={() => setShowMembers(false)}
        />
      )}
    </div>
  );
};
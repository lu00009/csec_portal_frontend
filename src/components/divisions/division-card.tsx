import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards";
import { useUserStore } from "@/stores/userStore";
import { Plus } from "lucide-react";
import Link from "next/link";

interface DivisionCardProps {
  division: {
    name: string;
    groups?: string[];
    memberCount: number;
    groupMemberCounts?: { [key: string]: number };
  };
  onAddMember?: () => void;
}

export function DivisionCard({ division, onAddMember }: DivisionCardProps) {
  const { user, hasRole, hasDivisionAccess } = useUserStore();
  const canAddMembers = user?.member?.clubRole === 'President' || 
                       user?.member?.clubRole === 'Vice President' ||
                       (user?.member?.clubRole?.includes('President') && hasDivisionAccess(division.name as any));

  return (
    <Card className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-gray-900 dark:text-white">{division.name}</CardTitle>
          <div className="flex items-center gap-2">
            {canAddMembers && onAddMember && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddMember}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Member
              </Button>
            )}
            <Link
              href={`/main/divisions/${encodeURIComponent(division.name)}`}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center"
            >
              View All
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {division.memberCount || 0} total members
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {division.groups?.map((groupName) => (
            <Link
              key={`${division.name}-${groupName}`}
              href={`/main/divisions/${encodeURIComponent(division.name)}/${encodeURIComponent(groupName)}`}
              className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-200">{groupName}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {division.groupMemberCounts?.[groupName] || 0} members
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
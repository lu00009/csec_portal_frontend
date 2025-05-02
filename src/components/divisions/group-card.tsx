import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards";
import { ChevronRight, User } from "lucide-react";
import Link from "next/link";

interface GroupCardProps {
  groupName: string;
  divisionName: string;
  memberCount: number;
}

export function GroupCard({ groupName, divisionName, memberCount }: GroupCardProps) {
  const encodedDivision = encodeURIComponent(divisionName);
  const encodedGroup = encodeURIComponent(groupName);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{groupName}</CardTitle>
          <Link
            href={`/main/divisions/${encodedDivision}/${encodedGroup}`}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: Math.min(memberCount, 5) }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
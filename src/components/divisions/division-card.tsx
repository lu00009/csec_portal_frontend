import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards";
import Link from "next/link";

interface DivisionCardProps {
  division: {
    name: string;
    groups?: string[];
    length: number;
  };
}

export function DivisionCard({ division }: DivisionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{division.name}</CardTitle>
          <Link
            href={`/main/divisions/${encodeURIComponent(division.name)}`}
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            View All
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">{division.length} members</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {division.groups?.map((groupName) => (
            <Link
              key={`${division.name}-${groupName}`}
              href={`/main/divisions/${encodeURIComponent(division.name)}/${encodeURIComponent(groupName)}`}
              className="flex justify-between items-center p-2 hover:bg-muted rounded-md transition-colors"
            >
              <span>{groupName}</span>
              <span className="text-muted-foreground">
                {division.length} members
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
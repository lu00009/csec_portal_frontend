"use client";

import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";

export const RuleCard = ({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
}) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium">{title}</h3>
      <p className="text-muted-foreground text-sm mb-2">{description}</p>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">{value}</span>
      </div>
      
    </div>
  );
};
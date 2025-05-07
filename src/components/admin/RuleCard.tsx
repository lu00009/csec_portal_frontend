"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const RuleCard = ({
  title,
  description,
  value,
  options,
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
        <Select
          value={value.toString()}
          onValueChange={(value) => onChange(parseInt(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
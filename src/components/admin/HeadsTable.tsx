"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Head } from "@/types/admin";

export const HeadsTable = ({
  heads,
  onEdit,
  onBan,
}: {
  heads: Head[];
  onEdit: (head: Head) => void;
  onBan: (id: string) => void;
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {heads.map((head) => (
            <tr key={head.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={head.avatar || ""} alt={head.name} />
                    <AvatarFallback>
                      {head.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{head.name}</span>
                </div>
              </td>
              <td className="p-4">{head.role}</td>
              <td className="p-4">{head.division}</td>
              <td className="p-4">
                <Badge variant={head.permissionStatus === "active" ? "default" : "destructive"}>
                  {head.permissionStatus}
                </Badge>
              </td>
              <td className="p-4 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(head)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onBan(head.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
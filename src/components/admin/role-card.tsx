"use client"

import { Badge } from "@/components/ui/badge"
import Button from "@/components/ui/button"
import type { Role } from "@/types/admin"
import { Edit, Trash2 } from "lucide-react"
import { useState } from "react"

export interface RoleCardProps {
  role: Role;
  onDelete: () => void;
  onEdit: () => void;
}

export function RoleCard({ role }: RoleCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className={role.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {role.status === "active" ? "Active" : "Inactive"}
            </Badge>
            <h3 className="font-medium">{role.name}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">{expanded ? "Permissions" : "Permission"}</h4>
          <div className="flex flex-wrap gap-2">
            {(expanded ? role.permissions : role.permissions.slice(0, 3)).map((permission, index) => (
              <Badge key={index} variant="default" className="rounded-md">
                {permission}
              </Badge>
            ))}
            {!expanded && role.permissions.length > 3 && (
              <Button variant="ghost" className="text-xs h-6 px-2" onClick={() => setExpanded(true)}>
                +{role.permissions.length - 3} more
              </Button>
            )}
          </div>
          {expanded && role.permissions.length > 3 && (
            <Button variant="ghost" className="text-xs mt-2" onClick={() => setExpanded(false)}>
              Show less
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

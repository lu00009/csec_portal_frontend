"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/admin/pagination";
import { BanMembersModal } from "@/components/admin/BanMembersModal";
import type { Member } from "@/types/admin";

export const MembersTable = ({
  members,
  onBanMembers,
}: {
  members: Member[];
  onBanMembers: (memberIds: string[]) => Promise<void>;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [membersToBan, setMembersToBan] = useState<string[]>([]);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const itemsPerPage = 10;

  const filteredMembers = members.filter(
    (member) =>
      `${member.member.firstName} ${member.member.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      member.member.clubRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMemberSelect = (memberId: string) => {
    setMembersToBan((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <div className="mt-6 border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Members</h3>
        {membersToBan.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setIsBanModalOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Ban Selected ({membersToBan.length})
          </Button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={
                    membersToBan.length > 0 &&
                    membersToBan.length === filteredMembers.length
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setMembersToBan(filteredMembers.map((m) => m.member._id));
                    } else {
                      setMembersToBan([]);
                    }
                  }}
                />
              </th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.map((member) => (
              <tr
                key={member.member._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">
                  <Checkbox
                    checked={membersToBan.includes(member.member._id)}
                    onCheckedChange={() => handleMemberSelect(member.member._id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={member.member.profilePicture || ""} 
                        alt={`${member.member.firstName} ${member.member.lastName}'s profile picture`} 
                      />
                      <AvatarFallback>
                        {member.member.firstName[0]}
                        {member.member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {member.member.firstName} {member.member.lastName}
                    </span>
                  </div>
                </td>
                <td className="p-4">{member.member.clubRole}</td>
                <td className="p-4">
                  <Badge variant={member.member.status === "active" ? "default" : "destructive"}>
                    {member.member.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredMembers.length}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {
          setCurrentPage(1); // Reset to the first page
          // Optionally update itemsPerPage if needed
        }}
      />

      <BanMembersModal
        open={isBanModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsBanModalOpen(false);
            setMembersToBan([]);
          }
        }}
        memberIds={membersToBan}
        onBan={onBanMembers}
      />
    </div>
  );
};
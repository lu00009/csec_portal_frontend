"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Search, ArrowLeft, Ban } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/admin/pagination";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useMembersStore from "@/stores/membersStore";
import { toast } from "sonner";
import { useAdminStore } from "@/stores/adminStore";

export const MembersTable = ({
  onBack,
}: {
  onBack?: () => void;
}) => {
  const { members, loading, error, fetchMembers } = useMembersStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 10;
  const {banMember}= useAdminStore()



  const filteredMembers = members?.filter((member) => {
    const matchesSearch = `${member?.firstName || ''} ${member?.lastName || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || 
      member?.clubRole?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage));
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const toggleMemberSelection = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const toggleAllMembers = (checked: boolean) => {
    if (checked) {
      const pageEmails = paginatedMembers.map(m => m.email).filter(Boolean) as string[];
      setSelectedEmails(prev => [...new Set([...prev, ...pageEmails])]);
    } else {
      const pageEmails = paginatedMembers.map(m => m.email).filter(Boolean) as string[];
      setSelectedEmails(prev => prev.filter(email => !pageEmails.includes(email)));
    }
  };

  const handleBan = async () => {
    if (selectedEmails.length === 0) {
      toast.warning("Please select at least one member to ban");
      return;
    }
  
    try {
      // This will now send { emails: [...] } format
      await banMember(selectedEmails);
      toast.success(`${selectedEmails.length} members banned successfully`);
      setSelectedEmails([]);
      fetchMembers();
    } catch (err) {
      toast.error("Failed to ban members");
      console.error("Ban error:", err);
    }
  };

  if (loading) return <div className="p-4">Loading members...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-xl font-bold">Members Management</h2>
        </div>
        
        {selectedEmails.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleBan}
            className="gap-2"
          >
            <Ban className="h-4 w-4" />
            Ban Selected ({selectedEmails.length})
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Search className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {isFilterOpen && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <h3 className="font-medium mb-2">Filters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left w-12">
                <Checkbox
                  checked={
                    selectedEmails.length > 0 &&
                    paginatedMembers.every(m => 
                      m.email && selectedEmails.includes(m.email)
                    )
                  }
                  onCheckedChange={(checked) => 
                    toggleAllMembers(checked === true)
                  }
                />
              </th>
              <th className="p-4 text-left">Member</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.map((member) => (
              <tr
                key={member._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">
                  <Checkbox
                    checked={member.email ? selectedEmails.includes(member.email) : false}
                    onCheckedChange={() => 
                      member.email && toggleMemberSelection(member.email)
                    }
                    disabled={!member.email}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={member.profilePicture || ""} 
                        alt={`${member.firstName || ''} ${member.lastName || ''}`}
                      />
                      <AvatarFallback>
                        {(member.firstName?.[0] || '') + (member.lastName?.[0] || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {member.firstName || ''} {member.lastName || ''}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {member.email || 'No email'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">{member.clubRole || ''}</td>
                <td className="p-4">
                  <Badge variant={member.status === "active" ? "default" : "destructive"}>
                    {member.status || 'unknown'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMembers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredMembers.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};
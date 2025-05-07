"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Search } from "lucide-react";
import { Pagination } from "@/components/admin/pagination";
import { AddHeadModal } from "@/components/admin/AddHeadModal";
import { HeadsTable } from "@/components/admin/HeadsTable";
import type { Head } from "@/types/admin";

export const HeadsTab = ({
  heads,
  onAddHead,
  onUpdateHead,
  onBanHead,
}: {
  heads: Head[];
  onAddHead: (head: Omit<Head, "id">) => Promise<void>;
  onUpdateHead: (id: string, head: Head) => Promise<void>;
  onBanHead: (id: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddHeadModalOpen, setIsAddHeadModalOpen] = useState(false);
  const [editingHead, setEditingHead] = useState<Head | null>(null);
  const itemsPerPage = 10;

  const filteredHeads = heads.filter(
    (head) =>
      head.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      head.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHeads.length / itemsPerPage);
  const paginatedHeads = filteredHeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search heads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setIsAddHeadModalOpen(true)}>
          Add Head
        </Button>
      </div>

      <HeadsTable 
        heads={paginatedHeads} 
        onEdit={(head: Head) => {
          setEditingHead(head);
          setIsAddHeadModalOpen(true);
        }} 
        onBan={(id: string) => onBanHead(id)}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => setCurrentPage(page)}
        totalItems={filteredHeads.length}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={() => {
          setCurrentPage(1); // Reset to the first page
          // Update itemsPerPage if needed
        }}
      />

      <AddHeadModal
        open={isAddHeadModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddHeadModalOpen(false);
            setEditingHead(null);
          }
        }}
        head={editingHead}
        onSave={async (head) => {
          if (editingHead) {
            await onUpdateHead(editingHead.id, head as Head);
          } else {
            await onAddHead(head);
          }
          setIsAddHeadModalOpen(false);
          setEditingHead(null);
        }}
      />
    </div>
  );
};
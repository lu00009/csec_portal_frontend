"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ShieldCheck, BookOpen } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";
import useMembersStore from "@/stores/membersStore";
import { useEffect, useState } from "react";
import { HeadsTab } from "@/components/admin/HeadsTab";
import { RolesTab } from "@/components/admin/RolesTab";
import { RulesTab } from "@/components/admin/RulesTab";

export default function AdministrationPage() {
  const {
    rules,
    heads,
    loading: adminLoading,
    error: adminError,
    fetchRules,
    addHead,
    updateHead,
    banMember,
    fetchHeads,
    updateRule,
    addRole,
    updateRole,
  } = useAdminStore();

  const {
    members,
    loading: membersLoading,
    error: membersError,
    fetchMembers,
  } = useMembersStore();

  const [activeTab, setActiveTab] = useState("heads");

  useEffect(() => {
    fetchHeads();
    fetchMembers();
    fetchRules();
  }, [fetchHeads, fetchMembers, fetchRules]);

  if (adminLoading || membersLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (adminError || membersError) {
    return <div className="p-6 text-red-500">Error: {adminError || membersError}</div>;
  }

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="heads">
            <Users className="h-4 w-4 mr-2" />
            Heads
          </TabsTrigger>
          <TabsTrigger value="roles">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="rules">
            <BookOpen className="h-4 w-4 mr-2" />
            Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="heads" className="space-y-4">
          <HeadsTab
            heads={heads}
            onAddHead={addHead}
            onUpdateHead={updateHead}
            onBanHead={(id) => banMember(id).then(fetchHeads)}
          />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RolesTab
            roles={Array.from(new Set(heads.map(head => ({
              id: head.role,
              name: head.role,
              permissions: [],
              status: "active"
            }))))}
            onAddRole={addRole}
            onUpdateRole={updateRole}
            onBanRole={(roleId) => {
              const headsWithRole = heads.filter(h => h.role === roleId);
              return Promise.all(headsWithRole.map(h => banMember(h.id)))
                .then(fetchHeads);
            }}
          />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
        <RulesTab
  rules={rules}
  members={members}
  onUpdateRule={updateRule}
  onBanMembers={async (memberIds) => {
    await Promise.all(memberIds.map(id => banMember(id)));
    fetchMembers();
  }}
/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";
import useMembersStore from "@/stores/membersStore";
import { useEffect, useState } from "react";
import { HeadsTab } from "@/components/admin/HeadsTab";
import { RulesTab } from "@/components/admin/RulesTab";

export default function AdministrationPage() {
  const {
    rules,
    heads,
    error: adminError,
    fetchRules,
    addHead,
    banMember,
    fetchHeads,
    
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
    console.log(heads)
  }, [fetchHeads, fetchMembers, fetchRules]);

  // if (adminLoading || membersLoading) {
  //   console.log('heads',heads)
  //   return <div className="p-6">Loading...</div>;
  // }

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
          <TabsTrigger value="rules">
            <BookOpen className="h-4 w-4 mr-2" />
            Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="heads" className="space-y-4">
          <HeadsTab
            heads={heads}
            onAddHead={addHead}
            onBanHead={(id) => banMember(id).then(fetchHeads)}
          />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
        <RulesTab
  rules={rules}
  members={members}
  onBanMembers={async (memberIds) => {
    await Promise.all(memberIds.map(id => banMember(id)));
    fetchMembers({limit: 200});
  }}
/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
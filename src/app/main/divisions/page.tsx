"use client"
import { AddDivisionDialog } from "@/components/divisions/add-division-dialog"
import { DivisionCard } from "@/components/divisions/division-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { canManageDivision } from "@/lib/divisionPermissions"
import { useDivisionsStore } from "@/stores/DivisionStore"
import { useUserStore } from "@/stores/userStore"
import { ChevronRight, Home, Search } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function DivisionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const [error, setError] = useState<string | null>(null)
  const { user } = useUserStore()

  const { divisions, loading, fetchDivisions, showAddDivisionDialog, setShowAddDivisionDialog } = useDivisionsStore()

  const [divisionStats, setDivisionStats] = useState<{
    [divisionName: string]: {
      memberCount: number
      groupMemberCounts: { [group: string]: number }
      groups: string[]
    }
  }>({})

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        await fetchDivisions()
        setError(null)
        console.log("Divisions loaded successfully:", divisions)
      } catch (err) {
        setError("Failed to load divisions. Please try again later.")
        console.error(err)
      }
    }

    loadDivisions()
  }, [fetchDivisions])

  useEffect(() => {
    const fetchStats = async () => {
      const token = useUserStore.getState().token
      const stats: typeof divisionStats = {}
      for (const division of divisions) {
        const groupsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/divisions/getGroups/${encodeURIComponent(division.name)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const groupsData = await groupsRes.json()
        const groups: string[] = groupsData.groups || []
        let memberCount = 0
        const groupMemberCounts: { [group: string]: number } = {}
        for (const group of groups) {
          const membersRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/groups/getMembers?division=${encodeURIComponent(division.name)}&group=${encodeURIComponent(group)}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          const membersData = await membersRes.json()
          const count = (membersData.groupMembers || []).length
          groupMemberCounts[group] = count
          memberCount += count
        }
        stats[division.name] = { memberCount, groupMemberCounts, groups }
      }
      setDivisionStats(stats)
    }
    if (divisions.length > 0) {
      fetchStats()
    }
  }, [divisions])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    if (query) {
      router.push(`/main/divisions?search=${encodeURIComponent(query)}`)
    } else {
      router.push("/main/divisions")
    }
  }

  return (
    <div className="flex flex-col h-full">
       <div className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <div className="flex items-center">
            <nav className="flex items-center space-x-2">
              <Link href="/main/divisions" className="text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link href="/main/divisions" className="text-muted-foreground hover:text-foreground">
                All Divisions
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </nav>
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <h1 className="text-xl font-semibold">All Divisions</h1>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="w-full pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {user?.member?.clubRole && (
            <Button 
              onClick={() => setShowAddDivisionDialog(true)}
              disabled={!canManageDivision(user?.member?.clubRole, 'all')}
            >
              Add Division
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-lg border animate-pulse bg-muted" />
            ))}
          </div>
        ) : divisions.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No divisions found</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery ? "Try a different search term or" : "Get started by"} creating a new division.
            </p>
            <Button onClick={() => setShowAddDivisionDialog(true)} className="mt-4">
              Add Division
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {divisions.map((division) => (
              <DivisionCard
                key={division.name}
                division={{
                  ...division,
                  memberCount: divisionStats[division.name]?.memberCount || 0,
                  groupMemberCounts: divisionStats[division.name]?.groupMemberCounts || {},
                  groups: divisionStats[division.name]?.groups || [],
                }}
              />
            ))}
          </div>
        )}
      </div>

      <AddDivisionDialog open={showAddDivisionDialog} onOpenChange={setShowAddDivisionDialog} />
    </div>
  )
}
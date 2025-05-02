"use client"
import { AddDivisionDialog } from "@/components/divisions/add-division-dialog"
import { DivisionCard } from "@/components/divisions/division-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { useDivisionsStore } from "@/stores/DivisionStore"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

export default function DivisionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const [error, setError] = useState<string | null>(null)

  const { divisions, isLoading, fetchDivisions, showAddDivisionDialog, setShowAddDivisionDialog } = useDivisionsStore()

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        await fetchDivisions(searchQuery)
        setError(null)
        console.log("Divisions loaded successfully:", divisions)


      } catch (err) {
        setError("Failed to load divisions. Please try again later.")
        console.error(err)
      }
    }

    loadDivisions()
  }, [fetchDivisions, searchQuery])

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
          <Button onClick={() => setShowAddDivisionDialog(true)}>Add Division</Button>
        </div>

        {isLoading ? (
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
              <DivisionCard key={division.name} division={division}/>
            ))}
          </div>
        )}
      </div>

      <AddDivisionDialog open={showAddDivisionDialog} onOpenChange={setShowAddDivisionDialog} />
    </div>
  )
}
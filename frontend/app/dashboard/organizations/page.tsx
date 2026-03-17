"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Users, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"

type Organization = {
  id: string
  name: string
  slug: string
  size: string
  industry: string
  membersCount: number
  createdAt: string
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch organizations from API
    const fetchOrganizations = async () => {
      try {
        const res = await fetch("/api/admin/organizations")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setOrganizations(data.organizations || [])
      } catch (error) {
        console.error("Failed to fetch organizations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      setOrganizations(organizations.filter(org => org.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-1">Manage all organizations on the platform</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Organization
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">Total Organizations</p>
          <p className="text-3xl font-bold mt-2">{organizations.length}</p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="text-3xl font-bold mt-2">
            {organizations.reduce((sum, org) => sum + org.membersCount, 0)}
          </p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">Active This Month</p>
          <p className="text-3xl font-bold mt-2">{organizations.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No organizations found
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map(org => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <Link href={`/dashboard/organizations/${org.id}`}>
                        <div className="cursor-pointer">
                          <p className="font-medium hover:underline">{org.name}</p>
                          <p className="text-xs text-muted-foreground">{org.slug}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>{org.industry}</TableCell>
                    <TableCell>{org.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4" />
                        {org.membersCount}
                      </div>
                    </TableCell>
                    <TableCell>{org.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(org.id)}
                          className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

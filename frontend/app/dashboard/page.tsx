"use client"

import { useState, useEffect } from "react"
import { Building2, Users, TrendingUp, Clock, Plus } from "lucide-react"
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

type DashboardStats = {
  isSuperAdmin: boolean
  stats: {
    totalOrganizations?: number
    totalUsers?: number
    totalMembers?: number
    totalRevenue?: number
    organizationCount?: number
    recentOrgs?: any[]
  }
  recentOrganizations?: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats")
        if (!res.ok) throw new Error("Failed to fetch")
        const result = await res.json()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-muted rounded-lg animate-pulse" />
          <div className="h-32 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard</p>
      </div>
    )
  }

  // SUPER ADMIN DASHBOARD
  if (data.isSuperAdmin) {
    const { totalOrganizations = 0, totalUsers = 0, totalMembers = 0, totalRevenue = 0 } = data.stats

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Overview</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all organizations</p>
          </div>
          <Link href="/dashboard/organizations">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Organization
            </Button>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Organizations</p>
                <p className="text-4xl font-bold mt-2">{totalOrganizations}</p>
              </div>
              <Building2 className="h-12 w-12 text-primary/30" />
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Users</p>
                <p className="text-4xl font-bold mt-2">{totalUsers}</p>
              </div>
              <Users className="h-12 w-12 text-blue-500/30" />
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Members</p>
                <p className="text-4xl font-bold mt-2">{totalMembers}</p>
              </div>
              <Users className="h-12 w-12 text-purple-500/30" />
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">${totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500/30" />
            </div>
          </div>
        </div>

        {/* Recent Organizations */}
        <div className="border rounded-lg bg-card overflow-hidden">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Organizations
            </h2>
            <Link href="/dashboard/organizations">
              <Button className="gap-2">View All</Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrganizations && data.recentOrganizations.length > 0 ? (
                  data.recentOrganizations.map((org: any) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {org.plan}
                        </span>
                      </TableCell>
                      <TableCell>{org.membersCount} members</TableCell>
                      <TableCell className="text-muted-foreground">
                        {org.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/organizations`}>
                          <button className="text-xs font-medium text-primary hover:underline">
                            View
                          </button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No organizations yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/organizations" className="group">
            <div className="border rounded-lg p-6 bg-card hover:border-primary transition-colors group-hover:shadow-lg">
              <Building2 className="h-6 w-6 mb-3 text-primary group-hover:translate-y-[-2px] transition-transform" />
              <h3 className="font-semibold mb-2">Manage Organizations</h3>
              <p className="text-sm text-muted-foreground">View all organizations and manage their details</p>
            </div>
          </Link>

          <Link href="/dashboard/logs" className="group">
            <div className="border rounded-lg p-6 bg-card hover:border-primary transition-colors group-hover:shadow-lg">
              <TrendingUp className="h-6 w-6 mb-3 text-green-500 group-hover:translate-y-[-2px] transition-transform" />
              <h3 className="font-semibold mb-2">Billing & Revenue</h3>
              <p className="text-sm text-muted-foreground">Track revenue and billing information</p>
            </div>
          </Link>

          <Link href="/dashboard/settings" className="group">
            <div className="border rounded-lg p-6 bg-card hover:border-primary transition-colors group-hover:shadow-lg">
              <Users className="h-6 w-6 mb-3 text-blue-500 group-hover:translate-y-[-2px] transition-transform" />
              <h3 className="font-semibold mb-2">Platform Settings</h3>
              <p className="text-sm text-muted-foreground">Configure platform-wide settings</p>
            </div>
          </Link>
        </div>
      </div>
    )
  }

  // REGULAR USER DASHBOARD
  const { organizationCount = 0, recentOrgs = [] } = data.stats

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Organizations</h1>
          <p className="text-muted-foreground mt-1">Manage your organizations and projects</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Organization
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Organizations</p>
              <p className="text-4xl font-bold mt-2">{organizationCount}</p>
            </div>
            <Building2 className="h-12 w-12 text-primary/30" />
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Members</p>
              <p className="text-4xl font-bold mt-2">{data.stats.totalMembers || 0}</p>
            </div>
            <Users className="h-12 w-12 text-blue-500/30" />
          </div>
        </div>
      </div>

      {/* Organizations List */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Your Organizations</h2>
        </div>

        {data.recentOrganizations && data.recentOrganizations.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrganizations.map((org: any) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell className="capitalize">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-medium">
                        {org.role?.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>{org.membersCount} members</TableCell>
                    <TableCell className="text-muted-foreground">
                      {org.joinedAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No organizations yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
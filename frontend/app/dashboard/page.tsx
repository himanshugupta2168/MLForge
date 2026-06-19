"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  TrendingUp,
  Clock,
  Plus,
  RefreshCw,
  MoveRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

type DashboardStats = {
  isSuperAdmin: boolean;
  stats: {
    totalOrganizations?: number;
    totalUsers?: number;
    totalMembers?: number;
    totalRevenue?: number;
    organizationCount?: number;
    recentOrgs?: any[];
  };
  recentOrganizations?: any[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-muted rounded-lg animate-pulse" />
          <div className="h-32 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard</p>
      </div>
    );
  }

  // SUPER ADMIN DASHBOARD
  if (data.isSuperAdmin) {
    const {
      totalOrganizations = 0,
      totalUsers = 0,
      totalMembers = 0,
      totalRevenue = 0,
    } = data.stats;

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Overview</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all organizations
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button className="gap-2" onClick={fetchStats}>
              <RefreshCw className="h-4 w-4 cursor-pointer" />
              Sync Changes
            </Button>
            <Link href="/dashboard/organizations">
              <Button className="gap-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                New Organization
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Organizations
                </p>
                <p className="text-4xl font-bold mt-2">{totalOrganizations}</p>
              </div>
              <Building2 className="h-12 w-12 text-primary/30" />
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Unique Users
                </p>
                <p className="text-4xl font-bold mt-2">{totalUsers}</p>
              </div>
              <Users className="h-12 w-12 text-blue-500/30" />
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Members across Organizations
                </p>
                <p className="text-4xl font-bold mt-2">{totalMembers}</p>
              </div>
              <Users className="h-12 w-12 text-purple-500/30" />
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Revenue
                </p>
                <p className="text-4xl font-bold mt-2">
                  ${totalRevenue.toLocaleString()}
                </p>
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
              <Button className="gap-2 cursor-pointer" >View All</Button>
            </Link>
          </div>

          <div className="max-h-96 overflow-y-auto px-6">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.recentOrganizations &&
                data.recentOrganizations.length > 0 ? (
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
                        <Link href={`/dashboard/organizations/${org.id}`}>
                          <button className="text-xs font-medium text-primary hover:underline">
                            <MoveRight className="h-4 w-4 inline-block hover:scale-x-150" />
                          </button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No organizations yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  // REGULAR USER DASHBOARD
  const { organizationCount = 0, recentOrgs = [] } = data.stats;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Organizations</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organizations and projects
          </p>
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
              <p className="text-sm text-muted-foreground font-medium">
                Organizations
              </p>
              <p className="text-4xl font-bold mt-2">{organizationCount}</p>
            </div>
            <Building2 className="h-12 w-12 text-primary/30" />
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Members
              </p>
              <p className="text-4xl font-bold mt-2">
                {data.stats.totalMembers || 0}
              </p>
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
            <p className="text-muted-foreground">
              No organizations yet. Create one to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

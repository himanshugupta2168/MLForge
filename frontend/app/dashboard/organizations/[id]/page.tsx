"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Shield, Users, Trash2, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NeuralLoader } from "@/components/ui/neural-loader"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

type Member = {
  id: string
  userId: string
  name: string
  email: string
  image?: string
  role: string
  status: string
  joinedAt: string
}

type OrganizationDetail = {
  id: string
  name: string
  slug: string
  size?: string
  industry?: string
  plan: string
  status: string
  createdAt: string
  serviceEnabled?: boolean
}

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string

  const [organization, setOrganization] = useState<OrganizationDetail | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [canManage, setCanManage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrgDetails = async () => {
      try {
        const res = await fetch(`/api/admin/organizations/${orgId}`)
        if (!res.ok) throw new Error("Failed to fetch organization")
        const data = await res.json()
        setOrganization(data.organization)
        setMembers(data.members || [])
        setCanManage(data.canManage || false)
      } catch (err) {
        console.error("Failed to fetch organization:", err)
        setError("Failed to load organization details")
      } finally {
        setIsLoading(false)
      }
    }

    if (orgId) {
      fetchOrgDetails()
    }
  }, [orgId])

  const handleMemberAction = async (memberId: string, action: "promote" | "demote" | "remove") => {
    setActionLoading(memberId)
    try {
      const res = await fetch(`/api/admin/organizations/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, action }),
      })

      if (!res.ok) throw new Error("Failed to update member")

      // Update local state
      if (action === "remove") {
        setMembers(members.filter(m => m.id !== memberId))
      } else {
        setMembers(
          members.map(m =>
            m.id === memberId
              ? { ...m, role: action === "promote" ? "ADMIN" : "MEMBER" }
              : m
          )
        )
      }
      setError(null)
    } catch (err) {
      console.error("Failed to update member:", err)
      setError("Failed to update member")
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleService = async () => {
    if (!organization) return

    // Optimistic update
    const previousState = organization.serviceEnabled;
    setOrganization({ ...organization, serviceEnabled: !previousState });

    try {
      const res = await fetch(`/api/admin/organizations/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-service", enabled: !previousState }),
      })

      if (!res.ok) throw new Error("Failed to update service status")
    } catch (err) {
      console.error("Failed to update service status", err)
      setError("Failed to update service status")
      // Revert if failed
      setOrganization({ ...organization, serviceEnabled: previousState });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <NeuralLoader size={64} />
          <p className="mt-4 text-muted-foreground">Loading organization details...</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Organization not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/organizations">
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Organizations
        </button>
      </Link>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Organization Header Card */}
      <div className="border rounded-lg bg-card p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            <p className="text-muted-foreground mt-1">@{organization.slug}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ml-4 ${organization.plan === "FREE"
              ? "bg-gray-500/10 text-gray-700 dark:text-gray-400"
              : organization.plan === "PRO"
                ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                : "bg-purple-500/10 text-purple-700 dark:text-purple-400"
              }`}
          >
            {organization.plan} Plan
          </span>
        </div>

        {/* Organization Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Industry</p>
            <p className="text-lg font-semibold">{organization.industry || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Size</p>
            <p className="text-lg font-semibold">{organization.size || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Status</p>
            <p className="text-lg font-semibold capitalize">{organization.status.toLowerCase()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Created</p>
            <p className="text-lg font-semibold">{organization.createdAt}</p>
          </div>
          <div className="flex flex-col justify-center border-l border-white/5 pl-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Service Access</p>
            <div className="flex items-center gap-2">
              <Switch
                checked={organization.serviceEnabled !== false}
                onCheckedChange={handleToggleService}
                disabled={!canManage}
                className="data-[state=checked]:bg-green-500/80 data-[state=unchecked]:bg-zinc-700"
              />
              <span className={`text-sm font-medium ${organization.serviceEnabled !== false ? 'text-green-500' : 'text-zinc-400'}`}>
                {organization.serviceEnabled !== false ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <div className="border-b px-6 py-4 bg-muted/30">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members ({members.length})
          </h2>
        </div>

        {members.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {member.image && (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium">{member.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      {canManage ? (
                        <div className="w-[120px]">
                          <Select
                            disabled={actionLoading === member.id}
                            value={member.role}
                            onValueChange={(newRole) => {
                              if (newRole !== member.role) {
                                if (newRole === 'ADMIN') {
                                  handleMemberAction(member.id, "promote");
                                } else {
                                  handleMemberAction(member.id, "demote");
                                }
                              }
                            }}
                          >
                            <SelectTrigger className="h-8 bg-white/5 border-white/10 text-xs shadow-none">
                              <div className="flex items-center gap-1.5 focus:ring-0">
                                {member.role === "ADMIN" && <Shield className="h-3 w-3 text-yellow-500" />}
                                <SelectValue placeholder="Role" />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="bg-[#111] border-white/10 text-white min-w-[120px]">
                              <SelectItem value="ADMIN" className="text-xs cursor-pointer focus:bg-white/10 focus:text-white">Admin</SelectItem>
                              <SelectItem value="MEMBER" className="text-xs cursor-pointer focus:bg-white/10 focus:text-white">User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${member.role === "ADMIN"
                            ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                            : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                            }`}
                        >
                          {member.role === "ADMIN" && <Shield className="h-3 w-3" />}
                          {member.role === "ADMIN" ? "Admin" : "User"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{member.joinedAt}</TableCell>
                    <TableCell className="text-right">
                      {canManage ? (
                        <button
                          onClick={() => handleMemberAction(member.id, "remove")}
                          disabled={actionLoading === member.id}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 inline-flex"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">No members yet</div>
        )}
      </div>
    </div>
  )
}

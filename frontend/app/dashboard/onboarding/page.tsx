"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Brain, Building2, Plus, Check, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function OnboardingPage() {
    const { data: session, update } = useSession()
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [orgName, setOrgName] = useState("")
    const [orgSize, setOrgSize] = useState("")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (session?.user?.hasOrg && session?.user?.status === "APPROVED") {
            router.push("/dashboard")
        }
    }, [session, router])

    useEffect(() => {
        if (session?.user?.email) {
            fetch("/api/auth/suggest-orgs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: session.user.email }),
            })
                .then(res => res.json())
                .then(data => setSuggestions(data.organizations || []))
                .catch(() => setSuggestions([]))
        }
    }, [session])

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orgName) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: session?.user?.name || "User",
                    email: session?.user?.email,
                    password: "OAUTH_USER", // Special flag
                    orgName,
                    orgSize
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error)
                return
            }

            // Re-fetch session to update org status
            await update()
            router.refresh()
            router.push("/dashboard")
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleJoinOrg = async (orgId: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: session?.user?.name || "User",
                    email: session?.user?.email,
                    password: "OAUTH_USER",
                    selectedOrgId: orgId
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error)
                return
            }

            await update()
            router.refresh()
            // Will show pending status on next render
        } catch (err) {
            setError("Failed to request joining organization.")
        } finally {
            setIsLoading(false)
        }
    }

    if (session?.user?.status === "PENDING") {
        return (
            <div className="max-w-md mx-auto py-20 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-500/10 mb-6">
                    <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Wait for Approval</h1>
                <p className="text-muted-foreground mb-8">
                    Your request to join the organization is pending approval from an administrator.
                    We'll let you know once you're in.
                </p>
                <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                    Return to Homepage
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-20">
            <div className="flex items-center gap-2 mb-10">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">MLForge Onboarding</span>
            </div>

            <div className="space-y-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome, {session?.user?.name}</h1>
                    <p className="text-muted-foreground">To get started with MLForge, you need to be part of an organization.</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {suggestions.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Suggested Organizations</h2>
                        <div className="grid gap-3">
                            {suggestions.map(org => (
                                <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors">
                                    <div>
                                        <p className="font-semibold">{org.name}</p>
                                        <p className="text-xs text-muted-foreground">@{org.slug}</p>
                                    </div>
                                    <Button size="sm" onClick={() => handleJoinOrg(org.id)} disabled={isLoading}>
                                        Request to Join
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">Or Create New</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <form onSubmit={handleCreateOrg} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="orgName">Organization Name</Label>
                            <Input
                                id="orgName"
                                placeholder="Acme AI"
                                value={orgName}
                                onChange={e => setOrgName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="orgSize">Team Size</Label>
                            <select
                                id="orgSize"
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                value={orgSize}
                                onChange={e => setOrgSize(e.target.value)}
                            >
                                <option value="">Select range...</option>
                                <option value="1-10">1-10 people</option>
                                <option value="11-50">11-50 people</option>
                                <option value="51-200">51-200 people</option>
                                <option value="201-1000">201-1000 people</option>
                                <option value="1000+">1000+ people</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full gap-2" disabled={isLoading || !orgName}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Create Organization
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

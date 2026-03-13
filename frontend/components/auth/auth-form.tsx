"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { signIn } from "next-auth/react"
import { Github, Brain, ArrowRight, ArrowLeft, AlertCircle, Check, RefreshCw, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ─── Types ────────────────────────────────────────────────────────
type Step =
    | "email"           // 1. Enter email
    | "login-password"  // 2a. Existing user → password
    | "signup-details"  // 2b. New user → name + password
    | "signup-org"      // 3. New user → organization
    | "verify-otp"      // 4. OTP verification

// ─── Step indicator ───────────────────────────────────────────────
const SIGNUP_STEPS: { id: Step; label: string }[] = [
    { id: "email", label: "Email" },
    { id: "signup-details", label: "Details" },
    { id: "signup-org", label: "Organization" },
    { id: "verify-otp", label: "Verify" },
]

function StepDots({ current }: { current: Step }) {
    const steps = SIGNUP_STEPS
    const currentIdx = steps.findIndex(s => s.id === current)
    if (currentIdx === -1) return null // login flow — no dots
    return (
        <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i < currentIdx ? "bg-white/60" : i === currentIdx ? "bg-white" : "bg-white/20"
                        }`} />
                    {i < steps.length - 1 && <div className={`h-px w-5 transition-all duration-300 ${i < currentIdx ? "bg-white/30" : "bg-white/10"}`} />}
                </div>
            ))}
            <span className="ml-2 text-[10px] text-white/30 uppercase tracking-widest">
                {currentIdx + 1} / {steps.length}
            </span>
        </div>
    )
}

// ─── Error message ────────────────────────────────────────────────
function ErrorMsg({ msg }: { msg: string | null }) {
    if (!msg) return null
    return (
        <div className="flex items-start gap-2 p-3 border border-red-500/20 bg-red-500/5 text-red-400 text-[12px] leading-relaxed mb-4">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            {msg}
        </div>
    )
}

// ─── Submit button ────────────────────────────────────────────────
function SubmitBtn({ loading, label, icon }: { loading: boolean; label: string; icon?: React.ReactNode }) {
    return (
        <Button type="submit" disabled={loading} className="w-full h-10 rounded-none bg-white text-black text-[13px] font-medium hover:bg-white/90">
            {loading ? (
                <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 border border-black/30 border-t-black rounded-full animate-spin" />
                    Please wait…
                </span>
            ) : (
                <span className="flex items-center gap-2">{label} {icon ?? <ArrowRight className="h-3.5 w-3.5" />}</span>
            )}
        </Button>
    )
}

// ─── Input styles ─────────────────────────────────────────────────
const inputCls = "h-10 rounded-none bg-white/[0.04] border-white/[0.09] text-[13px] text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-white/25 transition-colors"

// ─── OTP Input (6 boxes) ──────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null))

    const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (!refs[i].current?.value && i > 0) refs[i - 1].current?.focus()
        }
    }

    const handleChange = (i: number, v: string) => {
        const digit = v.replace(/\D/g, "").slice(-1)
        const arr = value.split("")
        arr[i] = digit
        const next = arr.join("").padEnd(6, "").slice(0, 6).trimEnd()
        onChange(next)
        if (digit && i < 5) refs[i + 1].current?.focus()
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        onChange(pasted)
        const focusIdx = Math.min(pasted.length, 5)
        refs[focusIdx].current?.focus()
        e.preventDefault()
    }

    return (
        <div className="flex gap-2 justify-between">
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={refs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] ?? ""}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKey(i, e)}
                    onPaste={handlePaste}
                    className="w-11 h-12 rounded-none bg-white/[0.04] border border-white/[0.09] text-white text-center text-lg font-semibold focus:outline-none focus:border-white/40 transition-colors"
                />
            ))}
        </div>
    )
}

// ─── Main Form ────────────────────────────────────────────────────
export function AuthForm() {
    const [step, setStep] = useState<Step>("email")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fields
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [orgName, setOrgName] = useState("")
    const [orgSize, setOrgSize] = useState("")
    const [orgIndustry, setOrgIndustry] = useState("")
    const [otp, setOtp] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [suggestions, setSuggestions] = useState<{ id: string; name: string; slug: string }[]>([])
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)

    // OTP resend timer
    const [resendTimer, setResendTimer] = useState(0)
    useEffect(() => {
        if (resendTimer <= 0) return
        const t = setTimeout(() => setResendTimer(r => r - 1), 1000)
        return () => clearTimeout(t)
    }, [resendTimer])

    // ── Fetch suggestions when reaching Org step ──────────────────
    useEffect(() => {
        if (step === "signup-org" && email) {
            fetch("/api/auth/suggest-orgs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
                .then(res => res.json())
                .then(data => setSuggestions(data.organizations || []))
                .catch(() => setSuggestions([]))
        }
    }, [step, email])

    const err = (msg: string) => { setError(msg); setIsLoading(false) }

    // ── Step 1: Email check ────────────────────────────────────────
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true); setError(null)
        try {
            const res = await fetch("/api/auth/check-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            setStep(data.exists ? "login-password" : "signup-details")
        } catch { err("Could not reach the server. Try again.") }
        finally { setIsLoading(false) }
    }

    // ── Step 2a: Login ─────────────────────────────────────────────
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true); setError(null)
        try {
            const result = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/dashboard" })
            if (result?.error) err("Invalid email or password.")
            else window.location.href = "/dashboard"
        } catch { err("An unexpected error occurred.") }
        finally { setIsLoading(false) }
    }

    // ── Step 2b → 3: Signup details ────────────────────────────────
    const handleSignupDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password.length < 8) return err("Password must be at least 8 characters.")
        setError(null)
        setStep("signup-org")
    }

    // ── Step 3 → 4: Org + send OTP ─────────────────────────────────
    const handleOrgSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true); setError(null)
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            if (!res.ok) { const d = await res.json(); return err(d.error) }
            setStep("verify-otp")
            setResendTimer(60)
        } catch { err("Could not send verification code. Try again.") }
        finally { setIsLoading(false) }
    }

    // ── Step 4: Verify OTP + create account ───────────────────────
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.length < 6) return err("Please enter the full 6-digit code.")
        setIsLoading(true); setError(null)
        try {
            // Verify OTP
            const verifyRes = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otp }),
            })
            if (!verifyRes.ok) { const d = await verifyRes.json(); return err(d.error) }

            // Create account
            const signupRes = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, orgName, orgSize, orgIndustry }),
            })
            if (!signupRes.ok) { const d = await signupRes.json(); return err(d.error) }

            // Sign in with the new credentials
            const result = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/dashboard" })
            if (result?.error) return err("Account created but sign-in failed. Please sign in manually.")
            window.location.href = "/dashboard"
        } catch { err("An unexpected error occurred.") }
        finally { setIsLoading(false) }
    }

    const handleResendOtp = async () => {
        if (resendTimer > 0) return
        setError(null)
        try {
            await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            setResendTimer(60)
            setOtp("")
        } catch { setError("Could not resend code.") }
    }

    const handleSocialLogin = async (provider: "github" | "google") => {
        setIsLoading(true)
        await signIn(provider, { callbackUrl: "/dashboard" })
    }

    // ── Render ─────────────────────────────────────────────────────
    return (
        <div className="w-full">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-10">
                <Brain className="h-4 w-4 text-white/50" strokeWidth={1.5} />
                <span className="text-sm font-medium text-white/50 tracking-tight">MLForge</span>
            </div>

            {/* Step dots (signup only) */}
            <StepDots current={step} />

            <ErrorMsg msg={error} />

            {/* ── STEP 1: Email ── */}
            {step === "email" && (
                <>
                    <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Welcome</h1>
                    <p className="text-[13px] text-white/40 mb-8">Enter your email to sign in or create an account.</p>
                    <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-[11px] text-white/35 uppercase tracking-[0.12em]">Email address</Label>
                            <Input id="email" type="email" autoComplete="email" placeholder="you@company.com"
                                value={email} onChange={e => setEmail(e.target.value)} required
                                className={inputCls} />
                        </div>
                        <SubmitBtn loading={isLoading} label="Continue" />
                    </form>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.07]" /></div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#050505] px-3 text-[11px] text-white/25 uppercase tracking-widest">or</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[{ provider: "github" as const, label: "GitHub", icon: <Github className="h-3.5 w-3.5 mr-2" /> },
                        { provider: "google" as const, label: "Google", icon: <svg className="h-3.5 w-3.5 mr-2" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" /></svg> },
                        ].map(({ provider, label, icon }) => (
                            <Button key={provider} variant="outline" onClick={() => handleSocialLogin(provider)} disabled={isLoading}
                                className="h-10 rounded-none border-white/[0.09] bg-white/[0.03] text-[12px] text-white/50 hover:bg-white/[0.06] hover:text-white/80 hover:border-white/[0.15]">
                                {icon}{label}
                            </Button>
                        ))}
                    </div>
                </>
            )}

            {/* ── STEP 2a: Login password ── */}
            {step === "login-password" && (
                <>
                    <button onClick={() => { setStep("email"); setError(null) }} className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 mb-6 transition-colors">
                        <ArrowLeft className="h-3 w-3" /> Back
                    </button>
                    <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Welcome back</h1>
                    <p className="text-[13px] text-white/40 mb-8">
                        Signing in as <span className="text-white/60">{email}</span>
                    </p>
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-[11px] text-white/35 uppercase tracking-[0.12em]">Password</Label>
                            <div className="relative group">
                                <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••"
                                    value={password} onChange={e => setPassword(e.target.value)} required autoFocus
                                    className={`${inputCls} pr-10`} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
                                </button>
                            </div>
                        </div>
                        <SubmitBtn loading={isLoading} label="Sign in" />
                    </form>
                </>
            )}

            {/* ── STEP 2b: Signup details ── */}
            {step === "signup-details" && (
                <>
                    <button onClick={() => { setStep("email"); setError(null) }} className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 mb-6 transition-colors">
                        <ArrowLeft className="h-3 w-3" /> Back
                    </button>
                    <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Create your account</h1>
                    <p className="text-[13px] text-white/40 mb-8">
                        Setting up <span className="text-white/60">{email}</span>
                    </p>
                    <form onSubmit={handleSignupDetailsSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-[11px] text-white/35 uppercase tracking-[0.12em]">Full name</Label>
                            <Input id="name" type="text" autoComplete="name" placeholder="Jane Smith"
                                value={name} onChange={e => setName(e.target.value)} required autoFocus
                                className={inputCls} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="pw2" className="text-[11px] text-white/35 uppercase tracking-[0.12em]">Password</Label>
                            <div className="relative group">
                                <Input id="pw2" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Min. 8 characters"
                                    value={password} onChange={e => setPassword(e.target.value)} required
                                    className={`${inputCls} pr-10`} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
                                </button>
                            </div>
                            {password.length > 0 && (
                                <div className="flex gap-1 mt-1.5">
                                    {[password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password)].map((ok, i) => (
                                        <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors ${ok ? "bg-white/50" : "bg-white/10"}`} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <SubmitBtn loading={false} label="Continue" />
                    </form>
                </>
            )}

            {/* ── STEP 3: Organization ── */}
            {step === "signup-org" && (
                <>
                    <button onClick={() => { setStep("signup-details"); setError(null) }} className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 mb-6 transition-colors">
                        <ArrowLeft className="h-3 w-3" /> Back
                    </button>
                    <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Your organization</h1>
                    <p className="text-[13px] text-white/40 mb-8">MLForge is enterprise-first. Set up your workspace.</p>
                    <form onSubmit={handleOrgSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="orgName" className="text-[11px] text-white/35 uppercase tracking-[0.12em]">Organization name</Label>
                            <Input id="orgName" type="text" placeholder="Acme AI Labs"
                                value={orgName} onChange={e => setOrgName(e.target.value)} required autoFocus
                                className={inputCls} />

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Existing {email.split("@")[1]} Orgs</p>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestions.map(org => (
                                            <button
                                                key={org.id}
                                                type="button"
                                                onClick={() => {
                                                    setOrgName(org.name)
                                                    setSelectedOrgId(org.id)
                                                }}
                                                className={`px-2.5 py-1 border transition-all text-[11px] ${selectedOrgId === org.id
                                                    ? "bg-white/10 border-white/40 text-white"
                                                    : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:bg-white/[0.07] hover:border-white/20 hover:text-white/80"
                                                    }`}
                                            >
                                                {selectedOrgId === org.id ? `Joined ${org.name}` : `Join ${org.name}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="orgSize" className="text-[11px] text-white/35 uppercase tracking-[0.12em]">Team size</Label>
                            <select id="orgSize" value={orgSize} onChange={e => setOrgSize(e.target.value)}
                                className="w-full h-10 rounded-none bg-white/[0.04] border border-white/[0.09] px-3 text-[13px] text-white/80 focus:outline-none focus:border-white/25 transition-colors appearance-none">
                                <option value="" className="bg-[#111]">Select range…</option>
                                {["1–10", "11–50", "51–200", "201–1000", "1000+"].map(s => (
                                    <option key={s} value={s} className="bg-[#111]">{s} people</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="orgIndustry" className="text-[11px] text-white/35 uppercase tracking-[0.12em]">Industry <span className="text-white/20 normal-case tracking-normal">optional</span></Label>
                            <Input id="orgIndustry" type="text" placeholder="Fintech, Healthcare, E-commerce…"
                                value={orgIndustry} onChange={e => setOrgIndustry(e.target.value)}
                                className={inputCls} />
                        </div>
                        <SubmitBtn loading={isLoading} label="Send verification code" />
                    </form>
                </>
            )}

            {/* ── STEP 4: OTP ── */}
            {step === "verify-otp" && (
                <>
                    <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Check your email</h1>
                    <p className="text-[13px] text-white/40 mb-2">
                        We sent a 6-digit code to <span className="text-white/60">{email}</span>
                    </p>
                    <p className="text-[12px] text-white/25 mb-8">Expires in 10 minutes. Check your spam folder if you don't see it.</p>
                    <form onSubmit={handleOtpSubmit} className="space-y-6">
                        <OtpInput value={otp} onChange={setOtp} />
                        <SubmitBtn loading={isLoading} label="Verify & create account" icon={<Check className="h-3.5 w-3.5" />} />
                    </form>

                    <div className="mt-5 flex items-center gap-2">
                        <button onClick={handleResendOtp} disabled={resendTimer > 0}
                            className="flex items-center gap-1.5 text-[12px] text-white/35 hover:text-white/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            <RefreshCw className="h-3 w-3" />
                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                        </button>
                        <span className="text-white/15">·</span>
                        <button onClick={() => { setStep("signup-org"); setError(null); setOtp("") }}
                            className="text-[12px] text-white/35 hover:text-white/60 transition-colors">
                            Change email
                        </button>
                    </div>
                </>
            )}

            {/* Footer */}
            {step === "email" && (
                <p className="mt-8 text-[11px] text-white/20 leading-relaxed">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="text-white/35 hover:text-white/60 underline underline-offset-2 transition-colors">Terms</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-white/35 hover:text-white/60 underline underline-offset-2 transition-colors">Privacy Policy</Link>.
                </p>
            )}
        </div>
    )
}

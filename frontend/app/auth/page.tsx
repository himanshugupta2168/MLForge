import { AuthForm } from "@/components/auth/auth-form"
import { NeuralNetworkBackground } from "@/components/ui/neural-network-bg"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function AuthPage() {
    const session = await getServerSession(authOptions)

    if (session) {
        redirect("/dashboard")
    }

    return (
        <div className="relative min-h-screen bg-[#050505] flex items-center justify-center px-6">
            {/* Animated neural network fills the whole page */}
            <NeuralNetworkBackground />

            {/* Vignette — darkens edges so the form pops */}
            <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-[#050505]/80 pointer-events-none" />

            {/* Back link */}
            <div className="absolute top-5 left-6 z-10">
                <Link
                    href="/"
                    className="text-[11px] text-white/25 hover:text-white/60 transition-colors tracking-wide"
                >
                    ← MLForge
                </Link>
            </div>

            {/* Auth card */}
            <div className="relative z-10 w-full max-w-sm bg-[#050505]/80 border border-white/[0.07] backdrop-blur-md p-10">
                <AuthForm />
            </div>
        </div>
    )
}

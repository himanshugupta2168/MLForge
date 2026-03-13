import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"

// Generate a random 6-digit OTP
function generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString()
}

export async function POST(req: NextRequest) {
    const { email } = await req.json()

    if (!email) {
        return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }

    // Invalidate any existing unused OTPs for this email
    await prisma.otpToken.updateMany({
        where: { email, used: false },
        data: { used: true },
    })

    const code = generateOtp()
    const hashed = await bcrypt.hash(code, 10)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.otpToken.create({
        data: { email, code: hashed, expiresAt },
    })

    // ─── Email Sending ────────────────────────────────────────────────
    // In production, replace this with a real email service:
    // e.g. Resend, SendGrid, Nodemailer, AWS SES
    //
    // Example with Resend:
    //   await resend.emails.send({
    //     from: "auth@mlforge.io",
    //     to: email,
    //     subject: "Your MLForge verification code",
    //     html: `<p>Your code is <strong>${code}</strong>. Expires in 10 minutes.</p>`,
    //   })
    //
    // For now, log to console in development:
    if (process.env.NODE_ENV === "development") {
        console.log(`\n[MLForge OTP] Email: ${email}  Code: ${code}\n`)
    }

    return NextResponse.json({ success: true })
}

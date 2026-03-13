import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    const { email, code } = await req.json()

    if (!email || !code) {
        return NextResponse.json({ error: "Email and code are required." }, { status: 400 })
    }

    // Find the most recent unused, non-expired OTP for this email
    const otp = await prisma.otpToken.findFirst({
        where: {
            email,
            used: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
    })

    if (!otp) {
        return NextResponse.json({ error: "Code expired or not found. Please request a new one." }, { status: 400 })
    }

    const isValid = await bcrypt.compare(code, otp.code)
    if (!isValid) {
        return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 })
    }

    // Mark OTP as used
    await prisma.otpToken.update({ where: { id: otp.id }, data: { used: true } })

    return NextResponse.json({ success: true })
}

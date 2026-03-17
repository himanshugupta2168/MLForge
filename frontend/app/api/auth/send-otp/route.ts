import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import nodemailer from "nodemailer"

// Generate a random 6-digit OTP
function generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString(); // Generates a random 6-digit OTP
}

// Create nodemailer transporter (lazy initialization)
let transporter: nodemailer.Transporter | null = null

const getTransporter = async () => {
    if (!transporter) {
        // Use Gmail for both development and production
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Gmail SMTP server
            port: 587, // Use STARTTLS on port 587
            secure: false, // false for STARTTLS
            auth: {
                user: process.env.SMTP_USER, // Gmail user (your email)
                pass: process.env.SMTP_PASS, // Gmail app password (create one if using 2FA)
            },
        })
    }
    return transporter
}

// The POST handler for the OTP generation and sending
export async function POST(req: NextRequest) {
    const { email } = await req.json() // Get email from request body

    if (!email) {
        return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }

    // Invalidate any unused OTPs for this email
    await prisma.otpToken.updateMany({
        where: { email, used: false },
        data: { used: true },
    })

    const code = generateOtp() // Generate the OTP
    const hashed = await bcrypt.hash(code, 10) // Hash the OTP before storing it in the DB
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // Set OTP expiration to 10 minutes

    // Store the OTP in the database
    await prisma.otpToken.create({
        data: { email, code: hashed, expiresAt },
    })

    // Email HTML content for OTP
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your MLForge Verification Code</title>
        <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #ffffff; margin-bottom: 8px; }
            .subtitle { font-size: 14px; color: #ffffff40; text-transform: uppercase; letter-spacing: 0.15em; }
            .content { background-color: #0a0a0a; border: 1px solid #ffffff0f; border-radius: 12px; padding: 40px; text-align: center; }
            .title { font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 24px; }
            .otp-code { font-size: 48px; font-weight: bold; color: #ffffff; background-color: #ffffff0f; border: 2px solid #ffffff1a; border-radius: 8px; padding: 20px; margin: 24px 0; letter-spacing: 8px; font-family: 'Courier New', monospace; }
            .message { font-size: 16px; color: #ffffff80; line-height: 1.6; margin-bottom: 24px; }
            .warning { font-size: 14px; color: #ffffff60; margin-top: 24px; padding-top: 24px; border-top: 1px solid #ffffff0f; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #ffffff40; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MLForge</div>
                <div class="subtitle">SmartML Platform</div>
            </div>

            <div class="content">
                <div class="title">Your Verification Code</div>
                <div class="otp-code">${code}</div>
                <div class="message">
                    Enter this code to verify your email address and complete your MLForge account setup.
                </div>
                <div class="warning">
                    This code expires in 10 minutes. Do not share it with anyone.
                </div>
            </div>

            <div class="footer">
                If you didn't request this code, please ignore this email.<br>
                © 2026 MLForge. All rights reserved.
            </div>
        </div>
    </body>
    </html>`

    try {
        // Send the OTP email
        const transporter = await getTransporter()
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL || "noreply@mlforge.com", // Default from email
            to: email, // Recipient email
            subject: "Your MLForge verification code", // Email subject
            html: emailHtml, // HTML content
        })

        // For development, log the preview URL
        if (process.env.NODE_ENV === "development") {
            console.log(`\n[MLForge OTP] Email sent: ${nodemailer.getTestMessageUrl(info)}\n`)
        }
    } catch (error) {
        console.error("Failed to send email:", error)
        return NextResponse.json({ error: "Failed to send email." }, { status: 500 })
    }

    // Log OTP for development (don't do this in production)
    if (process.env.NODE_ENV === "development") {
        console.log(`[MLForge OTP] Email: ${email}  Code: ${code}`)
    }

    return NextResponse.json({ success: true }) // Respond with success
}
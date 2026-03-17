import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserRole } from "@prisma/client"

// In-memory settings (TODO: Store in database)
let platformSettings = {
  platformName: "MLForge",
  supportEmail: "support@mlforge.com",
  apiDomain: "api.mlforge.com",
  maxOrganizations: "unlimited",
  maintenanceMode: false,
  emailNotifications: true,
  securityAlerts: true,
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is super admin
    if (!session?.user || session.user.globalRole !== UserRole.SUPERADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ settings: platformSettings })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is super admin
    if (!session?.user || session.user.globalRole !== UserRole.SUPERADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await req.json()

    // Merge updates with existing settings
    platformSettings = {
      ...platformSettings,
      ...updates,
    }

    return NextResponse.json({ success: true, settings: platformSettings })
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

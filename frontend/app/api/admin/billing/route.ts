import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is super admin
    if (!session?.user || session.user.globalRole !== UserRole.SUPERADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all organizations with billing info
    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        plan: true,
        status: true,
        currentPeriodEnd: true,
        createdAt: true,
        members: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate mock billing records from organization data
    const records = organizations.flatMap(org => {
      const monthPrice = org.plan === "FREE" ? 0 : org.plan === "PRO" ? 99.99 : 499.99
      
      return {
        id: org.id,
        organization: org.name,
        amount: monthPrice,
        status: org.status === "ACTIVE" ? "paid" : org.status === "PAST_DUE" ? "failed" : "pending",
        date: org.currentPeriodEnd?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
        plan: org.plan,
        membersCount: org.members.length,
      }
    })

    // Calculate stats
    const totalRevenue = records
      .filter(r => r.status === "paid")
      .reduce((sum, r) => sum + r.amount, 0)

    const pendingAmount = records
      .filter(r => r.status === "pending")
      .reduce((sum, r) => sum + r.amount, 0)

    const failedCount = records.filter(r => r.status === "failed").length

    return NextResponse.json({
      records,
      stats: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        pendingAmount: parseFloat(pendingAmount.toFixed(2)),
        failedCount,
      },
    })
  } catch (error) {
    console.error("Failed to fetch billing data:", error)
    return NextResponse.json({ error: "Failed to fetch billing data" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isSuperAdmin = session.user.globalRole === UserRole.SUPERADMIN

    if (isSuperAdmin) {
      // SUPER ADMIN STATS
      const organisations = await prisma.organization.findMany({
        include: { members: true },
        orderBy: { createdAt: "desc" },
        take:10,
      })

      const users = await prisma.user.findMany()

      const totalOrganizations = organisations.length
      const totalUsers = users.length
      const totalMembers = organisations.reduce((sum, org) => sum + org.members.length, 0)

      // Calculate revenue based on plans
      const totalRevenue = organisations.reduce((sum, org) => {
        let price = 0
        if (org.plan === "PRO") price = 99.99
        if (org.plan === "ENTERPRISE") price = 499.99
        return sum + price
      }, 0)

      // Recent organizations (last 5)
      const recentOrganizations = organisations
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map(org => ({
          id: org.id,
          name: org.name,
          plan: org.plan,
          membersCount: org.members.length,
          createdAt: org.createdAt.toISOString().split("T")[0],
          status: org.status,
        }))

      return NextResponse.json({
        isSuperAdmin: true,
        stats: {
          totalOrganizations,
          totalUsers,
          totalMembers,
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        },
        recentOrganizations,
      })
    } else {
      // REGULAR USER STATS
      const userOrganizations = await prisma.organizationMember.findMany({
        where: { userId: session.user.id },
        include: {
          organization: {
            include: {
              members: true,
            },
          },
        },
      })

      const organizationCount = userOrganizations.length
      const totalMembers = userOrganizations.reduce(
        (sum, m) => sum + m.organization.members.length,
        0
      )

      const recentOrganizations = userOrganizations
        .sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime())
        .slice(0, 5)
        .map(m => ({
          id: m.organization.id,
          name: m.organization.name,
          role: m.role,
          membersCount: m.organization.members.length,
          joinedAt: m.joinedAt.toISOString().split("T")[0],
        }))

      return NextResponse.json({
        isSuperAdmin: false,
        stats: {
          organizationCount,
          totalMembers,
        },
        recentOrganizations,
      })
    }
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserRole, MemberRole } from "@prisma/client"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: orgId } = await params

    // Fetch organization with all members
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            joinedAt: "desc",
          },
        },
      },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user is super admin or org member
    const isSuperAdmin = session.user.globalRole === UserRole.SUPERADMIN
    const memberRecord = organization.members.find(m => m.userId === session.user.id)
    const isOrgMember = !!memberRecord

    if (!isSuperAdmin && !isOrgMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Check if user can perform admin actions (super admin or org admin)
    const canManage = isSuperAdmin || memberRecord?.role === MemberRole.ADMIN

    const formattedMembers = organization.members.map(m => ({
      id: m.id,
      userId: m.user.id,
      name: m.user.name || "Unknown",
      email: m.user.email,
      image: m.user.image,
      role: m.role,
      status: m.status,
      joinedAt: m.joinedAt.toISOString().split("T")[0],
    }))

    return NextResponse.json({
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        size: organization.size,
        industry: organization.industry,
        plan: organization.plan,
        status: organization.status,
        createdAt: organization.createdAt.toISOString().split("T")[0],
        serviceEnabled: organization.serviceEnabled,
      },
      members: formattedMembers,
      canManage,
    })
  } catch (error) {
    console.error("Failed to fetch organization:", error)
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: orgId } = await params
    const payload = await req.json()
    const { action } = payload

    if (!action) {
      return NextResponse.json(
        { error: "action is required" },
        { status: 400 }
      )
    }

    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: { members: true },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check permissions
    const isSuperAdmin = session.user.globalRole === UserRole.SUPERADMIN
    const isOrgAdmin = organization.members.some(
      m => m.userId === session.user.id && m.role === MemberRole.ADMIN
    )

    if (!isSuperAdmin && !isOrgAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    if (action === "toggle-service") {
      const data = await prisma.organization.update({
        where: {
          id: orgId,
        },
        data: {
          serviceEnabled: !!payload.enabled,
        }
      })
      return NextResponse.json({ success: true, enabled: data.serviceEnabled })
    }

    const { memberId } = payload
    if (!memberId) {
      return NextResponse.json({ error: "memberId is required for this action" }, { status: 400 })
    }

    // Get the member to update
    const member = await prisma.organizationMember.findUnique({
      where: { id: memberId },
    })

    if (!member || member.organizationId !== orgId) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Perform action
    if (action === "promote") {
      await prisma.organizationMember.update({
        where: { id: memberId },
        data: { role: MemberRole.ADMIN },
      })
    } else if (action === "demote") {
      await prisma.organizationMember.update({
        where: { id: memberId },
        data: { role: MemberRole.MEMBER },
      })
    } else if (action === "remove") {
      await prisma.organizationMember.delete({
        where: { id: memberId },
      })
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update member:", error)
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
  }
}

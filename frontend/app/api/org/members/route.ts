import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"
import { MemberRole, MemberStatus } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.orgId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const members = await prisma.organizationMember.findMany({
            where: { organizationId: session.user.orgId },
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
            orderBy: { joinedAt: "desc" },
        })

        return NextResponse.json({ members })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
    }
}

// PATCH for updating role or status
export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.orgId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only Admins or Owners can manage members
    if (session.user.orgRole !== MemberRole.ADMIN && session.user.orgRole !== MemberRole.OWNER) {
        return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 })
    }

    const { membershipId, status, role } = await req.json()

    if (!membershipId) {
        return NextResponse.json({ error: "Membership ID required" }, { status: 400 })
    }

    try {
        const updated = await prisma.organizationMember.update({
            where: {
                id: membershipId,
                organizationId: session.user.orgId // Security: Ensure membership belongs to current org
            },
            data: {
                ...(status && { status }),
                ...(role && { role }),
            }
        })

        return NextResponse.json({ success: true, updated })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
    }
}

// DELETE for removing members
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    const membershipId = searchParams.get("id")

    if (!session || !session.user.orgId || !membershipId) {
        return NextResponse.json({ error: "Unauthorized or missing ID" }, { status: 401 })
    }

    if (session.user.orgRole !== MemberRole.ADMIN && session.user.orgRole !== MemberRole.OWNER) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    try {
        await prisma.organizationMember.delete({
            where: {
                id: membershipId,
                organizationId: session.user.orgId
            }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove member" }, { status: 500 })
    }
}

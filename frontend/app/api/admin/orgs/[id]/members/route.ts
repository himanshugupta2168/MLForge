import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "../../../../auth/[...nextauth]/route"
import { UserRole } from "@prisma/client"

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.globalRole !== UserRole.SUPERADMIN) {
        return NextResponse.json({ error: "Unauthorized. SuperAdmin access required." }, { status: 403 })
    }

    try {
        const members = await prisma.organizationMember.findMany({
            where: { organizationId: params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json({ members })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch organization members" }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.globalRole !== UserRole.SUPERADMIN) {
        return NextResponse.json({ error: "Unauthorized. SuperAdmin access required." }, { status: 403 })
    }

    try {
        const { userId } = await req.json()

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }

        const membership = await prisma.organizationMember.deleteMany({
            where: {
                organizationId: params.id,
                userId: userId
            }
        })

        if (membership.count === 0) {
            return NextResponse.json({ error: "User is not a member of this organization" }, { status: 404 })
        }

        return NextResponse.json({ message: "User removed from organization successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove user from organization" }, { status: 500 })
    }
}
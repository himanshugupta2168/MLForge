import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "../../../auth/[...nextauth]/route"
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
        const organization = await prisma.organization.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: { members: true }
                }
            }
        })

        if (!organization) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 })
        }

        return NextResponse.json({ organization })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 })
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
        // First, remove all members from the organization
        await prisma.organizationMember.deleteMany({
            where: { organizationId: params.id }
        })

        // Then delete the organization
        const organization = await prisma.organization.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: "Organization deleted successfully", organization })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete organization" }, { status: 500 })
    }
}
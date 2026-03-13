import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"
import { UserRole } from "@prisma/client"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.globalRole !== UserRole.SUPERADMIN) {
        return NextResponse.json({ error: "Unauthorized. SuperAdmin access required." }, { status: 403 })
    }

    try {
        const organizations = await prisma.organization.findMany({
            include: {
                _count: {
                    select: { members: true }
                }
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json({ organizations })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 })
    }
}

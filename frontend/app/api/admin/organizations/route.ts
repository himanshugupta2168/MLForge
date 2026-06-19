import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"
import { MemberRole, MemberStatus, UserRole } from "@prisma/client"

function slugify(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Check if user is super admin
        if (!session?.user || session.user.globalRole !== UserRole.SUPERADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch all organizations with member count
        const organizations = await prisma.organization.findMany({
            include: {
                members: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        const formattedOrgs = organizations.map(org => ({
            id: org.id,
            name: org.name,
            slug: org.slug,
            size: org.size || "N/A",
            industry: org.industry || "N/A",
            plan: org.plan,
            status: org.status,
            membersCount: org.members.length,
            createdAt: org.createdAt.toISOString().split("T")[0],
        }))

        return NextResponse.json({ organizations: formattedOrgs })
    } catch (error) {
        console.error("Failed to fetch organizations:", error)
        return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    // 1. Guard: Only SUPERADMIN can access this route
    if (!session || session.user.globalRole !== UserRole.SUPERADMIN) {
        return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 })
    }

    const { orgName, adminEmail, orgSize, orgIndustry } = await req.json()

    if (!orgName || !adminEmail) {
        return NextResponse.json({ error: "Organization name and Admin email are required." }, { status: 400 })
    }

    try {
        // 2. Find the user who will be the admin
        const targetUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        })

        if (!targetUser) {
            return NextResponse.json({ error: "User with this email does not exist. Please have them sign up first." }, { status: 404 })
        }

        // 3. Generate unique slug
        let baseSlug = slugify(orgName)
        let slug = baseSlug
        let counter = 1
        while (await prisma.organization.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter++}`
        }

        // 4. Create Org and Membership in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name: orgName,
                    slug,
                    size: orgSize ?? null,
                    industry: orgIndustry ?? null,
                }
            })

            const membership = await tx.organizationMember.create({
                data: {
                    userId: targetUser.id,
                    organizationId: org.id,
                    role: MemberRole.ADMIN,
                    status: MemberStatus.APPROVED,
                }
            })

            return { org, membership }
        })

        return NextResponse.json({
            success: true,
            orgId: result.org.id,
            adminId: result.membership.userId
        })

    } catch (error) {
        console.error("Superadmin org creation error:", error)
        return NextResponse.json({ error: "Failed to create organization." }, { status: 500 })
    }
}



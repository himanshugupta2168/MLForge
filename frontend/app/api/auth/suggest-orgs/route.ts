import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
    const { email } = await req.json()

    if (!email || !email.includes("@")) {
        return NextResponse.json({ organizations: [] })
    }

    const domain = email.split("@")[1]

    // Skip common public domains to avoid irrelevant suggestions
    const publicDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"]
    if (publicDomains.includes(domain.toLowerCase())) {
        return NextResponse.json({ organizations: [] })
    }

    try {
        // Find organizations that have members with the same email domain
        const organizations = await prisma.organization.findMany({
            where: {
                members: {
                    some: {
                        user: {
                            email: {
                                endsWith: `@${domain}`,
                            },
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
            distinct: ["id"],
            take: 5,
        })

        return NextResponse.json({ organizations })
    } catch (error) {
        console.error("Error suggesting organizations:", error)
        return NextResponse.json({ organizations: [] })
    }
}

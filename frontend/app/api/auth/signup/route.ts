import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

function slugify(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

export async function POST(req: NextRequest) {
    const { name, email, password, orgName, orgSize, orgIndustry, selectedOrgId } = await req.json()

    if (!name || !email || !password || (!orgName && !selectedOrgId)) {
        return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 })
    }

    const domain = email.split("@")[1]
    const publicDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]
    const isPublicDomain = publicDomains.includes(domain.toLowerCase())

    // Guard: should not re-register an existing user (except for OAuth onboarding)
    const existing = await prisma.user.findUnique({ where: { email } })
    const isOAuthOnboarding = existing && password === "OAUTH_USER"

    if (existing && !isOAuthOnboarding) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
    }

    const hashedPassword = isOAuthOnboarding ? existing.password : await bcrypt.hash(password, 10)

    // ── CASE 1: Joining an Existing Organization ──────────────────
    if (selectedOrgId) {
        const result = await prisma.$transaction(async (tx) => {
            const user = isOAuthOnboarding ? existing : await tx.user.create({
                data: { name, email, password: hashedPassword, emailVerified: new Date() }
            })
            const membership = await tx.organizationMember.create({
                data: {
                    userId: user.id,
                    organizationId: selectedOrgId,
                    role: "MEMBER",
                    status: "PENDING", // Must be approved by Org Admin
                }
            })
            return { user, orgId: selectedOrgId }
        })

        return NextResponse.json({ success: true, userId: result.user.id, orgId: result.orgId, status: "PENDING" })
    }

    // ── CASE 2: Creating a New Organization ────────────────────────

    // Safety Check: If it's a corporate domain, check if an org already exists for it
    if (!isPublicDomain) {
        const existingDomainOrg = await prisma.organization.findFirst({
            where: {
                members: {
                    some: {
                        user: { email: { endsWith: `@${domain}` } }
                    }
                }
            }
        })

        if (existingDomainOrg) {
            return NextResponse.json({
                error: `An organization for ${domain} already exists. Please request to join it instead.`,
                suggestedOrgId: existingDomainOrg.id,
                suggestedOrgName: existingDomainOrg.name
            }, { status: 403 })
        }
    }

    // Generate a unique org slug
    let baseSlug = slugify(orgName)
    let slug = baseSlug
    let counter = 1
    while (await prisma.organization.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`
    }

    // Create user (if not exists) + org + membership in one transaction
    const result = await prisma.$transaction(async (tx) => {
        const user = isOAuthOnboarding ? existing : await tx.user.create({
            data: { name, email, password: hashedPassword, emailVerified: new Date() }
        })

        const org = await tx.organization.create({
            data: {
                name: orgName,
                slug,
                size: orgSize ?? null,
                industry: orgIndustry ?? null,
                status: "TRIAL",
                plan: "FREE"
            },
        })

        await tx.organizationMember.create({
            data: {
                userId: user.id,
                organizationId: org.id,
                role: "OWNER", // First person is the Owner
                status: "APPROVED",
            },
        })

        return { user, org }
    })

    return NextResponse.json({
        success: true,
        userId: result.user.id,
        orgId: result.org.id,
    })
}

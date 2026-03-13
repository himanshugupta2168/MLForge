import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const prismaClientSingleton = () => {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool as any)
    return new PrismaClient({ adapter })
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const getPrisma = () => {
    let cached = globalThis.prismaGlobal

    // If client exists but is missing new models or fields, force reload
    const isStale = cached && (
        !("otpToken" in cached) ||
        !("organization" in cached) ||
        // Check if OrganizationMember has the new status field
        (cached as any).organizationMember?.fields?.status === undefined
    )

    if (isStale) {
        console.log("🔄 Prisma Client is stale, re-initializing...")
        cached = undefined
    }

    if (!cached) {
        console.log("⚡ Creating new Prisma Client instance")
        const p = prismaClientSingleton()
        if (process.env.NODE_ENV !== "production") {
            globalThis.prismaGlobal = p
        }
        return p
    }
    return cached as NonNullable<typeof globalThis.prismaGlobal>
}

const prisma = getPrisma()
export default prisma

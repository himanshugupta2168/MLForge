import { DefaultSession, DefaultUser } from "next-auth"
import { UserRole, MemberRole, MemberStatus } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            orgId: string | null
            hasOrg: boolean
            globalRole: UserRole
            orgRole?: MemberRole | null
            status?: MemberStatus | null
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: string
        password?: string | null
        orgId?: string | null
        hasOrg?: boolean
        globalRole?: UserRole
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        orgId: string | null
        hasOrg: boolean
        globalRole: UserRole
        orgRole?: MemberRole | null
        status?: MemberStatus | null
    }
}

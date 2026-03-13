"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { Home, Users, Settings, Shield, Database, LogOut, Group, CircleDollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

type LayoutProps = {
  children: ReactNode
}

const menuItems = [
  {
    role: "Super Admin",
    items: [
      { name: "Home", href: "/", icon: Home },
      { name: "Manage Organizations", href: "/dashboard/organizations", icon: Group },
      { name: "Billings", href: "/dashboard/logs", icon: CircleDollarSign },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
  {
    role: "Admin",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Users", href: "/dashboard/users", icon: Users },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
]

export default function DashboardLayout({ children }: LayoutProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()


  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // Determine which menu to show based on user role
  const getMenuItems = () => {
    if (session?.user?.globalRole === "SUPERADMIN") {
      return menuItems[0].items // Super Admin menu
    }
    return menuItems[1].items // Admin menu (default)
  }
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 p-4">
        <h2 className="text-sm pb-4 border  font-medium tracking-tight cursor-pointer" onClick={() => router.push('/')}>
          MLForge
        </h2>

        <div className="mb-6">
          <ul className="space-y-2">
            {getMenuItems().map((item) => {
              const Icon = item.icon

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Right Section */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <header className="flex items-center justify-between border-b px-6 py-3">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            {session?.user && (
              <p className="text-sm text-muted-foreground">
                Welcome, {session.user.name} ({session.user.globalRole})
              </p>
            )}
          </div>

          <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to logout? You will be redirected to the login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        {/* Nested Content */}
        <main className="flex-1 p-6 bg-muted/20">
          {children}
        </main>

      </div>
    </div>
  )
}
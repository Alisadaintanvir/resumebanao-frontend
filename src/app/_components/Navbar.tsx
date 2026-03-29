"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, LogOut, User as UserIcon } from "lucide-react"
import { User } from "@/types"
import { logoutAction } from "@/actions/auth.action"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname()
  
  // Quick logic to hide nav/footer on builder itself
  if (pathname.startsWith('/builder')) return null

  const handleLogout = async () => {
    await logoutAction()
    window.location.href = "/login"
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground font-bold text-xl hover:opacity-80 transition-opacity">
          <FileText className="w-6 h-6 text-primary" />
          <span>Neo<span className="text-primary">Resume</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="/#templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Templates</Link>
          <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground mr-2">
                 <UserIcon className="w-4 h-4" />
                 <span>{user.first_name}</span>
              </div>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="icon" onClick={handleLogout} title="Logout" className="border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

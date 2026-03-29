"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, LogOut, User as UserIcon } from "lucide-react"
import { User } from "@/types"
import { logoutAction } from "@/actions/auth.action"

export default function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname()
  
  // Quick logic to hide nav/footer on builder itself
  if (pathname.startsWith('/builder')) return null

  const handleLogout = async () => {
    await logoutAction()
    // Hard reload or push to login
    window.location.href = "/login"
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-80 transition-opacity">
          <FileText className="w-6 h-6 text-emerald-500" />
          <span>Neo<span className="text-emerald-500">Resume</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link href="/#templates" className="text-sm text-gray-300 hover:text-white transition-colors">Templates</Link>
          <Link href="/#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 mr-2">
                 <UserIcon className="w-4 h-4" />
                 <span>{user.first_name}</span>
              </div>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="icon" onClick={handleLogout} title="Logout" className="border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/30">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex text-gray-300 hover:text-white">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

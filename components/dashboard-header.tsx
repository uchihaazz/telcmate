"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User, Book, Headphones, Pencil, Settings, Home, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DashboardHeader() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const headerRef = useRef(null)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    // Check if user is admin
    const adminStatus = localStorage.getItem("isAdmin") === "true"
    const demoStatus = localStorage.getItem("isDemo") === "true"
    setIsAdmin(adminStatus)
    setIsDemo(demoStatus)

    // Check for duplicate headers
    const existingHeaders = document.querySelectorAll('[data-header-id="dashboard-header"]')
    if (existingHeaders.length > 1) {
      // If this is not the first header, don't render it
      setShouldRender(false)
    }
  }, [])

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("userCode")
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("isDemo")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    // Redirect to home page
    router.push("/")
  }

  if (!shouldRender) {
    return null
  }

  return (
    <header className="bg-white border-b" data-header-id="dashboard-header" ref={headerRef}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-emerald-600 flex items-center">
              <Book className="mr-2 h-6 w-6" />
              TELC B2 Prep
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-emerald-600 flex items-center">
              <Home className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/dashboard/reading" className="text-gray-600 hover:text-emerald-600 flex items-center">
              <Book className="mr-1 h-4 w-4" />
              Reading
            </Link>
            <Link href="/dashboard/listening" className="text-gray-600 hover:text-emerald-600 flex items-center">
              <Headphones className="mr-1 h-4 w-4" />
              Listening
            </Link>
            <Link href="/dashboard/grammar" className="text-gray-600 hover:text-emerald-600 flex items-center">
              <Settings className="mr-1 h-4 w-4" />
              Grammar
            </Link>
            <Link href="/dashboard/writing" className="text-gray-600 hover:text-emerald-600 flex items-center">
              <Pencil className="mr-1 h-4 w-4" />
              Writing
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-emerald-600 flex items-center">
              <Mail className="mr-1 h-4 w-4" />
              Contact
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-gray-600 hover:text-emerald-600 flex items-center">
                <User className="mr-1 h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center">
              <LogOut className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

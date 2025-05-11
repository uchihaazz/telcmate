"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import DataInitializer from "@/components/data-initializer"
import { Phone, Mail, Instagram, Twitter, Facebook, ExternalLink } from "lucide-react"
import { getUserByCode } from "@/lib/firebase-data"
import type { User } from "@/lib/user-types"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userCode, setUserCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminCode, setAdminCode] = useState("")

  useEffect(() => {
    // Check if user is already logged in
    const storedUserCode = localStorage.getItem("userCode")
    if (storedUserCode) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await getUserByCode(userCode) as User | null

      if (user) {
        // Store user data in localStorage (we'll keep this for session management)
        localStorage.setItem("userCode", user.code)
        localStorage.setItem("userName", user.name)
        localStorage.setItem("isAdmin", user.isAdmin.toString())
        localStorage.setItem("isDemo", user.isDemo ? "true" : "false")

        toast({
          title: "Login successful",
          description: `Welcome, ${user.name}!`,
        })

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid user code. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const adminUser = await getUserByCode(adminCode) as User | null

      if (adminUser && adminUser.isAdmin) {
        // Store admin data in localStorage
        localStorage.setItem("userCode", adminUser.code)
        localStorage.setItem("userName", adminUser.name)
        localStorage.setItem("isAdmin", "true")
        localStorage.setItem("isDemo", "false")

        toast({
          title: "Admin login successful",
          description: `Welcome, ${adminUser.name}!`,
        })

        // Redirect to admin dashboard
        router.push("/admin")
      } else {
        toast({
          title: "Admin login failed",
          description: "Invalid admin code. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    // Set demo user data
    localStorage.setItem("userCode", "demo123")
    localStorage.setItem("userName", "Demo User")
    localStorage.setItem("isAdmin", "false")
    localStorage.setItem("isDemo", "true")

    toast({
      title: "Demo mode activated",
      description: "You are now using the demo account with limited access.",
    })

    // Redirect to dashboard
    router.push("/dashboard")
  }

  const toggleAdminLogin = () => {
    setShowAdminLogin(!showAdminLogin)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <DataInitializer />
      <div className="w-full max-w-md">
        {!showAdminLogin ? (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Telc Mate</CardTitle>
              <CardDescription className="text-center">
                Enter your user code to access the TELC B2 preparation platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="userCode">User Code</Label>
                  <Input
                    id="userCode"
                    placeholder="Enter your user code"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" className="w-full" onClick={handleDemoLogin}>
                  Try Demo
                </Button>
                <Button variant="outline" className="w-full" onClick={toggleAdminLogin}>
                  Admin Login
                </Button>
              </div>

              {/* Contact Information Section */}
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Need a code?</span>
                </div>
              </div>

              <div className="text-center text-sm">
                <p className="font-medium text-emerald-600 mb-2">Contact me to get your access code</p>
                <div className="flex justify-center items-center gap-4 mb-3">
                  <a
                    href="tel:+491234567890"
                    className="flex flex-col items-center hover:text-emerald-600 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="text-xs mt-1">Call</span>
                  </a>
                  <a
                    href="mailto:contact@telcmate.com"
                    className="flex flex-col items-center hover:text-emerald-600 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="text-xs mt-1">Email</span>
                  </a>
                  <a href="/contact" className="flex flex-col items-center hover:text-emerald-600 transition-colors">
                    <ExternalLink className="h-5 w-5" />
                    <span className="text-xs mt-1">Contact</span>
                  </a>
                </div>
                <div className="flex justify-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-400 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your admin code to access the administration panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAdminLogin}>
                <div className="space-y-2">
                  <Label htmlFor="adminCode">Admin Code</Label>
                  <Input
                    id="adminCode"
                    placeholder="Enter your admin code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Admin"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" onClick={toggleAdminLogin}>
                Back to User Login
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import LoadingSpinner from "@/components/loading-spinner"
import DataInitializer from "@/components/data-initializer"
import { useToast } from "@/hooks/use-toast"

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const userCode = localStorage.getItem("userCode")
    const demoStatus = localStorage.getItem("isDemo") === "true"

    if (!userCode) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
      setIsDemo(demoStatus)

      // If demo user tries to access restricted content
      if (demoStatus) {
        // Get the section and part from the URL
        const parts = pathname.split("/")
        const section = parts[2] // reading, listening, etc.
        const exerciseId = parts[3] // specific exercise ID

        // Demo users can access at least one exercise in each Teil
        if (exerciseId && !isExerciseAllowedForDemo(exerciseId)) {
          toast({
            title: "Demo Restriction",
            description: "Demo users can only access demo exercises. Please upgrade to a full account.",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      }
    }

    // Short timeout to ensure smooth transition
    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [router, pathname, toast])

  // Function to check if an exercise is allowed for demo users
  const isExerciseAllowedForDemo = (exerciseId) => {
    // Allow the first exercise of each type and part
    const allowedExercises = [
      "reading-part1-1",
      "reading-part2-1",
      "reading-part3-1",
      "listening-part1-1",
      "listening-part2-1",
      "listening-part3-1",
      "grammar-part1-1",
      "grammar-part2-1",
      "grammar-part3-1",
      "writing-part1-1",
      "writing-part2-1",
    ]

    return allowedExercises.includes(exerciseId)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return null // This will be replaced by the redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DataInitializer />
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {isDemo && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800">
              <strong>Demo Mode:</strong> You have access to one exercise in each section. Upgrade to a full account for
              complete access.
            </p>
          </div>
        )}
        <div className="animate-fadeIn">{children}</div>
      </main>
    </div>
  )
}

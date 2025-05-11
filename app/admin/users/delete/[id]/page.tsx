"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import LoadingSpinner from "@/components/loading-spinner"

export default function DeleteUserPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Get user data
    const usersData = localStorage.getItem("users")
    const users = usersData ? JSON.parse(usersData) : []
    const foundUser = users.find((u) => u.id === params.id)

    if (foundUser) {
      setUser(foundUser)
    } else {
      toast({
        title: "Error",
        description: "User not found.",
        variant: "destructive",
      })
      router.push("/admin")
    }

    setIsLoading(false)
  }, [params.id, router, toast])

  const handleDelete = () => {
    setIsDeleting(true)

    // Get existing users
    const usersData = localStorage.getItem("users")
    const users = usersData ? JSON.parse(usersData) : []

    // Remove user
    const updatedUsers = users.filter((u) => u.id !== params.id)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    toast({
      title: "Success",
      description: "User deleted successfully.",
    })

    // Redirect to admin dashboard
    router.push("/admin")
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Delete User</h1>
          <p className="text-gray-600">Permanently remove a user from the system</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Confirm Deletion</CardTitle>
            <CardDescription>Are you sure you want to delete this user? This action cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-lg font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">User Code</p>
                    <p className="text-lg font-medium">{user.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-lg font-medium">{user.isAdmin ? "Admin" : "Student"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Demo User</p>
                    <p className="text-lg font-medium">{user.isDemo ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

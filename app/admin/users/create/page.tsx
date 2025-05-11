"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import DashboardHeader from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Permissions } from "@/lib/permissions"
import type { User } from "@/lib/user-types"

export default function CreateUserPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [role, setRole] = useState("student")
  const [isDemo, setIsDemo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user has permission to create users
    const userCode = localStorage.getItem("userCode")
    const storedUsers = localStorage.getItem("users")

    if (storedUsers) {
      const users = JSON.parse(storedUsers)
      const user = users.find((u) => u.code === userCode)

      if (user) {
        setCurrentUser(user)

        if (!Permissions.canAddUsers(user)) {
          toast({
            title: "Permission Denied",
            description: "You don't have permission to add users.",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/dashboard")
    }
  }, [router, toast])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate inputs
    if (!name.trim() || !code.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Get existing users
    const usersData = localStorage.getItem("users")
    const users = usersData ? JSON.parse(usersData) : []

    // Check if code already exists
    if (users.some((user) => user.code === code)) {
      toast({
        title: "Error",
        description: "User code already exists. Please use a different code.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      code,
      isAdmin: role === "admin",
      isModerator: role === "moderator",
      isDemo,
      role,
    }

    // Add to users array
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    toast({
      title: "Success",
      description: "User created successfully.",
    })

    // Redirect to admin dashboard
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New User</h1>
          <p className="text-gray-600">Add a new user to the system</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>Enter the details for the new user</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter user's full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">User Code</Label>
                <Input
                  id="code"
                  placeholder="Enter a unique code for the user"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">This code will be used for login.</p>
              </div>

              <div className="space-y-2">
                <Label>User Role</Label>
                <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="role-student" />
                    <Label htmlFor="role-student" className="cursor-pointer">
                      Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderator" id="role-moderator" />
                    <Label htmlFor="role-moderator" className="cursor-pointer">
                      Moderator
                    </Label>
                    <span className="text-xs text-gray-500">(Can add and edit users/exercises)</span>
                  </div>
                  {currentUser && (currentUser.isAdmin || currentUser.role === "admin") && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="role-admin" />
                      <Label htmlFor="role-admin" className="cursor-pointer">
                        Admin
                      </Label>
                      <span className="text-xs text-gray-500">(Full access to all features)</span>
                    </div>
                  )}
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isDemo" checked={isDemo} onCheckedChange={setIsDemo} />
                <Label htmlFor="isDemo" className="cursor-pointer">
                  Demo User
                </Label>
                <p className="text-sm text-gray-500 ml-2">(Demo users have limited access)</p>
              </div>

              <div className="pt-4">
                <Button type="submit" className="mr-2" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create User"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

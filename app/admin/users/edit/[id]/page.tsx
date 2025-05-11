"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import LoadingSpinner from "@/components/loading-spinner"
import { Permissions } from "@/lib/permissions"
import type { User } from "@/lib/user-types"

export default function EditUserPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [role, setRole] = useState("student")
  const [isDemo, setIsDemo] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [originalCode, setOriginalCode] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)

  useEffect(() => {
    // Check if user has permission to edit users
    const userCode = localStorage.getItem("userCode")
    const storedUsers = localStorage.getItem("users")

    if (storedUsers) {
      const users = JSON.parse(storedUsers)
      const user = users.find((u) => u.code === userCode)

      if (user) {
        setCurrentUser(user)

        if (!Permissions.canEditUsers(user)) {
          toast({
            title: "Permission Denied",
            description: "You don't have permission to edit users.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        // Get user to edit
        const editUser = users.find((u) => u.id === params.id)
        if (editUser) {
          setUserToEdit(editUser)
          setName(editUser.name)
          setCode(editUser.code)
          setOriginalCode(editUser.code)

          // Set role
          if (editUser.role) {
            setRole(editUser.role)
          } else if (editUser.isAdmin) {
            setRole("admin")
          } else if (editUser.isModerator) {
            setRole("moderator")
          } else {
            setRole("student")
          }

          setIsDemo(editUser.isDemo || false)
        } else {
          toast({
            title: "Error",
            description: "User not found.",
            variant: "destructive",
          })
          router.push("/admin")
        }
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/dashboard")
    }

    setIsLoading(false)
  }, [params.id, router, toast])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSaving(true)

    // Validate inputs
    if (!name.trim() || !code.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    // Get existing users
    const usersData = localStorage.getItem("users")
    const users = usersData ? JSON.parse(usersData) : []

    // Check if code already exists (only if code has changed)
    if (code !== originalCode && users.some((user) => user.code === code)) {
      toast({
        title: "Error",
        description: "User code already exists. Please use a different code.",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    // Update user
    const updatedUsers = users.map((user) => {
      if (user.id === params.id) {
        return {
          ...user,
          name,
          code,
          isAdmin: role === "admin",
          isModerator: role === "moderator",
          isDemo,
          role,
        }
      }
      return user
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    toast({
      title: "Success",
      description: "User updated successfully.",
    })

    // Redirect to admin dashboard
    router.push("/admin")
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!currentUser || !userToEdit) {
    return null
  }

  // Check if current user can edit role to admin
  const canAssignAdminRole = currentUser.isAdmin || currentUser.role === "admin"

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit User</h1>
          <p className="text-gray-600">Update user information</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>Edit the details for this user</CardDescription>
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
                  {canAssignAdminRole && (
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
                <Button type="submit" className="mr-2" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
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

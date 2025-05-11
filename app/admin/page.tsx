"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Book,
  Headphones,
  GraduationCap,
  PenTool,
  Shield,
  AlertTriangle,
  Settings,
  Clock,
  Database,
  Filter,
  Trash2,
} from "lucide-react"
import { getAllExercises, getExercisesByTypeAndPart } from "@/lib/exercise-data"
import { Permissions } from "@/lib/permissions"
import type { User } from "@/lib/user-types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isModerator, setIsModerator] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [exercises, setExercises] = useState([])
  const [filteredExercises, setFilteredExercises] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExercises, setSelectedExercises] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    part: "all",
  })

  // Settings state
  const [settings, setSettings] = useState({
    siteTitle: "Telc Mate",
    allowRegistration: false,
    maintenanceMode: false,
    defaultTimeLimit: {
      reading: 20,
      listening: 15,
      grammar: 15,
      writing: 30,
    },
    language: "en",
    showCorrectAnswers: true,
    allowTestRetake: true,
    demoAccessLevel: "limited",
  })

  // Exercise counts by type and part
  const [readingPart1Count, setReadingPart1Count] = useState(0)
  const [readingPart2Count, setReadingPart2Count] = useState(0)
  const [readingPart3Count, setReadingPart3Count] = useState(0)

  const [listeningPart1Count, setListeningPart1Count] = useState(0)
  const [listeningPart2Count, setListeningPart2Count] = useState(0)
  const [listeningPart3Count, setListeningPart3Count] = useState(0)

  const [grammarPart1Count, setGrammarPart1Count] = useState(0)
  const [grammarPart2Count, setGrammarPart2Count] = useState(0)

  const [writingPart1Count, setWritingPart1Count] = useState(0)
  const [writingPart2Count, setWritingPart2Count] = useState(0)

  useEffect(() => {
    // Check if user is admin or moderator
    const adminStatus = localStorage.getItem("isAdmin") === "true"
    const moderatorStatus = localStorage.getItem("isModerator") === "true"

    if (!adminStatus && !moderatorStatus) {
      router.push("/dashboard")
      return
    }

    setIsAdmin(adminStatus)
    setIsModerator(moderatorStatus)

    // Get current user
    const userCode = localStorage.getItem("userCode")
    const storedUsers = localStorage.getItem("users")
    let parsedUsers = []

    if (storedUsers) {
      parsedUsers = JSON.parse(storedUsers)
      setUsers(parsedUsers)

      const user = parsedUsers.find((u) => u.code === userCode)
      if (user) {
        setCurrentUser(user)
      }
    }

    // Load exercises
    const allExercises = getAllExercises()
    setExercises(allExercises)
    setFilteredExercises(allExercises)

    // Count exercises by type and part
    setReadingPart1Count(getExercisesByTypeAndPart("reading", "part1").length)
    setReadingPart2Count(getExercisesByTypeAndPart("reading", "part2").length)
    setReadingPart3Count(getExercisesByTypeAndPart("reading", "part3").length)

    setListeningPart1Count(getExercisesByTypeAndPart("listening", "part1").length)
    setListeningPart2Count(getExercisesByTypeAndPart("listening", "part2").length)
    setListeningPart3Count(getExercisesByTypeAndPart("listening", "part3").length)

    setGrammarPart1Count(getExercisesByTypeAndPart("grammar", "part1").length)
    setGrammarPart2Count(getExercisesByTypeAndPart("grammar", "part2").length)

    setWritingPart1Count(getExercisesByTypeAndPart("writing", "part1").length)
    setWritingPart2Count(getExercisesByTypeAndPart("writing", "part2").length)

    // Load settings
    const storedSettings = localStorage.getItem("systemSettings")
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    // Apply filters and search
    let result = [...exercises]

    // Apply type filter
    if (filters.type !== "all") {
      result = result.filter((ex) => ex.type === filters.type)
    }

    // Apply part filter
    if (filters.part !== "all") {
      result = result.filter((ex) => ex.part === filters.part)
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (ex) =>
          ex.title.toLowerCase().includes(term) ||
          ex.description?.toLowerCase().includes(term) ||
          ex.id.toLowerCase().includes(term),
      )
    }

    setFilteredExercises(result)

    // Reset selection when filters change
    setSelectedExercises([])
    setSelectAll(false)
  }, [exercises, filters, searchTerm])

  const getExerciseCountByType = (type) => {
    return exercises.filter((ex) => ex.type === type).length
  }

  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...settings }

    // Handle nested settings
    if (key.includes(".")) {
      const [parent, child] = key.split(".")
      updatedSettings[parent][child] = value
    } else {
      updatedSettings[key] = value
    }

    setSettings(updatedSettings)

    // Save to localStorage
    localStorage.setItem("systemSettings", JSON.stringify(updatedSettings))
  }

  const handleSaveSettings = () => {
    localStorage.setItem("systemSettings", JSON.stringify(settings))
    toast({
      title: "Settings Saved",
      description: "Your system settings have been saved successfully.",
    })
  }

  const handleSelectExercise = (exerciseId) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(selectedExercises.filter((id) => id !== exerciseId))
    } else {
      setSelectedExercises([...selectedExercises, exerciseId])
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedExercises([])
    } else {
      setSelectedExercises(filteredExercises.map((ex) => ex.id))
    }
    setSelectAll(!selectAll)
  }

  const handleDeleteSelected = () => {
    if (selectedExercises.length === 0) return

    // Remove selected exercises from localStorage
    const updatedExercises = exercises.filter((ex) => !selectedExercises.includes(ex.id))
    localStorage.setItem("exercises", JSON.stringify(updatedExercises))

    // Update state
    setExercises(updatedExercises)
    setSelectedExercises([])
    setSelectAll(false)
    setShowDeleteDialog(false)

    toast({
      title: "Exercises Deleted",
      description: `${selectedExercises.length} exercise(s) have been deleted successfully.`,
    })
  }

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  if (!isAdmin && !isModerator) {
    return null // This should not happen due to the redirect, but just in case
  }

  const canRemoveUsers = currentUser && Permissions.canRemoveUsers(currentUser)
  const canRemoveExercises = currentUser && Permissions.canRemoveExercises(currentUser)

  return (
    <div className="min-h-screen bg-gray-50">
      <DataInitializer />
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <div className="flex items-center">
            <p className="text-gray-600 mr-2">Manage exercises, users, and system settings.</p>
            {isAdmin ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <Shield className="w-3 h-3 mr-1" /> Admin
              </span>
            ) : isModerator ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Shield className="w-3 h-3 mr-1" /> Moderator
              </span>
            ) : null}
          </div>
        </div>

        {isModerator && !isAdmin && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Moderator Access</AlertTitle>
            <AlertDescription>
              As a moderator, you can add and edit users and exercises, but you cannot remove them. Contact an admin for
              those actions.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-emerald-500" />
                Reading Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Teil 1: Title Matching</span>
                  <span className="font-bold">{readingPart1Count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teil 2: Multiple Choice</span>
                  <span className="font-bold">{readingPart2Count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teil 3: Gap Filling</span>
                  <span className="font-bold">{readingPart3Count}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Total</span>
                  <span className="font-bold">{getExerciseCountByType("reading")}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/admin/exercises/create" className="w-full">
                <Button variant="outline" className="w-full">
                  Add Exercise
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-emerald-500" />
                Listening Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Teil 1: Short Conversations</span>
                  <span className="font-bold">{listeningPart1Count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teil 2: Dialogue</span>
                  <span className="font-bold">{listeningPart2Count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teil 3: News & Announcements</span>
                  <span className="font-bold">{listeningPart3Count}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Total</span>
                  <span className="font-bold">{getExerciseCountByType("listening")}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/admin/exercises/create" className="w-full">
                <Button variant="outline" className="w-full">
                  Add Exercise
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-500" />
                Grammar Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Teil 1: Fill in the Blanks</span>
                  <span className="font-bold">{grammarPart1Count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teil 2: Word Formation</span>
                  <span className="font-bold">{grammarPart2Count}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Total</span>
                  <span className="font-bold">{getExerciseCountByType("grammar")}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/admin/exercises/create" className="w-full">
                <Button variant="outline" className="w-full">
                  Add Exercise
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-emerald-500" />
                Writing Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Teil 1: Formal Letter/Email</span>
                  <span className="font-bold">{writingPart1Count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teil 2: Essay</span>
                  <span className="font-bold">{writingPart2Count}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Total</span>
                  <span className="font-bold">{getExerciseCountByType("writing")}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/admin/exercises/create" className="w-full">
                <Button variant="outline" className="w-full">
                  Add Exercise
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="exercises" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises">
            <Card>
              <CardHeader>
                <CardTitle>All Exercises</CardTitle>
                <CardDescription>Manage all exercises in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Filter Exercises</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs text-gray-500">Exercise Type</DropdownMenuLabel>
                            <DropdownMenuItem
                              className={filters.type === "all" ? "bg-gray-100" : ""}
                              onClick={() => handleFilterChange("type", "all")}
                            >
                              All Types
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={filters.type === "reading" ? "bg-gray-100" : ""}
                              onClick={() => handleFilterChange("type", "reading")}
                            >
                              Reading
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={filters.type === "listening" ? "bg-gray-100" : ""}
                              onClick={() => handleFilterChange("type", "listening")}
                            >
                              Listening
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={filters.type === "grammar" ? "bg-gray-100" : ""}
                              onClick={() => handleFilterChange("type", "grammar")}
                            >
                              Grammar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={filters.type === "writing" ? "bg-gray-100" : ""}
                              onClick={() => handleFilterChange("type", "writing")}
                            >
                              Writing
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs text-gray-500">Exercise Part</DropdownMenuLabel>
                            <DropdownMenuItem
                              className={filters.part === "all" ? "bg-gray-100" : ""}
                              onClick={() => handleFilterChange("part", "all")}
                            >
                              All Parts
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={filters.part === "part1" ? "bg-gray-100" : ""}
                              onClick={() => handleFilterChange("part", "part1")}
                            >
                              Teil 1
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={filters.part === "part2" ? "bg-gray-100" : ""}
                              onClick={() => handleFilterChange("part", "part2")}
                            >
                              Teil 2
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={filters.part === "part3" ? "bg-gray-100" : ""}
                              onClick={() => handleFilterChange("part", "part3")}
                            >
                              Teil 3
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Link href="/admin/exercises/create">
                        <Button>Create New Exercise</Button>
                      </Link>
                    </div>
                  </div>

                  {selectedExercises.length > 0 && canRemoveExercises && (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <span>
                        {selectedExercises.length} exercise{selectedExercises.length > 1 ? "s" : ""} selected
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Selected
                      </Button>
                    </div>
                  )}

                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b bg-gray-50">
                      <div className="col-span-1 flex items-center">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                          disabled={!canRemoveExercises}
                        />
                      </div>
                      <div className="col-span-3">Title</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Part</div>
                      <div className="col-span-2">Time Limit</div>
                      <div className="col-span-2">Actions</div>
                    </div>

                    {filteredExercises.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No exercises found</div>
                    ) : (
                      filteredExercises.map((exercise, index) => (
                        <div
                          key={exercise.id}
                          className={`grid grid-cols-12 gap-4 p-4 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } border-b last:border-0`}
                        >
                          <div className="col-span-1 flex items-center">
                            <Checkbox
                              checked={selectedExercises.includes(exercise.id)}
                              onCheckedChange={() => handleSelectExercise(exercise.id)}
                              disabled={!canRemoveExercises}
                            />
                          </div>
                          <div className="col-span-3 truncate">{exercise.title}</div>
                          <div className="col-span-2 capitalize">{exercise.type}</div>
                          <div className="col-span-2">
                            {exercise.part === "part1" ? "Teil 1" : exercise.part === "part2" ? "Teil 2" : "Teil 3"}
                          </div>
                          <div className="col-span-2">{exercise.timeLimit} min</div>
                          <div className="col-span-2 flex gap-2">
                            <Link href={`/admin/exercises/edit/${exercise.id}`}>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                            {canRemoveExercises && (
                              <Link href={`/admin/exercises/delete/${exercise.id}`}>
                                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                  Delete
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Users</h3>
                    <Link href="/admin/users/create">
                      <Button>Add New User</Button>
                    </Link>
                  </div>

                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b bg-gray-50">
                      <div className="col-span-1">ID</div>
                      <div className="col-span-3">Name</div>
                      <div className="col-span-2">Code</div>
                      <div className="col-span-2">Role</div>
                      <div className="col-span-4">Actions</div>
                    </div>

                    {users.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No users found</div>
                    ) : (
                      users.map((user, index) => (
                        <div
                          key={user.id}
                          className={`grid grid-cols-12 gap-4 p-4 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } border-b last:border-0`}
                        >
                          <div className="col-span-1">{user.id.substring(0, 8)}...</div>
                          <div className="col-span-3">{user.name}</div>
                          <div className="col-span-2">{user.code}</div>
                          <div className="col-span-2">
                            {user.role
                              ? user.role
                              : user.isAdmin
                                ? "Admin"
                                : user.isModerator
                                  ? "Moderator"
                                  : "Student"}
                          </div>
                          <div className="col-span-4 flex gap-2">
                            <Link href={`/admin/users/edit/${user.id}`}>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                            {canRemoveUsers && (
                              <Link href={`/admin/users/delete/${user.id}`}>
                                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                  Delete
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* General Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="siteTitle">Site Title</Label>
                          <Input
                            id="siteTitle"
                            value={settings.siteTitle}
                            onChange={(e) => handleSettingChange("siteTitle", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="language">System Language</Label>
                          <Select
                            value={settings.language}
                            onValueChange={(value) => handleSettingChange("language", value)}
                          >
                            <SelectTrigger id="language">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="allowRegistration"
                          checked={settings.allowRegistration}
                          onCheckedChange={(checked) => handleSettingChange("allowRegistration", checked)}
                        />
                        <Label htmlFor="allowRegistration">Allow Public Registration</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="maintenanceMode"
                          checked={settings.maintenanceMode}
                          onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                        />
                        <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Test Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Test Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="timeLimit-reading">Reading Time Limit (min)</Label>
                          <Input
                            id="timeLimit-reading"
                            type="number"
                            min="1"
                            value={settings.defaultTimeLimit.reading}
                            onChange={(e) =>
                              handleSettingChange("defaultTimeLimit.reading", Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeLimit-listening">Listening Time Limit (min)</Label>
                          <Input
                            id="timeLimit-listening"
                            type="number"
                            min="1"
                            value={settings.defaultTimeLimit.listening}
                            onChange={(e) =>
                              handleSettingChange("defaultTimeLimit.listening", Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeLimit-grammar">Grammar Time Limit (min)</Label>
                          <Input
                            id="timeLimit-grammar"
                            type="number"
                            min="1"
                            value={settings.defaultTimeLimit.grammar}
                            onChange={(e) =>
                              handleSettingChange("defaultTimeLimit.grammar", Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeLimit-writing">Writing Time Limit (min)</Label>
                          <Input
                            id="timeLimit-writing"
                            type="number"
                            min="1"
                            value={settings.defaultTimeLimit.writing}
                            onChange={(e) =>
                              handleSettingChange("defaultTimeLimit.writing", Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showCorrectAnswers"
                          checked={settings.showCorrectAnswers}
                          onCheckedChange={(checked) => handleSettingChange("showCorrectAnswers", checked)}
                        />
                        <Label htmlFor="showCorrectAnswers">Show Correct Answers After Test</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="allowTestRetake"
                          checked={settings.allowTestRetake}
                          onCheckedChange={(checked) => handleSettingChange("allowTestRetake", checked)}
                        />
                        <Label htmlFor="allowTestRetake">Allow Users to Retake Tests</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Demo Account Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Demo Account Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="demoAccessLevel">Demo Account Access Level</Label>
                        <Select
                          value={settings.demoAccessLevel}
                          onValueChange={(value) => handleSettingChange("demoAccessLevel", value)}
                        >
                          <SelectTrigger id="demoAccessLevel">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Access</SelectItem>
                            <SelectItem value="limited">Limited Access (First exercise of each type)</SelectItem>
                            <SelectItem value="full">Full Access (All exercises)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings} className="bg-emerald-600 hover:bg-emerald-700">
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Exercises</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedExercises.length} selected exercise
              {selectedExercises.length > 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

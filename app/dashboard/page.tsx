"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Book, Headphones, PenTool, GraduationCap, ClipboardList } from "lucide-react"
import { getExercisesByType } from "@/lib/exercise-data"

export default function Dashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("Student")
  const [isAdmin, setIsAdmin] = useState(false)
  const [isModerator, setIsModerator] = useState(false)
  const [exerciseCounts, setExerciseCounts] = useState({
    reading: 0,
    listening: 0,
    grammar: 0,
    writing: 0,
  })

  useEffect(() => {
    // Check if user is authenticated
    const userCode = localStorage.getItem("userCode")
    if (!userCode) {
      router.push("/")
      return
    }

    // Get user data
    const storedName = localStorage.getItem("userName")
    const adminStatus = localStorage.getItem("isAdmin") === "true"
    const moderatorStatus = localStorage.getItem("isModerator") === "true"

    if (storedName) {
      setUserName(storedName)
    }

    setIsAdmin(adminStatus)
    setIsModerator(moderatorStatus)

    // Get exercise counts
    setExerciseCounts({
      reading: getExercisesByType("reading").length,
      listening: getExercisesByType("listening").length,
      grammar: getExercisesByType("grammar").length,
      writing: getExercisesByType("writing").length,
    })
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <DataInitializer />
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1>
          <p className="text-gray-600">Continue your TELC B2 preparation with our comprehensive exercises.</p>
        </div>

        <div className="mb-8">
          <Link href="/dashboard/test">
            <Button size="lg" className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Take a Complete TELC B2 Test
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            Practice with a full test that includes all sections: Reading, Listening, Grammar, and Writing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-emerald-500" />
                Reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{exerciseCounts.reading}</p>
              <p className="text-sm text-gray-500">Available exercises</p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/reading" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Practice Now</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-emerald-500" />
                Listening
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{exerciseCounts.listening}</p>
              <p className="text-sm text-gray-500">Available exercises</p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/listening" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Practice Now</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-500" />
                Grammar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{exerciseCounts.grammar}</p>
              <p className="text-sm text-gray-500">Available exercises</p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/grammar" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Practice Now</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-emerald-500" />
                Writing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{exerciseCounts.writing}</p>
              <p className="text-sm text-gray-500">Available exercises</p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/writing" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Practice Now</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your TELC B2 preparation progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Reading</span>
                    <span className="text-sm text-gray-500">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Listening</span>
                    <span className="text-sm text-gray-500">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Grammar</span>
                    <span className="text-sm text-gray-500">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Writing</span>
                    <span className="text-sm text-gray-500">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent exercise attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-3">
                    <Book className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Reading Part 2: Multiple Choice</p>
                      <p className="text-sm text-gray-500">Completed yesterday</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">75%</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-3">
                    <Headphones className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Listening Part 1: Short Conversations</p>
                      <p className="text-sm text-gray-500">Completed 2 days ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">60%</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Grammar Part 1: Fill in the Blanks</p>
                      <p className="text-sm text-gray-500">Completed 3 days ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">80%</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

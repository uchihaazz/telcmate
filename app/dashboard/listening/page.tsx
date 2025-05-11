"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ArrowRight, Headphones } from "lucide-react"
import { getExercisesByTypeAndPart } from "@/lib/exercise-data"

export default function ListeningExercises() {
  const [part1Exercises, setPart1Exercises] = useState([])
  const [part2Exercises, setPart2Exercises] = useState([])
  const [part3Exercises, setPart3Exercises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get listening exercises by part
    const listeningPart1 = getExercisesByTypeAndPart("listening", "part1")
    const listeningPart2 = getExercisesByTypeAndPart("listening", "part2")
    const listeningPart3 = getExercisesByTypeAndPart("listening", "part3")

    setPart1Exercises(listeningPart1)
    setPart2Exercises(listeningPart2)
    setPart3Exercises(listeningPart3)

    setLoading(false)
  }, [])

  const renderExerciseCards = (exercises) => {
    if (exercises.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-lg mb-4">No exercises available for this part yet.</p>
          <p>Check back later or contact your administrator.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{exercise.title}</CardTitle>
              <CardDescription>
                {exercise.part === "part1"
                  ? "Short Conversations"
                  : exercise.part === "part2"
                    ? "Dialogue"
                    : "News and Announcements"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{exercise.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{exercise.timeLimit} minutes</span>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Link href={`/dashboard/listening/${exercise.id}`} className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Start Exercise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DataInitializer />
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Listening Exercises</h1>
          <p className="text-gray-600">Practice your listening skills with these TELC B2 format exercises.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading exercises...</div>
        ) : (
          <Tabs defaultValue="part1" className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="part1" className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                <span>Teil 1: Short Conversations</span>
              </TabsTrigger>
              <TabsTrigger value="part2" className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                <span>Teil 2: Dialogue</span>
              </TabsTrigger>
              <TabsTrigger value="part3" className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                <span>Teil 3: News & Announcements</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="part1">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Teil 1: Short Conversations</h2>
                <p className="text-gray-600">Listen to short conversations and answer questions about them.</p>
              </div>
              {renderExerciseCards(part1Exercises)}
            </TabsContent>

            <TabsContent value="part2">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Teil 2: Dialogue</h2>
                <p className="text-gray-600">Listen to a longer dialogue and answer questions about it.</p>
              </div>
              {renderExerciseCards(part2Exercises)}
            </TabsContent>

            <TabsContent value="part3">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Teil 3: News and Announcements</h2>
                <p className="text-gray-600">
                  Listen to news reports and announcements and answer questions about them.
                </p>
              </div>
              {renderExerciseCards(part3Exercises)}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

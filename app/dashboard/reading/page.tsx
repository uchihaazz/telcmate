"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ArrowRight, Book } from "lucide-react"
import { getExercisesByTypeAndPart } from "@/lib/exercise-data"

export default function ReadingExercises() {
  const [part1Exercises, setPart1Exercises] = useState([])
  const [part2Exercises, setPart2Exercises] = useState([])
  const [part3Exercises, setPart3Exercises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get reading exercises by part
    const readingPart1 = getExercisesByTypeAndPart("reading", "part1")
    const readingPart2 = getExercisesByTypeAndPart("reading", "part2")
    const readingPart3 = getExercisesByTypeAndPart("reading", "part3")

    setPart1Exercises(readingPart1)
    setPart2Exercises(readingPart2)
    setPart3Exercises(readingPart3)

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
                  ? "Title Matching Exercise"
                  : exercise.part === "part2"
                    ? "Multiple Choice Questions"
                    : "Text-Title Matching with X"}
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
              <Link href={`/dashboard/reading/${exercise.id}`} className="w-full">
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
          <h1 className="text-3xl font-bold mb-2">Reading Exercises</h1>
          <p className="text-gray-600">Practice your reading skills with these TELC B2 format exercises.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading exercises...</div>
        ) : (
          <Tabs defaultValue="part1" className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="part1" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Teil 1: Title Matching</span>
              </TabsTrigger>
              <TabsTrigger value="part2" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Teil 2: Multiple Choice</span>
              </TabsTrigger>
              <TabsTrigger value="part3" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Teil 3: Gap Filling</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="part1">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Teil 1: Title Matching</h2>
                <p className="text-gray-600">Match the titles to the appropriate texts.</p>
              </div>
              {renderExerciseCards(part1Exercises)}
            </TabsContent>

            <TabsContent value="part2">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Teil 2: Multiple Choice</h2>
                <p className="text-gray-600">Read texts and answer multiple-choice questions.</p>
              </div>
              {renderExerciseCards(part2Exercises)}
            </TabsContent>

            <TabsContent value="part3">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Teil 3: Gap Filling</h2>
                <p className="text-gray-600">Fill in the gaps with the appropriate sentences.</p>
              </div>
              {renderExerciseCards(part3Exercises)}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

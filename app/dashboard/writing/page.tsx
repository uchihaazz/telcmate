"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ArrowRight, PenTool } from "lucide-react"
import { getExercisesByTypeAndPart } from "@/lib/exercise-data"

export default function WritingExercises() {
  const [part1Exercises, setPart1Exercises] = useState([])
  const [part2Exercises, setPart2Exercises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get writing exercises by part
    const writingPart1 = getExercisesByTypeAndPart("writing", "part1")
    const writingPart2 = getExercisesByTypeAndPart("writing", "part2")

    setPart1Exercises(writingPart1)
    setPart2Exercises(writingPart2)

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
              <CardDescription>{exercise.part === "part1" ? "Formal Letter/Email" : "Essay"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{exercise.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{exercise.timeLimit} minutes</span>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Link href={`/dashboard/writing/${exercise.id}`} className="w-full">
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
          <h1 className="text-3xl font-bold mb-2">Writing Exercises</h1>
          <p className="text-gray-600">Practice your writing skills with these TELC B2 format exercises.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading exercises...</div>
        ) : (
          <Tabs defaultValue="part1" className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="part1" className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                <span>Teil 1: Formal Letter/Email</span>
              </TabsTrigger>
              <TabsTrigger value="part2" className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                <span>Teil 2: Essay</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="part1">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Teil 1: Formal Letter/Email</h2>
                <p className="text-gray-600">Write a formal letter or email based on a given situation.</p>
              </div>
              {renderExerciseCards(part1Exercises)}
            </TabsContent>

            <TabsContent value="part2">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Teil 2: Essay</h2>
                <p className="text-gray-600">Write an essay expressing your opinion on a given topic.</p>
              </div>
              {renderExerciseCards(part2Exercises)}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

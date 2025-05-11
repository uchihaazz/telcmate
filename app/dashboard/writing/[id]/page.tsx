"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import LoadingSpinner from "@/components/loading-spinner"
import { getExerciseById } from "@/lib/exercise-data"

export default function WritingExercisePage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [response, setResponse] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [savedResponse, setSavedResponse] = useState("")
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    // Check if user is in demo mode
    const demoStatus = localStorage.getItem("isDemo") === "true"
    setIsDemo(demoStatus)

    // Load exercise by ID
    const currentExercise = getExerciseById(params.id)

    if (currentExercise && currentExercise.type === "writing") {
      setExercise(currentExercise)
      setTimeLeft(currentExercise.timeLimit * 60) // Convert minutes to seconds

      // Check if there's a saved response for this exercise
      const savedResponses = localStorage.getItem("writingResponses")
      if (savedResponses) {
        const responses = JSON.parse(savedResponses)
        const savedExerciseResponse = responses[currentExercise.id]
        if (savedExerciseResponse) {
          setResponse(savedExerciseResponse.text)
          if (savedExerciseResponse.submitted) {
            setSubmitted(true)
            setSavedResponse(savedExerciseResponse.text)
          }
        }
      }
    } else {
      toast({
        title: "Exercise not found",
        description: "The requested exercise could not be found.",
        variant: "destructive",
      })
      router.push("/dashboard/writing")
    }

    setLoading(false)
  }, [params.id, router, toast])

  // Timer effect
  useEffect(() => {
    if (!exercise || submitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [exercise, submitted])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleSave = () => {
    // Save the current response to localStorage
    const savedResponses = localStorage.getItem("writingResponses")
    const responses = savedResponses ? JSON.parse(savedResponses) : {}

    responses[exercise.id] = {
      text: response,
      submitted: false,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("writingResponses", JSON.stringify(responses))

    toast({
      title: "Progress saved",
      description: "Your response has been saved. You can continue later.",
    })
  }

  const handleSubmit = () => {
    // Save the final response to localStorage
    const savedResponses = localStorage.getItem("writingResponses")
    const responses = savedResponses ? JSON.parse(savedResponses) : {}

    responses[exercise.id] = {
      text: response,
      submitted: true,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("writingResponses", JSON.stringify(responses))

    setSubmitted(true)
    setSavedResponse(response)

    toast({
      title: "Exercise submitted",
      description: "Your response has been submitted for review.",
    })
  }

  const countWords = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Exercise not found</h1>
            <p className="mb-6">The requested exercise could not be found.</p>
            <Link href="/dashboard/writing">
              <Button>Back to Writing Exercises</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DataInitializer />
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/writing">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{exercise.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                submitted
                  ? "bg-gray-200 text-gray-700"
                  : timeLeft < 60
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{submitted ? "Completed" : formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{exercise.description}</p>
            <div className="p-4 bg-gray-50 border rounded-md">
              <p className="font-medium">Prompt:</p>
              <p className="mt-2">{exercise.prompt}</p>
            </div>
            <div className="mt-4">
              <p className="font-medium">Evaluation Criteria:</p>
              <ul className="list-disc pl-5 mt-2">
                {exercise.evaluationCriteria.map((criterion, index) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {submitted ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Submitted Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 border rounded-md whitespace-pre-wrap">{savedResponse}</div>
              <div className="mt-4 text-sm text-gray-500">Word count: {countWords(savedResponse)} words</div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Response</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your response here..."
                className="min-h-[300px] font-mono"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
              <div className="mt-2 flex justify-between items-center">
                <div className="text-sm text-gray-500">Word count: {countWords(response)} words</div>
                <Button variant="outline" size="sm" onClick={handleSave} className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex justify-end">
          {!submitted ? (
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit}>
              Submit Response
            </Button>
          ) : (
            <Link href="/dashboard/writing">
              <Button variant="outline">Back to Exercises</Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}

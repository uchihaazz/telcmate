"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import LoadingSpinner from "@/components/loading-spinner"
import { getExerciseById } from "@/lib/exercise-data"

export default function ReadingExercisePage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    // Check if user is in demo mode
    const demoStatus = localStorage.getItem("isDemo") === "true"
    setIsDemo(demoStatus)

    // Load exercise by ID
    const currentExercise = getExerciseById(params.id)

    if (currentExercise && currentExercise.type === "reading") {
      setExercise(currentExercise)
      setTimeLeft(currentExercise.timeLimit * 60) // Convert minutes to seconds

      // Initialize answers based on exercise part
      if (currentExercise.part === "part1") {
        // Title matching exercise
        const initialMatches = {}
        if (currentExercise.texts) {
          currentExercise.texts.forEach((_, index) => {
            initialMatches[`text-${index}`] = null
          })
        }
        setAnswers(initialMatches)
      } else if (currentExercise.part === "part2") {
        // Multiple choice questions
        const initialAnswers = {}
        if (currentExercise.questions) {
          currentExercise.questions.forEach((_, index) => {
            initialAnswers[`question-${index}`] = null
          })
        }
        setAnswers(initialAnswers)
      } else if (currentExercise.part === "part3") {
        // Title-text matching with X option
        const initialMatches = {}
        if (currentExercise.titles) {
          currentExercise.titles.forEach((_, index) => {
            initialMatches[`title-${index}`] = null
          })
        }
        setAnswers(initialMatches)
      }
    } else {
      toast({
        title: "Exercise not found",
        description: "The requested exercise could not be found.",
        variant: "destructive",
      })
      router.push("/dashboard/reading")
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

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item)
  }

  const handleDrop = (e, target) => {
    e.preventDefault()
    const item = e.dataTransfer.getData("text/plain")

    // Update answers
    setAnswers({
      ...answers,
      [target]: item,
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleMultipleChoiceSelect = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    })
  }

  const handleTitleMatch = (titleId, textId) => {
    setAnswers({
      ...answers,
      [titleId]: textId,
    })
  }

  const handleSubmit = () => {
    let correctCount = 0
    let totalQuestions = 0

    if (!exercise) return

    if (exercise.part === "part1" && exercise.texts) {
      // Title matching
      exercise.texts.forEach((text, index) => {
        totalQuestions++
        if (answers[`text-${index}`] === text.correctTitle) {
          correctCount++
        }
      })
    } else if (exercise.part === "part2" && exercise.questions && exercise.correctAnswers) {
      // Multiple choice
      exercise.questions.forEach((_, index) => {
        totalQuestions++
        if (answers[`question-${index}`] === exercise.correctAnswers[index]) {
          correctCount++
        }
      })
    } else if (exercise.part === "part3" && exercise.titles && exercise.correctMatches) {
      // Title-text matching with X
      exercise.titles.forEach((_, index) => {
        totalQuestions++
        if (answers[`title-${index}`] === exercise.correctMatches[index]) {
          correctCount++
        }
      })
    }

    const finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
    setScore(finalScore)
    setSubmitted(true)

    toast({
      title: "Exercise completed",
      description: `Your score: ${finalScore}%`,
    })
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
            <Link href="/dashboard/reading">
              <Button>Back to Reading Exercises</Button>
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
            <Link href="/dashboard/reading">
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
            <p>{exercise.description}</p>
          </CardContent>
        </Card>

        {exercise.part === "part1" && exercise.texts && exercise.titles && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Texts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {exercise.texts.map((text, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-md"
                        onDrop={(e) => handleDrop(e, `text-${index}`)}
                        onDragOver={handleDragOver}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold">Text {index + 1}</h3>
                          {submitted && (
                            <div>
                              {answers[`text-${index}`] === text.correctTitle ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                        <p>{text.content}</p>
                        {answers[`text-${index}`] && (
                          <div className="mt-2 p-2 bg-gray-100 rounded-md">
                            Selected title: {answers[`text-${index}`]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Titles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exercise.titles.map((title, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-md bg-gray-50 cursor-move"
                        draggable={!submitted}
                        onDragStart={(e) => handleDragStart(e, title)}
                      >
                        {title}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {exercise.part === "part2" && exercise.content && exercise.questions && exercise.options && (
          <Card>
            <CardHeader>
              <CardTitle>Reading Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 border rounded-md bg-white">
                <p className="whitespace-pre-line">{exercise.content}</p>
              </div>

              <h3 className="text-lg font-semibold mb-4">Questions</h3>
              <div className="space-y-6">
                {exercise.questions.map((question, qIndex) => (
                  <div key={qIndex} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{question}</h4>
                      {submitted && exercise.correctAnswers && (
                        <div>
                          {answers[`question-${qIndex}`] === exercise.correctAnswers[qIndex] ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {exercise.options[qIndex]?.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`p-2 border rounded-md cursor-pointer ${
                            answers[`question-${qIndex}`] === oIndex
                              ? "bg-emerald-100 border-emerald-300"
                              : "bg-white hover:bg-gray-50"
                          } ${
                            submitted && exercise.correctAnswers && exercise.correctAnswers[qIndex] === oIndex
                              ? "border-green-500 bg-green-50"
                              : ""
                          }`}
                          onClick={() => !submitted && handleMultipleChoiceSelect(`question-${qIndex}`, oIndex)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {exercise.part === "part3" && exercise.titles && exercise.texts && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Titles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exercise.titles.map((title, index) => (
                      <div key={index} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold">{title}</h3>
                          {submitted && exercise.correctMatches && (
                            <div>
                              {answers[`title-${index}`] === exercise.correctMatches[index] ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <Select
                            value={answers[`title-${index}`] || ""}
                            onValueChange={(value) => handleTitleMatch(`title-${index}`, value)}
                            disabled={submitted}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select matching text..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="X">X (No matching text)</SelectItem>
                              {exercise.texts.map((_, textIndex) => (
                                <SelectItem key={textIndex} value={`text-${textIndex}`}>
                                  Text {textIndex + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {submitted && exercise.correctMatches && (
                            <div className="mt-2 p-2 bg-gray-50 rounded border">
                              <p className="text-sm font-medium">
                                Correct answer:{" "}
                                {exercise.correctMatches[index] === "X"
                                  ? "X (No matching text)"
                                  : `Text ${Number.parseInt(exercise.correctMatches[index].split("-")[1]) + 1}`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Texts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exercise.texts.map((text, index) => (
                      <div key={index} className="p-4 border rounded-md">
                        <h3 className="font-bold mb-2">Text {index + 1}</h3>
                        <p>{text.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!submitted ? (
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit}>
              Submit Answers
            </Button>
          ) : (
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md">
                <span className="font-medium">Your Score:</span>
                <span className="text-lg font-bold">{score}%</span>
              </div>
              <Link href="/dashboard/reading">
                <Button variant="outline">Back to Exercises</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

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

export default function GrammarExercisePage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isDemo, setIsDemo] = useState(false)
  const [draggedWord, setDraggedWord] = useState(null)
  const [filledBlanks, setFilledBlanks] = useState({})

  useEffect(() => {
    // Check if user is in demo mode
    const demoStatus = localStorage.getItem("isDemo") === "true"
    setIsDemo(demoStatus)

    // Load exercise by ID
    const currentExercise = getExerciseById(params.id)

    if (currentExercise && currentExercise.type === "grammar") {
      setExercise(currentExercise)
      setTimeLeft(currentExercise.timeLimit * 60) // Convert minutes to seconds

      // Initialize answers based on exercise part
      if (currentExercise.part === "part1") {
        // For dropdown selection
        const initialAnswers = {}
        if (currentExercise.blanks) {
          currentExercise.blanks.forEach((_, index) => {
            initialAnswers[`blank-${index}`] = null
          })
        }
        setAnswers(initialAnswers)
      } else if (currentExercise.part === "part2") {
        // For drag and drop
        const initialBlanks = {}
        if (currentExercise.blanks) {
          currentExercise.blanks.forEach((_, index) => {
            initialBlanks[`blank-${index}`] = null
          })
        }
        setFilledBlanks(initialBlanks)
      }
    } else {
      toast({
        title: "Exercise not found",
        description: "The requested exercise could not be found.",
        variant: "destructive",
      })
      router.push("/dashboard/grammar")
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

  const handleDropdownSelect = (blankId, optionIndex) => {
    setAnswers({
      ...answers,
      [blankId]: optionIndex,
    })
  }

  const handleDragStart = (e, word, index) => {
    setDraggedWord({ word, index })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, blankId) => {
    e.preventDefault()
    if (!draggedWord) return

    setFilledBlanks({
      ...filledBlanks,
      [blankId]: draggedWord,
    })
  }

  const handleRemoveWord = (blankId) => {
    setFilledBlanks({
      ...filledBlanks,
      [blankId]: null,
    })
  }

  const handleSubmit = () => {
    let correctCount = 0
    let totalQuestions = 0

    if (exercise.part === "part1") {
      // Score dropdown selections
      if (exercise.blanks) {
        exercise.blanks.forEach((_, index) => {
          totalQuestions++
          if (answers[`blank-${index}`] === exercise.correctAnswers[index]) {
            correctCount++
          }
        })
      }
    } else if (exercise.part === "part2") {
      // Score drag and drop
      if (exercise.blanks) {
        exercise.blanks.forEach((blank, index) => {
          totalQuestions++
          if (filledBlanks[`blank-${index}`]?.word === blank.correctWord) {
            correctCount++
          }
        })
      }
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
            <Link href="/dashboard/grammar">
              <Button>Back to Grammar Exercises</Button>
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
            <Link href="/dashboard/grammar">
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

        {exercise.part === "part1" && (
          <Card>
            <CardHeader>
              <CardTitle>Fill in the Blanks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {exercise.textWithBlanks?.map((segment, index) => (
                  <span key={index}>
                    {segment.type === "text" ? (
                      segment.content
                    ) : (
                      <span className="inline-block mx-1">
                        <Select
                          value={answers[`blank-${segment.blankIndex}`]?.toString() || ""}
                          onValueChange={(value) => handleDropdownSelect(`blank-${segment.blankIndex}`, Number(value))}
                          disabled={submitted}
                        >
                          <SelectTrigger className="w-[120px] h-8 inline-flex">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {exercise.blanks[segment.blankIndex]?.options.map((option, optIndex) => (
                              <SelectItem key={optIndex} value={optIndex.toString()}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {submitted && (
                          <span className="ml-1">
                            {answers[`blank-${segment.blankIndex}`] === exercise.correctAnswers[segment.blankIndex] ? (
                              <CheckCircle className="inline h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="inline h-4 w-4 text-red-500" />
                            )}
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {exercise.part === "part2" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Text with Blanks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {exercise.textWithBlanks?.map((segment, index) => (
                    <span key={index}>
                      {segment.type === "text" ? (
                        segment.content
                      ) : (
                        <span
                          className={`inline-block mx-1 px-2 py-1 border-2 rounded min-w-[100px] min-h-[30px] ${
                            filledBlanks[`blank-${segment.blankIndex}`]
                              ? "border-blue-400 bg-blue-50"
                              : "border-dashed border-gray-400"
                          }`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, `blank-${segment.blankIndex}`)}
                        >
                          {filledBlanks[`blank-${segment.blankIndex}`] ? (
                            <span className="flex items-center justify-between">
                              <span>{filledBlanks[`blank-${segment.blankIndex}`].word}</span>
                              {!submitted && (
                                <button
                                  onClick={() => handleRemoveWord(`blank-${segment.blankIndex}`)}
                                  className="text-red-500 text-xs ml-2"
                                >
                                  ✕
                                </button>
                              )}
                              {submitted && (
                                <span className="ml-1">
                                  {filledBlanks[`blank-${segment.blankIndex}`].word ===
                                  exercise.blanks[segment.blankIndex].correctWord ? (
                                    <CheckCircle className="inline h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="inline h-4 w-4 text-red-500" />
                                  )}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-gray-400">___________</span>
                          )}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Word Bank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {exercise.wordBank?.map((word, index) => {
                    // Check if this word is already used
                    const isUsed = Object.values(filledBlanks).some((filled) => filled && filled.index === index)

                    return (
                      <div
                        key={index}
                        draggable={!isUsed && !submitted}
                        onDragStart={(e) => handleDragStart(e, word, index)}
                        className={`px-3 py-1 border rounded-md ${
                          isUsed ? "opacity-50 bg-gray-100" : "bg-white cursor-grab"
                        } ${submitted ? "cursor-default" : ""}`}
                      >
                        {word}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
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
              <Link href="/dashboard/grammar">
                <Button variant="outline">Back to Exercises</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

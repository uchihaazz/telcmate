"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, CheckCircle, XCircle, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LoadingSpinner from "@/components/loading-spinner"
import { getExerciseById } from "@/lib/exercise-data"

export default function ListeningExercisePage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isDemo, setIsDemo] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)

  // Create a ref for the audio element
  const audioRef = useRef(null)

  useEffect(() => {
    // Check if user is in demo mode
    const demoStatus = localStorage.getItem("isDemo") === "true"
    setIsDemo(demoStatus)

    // Load exercise by ID
    const currentExercise = getExerciseById(params.id)

    if (currentExercise && currentExercise.type === "listening") {
      setExercise(currentExercise)
      setTimeLeft(currentExercise.timeLimit * 60) // Convert minutes to seconds

      // Initialize answers based on exercise part
      if (currentExercise.questions) {
        const initialAnswers = {}
        currentExercise.questions.forEach((_, index) => {
          initialAnswers[`question-${index}`] = null
        })
        setAnswers(initialAnswers)
      }
    } else {
      toast({
        title: "Exercise not found",
        description: "The requested exercise could not be found.",
        variant: "destructive",
      })
      router.push("/dashboard/listening")
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

  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    })
  }

  // Improved audio player functionality
  const playAudio = () => {
    if (!audioRef.current) {
      setAudioError(true)
      toast({
        title: "Audio Error",
        description: "Could not play the audio file. Please try again later.",
        variant: "destructive",
      })
      return
    }

    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback error:", error)
          setAudioError(true)
          toast({
            title: "Audio Error",
            description: "Could not play the audio file. Please try again later.",
            variant: "destructive",
          })
        })
      }
    } catch (error) {
      console.error("Audio playback error:", error)
      setAudioError(true)
      toast({
        title: "Audio Error",
        description: "Could not play the audio file. Please try again later.",
        variant: "destructive",
      })
    }
  }

  // Handle audio events
  const handleAudioPlay = () => {
    setIsPlaying(true)
  }

  const handleAudioPause = () => {
    setIsPlaying(false)
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handleAudioError = () => {
    setAudioError(true)
    setIsPlaying(false)
    toast({
      title: "Audio Error",
      description: "Could not play the audio file. Please try again later.",
      variant: "destructive",
    })
  }

  const handleSubmit = () => {
    let correctCount = 0
    let totalQuestions = 0

    if (exercise.questions) {
      exercise.questions.forEach((_, index) => {
        totalQuestions++
        if (answers[`question-${index}`] === exercise.correctAnswers[index]) {
          correctCount++
        }
      })
    }

    const finalScore = Math.round((correctCount / totalQuestions) * 100)
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
            <Link href="/dashboard/listening">
              <Button>Back to Listening Exercises</Button>
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
            <Link href="/dashboard/listening">
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Audio</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={exercise.audioUrl}
              onPlay={handleAudioPlay}
              onPause={handleAudioPause}
              onEnded={handleAudioEnded}
              onError={handleAudioError}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4 mb-6">
              <Button
                className={`flex items-center gap-2 px-6 py-3 text-lg ${audioError ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={playAudio}
                disabled={audioError}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-5 w-5" /> Pause Audio
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" /> Play Audio
                  </>
                )}
              </Button>

              {audioError && (
                <div className="flex items-center gap-2 text-red-500">
                  <VolumeX className="h-5 w-5" />
                  <span>Audio file could not be loaded</span>
                </div>
              )}

              {isPlaying && !audioError && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <Volume2 className="h-5 w-5 animate-pulse" />
                  <span>Audio is playing...</span>
                </div>
              )}
            </div>

            {exercise.part === "part2" && submitted && (
              <div className="p-4 bg-gray-50 rounded-md mb-6">
                <h3 className="font-medium mb-2">Transcript:</h3>
                <p className="whitespace-pre-line">{exercise.transcript}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {exercise.questions?.map((question, qIndex) => (
                <div key={qIndex} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">
                      Question {qIndex + 1}: {question}
                    </h4>
                    {submitted && (
                      <div>
                        {answers[`question-${qIndex}`] === exercise.correctAnswers[qIndex] ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {exercise.options[qIndex]?.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`p-2 border rounded-md cursor-pointer ${
                          answers[`question-${qIndex}`] === oIndex
                            ? "bg-emerald-100 border-emerald-300"
                            : "bg-white hover:bg-gray-50"
                        } ${
                          submitted && exercise.correctAnswers[qIndex] === oIndex ? "border-green-500 bg-green-50" : ""
                        }`}
                        onClick={() => !submitted && handleOptionSelect(`question-${qIndex}`, oIndex)}
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
              <Link href="/dashboard/listening">
                <Button variant="outline">Back to Exercises</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

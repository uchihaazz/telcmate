"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Book,
  Headphones,
  GraduationCap,
  PenTool,
  ArrowLeft,
  ArrowRight,
  Home,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { useTest } from "@/lib/test-context"
import { getExerciseById } from "@/lib/exercise-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ReadingExercise from "@/components/reading-exercise"
import ListeningExercise from "@/components/listening-exercise"
import GrammarExercise from "@/components/grammar-exercise"
import WritingExercise from "@/components/writing-exercise"
import { useToast } from "@/hooks/use-toast"

export default function TestExercisePage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    sections,
    currentSection,
    currentPart,
    setCurrentSection,
    setCurrentPart,
    getSelectedExercise,
    isTestReady,
    completeTest,
    showAnswers,
    setShowAnswers,
  } = useTest()
  const [currentExercise, setCurrentExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [testCompleted, setTestCompleted] = useState(false)

  useEffect(() => {
    if (!isTestReady) {
      router.push("/dashboard/test")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get the selected exercise for the current section and part
      const selectedExercise = getSelectedExercise(currentSection, currentPart)

      if (!selectedExercise) {
        setError("No exercise selected for this part. Please go back and generate a new test.")
        setLoading(false)
        return
      }

      // Load the full exercise data
      const exerciseData = getExerciseById(selectedExercise.id)

      if (!exerciseData) {
        setError(`Exercise not found: ${selectedExercise.id}. Please go back and generate a new test.`)
        setLoading(false)
        return
      }

      setCurrentExercise(exerciseData)
      setLoading(false)
    } catch (err) {
      console.error("Error loading exercise:", err)
      setError("Error loading exercise. Please go back and generate a new test.")
      setLoading(false)

      toast({
        variant: "destructive",
        title: "Error Loading Exercise",
        description: "There was a problem loading the exercise. Please try generating a new test.",
      })
    }
  }, [currentSection, currentPart, isTestReady, router, getSelectedExercise, toast])

  const handlePreviousPart = () => {
    if (currentPart > 0) {
      // Go to previous part in the same section
      setCurrentPart(currentPart - 1)
    } else if (currentSection > 0) {
      // Go to the last part of the previous section
      setCurrentSection(currentSection - 1)
      setCurrentPart(sections[currentSection - 1].parts.length - 1)
    }
  }

  const handleNextPart = () => {
    if (currentPart < sections[currentSection].parts.length - 1) {
      // Go to next part in the same section
      setCurrentPart(currentPart + 1)
    } else if (currentSection < sections.length - 1) {
      // Go to the first part of the next section
      setCurrentSection(currentSection + 1)
      setCurrentPart(0)
    }
  }

  const handleFinishTest = () => {
    if (!testCompleted) {
      setTestCompleted(true)
      completeTest()
      toast({
        title: "Test Completed",
        description: "Your test has been completed. You can now review your answers.",
      })
    } else {
      router.push("/dashboard")
    }
  }

  const handleExitTest = () => {
    router.push("/dashboard")
  }

  const getSectionIcon = (type) => {
    switch (type) {
      case "reading":
        return <Book className="h-5 w-5" />
      case "listening":
        return <Headphones className="h-5 w-5" />
      case "grammar":
        return <GraduationCap className="h-5 w-5" />
      case "writing":
        return <PenTool className="h-5 w-5" />
      default:
        return <Book className="h-5 w-5" />
    }
  }

  // Calculate progress
  const totalParts = sections.reduce((total, section) => total + section.parts.length, 0)
  const currentPartIndex =
    sections.slice(0, currentSection).reduce((total, section) => total + section.parts.length, 0) + currentPart + 1
  const progressPercentage = (currentPartIndex / totalParts) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading exercise...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-between">
            <Link href="/dashboard/test">
              <Button variant="outline">Back to Test Selection</Button>
            </Link>
            <Button variant="outline" onClick={handleExitTest}>
              Exit Test
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">TELC B2 Test</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Part {currentPartIndex} of {totalParts}
              </span>
              <Progress value={progressPercentage} className="w-32 h-2" />
            </div>
          </div>

          {showAnswers && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Test Completed</AlertTitle>
              <AlertDescription>
                You have completed the test. You can now review your answers and see the correct solutions.
              </AlertDescription>
            </Alert>
          )}

          <Tabs
            value={`${currentSection}-${currentPart}`}
            onValueChange={(value) => {
              const [sectionIndex, partIndex] = value.split("-").map(Number)
              setCurrentSection(sectionIndex)
              setCurrentPart(partIndex)
            }}
            className="mb-6"
          >
            <TabsList className="mb-2 flex flex-wrap">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="flex flex-col mb-2 mr-2">
                  <div className="flex items-center gap-1 mb-1">
                    {getSectionIcon(section.type)}
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                  <div className="flex">
                    {section.parts.map((part, partIndex) => (
                      <TabsTrigger
                        key={`${sectionIndex}-${partIndex}`}
                        value={`${sectionIndex}-${partIndex}`}
                        className="text-xs px-2 py-1"
                      >
                        Teil {partIndex + 1}
                      </TabsTrigger>
                    ))}
                  </div>
                </div>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{currentExercise.title}</CardTitle>
            <CardDescription>{currentExercise.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentExercise.type === "reading" && (
              <ReadingExercise exercise={currentExercise} showAnswers={showAnswers} />
            )}
            {currentExercise.type === "listening" && (
              <ListeningExercise exercise={currentExercise} showAnswers={showAnswers} />
            )}
            {currentExercise.type === "grammar" && (
              <GrammarExercise exercise={currentExercise} showAnswers={showAnswers} />
            )}
            {currentExercise.type === "writing" && (
              <WritingExercise exercise={currentExercise} showAnswers={showAnswers} />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousPart}
              disabled={currentSection === 0 && currentPart === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Part
            </Button>

            {currentSection === sections.length - 1 && currentPart === sections[currentSection].parts.length - 1 ? (
              <Button
                onClick={handleFinishTest}
                className={`${testCompleted ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"} flex items-center gap-2`}
              >
                {testCompleted ? (
                  <>
                    <Home className="h-4 w-4" />
                    Return to Dashboard
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Finish Test
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNextPart} className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
                Next Part
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="flex justify-between">
          <Link href="/dashboard/test">
            <Button variant="outline">Back to Test Selection</Button>
          </Link>
          <Button variant="outline" onClick={handleExitTest}>
            Exit Test
          </Button>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, AlertCircle, CheckCircle2, RefreshCw, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTest } from "@/lib/test-context"
import { useToast } from "@/hooks/use-toast"

export default function TestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { sections, selectRandomExercises, startTest, isTestReady, resetTest } = useTest()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [missingExercises, setMissingExercises] = useState([])

  // If test is already in progress, redirect to the current section
  useEffect(() => {
    if (isTestReady) {
      router.push("/dashboard/test/exercise")
    }
  }, [isTestReady, router])

  // Check for missing exercises
  useEffect(() => {
    const missing = []
    sections.forEach((section) => {
      section.parts.forEach((part) => {
        if (part.exercises.length === 0) {
          missing.push(`${section.title} - ${part.title}`)
        }
      })
    })
    setMissingExercises(missing)
  }, [sections])

  const handleGenerateTest = () => {
    setIsGenerating(true)

    // Simulate a loading delay for better UX
    setTimeout(() => {
      const allPartsHaveExercises = selectRandomExercises()
      setIsGenerating(false)
      setIsGenerated(true)

      if (allPartsHaveExercises) {
        toast({
          title: "Test Generated",
          description: "Your test has been randomly generated with exercises from each section.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Warning",
          description: "Some parts don't have available exercises. The test may be incomplete.",
        })
      }
    }, 1000)
  }

  const handleStartTest = () => {
    startTest()
    router.push("/dashboard/test/exercise")
  }

  const handleResetTest = () => {
    resetTest()
    setIsGenerated(false)

    toast({
      title: "Test Reset",
      description: "Your test has been reset. You can generate a new one.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Take a Complete TELC B2 Test</h1>
          <p className="text-gray-600">Generate a complete test with randomly selected exercises from each section.</p>
        </div>

        <Alert className="mb-6">
          <Clock className="h-4 w-4" />
          <AlertTitle>Test Information</AlertTitle>
          <AlertDescription>
            A complete TELC B2 test consists of Reading, Listening, Grammar, and Writing sections. Each section has
            multiple parts. The system will randomly select one exercise for each part to create your test.
          </AlertDescription>
        </Alert>

        {missingExercises.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Missing Exercises</AlertTitle>
            <AlertDescription>
              <p>The following parts don't have any exercises available:</p>
              <ul className="list-disc pl-5 mt-2">
                {missingExercises.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="mt-2">Please add exercises for these parts in the admin panel before generating a test.</p>
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate Your Test</CardTitle>
            <CardDescription>
              Click the button below to generate a complete test with random exercises from each section.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sections.map((section) => (
                  <div key={section.type} className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2 capitalize">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.parts.map((part, index) => (
                        <li key={index} className="flex items-start gap-2">
                          {part.selectedExerciseId ? (
                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                          ) : part.exercises.length === 0 ? (
                            <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 mt-0.5 rounded-full border border-gray-300 shrink-0" />
                          )}
                          <span className="text-sm">
                            {part.title}
                            {part.exercises.length === 0 && (
                              <span className="text-amber-500 text-xs block">No exercises available</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {isGenerated ? (
              <>
                <Button variant="outline" onClick={handleResetTest} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Generate New Test
                </Button>
                <Button
                  onClick={handleStartTest}
                  disabled={missingExercises.length > 0}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Start Test
                </Button>
              </>
            ) : (
              <>
                <div></div> {/* Empty div for spacing */}
                <Button
                  onClick={handleGenerateTest}
                  disabled={isGenerating || missingExercises.length > 0}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGenerating ? "Generating..." : "Generate Random Test"}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        {!isGenerated && missingExercises.length === 0 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Test Not Generated</AlertTitle>
            <AlertDescription>
              Please generate a test before starting. This will randomly select exercises for each part of the test.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

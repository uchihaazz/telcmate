"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Upload, X, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addExercise } from "@/lib/firebase-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import LoadingSpinner from "@/components/loading-spinner"
import type { Exercise } from "@/lib/exercise-types"

interface FormData {
  type: Exercise['type'];
  part: Exercise['part'];
  title: string;
  description: string;
  timeLimit: number;
  content: string;
  texts: Array<{
    content: string;
    correctTitle: string;
  }>;
  prompt: string;
  evaluationCriteria: string[];
}

export default function CreateExercise() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    type: "reading",
    part: "part1",
    title: "",
    description: "",
    timeLimit: 15,
    content: "",
    texts: [],
    prompt: "",
    evaluationCriteria: [],
  })

  useEffect(() => {
    // Check if user is admin
    const isAdminUser = localStorage.getItem("isAdmin") === "true"
    setIsAdmin(isAdminUser)

    if (!isAdminUser) {
      router.push("/")
    }

    setLoading(false)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create new exercise object
      const newExercise: Exercise = {
        ...formData,
        id: `${formData.type}-${formData.part}-${Date.now()}`,
      } as Exercise

      // Add exercise to Firebase
      await addExercise(newExercise)

      toast({
        title: "Exercise Created",
        description: "The exercise has been created successfully.",
      })

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create exercise. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTextChange = (index: number, field: keyof FormData['texts'][0], value: string) => {
    const newTexts = [...formData.texts]
    newTexts[index] = { ...newTexts[index], [field]: value }
    setFormData({ ...formData, texts: newTexts })
  }

  const addText = () => {
    setFormData({
      ...formData,
      texts: [...formData.texts, { content: "", correctTitle: "" }],
    })
  }

  const removeText = (index: number) => {
    const newTexts = formData.texts.filter((_, i) => i !== index)
    setFormData({ ...formData, texts: newTexts })
  }

  const handleCriteriaChange = (index: number, value: string) => {
    const newCriteria = [...formData.evaluationCriteria]
    newCriteria[index] = value
    setFormData({ ...formData, evaluationCriteria: newCriteria })
  }

  const addCriteria = () => {
    setFormData({
      ...formData,
      evaluationCriteria: [...formData.evaluationCriteria, ""],
    })
  }

  const removeCriteria = (index: number) => {
    const newCriteria = formData.evaluationCriteria.filter((_, i) => i !== index)
    setFormData({ ...formData, evaluationCriteria: newCriteria })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAdmin) {
    return null // This should not happen due to the redirect, but just in case
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DataInitializer />
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Create New Exercise</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic exercise info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Exercise Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Exercise['type']) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="listening">Listening</SelectItem>
                      <SelectItem value="grammar">Grammar</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="part">Part</Label>
                  <Select
                    value={formData.part}
                    onValueChange={(value: Exercise['part']) =>
                      setFormData({ ...formData, part: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select part" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="part1">Part 1</SelectItem>
                      <SelectItem value="part2">Part 2</SelectItem>
                      {formData.type !== "writing" && <SelectItem value="part3">Part 3</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  value={formData.timeLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, timeLimit: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Type-specific fields */}
          {formData.type === "reading" && formData.part === "part1" && (
            <Card>
              <CardHeader>
                <CardTitle>Reading Part 1: Title Matching</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.texts.map((text, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Text {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeText(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Text Content</Label>
                      <Textarea
                        value={text.content}
                        onChange={(e) => handleTextChange(index, "content", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Correct Title</Label>
                      <Input
                        value={text.correctTitle}
                        onChange={(e) => handleTextChange(index, "correctTitle", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addText} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Text
                </Button>
              </CardContent>
            </Card>
          )}

          {formData.type === "writing" && (
            <Card>
              <CardHeader>
                <CardTitle>Writing Exercise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Writing Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Evaluation Criteria</Label>
                    <Button type="button" onClick={addCriteria} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Criterion
                    </Button>
                  </div>
                  {formData.evaluationCriteria.map((criterion, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={criterion}
                        onChange={(e) => handleCriteriaChange(index, e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCriteria(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Exercise"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

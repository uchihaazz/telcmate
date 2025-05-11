"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Upload, X, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getExerciseById, updateExercise } from "@/lib/firebase-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import LoadingSpinner from "@/components/loading-spinner"
import { BaseExercise } from "@/lib/exercise-types"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditExercisePage({ params }: PageProps) {
  const { id } = await params
  const router = useRouter()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<BaseExercise | null>(null)
  const [formData, setFormData] = useState<{
    title: string
    description: string
    type: string
    part: string
  }>({
    title: "",
    description: "",
    type: "",
    part: "",
  })

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/check-admin')
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      } catch (error) {
        console.error('Error checking admin status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [])

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const exerciseData = await getExerciseById(id)
        if (exerciseData) {
          const typedExercise = exerciseData as BaseExercise
          setExercise(typedExercise)
          setFormData({
            title: typedExercise.title,
            description: typedExercise.description,
            type: typedExercise.type,
            part: typedExercise.part,
          })
        }
      } catch (error) {
        console.error('Error fetching exercise:', error)
        toast({
          title: "Error",
          description: "Failed to fetch exercise data",
          variant: "destructive",
        })
      }
    }

    if (id) {
      fetchExercise()
    }
  }, [id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!exercise) return

      const updatedExercise = {
        ...exercise,
        ...formData,
      }

      await updateExercise(id, updatedExercise)
      toast({
        title: "Success",
        description: "Exercise updated successfully",
      })
      router.push('/admin/exercises')
    } catch (error) {
      console.error('Error updating exercise:', error)
      toast({
        title: "Error",
        description: "Failed to update exercise",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">You do not have permission to access this page.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DataInitializer />
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Exercise</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Exercise Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="reading">Reading</option>
                  <option value="listening">Listening</option>
                  <option value="writing">Writing</option>
                  <option value="speaking">Speaking</option>
                </select>
              </div>

              <div>
                <label htmlFor="part" className="block text-sm font-medium text-gray-700">
                  Part
                </label>
                <select
                  id="part"
                  name="part"
                  value={formData.part}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a part</option>
                  <option value="part1">Part 1</option>
                  <option value="part2">Part 2</option>
                  <option value="part3">Part 3</option>
                </select>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Link href="/admin">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

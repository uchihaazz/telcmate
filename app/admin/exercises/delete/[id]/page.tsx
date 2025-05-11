"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import DataInitializer from "@/components/data-initializer"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getExerciseById, deleteExercise } from "@/lib/firebase-data"
import LoadingSpinner from "@/components/loading-spinner"
import { BaseExercise } from "@/lib/exercise-types"

interface DeleteExercisePageProps {
  params: {
    id: string
  }
}

export default function DeleteExercisePage({ params }: DeleteExercisePageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<BaseExercise | null>(null)

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

  const handleDelete = async () => {
    try {
      await deleteExercise(params.id)
      toast({
        title: "Success",
        description: "Exercise deleted successfully",
      })
      router.push('/admin/exercises')
    } catch (error) {
      console.error('Error deleting exercise:', error)
      toast({
        title: "Error",
        description: "Failed to delete exercise",
        variant: "destructive",
      })
    }
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
          <h1 className="text-3xl font-bold">Delete Exercise</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card className="mb-6 border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">
              Are you sure you want to delete the following exercise? This action cannot be undone.
            </p>

            <div className="space-y-4 p-4 border rounded-md bg-gray-50">
              <div>
                <h3 className="font-medium">Title</h3>
                <p>{exercise?.title}</p>
              </div>
              <div>
                <h3 className="font-medium">Type</h3>
                <p className="capitalize">
                  {exercise?.type} -{" "}
                  {exercise?.part === "part1" ? "Teil 1" : exercise?.part === "part2" ? "Teil 2" : "Teil 3"}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p>{exercise?.description}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 pt-2">
            <Link href="/admin">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Exercise
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

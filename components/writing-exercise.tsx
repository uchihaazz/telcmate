"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useTest } from "@/lib/test-context"
import { useToast } from "@/hooks/use-toast"
import { Clock, Save, CheckCircle } from "lucide-react"

export default function WritingExercise({ exercise, showAnswers }) {
  const { writingChoice, setWritingChoice } = useTest()
  const { toast } = useToast()
  const [answer, setAnswer] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  // Get the writing exercises for this part
  const getWritingOptions = () => {
    // For simplicity, we'll just create two options based on the current exercise
    // In a real app, you would fetch two different exercises from the database
    return [
      {
        id: 1,
        title: "Formal Complaint",
        prompt:
          "Write a formal letter of complaint (approximately 150-200 words) to a hotel manager regarding issues you experienced during your stay. Describe the problems, explain how they affected your stay, and request specific compensation.",
        evaluationCriteria: [
          "Clear description of the problems",
          "Appropriate formal language and tone",
          "Logical organization of ideas",
          "Correct grammar and vocabulary",
          "Appropriate length (150-200 words)",
        ],
      },
      {
        id: 2,
        title: "Information Request",
        prompt:
          "Write a formal email (approximately 150-200 words) to a language school requesting information about their intensive German courses. Ask about course duration, prices, accommodation options, and any additional services they offer.",
        evaluationCriteria: [
          "Clear and specific questions",
          "Appropriate formal language and tone",
          "Logical organization of ideas",
          "Correct grammar and vocabulary",
          "Appropriate length (150-200 words)",
        ],
      },
    ]
  }

  const options = getWritingOptions()

  useEffect(() => {
    // Load saved answer if available
    if (writingChoice) {
      const savedAnswer = localStorage.getItem(`writing-answer-${exercise.id}-${writingChoice}`)
      if (savedAnswer) {
        setAnswer(savedAnswer)
        setWordCount(savedAnswer.trim() === "" ? 0 : savedAnswer.trim().split(/\s+/).length)
        setIsSaved(true)
      }
    }
  }, [exercise.id, writingChoice])

  const handleChooseOption = (optionId) => {
    setWritingChoice(optionId)
    toast({
      title: "Option Selected",
      description: "You have selected a writing task. You can now begin writing your response.",
    })
  }

  const handleAnswerChange = (e) => {
    const text = e.target.value
    setAnswer(text)
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length)
    setIsSaved(false)
  }

  const handleSaveAnswer = () => {
    if (answer.trim().length < 10) {
      toast({
        title: "Answer Too Short",
        description: "Please write a more detailed answer before saving.",
        variant: "destructive",
      })
      return
    }

    // Save the answer to localStorage
    localStorage.setItem(`writing-answer-${exercise.id}-${writingChoice}`, answer)
    setIsSaved(true)

    toast({
      title: "Answer Saved",
      description: "Your answer has been saved successfully.",
    })
  }

  // If no writing choice has been made yet, show the options
  if (writingChoice === null) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Choose One Writing Task</h2>
          <p className="text-gray-600">Select one of the following writing tasks to complete.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option) => (
            <Card key={option.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{option.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{option.prompt}</p>
                <div className="text-xs text-gray-500">
                  <p className="font-medium mb-1">Evaluation Criteria:</p>
                  <ul className="list-disc list-inside">
                    {option.evaluationCriteria.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleChooseOption(option.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={showAnswers}
                >
                  Select This Task
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show the selected writing task
  const selectedOption = options.find((option) => option.id === writingChoice)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Writing Task</h2>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Time Limit: {exercise.timeLimit || 30} minutes</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{selectedOption.title}</CardTitle>
          <CardDescription>{selectedOption.prompt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Evaluation Criteria:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {selectedOption.evaluationCriteria.map((criteria, index) => (
                <li key={index}>{criteria}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="answer" className="font-medium">
                Your Answer:
              </label>
              <span className={`text-sm ${wordCount < 150 || wordCount > 200 ? "text-amber-500" : "text-green-600"}`}>
                {wordCount} {wordCount === 1 ? "word" : "words"}
                {" (recommended: 150-200 words)"}
              </span>
            </div>
            <Textarea
              id="answer"
              value={answer}
              onChange={handleAnswerChange}
              placeholder="Write your answer here..."
              className="min-h-[300px]"
              disabled={showAnswers}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!showAnswers && (
            <Button variant="outline" onClick={() => setWritingChoice(null)} disabled={showAnswers}>
              Choose Different Task
            </Button>
          )}
          {!showAnswers && (
            <Button onClick={handleSaveAnswer} className="flex items-center gap-2" disabled={answer.trim().length < 10}>
              {isSaved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Answer
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {showAnswers && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-medium mb-2 text-blue-800">Writing Evaluation:</h3>
          <p className="mb-2">Your writing will be evaluated based on the following criteria:</p>
          <ul className="list-disc list-inside space-y-1">
            {selectedOption.evaluationCriteria.map((criteria, index) => (
              <li key={index} className="text-blue-700">
                {criteria}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

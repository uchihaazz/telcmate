"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReadingExercise({ exercise }) {
  const [answers, setAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (exercise.part === "part1") {
    // Title Matching Exercise
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Texts</h3>
            <div className="space-y-4">
              {exercise.texts.map((text, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <p className="font-medium mb-2">Text {index + 1}</p>
                    <p>{text.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Titles</h3>
            <div className="space-y-4">
              {exercise.texts.map((_, index) => (
                <div key={index} className="space-y-2">
                  <Label>Text {index + 1}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a title" />
                    </SelectTrigger>
                    <SelectContent>
                      {exercise.titles.map((title, titleIndex) => (
                        <SelectItem key={titleIndex} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Check Answers
        </Button>
      </div>
    )
  }

  if (exercise.part === "part2") {
    // Multiple Choice Exercise
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="whitespace-pre-line">{exercise.content}</p>
        </div>

        <div className="space-y-6">
          {exercise.questions.map((question, qIndex) => (
            <div key={qIndex} className="space-y-2">
              <h3 className="font-medium">
                Question {qIndex + 1}: {question}
              </h3>
              <RadioGroup>
                {exercise.options[qIndex].map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                    <Label htmlFor={`q${qIndex}-o${oIndex}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Check Answers
        </Button>
      </div>
    )
  }

  if (exercise.part === "part3") {
    // Gap Filling Exercise
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {exercise.content.map((item, index) => {
            if (typeof item === "string") {
              return <p key={index}>{item}</p>
            } else if (item.startsWith("___")) {
              const gapIndex = Number.parseInt(item.replace("___", "")) - 1
              return (
                <div key={index} className="my-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={`Gap ${gapIndex + 1}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {exercise.sentences.map((sentence, sIndex) => (
                        <SelectItem key={sIndex} value={sIndex.toString()}>
                          {sentence}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            }
            return null
          })}
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Check Answers
        </Button>
      </div>
    )
  }

  return <div>Unsupported reading exercise type</div>
}

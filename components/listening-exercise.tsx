"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2 } from "lucide-react"

export default function ListeningExercise({ exercise }) {
  const [answers, setAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const toggleAudio = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">Audio</span>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={toggleAudio}>
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
            </div>
            <audio className="w-full mt-4" controls src={exercise.audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
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

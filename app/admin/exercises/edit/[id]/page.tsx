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
import { getExerciseById, updateExercise } from "@/lib/exercise-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import LoadingSpinner from "@/components/loading-spinner"

export default function EditExercise({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [exercise, setExercise] = useState(null)

  // Basic exercise info
  const [exerciseType, setExerciseType] = useState("")
  const [exercisePart, setExercisePart] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState(15)

  // Reading exercise fields
  const [readingContent, setReadingContent] = useState("")
  const [texts, setTexts] = useState([{ content: "", correctTitle: "" }])
  const [titles, setTitles] = useState([""])
  const [questions, setQuestions] = useState([""])
  const [options, setOptions] = useState([[""]])
  const [correctAnswers, setCorrectAnswers] = useState([0])

  // Reading Teil 3 specific fields
  const [part3Texts, setPart3Texts] = useState([{ content: "" }])
  const [part3Titles, setPart3Titles] = useState([""])
  const [correctMatches, setCorrectMatches] = useState(["X"])

  // Listening exercise fields
  const [audioUrl, setAudioUrl] = useState("")
  const [audioFile, setAudioFile] = useState(null)
  const [transcript, setTranscript] = useState("")
  const [audioError, setAudioError] = useState("")

  // Grammar exercise fields
  const [textWithBlanks, setTextWithBlanks] = useState([{ type: "text", content: "" }])
  const [blanks, setBlanks] = useState([{ options: ["", "", "", ""] }])
  const [wordBank, setWordBank] = useState(["", "", "", "", "", "", "", "", "", ""])
  const [grammarSentences, setGrammarSentences] = useState([""])
  const [correctSentences, setCorrectSentences] = useState([""])
  const [errorTypes, setErrorTypes] = useState([""])
  const [correctTransformations, setCorrectTransformations] = useState([""])

  // Writing exercise fields
  const [prompt, setPrompt] = useState("")
  const [evaluationCriteria, setEvaluationCriteria] = useState([
    "Task completion",
    "Organization and coherence",
    "Range of vocabulary",
    "Grammatical accuracy",
    "Register and format",
  ])

  useEffect(() => {
    // Check if user is admin
    const adminStatus = localStorage.getItem("isAdmin") === "true"
    if (!adminStatus) {
      router.push("/dashboard")
      return
    }

    setIsAdmin(adminStatus)

    // Load exercise by ID
    const currentExercise = getExerciseById(params.id)
    if (!currentExercise) {
      toast({
        title: "Exercise not found",
        description: "The requested exercise could not be found.",
        variant: "destructive",
      })
      router.push("/admin")
      return
    }

    setExercise(currentExercise)

    // Set basic info
    setExerciseType(currentExercise.type)
    setExercisePart(currentExercise.part)
    setTitle(currentExercise.title)
    setDescription(currentExercise.description)
    setTimeLimit(currentExercise.timeLimit)

    // Set type-specific fields
    if (currentExercise.type === "reading") {
      if (currentExercise.part === "part1") {
        setTexts(currentExercise.texts || [{ content: "", correctTitle: "" }])
        setTitles(currentExercise.titles || [""])
      } else if (currentExercise.part === "part2") {
        setReadingContent(currentExercise.content || "")
        setQuestions(currentExercise.questions || [""])
        setOptions(currentExercise.options || [[""]])
        setCorrectAnswers(currentExercise.correctAnswers || [0])
      } else if (currentExercise.part === "part3") {
        setPart3Texts(currentExercise.texts || [{ content: "" }])
        setPart3Titles(currentExercise.titles || [""])
        setCorrectMatches(currentExercise.correctMatches || ["X"])
      }
    } else if (currentExercise.type === "listening") {
      setAudioUrl(currentExercise.audioUrl || "")
      setQuestions(currentExercise.questions || [""])
      setOptions(currentExercise.options || [[""]])
      setCorrectAnswers(currentExercise.correctAnswers || [0])
      if (currentExercise.part === "part2") {
        setTranscript(currentExercise.transcript || "")
      }
    } else if (currentExercise.type === "grammar") {
      if (currentExercise.part === "part1") {
        setTextWithBlanks(currentExercise.textWithBlanks || [{ type: "text", content: "" }])
        setBlanks(currentExercise.blanks || [{ options: ["", "", "", ""] }])
        setCorrectAnswers(currentExercise.correctAnswers || [0])
      } else if (currentExercise.part === "part2") {
        setTextWithBlanks(currentExercise.textWithBlanks || [{ type: "text", content: "" }])
        setBlanks(
          currentExercise.blanks || [{ correctWord: "" }].map((b) => ({ options: [b.correctWord || "", "", "", ""] })),
        )
        setWordBank(currentExercise.wordBank || ["", "", "", "", "", "", "", "", "", ""])
      }
    } else if (currentExercise.type === "writing") {
      setPrompt(currentExercise.prompt || "")
      setEvaluationCriteria(
        currentExercise.evaluationCriteria || [
          "Task completion",
          "Organization and coherence",
          "Range of vocabulary",
          "Grammatical accuracy",
          "Register and format",
        ],
      )
    }

    setLoading(false)
  }, [params.id, router, toast])

  const handleAddText = () => {
    setTexts([...texts, { content: "", correctTitle: "" }])
  }

  const handleRemoveText = (index) => {
    const newTexts = [...texts]
    newTexts.splice(index, 1)
    setTexts(newTexts)
  }

  const handleTextChange = (index, field, value) => {
    const newTexts = [...texts]
    newTexts[index][field] = value
    setTexts(newTexts)
  }

  const handleTitleChange = (index, value) => {
    const newTitles = [...titles]
    newTitles[index] = value
    setTitles(newTitles)
  }

  const handleAddTitle = () => {
    setTitles([...titles, ""])
  }

  const handleRemoveTitle = (index) => {
    const newTitles = [...titles]
    newTitles.splice(index, 1)
    setTitles(newTitles)
  }

  // Reading Teil 3 handlers
  const handleAddPart3Text = () => {
    setPart3Texts([...part3Texts, { content: "" }])
  }

  const handleRemovePart3Text = (index) => {
    const newTexts = [...part3Texts]
    newTexts.splice(index, 1)
    setPart3Texts(newTexts)
  }

  const handlePart3TextChange = (index, value) => {
    const newTexts = [...part3Texts]
    newTexts[index].content = value
    setPart3Texts(newTexts)
  }

  const handlePart3TitleChange = (index, value) => {
    const newTitles = [...part3Titles]
    newTitles[index] = value
    setPart3Titles(newTitles)
  }

  const handleCorrectMatchChange = (titleIndex, value) => {
    const newMatches = [...correctMatches]
    newMatches[titleIndex] = value
    setCorrectMatches(newMatches)
  }

  const handleAddQuestion = () => {
    setQuestions([...questions, ""])
    setOptions([...options, [""]])
    setCorrectAnswers([...correctAnswers, 0])
  }

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions)

    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)

    const newCorrectAnswers = [...correctAnswers]
    newCorrectAnswers.splice(index, 1)
    setCorrectAnswers(newCorrectAnswers)
  }

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  const handleAddOption = (questionIndex) => {
    const newOptions = [...options]
    newOptions[questionIndex] = [...newOptions[questionIndex], ""]
    setOptions(newOptions)
  }

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const newOptions = [...options]
    newOptions[questionIndex].splice(optionIndex, 1)
    setOptions(newOptions)
  }

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newOptions = [...options]
    newOptions[questionIndex][optionIndex] = value
    setOptions(newOptions)
  }

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const newCorrectAnswers = [...correctAnswers]
    newCorrectAnswers[questionIndex] = Number.parseInt(value)
    setCorrectAnswers(newCorrectAnswers)
  }

  const handleAddBlank = () => {
    setTextWithBlanks([...textWithBlanks, { type: "blank", blankIndex: blanks.length }, { type: "text", content: "" }])
    setBlanks([...blanks, { options: ["", "", "", ""] }])
  }

  const handleTextWithBlanksChange = (index, value) => {
    const newTextWithBlanks = [...textWithBlanks]
    if (newTextWithBlanks[index].type === "text") {
      newTextWithBlanks[index].content = value
    }
    setTextWithBlanks(newTextWithBlanks)
  }

  const handleBlankOptionChange = (blankIndex, optionIndex, value) => {
    const newBlanks = [...blanks]
    newBlanks[blankIndex].options[optionIndex] = value
    setBlanks(newBlanks)
  }

  const handleWordBankChange = (index, value) => {
    const newWordBank = [...wordBank]
    newWordBank[index] = value
    setWordBank(newWordBank)
  }

  const handleAddSentence = () => {
    setGrammarSentences([...grammarSentences, ""])
    setCorrectSentences([...correctSentences, ""])
    setErrorTypes([...errorTypes, ""])
  }

  const handleRemoveSentence = (index) => {
    const newGrammarSentences = [...grammarSentences]
    newGrammarSentences.splice(index, 1)
    setGrammarSentences(newGrammarSentences)

    const newCorrectSentences = [...correctSentences]
    newCorrectSentences.splice(index, 1)
    setCorrectSentences(newCorrectSentences)

    const newErrorTypes = [...errorTypes]
    newErrorTypes.splice(index, 1)
    setErrorTypes(newErrorTypes)
  }

  const handleSentenceChange = (index, value) => {
    const newGrammarSentences = [...grammarSentences]
    newGrammarSentences[index] = value
    setGrammarSentences(newGrammarSentences)
  }

  const handleCorrectSentenceChange = (index, value) => {
    const newCorrectSentences = [...correctSentences]
    newCorrectSentences[index] = value
    setCorrectSentences(newCorrectSentences)
  }

  const handleErrorTypeChange = (index, value) => {
    const newErrorTypes = [...errorTypes]
    newErrorTypes[index] = value
    setErrorTypes(newErrorTypes)
  }

  const handleAddTransformation = () => {
    setGrammarSentences([...grammarSentences, ""])
    setCorrectTransformations([...correctTransformations, ""])
  }

  const handleRemoveTransformation = (index) => {
    const newGrammarSentences = [...grammarSentences]
    newGrammarSentences.splice(index, 1)
    setGrammarSentences(newGrammarSentences)

    const newCorrectTransformations = [...correctTransformations]
    newCorrectTransformations.splice(index, 1)
    setCorrectTransformations(newCorrectTransformations)
  }

  const handleTransformationChange = (index, value) => {
    const newCorrectTransformations = [...correctTransformations]
    newCorrectTransformations[index] = value
    setCorrectTransformations(newCorrectTransformations)
  }

  const handleAddCriterion = () => {
    setEvaluationCriteria([...evaluationCriteria, ""])
  }

  const handleRemoveCriterion = (index) => {
    const newCriteria = [...evaluationCriteria]
    newCriteria.splice(index, 1)
    setEvaluationCriteria(newCriteria)
  }

  const handleCriterionChange = (index, value) => {
    const newCriteria = [...evaluationCriteria]
    newCriteria[index] = value
    setEvaluationCriteria(newCriteria)
  }

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check if file is an audio file
      if (!file.type.startsWith("audio/")) {
        setAudioError("Please upload an audio file (MP3, WAV, etc.)")
        return
      }

      setAudioFile(file)
      setAudioUrl(URL.createObjectURL(file))
      setAudioError("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!title || !description || !exerciseType || !exercisePart || !timeLimit) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Validate audio for listening exercises
    if (exerciseType === "listening" && !audioUrl) {
      setAudioError("Please provide an audio file or URL")
      toast({
        title: "Validation Error",
        description: "Please provide an audio file for the listening exercise.",
        variant: "destructive",
      })
      return
    }

    // Create an updated exercise based on type and part
    let updatedExercise = {
      ...exercise,
      type: exerciseType,
      part: exercisePart,
      title,
      description,
      timeLimit: Number.parseInt(timeLimit),
    }

    // Add type-specific fields
    if (exerciseType === "reading") {
      if (exercisePart === "part1") {
        // Filter out empty titles
        const filteredTitles = titles.filter((title) => title.trim() !== "")

        updatedExercise = {
          ...updatedExercise,
          texts,
          titles: filteredTitles,
        }
      } else if (exercisePart === "part2") {
        updatedExercise = {
          ...updatedExercise,
          content: readingContent,
          questions,
          options,
          correctAnswers,
        }
      } else if (exercisePart === "part3") {
        // Filter out empty titles and texts
        const filteredTitles = part3Titles.filter((title) => title.trim() !== "")
        const filteredTexts = part3Texts.filter((text) => text.content.trim() !== "")

        // Adjust correct matches to match the filtered arrays
        const validCorrectMatches = correctMatches.slice(0, filteredTitles.length)

        updatedExercise = {
          ...updatedExercise,
          titles: filteredTitles,
          texts: filteredTexts,
          correctMatches: validCorrectMatches,
        }
      }
    } else if (exerciseType === "listening") {
      updatedExercise = {
        ...updatedExercise,
        audioUrl,
        questions,
        options,
        correctAnswers,
      }

      if (exercisePart === "part2") {
        updatedExercise.transcript = transcript
      }
    } else if (exerciseType === "grammar") {
      if (exercisePart === "part1") {
        updatedExercise = {
          ...updatedExercise,
          textWithBlanks,
          blanks,
          correctAnswers,
        }
      } else if (exercisePart === "part2") {
        updatedExercise = {
          ...updatedExercise,
          textWithBlanks,
          blanks: blanks.map((blank, index) => ({ correctWord: blank.options[0] })),
          wordBank,
        }
      }
    } else if (exerciseType === "writing") {
      updatedExercise = {
        ...updatedExercise,
        prompt,
        evaluationCriteria,
      }
    }

    // Update exercise in localStorage
    const success = updateExercise(updatedExercise)

    if (success) {
      toast({
        title: "Exercise Updated",
        description: "The exercise has been updated successfully.",
      })

      // Redirect to admin dashboard
      router.push("/admin")
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update the exercise. Please try again.",
        variant: "destructive",
      })
    }
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
          <h1 className="text-3xl font-bold">Edit Exercise</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="exerciseType">Exercise Type</Label>
                  <Select value={exerciseType} onValueChange={setExerciseType} required disabled>
                    <SelectTrigger id="exerciseType">
                      <SelectValue placeholder="Select exercise type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="listening">Listening</SelectItem>
                      <SelectItem value="grammar">Grammar</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Exercise type cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exercisePart">Exercise Part</Label>
                  <Select value={exercisePart} onValueChange={setExercisePart} required disabled>
                    <SelectTrigger id="exercisePart">
                      <SelectValue placeholder="Select exercise part" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="part1">Teil 1</SelectItem>
                      <SelectItem value="part2">Teil 2</SelectItem>
                      {exerciseType !== "grammar" && exerciseType !== "writing" && (
                        <SelectItem value="part3">Teil 3</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Exercise part cannot be changed</p>
                </div>
              </div>

              {exerciseType && exercisePart && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Exercise Type Information</AlertTitle>
                  <AlertDescription>
                    {exerciseType === "reading" && exercisePart === "part1" && "Title Matching Exercise"}
                    {exerciseType === "reading" && exercisePart === "part2" && "Multiple Choice Questions"}
                    {exerciseType === "reading" && exercisePart === "part3" && "Title-Text Matching with X Option"}
                    {exerciseType === "listening" && exercisePart === "part1" && "Short Conversations"}
                    {exerciseType === "listening" && exercisePart === "part2" && "Dialogue"}
                    {exerciseType === "listening" && exercisePart === "part3" && "News and Announcements"}
                    {exerciseType === "grammar" && exercisePart === "part1" && "Fill in the Blanks"}
                    {exerciseType === "grammar" && exercisePart === "part2" && "Word Formation"}
                    {exerciseType === "writing" && exercisePart === "part1" && "Formal Letter/Email"}
                    {exerciseType === "writing" && exercisePart === "part2" && "Essay"}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2 mb-6">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter exercise title"
                  required
                />
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter exercise description"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  min="1"
                  max="120"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {exerciseType && exercisePart && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Exercise Content</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Reading Exercise Forms */}
                {exerciseType === "reading" && exercisePart === "part1" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Title Matching Exercise</h3>

                    <div className="space-y-4">
                      <Label>Texts</Label>
                      {texts.map((text, index) => (
                        <div key={index} className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Text {index + 1}</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveText(index)}
                              disabled={texts.length <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`text-content-${index}`}>Content</Label>
                              <Textarea
                                id={`text-content-${index}`}
                                value={text.content}
                                onChange={(e) => handleTextChange(index, "content", e.target.value)}
                                placeholder="Enter text content"
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`text-title-${index}`}>Correct Title</Label>
                              <Input
                                id={`text-title-${index}`}
                                value={text.correctTitle}
                                onChange={(e) => handleTextChange(index, "correctTitle", e.target.value)}
                                placeholder="Enter correct title for this text"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={handleAddText} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Add Text
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Titles (including distractors)</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddTitle}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {titles.map((title, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="space-y-2 flex-1">
                            <Label htmlFor={`title-${index}`}>Title {index + 1}</Label>
                            <Input
                              id={`title-${index}`}
                              value={title}
                              onChange={(e) => handleTitleChange(index, e.target.value)}
                              placeholder={`Enter title ${index + 1}`}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-8"
                            onClick={() => handleRemoveTitle(index)}
                            disabled={titles.length <= texts.length}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <p className="text-sm text-gray-500">
                        Note: You should have at least as many titles as texts, plus some distractors.
                      </p>
                    </div>
                  </div>
                )}

                {exerciseType === "reading" && exercisePart === "part2" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Multiple Choice Exercise</h3>

                    <div className="space-y-2">
                      <Label htmlFor="reading-content">Reading Text</Label>
                      <Textarea
                        id="reading-content"
                        value={readingContent}
                        onChange={(e) => setReadingContent(e.target.value)}
                        placeholder="Enter the reading text"
                        className="min-h-[200px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Questions</Label>
                      {questions.map((question, qIndex) => (
                        <div key={qIndex} className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Question {qIndex + 1}</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveQuestion(qIndex)}
                              disabled={questions.length <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
                              <Input
                                id={`question-${qIndex}`}
                                value={question}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                placeholder="Enter question text"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label>Options</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddOption(qIndex)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {options[qIndex]?.map((option, oIndex) => (
                                <div key={oIndex} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    placeholder={`Option ${oIndex + 1}`}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveOption(qIndex, oIndex)}
                                    disabled={options[qIndex].length <= 1}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`correct-answer-${qIndex}`}>Correct Answer</Label>
                              <Select
                                value={correctAnswers[qIndex]?.toString()}
                                onValueChange={(value) => handleCorrectAnswerChange(qIndex, value)}
                              >
                                <SelectTrigger id={`correct-answer-${qIndex}`}>
                                  <SelectValue placeholder="Select correct answer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {options[qIndex]?.map((_, oIndex) => (
                                    <SelectItem key={oIndex} value={oIndex.toString()}>
                                      Option {oIndex + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={handleAddQuestion} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Add Question
                      </Button>
                    </div>
                  </div>
                )}

                {exerciseType === "reading" && exercisePart === "part3" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Title-Text Matching with X Option</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      In this exercise, students need to match titles with texts. Some titles may not have a matching
                      text (X option).
                    </p>

                    <div className="space-y-4">
                      <Label>Titles</Label>
                      {part3Titles.map((title, index) => (
                        <div key={index} className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Title {index + 1}</h4>
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newTitles = [...part3Titles]
                                  newTitles.splice(index, 1)
                                  setPart3Titles(newTitles)

                                  const newMatches = [...correctMatches]
                                  newMatches.splice(index, 1)
                                  setCorrectMatches(newMatches)
                                }}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`part3-title-${index}`}>Title Text</Label>
                              <Input
                                id={`part3-title-${index}`}
                                value={title}
                                onChange={(e) => handlePart3TitleChange(index, e.target.value)}
                                placeholder="Enter title text"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`correct-match-${index}`}>Correct Match</Label>
                              <Select
                                value={correctMatches[index]}
                                onValueChange={(value) => handleCorrectMatchChange(index, value)}
                              >
                                <SelectTrigger id={`correct-match-${index}`}>
                                  <SelectValue placeholder="Select correct match" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="X">X (No matching text)</SelectItem>
                                  {part3Texts.map((_, textIndex) => (
                                    <SelectItem key={textIndex} value={`text-${textIndex}`}>
                                      Text {textIndex + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPart3Titles([...part3Titles, ""])
                          setCorrectMatches([...correctMatches, "X"])
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Title
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Label>Texts</Label>
                      {part3Texts.map((text, index) => (
                        <div key={index} className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Text {index + 1}</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemovePart3Text(index)}
                              disabled={part3Texts.length <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`part3-text-content-${index}`}>Content</Label>
                            <Textarea
                              id={`part3-text-content-${index}`}
                              value={text.content}
                              onChange={(e) => handlePart3TextChange(index, e.target.value)}
                              placeholder="Enter text content"
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={handleAddPart3Text} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Add Text
                      </Button>
                    </div>
                  </div>
                )}

                {/* Listening Exercise Forms */}
                {exerciseType === "listening" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">
                      {exercisePart === "part1"
                        ? "Short Conversations"
                        : exercisePart === "part2"
                          ? "Dialogue"
                          : "News and Announcements"}
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="audio-url">Audio File</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Input
                            id="audio-url"
                            value={audioUrl}
                            onChange={(e) => {
                              setAudioUrl(e.target.value)
                              setAudioError("")
                            }}
                            placeholder="Enter audio URL or path"
                            className="flex-1"
                          />
                          <label className="cursor-pointer">
                            <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                              <Upload className="h-4 w-4 mr-2" /> Upload
                            </div>
                            <input type="file" accept="audio/*" className="hidden" onChange={handleAudioFileChange} />
                          </label>
                        </div>

                        {audioUrl && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Audio Preview:</p>
                            <audio controls className="w-full">
                              <source src={audioUrl} />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}

                        {audioError && <p className="text-sm text-red-500 mt-1">{audioError}</p>}

                        <p className="text-sm text-gray-500">
                          You can either upload an audio file or enter a URL. For demo purposes, you can enter a
                          placeholder URL like "/audio/exercise-name.mp3"
                        </p>
                      </div>
                    </div>

                    {exercisePart === "part2" && (
                      <div className="space-y-2">
                        <Label htmlFor="transcript">Transcript</Label>
                        <Textarea
                          id="transcript"
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          placeholder="Enter the audio transcript"
                          className="min-h-[200px]"
                        />
                      </div>
                    )}

                    <div className="space-y-4">
                      <Label>Questions</Label>
                      {questions.map((question, qIndex) => (
                        <div key={qIndex} className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Question {qIndex + 1}</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveQuestion(qIndex)}
                              disabled={questions.length <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
                              <Input
                                id={`question-${qIndex}`}
                                value={question}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                placeholder="Enter question text"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label>Options</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddOption(qIndex)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {options[qIndex]?.map((option, oIndex) => (
                                <div key={oIndex} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    placeholder={`Option ${oIndex + 1}`}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveOption(qIndex, oIndex)}
                                    disabled={options[qIndex].length <= 1}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`correct-answer-${qIndex}`}>Correct Answer</Label>
                              <Select
                                value={correctAnswers[qIndex]?.toString()}
                                onValueChange={(value) => handleCorrectAnswerChange(qIndex, value)}
                              >
                                <SelectTrigger id={`correct-answer-${qIndex}`}>
                                  <SelectValue placeholder="Select correct answer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {options[qIndex]?.map((_, oIndex) => (
                                    <SelectItem key={oIndex} value={oIndex.toString()}>
                                      Option {oIndex + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddQuestion}
                        className="w-full"
                        disabled={
                          (exercisePart === "part1" && questions.length >= 5) ||
                          (exercisePart === "part2" && questions.length >= 10) ||
                          (exercisePart === "part3" && questions.length >= 6)
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Question
                      </Button>
                      {exercisePart === "part1" && (
                        <p className="text-sm text-gray-500">Maximum 5 questions for Teil 1</p>
                      )}
                      {exercisePart === "part2" && (
                        <p className="text-sm text-gray-500">Maximum 10 questions for Teil 2</p>
                      )}
                      {exercisePart === "part3" && (
                        <p className="text-sm text-gray-500">Maximum 6 questions for Teil 3</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Grammar Exercise Forms */}
                {exerciseType === "grammar" && exercisePart === "part1" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Fill in the Blanks</h3>

                    <div className="space-y-4">
                      <Label>Text with Blanks</Label>
                      <div className="p-4 border rounded-md">
                        {textWithBlanks.map((segment, index) => (
                          <div key={index} className="mb-2">
                            {segment.type === "text" ? (
                              <div className="space-y-2">
                                <Label htmlFor={`text-segment-${index}`}>Text Segment</Label>
                                <Input
                                  id={`text-segment-${index}`}
                                  value={segment.content}
                                  onChange={(e) => handleTextWithBlanksChange(index, e.target.value)}
                                  placeholder="Enter text segment"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center p-2 bg-gray-100 rounded-md">
                                <span className="text-gray-500">Blank {segment.blankIndex + 1}</span>
                              </div>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={handleAddBlank} className="w-full mt-4">
                          <Plus className="h-4 w-4 mr-2" /> Add Blank
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Blanks Options</Label>
                      {blanks.map((blank, blankIndex) => (
                        <div key={blankIndex} className="p-4 border rounded-md">
                          <h4 className="font-medium mb-2">Blank {blankIndex + 1} Options</h4>
                          <div className="space-y-2">
                            {blank.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => handleBlankOptionChange(blankIndex, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="mt-2">
                            <Label htmlFor={`correct-blank-${blankIndex}`}>Correct Option</Label>
                            <Select
                              value={correctAnswers[blankIndex]?.toString()}
                              onValueChange={(value) => handleCorrectAnswerChange(blankIndex, value)}
                            >
                              <SelectTrigger id={`correct-blank-${blankIndex}`}>
                                <SelectValue placeholder="Select correct option" />
                              </SelectTrigger>
                              <SelectContent>
                                {blank.options.map((_, optionIndex) => (
                                  <SelectItem key={optionIndex} value={optionIndex.toString()}>
                                    Option {optionIndex + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {exerciseType === "grammar" && exercisePart === "part2" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Word Formation</h3>

                    <div className="space-y-4">
                      <Label>Text with Blanks</Label>
                      <div className="p-4 border rounded-md">
                        {textWithBlanks.map((segment, index) => (
                          <div key={index} className="mb-2">
                            {segment.type === "text" ? (
                              <div className="space-y-2">
                                <Label htmlFor={`text-segment-${index}`}>Text Segment</Label>
                                <Input
                                  id={`text-segment-${index}`}
                                  value={segment.content}
                                  onChange={(e) => handleTextWithBlanksChange(index, e.target.value)}
                                  placeholder="Enter text segment"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center p-2 bg-gray-100 rounded-md">
                                <span className="text-gray-500">Blank {segment.blankIndex + 1}</span>
                              </div>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={handleAddBlank} className="w-full mt-4">
                          <Plus className="h-4 w-4 mr-2" /> Add Blank
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Blanks Correct Words</Label>
                      {blanks.map((_, blankIndex) => (
                        <div key={blankIndex} className="space-y-2">
                          <Label htmlFor={`correct-word-${blankIndex}`}>Correct Word for Blank {blankIndex + 1}</Label>
                          <Input
                            id={`correct-word-${blankIndex}`}
                            value={blanks[blankIndex].options[0]}
                            onChange={(e) => handleBlankOptionChange(blankIndex, 0, e.target.value)}
                            placeholder="Enter correct word"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <Label>Word Bank</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {wordBank.map((word, index) => (
                          <Input
                            key={index}
                            value={word}
                            onChange={(e) => handleWordBankChange(index, e.target.value)}
                            placeholder={`Word ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Writing Exercise Forms */}
                {exerciseType === "writing" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">
                      {exercisePart === "part1" ? "Formal Letter/Email" : "Essay"}
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="writing-prompt">Writing Prompt</Label>
                      <Textarea
                        id="writing-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter the writing prompt"
                        className="min-h-[150px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Evaluation Criteria</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddCriterion}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {evaluationCriteria.map((criterion, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={criterion}
                            onChange={(e) => handleCriterionChange(index, e.target.value)}
                            placeholder={`Criterion ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveCriterion(index)}
                            disabled={evaluationCriteria.length <= 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Link href="/admin">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Update Exercise</Button>
          </div>
        </form>
      </main>
    </div>
  )
}

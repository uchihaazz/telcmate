"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getExercisesByTypeAndPart } from "./exercise-data"

export interface TestExercise {
  id: string
  type: string
  part: string
  title: string
}

export interface TestSection {
  type: string
  title: string
  parts: {
    part: string
    title: string
    selectedExerciseId: string | null
    exercises: TestExercise[]
  }[]
}

interface TestContextType {
  sections: TestSection[]
  currentSection: number
  currentPart: number
  setCurrentSection: (index: number) => void
  setCurrentPart: (index: number) => void
  selectExercise: (sectionIndex: number, partIndex: number, exerciseId: string) => void
  getSelectedExercise: (sectionIndex: number, partIndex: number) => any
  isTestReady: boolean
  startTest: () => void
  completeTest: () => void
  resetTest: () => void
  selectRandomExercises: () => boolean
  writingChoice: number | null
  setWritingChoice: (choice: number) => void
  showAnswers: boolean
  setShowAnswers: (show: boolean) => void
}

const TestContext = createContext<TestContextType | undefined>(undefined)

export function TestProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<TestSection[]>([
    {
      type: "reading",
      title: "Reading",
      parts: [
        { part: "part1", title: "Teil 1: Title Matching", selectedExerciseId: null, exercises: [] },
        { part: "part2", title: "Teil 2: Multiple Choice", selectedExerciseId: null, exercises: [] },
        { part: "part3", title: "Teil 3: Gap Filling", selectedExerciseId: null, exercises: [] },
      ],
    },
    {
      type: "listening",
      title: "Listening",
      parts: [
        { part: "part1", title: "Teil 1: Short Conversations", selectedExerciseId: null, exercises: [] },
        { part: "part2", title: "Teil 2: Dialogue", selectedExerciseId: null, exercises: [] },
        { part: "part3", title: "Teil 3: News & Announcements", selectedExerciseId: null, exercises: [] },
      ],
    },
    {
      type: "grammar",
      title: "Grammar",
      parts: [
        { part: "part1", title: "Teil 1: Fill in the Blanks", selectedExerciseId: null, exercises: [] },
        { part: "part2", title: "Teil 2: Word Formation", selectedExerciseId: null, exercises: [] },
      ],
    },
    {
      type: "writing",
      title: "Writing",
      parts: [{ part: "part1", title: "Teil 1: Writing Task", selectedExerciseId: null, exercises: [] }],
    },
  ])
  const [currentSection, setCurrentSection] = useState(0)
  const [currentPart, setCurrentPart] = useState(0)
  const [isTestReady, setIsTestReady] = useState(false)
  const [writingChoice, setWritingChoice] = useState<number | null>(null)
  const [showAnswers, setShowAnswers] = useState(false)

  // Load exercises for each section and part
  useEffect(() => {
    const updatedSections = [...sections]

    updatedSections.forEach((section, sectionIndex) => {
      section.parts.forEach((part, partIndex) => {
        // For writing, we'll combine both part1 and part2 exercises
        const exerciseType =
          section.type === "writing"
            ? getExercisesByTypeAndPart(section.type, "part1").concat(getExercisesByTypeAndPart(section.type, "part2"))
            : getExercisesByTypeAndPart(section.type, part.part)

        updatedSections[sectionIndex].parts[partIndex].exercises = exerciseType.map((ex) => ({
          id: ex.id,
          type: ex.type,
          part: ex.part,
          title: ex.title,
        }))
      })
    })

    setSections(updatedSections)
  }, [])

  const selectExercise = (sectionIndex: number, partIndex: number, exerciseId: string) => {
    const updatedSections = [...sections]
    updatedSections[sectionIndex].parts[partIndex].selectedExerciseId = exerciseId
    setSections(updatedSections)
  }

  const getSelectedExercise = (sectionIndex: number, partIndex: number) => {
    const section = sections[sectionIndex]
    if (!section) return null

    const part = section.parts[partIndex]
    if (!part) return null

    const exerciseId = part.selectedExerciseId
    if (!exerciseId) return null

    // First try to find it in our local exercises array
    const localExercise = part.exercises.find((ex) => ex.id === exerciseId)
    if (localExercise) return localExercise

    // If not found locally, try to get it directly from storage
    // This is a fallback in case the exercises array wasn't properly loaded
    return { id: exerciseId, type: section.type, part: part.part, title: "Exercise" }
  }

  // Randomly select exercises for each part
  const selectRandomExercises = () => {
    const updatedSections = [...sections]
    let allPartsHaveExercises = true

    updatedSections.forEach((section, sectionIndex) => {
      section.parts.forEach((part, partIndex) => {
        const { exercises } = part
        if (exercises.length > 0) {
          // Randomly select an exercise
          const randomIndex = Math.floor(Math.random() * exercises.length)
          updatedSections[sectionIndex].parts[partIndex].selectedExerciseId = exercises[randomIndex].id
        } else {
          // No exercises available for this part
          allPartsHaveExercises = false
          console.warn(`No exercises available for ${section.type} ${part.part}`)
        }
      })
    })

    setSections(updatedSections)
    return allPartsHaveExercises
  }

  const startTest = () => {
    setIsTestReady(true)
    setShowAnswers(false)
    // Save test state to localStorage
    localStorage.setItem(
      "currentTest",
      JSON.stringify({
        sections,
        currentSection,
        currentPart,
        isTestReady: true,
        writingChoice,
        showAnswers,
      }),
    )
  }

  const completeTest = () => {
    setShowAnswers(true)
    // Update test state in localStorage
    localStorage.setItem(
      "currentTest",
      JSON.stringify({
        sections,
        currentSection,
        currentPart,
        isTestReady,
        writingChoice,
        showAnswers: true,
      }),
    )
  }

  const resetTest = () => {
    const updatedSections = [...sections]
    updatedSections.forEach((section, sectionIndex) => {
      section.parts.forEach((part, partIndex) => {
        updatedSections[sectionIndex].parts[partIndex].selectedExerciseId = null
      })
    })
    setSections(updatedSections)
    setCurrentSection(0)
    setCurrentPart(0)
    setIsTestReady(false)
    setWritingChoice(null)
    setShowAnswers(false)
    // Clear test state from localStorage
    localStorage.removeItem("currentTest")
  }

  // Load test state from localStorage if available
  useEffect(() => {
    const savedTest = localStorage.getItem("currentTest")
    if (savedTest) {
      try {
        const {
          sections: savedSections,
          currentSection: savedCurrentSection,
          currentPart: savedCurrentPart,
          isTestReady: savedIsTestReady,
          writingChoice: savedWritingChoice,
          showAnswers: savedShowAnswers,
        } = JSON.parse(savedTest)
        setSections(savedSections)
        setCurrentSection(savedCurrentSection)
        setCurrentPart(savedCurrentPart)
        setIsTestReady(savedIsTestReady)
        if (savedWritingChoice !== undefined) {
          setWritingChoice(savedWritingChoice)
        }
        if (savedShowAnswers !== undefined) {
          setShowAnswers(savedShowAnswers)
        }
      } catch (error) {
        console.error("Error loading saved test:", error)
        localStorage.removeItem("currentTest")
      }
    }
  }, [])

  return (
    <TestContext.Provider
      value={{
        sections,
        currentSection,
        currentPart,
        setCurrentSection,
        setCurrentPart,
        selectExercise,
        getSelectedExercise,
        isTestReady,
        startTest,
        completeTest,
        resetTest,
        selectRandomExercises,
        writingChoice,
        setWritingChoice,
        showAnswers,
        setShowAnswers,
      }}
    >
      {children}
    </TestContext.Provider>
  )
}

export function useTest() {
  const context = useContext(TestContext)
  if (context === undefined) {
    throw new Error("useTest must be used within a TestProvider")
  }
  return context
}

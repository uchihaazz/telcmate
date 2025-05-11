"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

// Sortable item component for drag and drop
function SortableItem({ id, word }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-gray-300 rounded-md p-2 mb-2 cursor-move shadow-sm hover:shadow-md transition-shadow"
    >
      {word}
    </div>
  )
}

// Droppable area component
function DroppableArea({ id, children, className }) {
  return (
    <div id={id} className={`p-3 rounded-md ${className}`}>
      {children}
    </div>
  )
}

export default function GrammarExercise({ exercise, showAnswers }) {
  const [answers, setAnswers] = useState({})
  const [dragItems, setDragItems] = useState([])
  const [dropItems, setDropItems] = useState([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    if (exercise.part === "part2") {
      // Initialize drag items with the word bank
      setDragItems(exercise.wordBank.map((word, index) => ({ id: `word-${index}`, word })))
      // Initialize drop items as empty
      setDropItems([])
    }
  }, [exercise])

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      // If dragging between the word bank and the drop area
      if (active.id.toString().startsWith("word-") && over.id === "drop-area") {
        // Move from word bank to drop area
        const activeItem = dragItems.find((item) => item.id === active.id)
        if (activeItem) {
          setDragItems(dragItems.filter((item) => item.id !== active.id))
          setDropItems([...dropItems, activeItem])
        }
      } else if (active.id.toString().startsWith("word-") && over.id.toString().startsWith("word-")) {
        // Reordering within the word bank
        const oldIndex = dragItems.findIndex((item) => item.id === active.id)
        const newIndex = dragItems.findIndex((item) => item.id === over.id)
        setDragItems(arrayMove(dragItems, oldIndex, newIndex))
      } else if (over.id === "word-bank") {
        // Move from drop area back to word bank
        const activeItem = dropItems.find((item) => item.id === active.id)
        if (activeItem) {
          setDropItems(dropItems.filter((item) => item.id !== active.id))
          setDragItems([...dragItems, activeItem])
        }
      }
    }
  }

  if (exercise.part === "part1") {
    // Fill in the Blanks Exercise
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {exercise.textWithBlanks.map((segment, index) => {
            if (segment.type === "text") {
              return <span key={index}>{segment.content}</span>
            } else if (segment.type === "blank") {
              const blankIndex = segment.blankIndex
              const correctAnswer = exercise.blanks[blankIndex].correctAnswer
              const isCorrect = answers[blankIndex] === correctAnswer

              return (
                <Select
                  key={index}
                  value={answers[blankIndex] || ""}
                  onValueChange={(value) => setAnswers({ ...answers, [blankIndex]: value })}
                  disabled={showAnswers}
                >
                  <SelectTrigger
                    className={`w-40 inline-block mx-1 ${
                      showAnswers ? (isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : ""
                    }`}
                  >
                    <SelectValue placeholder={`Blank ${blankIndex + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {exercise.blanks[blankIndex].options.map((option, oIndex) => (
                      <SelectItem key={oIndex} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }
            return null
          })}
        </div>

        {showAnswers && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium mb-2 text-blue-800">Correct Answers:</h3>
            <ul className="list-disc list-inside space-y-1">
              {exercise.blanks.map((blank, index) => (
                <li key={index} className="text-blue-700">
                  Blank {index + 1}: <span className="font-medium">{blank.correctAnswer}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  if (exercise.part === "part2") {
    // Word Formation Exercise (Drag and Drop)
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="mb-4">
            {exercise.instructions || "Drag the words from the word bank to form the correct sentences."}
          </p>

          <div className="text-content mb-6">
            {exercise.textWithBlanks.map((segment, index) => {
              if (segment.type === "text") {
                return <span key={index}>{segment.content}</span>
              } else if (segment.type === "blank") {
                const blankIndex = segment.blankIndex
                const correctAnswer = exercise.blanks ? exercise.blanks[blankIndex]?.correctAnswer : null

                return (
                  <span
                    key={index}
                    className={`inline-block mx-1 px-3 py-1 border border-dashed rounded-md min-w-[100px] ${
                      showAnswers ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    {showAnswers
                      ? correctAnswer
                      : dropItems[blankIndex]
                        ? dropItems[blankIndex].word
                        : `[Blank ${blankIndex + 1}]`}
                  </span>
                )
              }
              return null
            })}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Word Bank</h3>
                <DroppableArea id="word-bank" className="bg-gray-50 min-h-[200px]">
                  <SortableContext items={dragItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                    {dragItems.map((item) => (
                      <SortableItem key={item.id} id={item.id} word={item.word} />
                    ))}
                  </SortableContext>
                </DroppableArea>
              </div>

              <div>
                <h3 className="font-medium mb-2">Your Answer</h3>
                <DroppableArea id="drop-area" className="bg-blue-50 min-h-[200px]">
                  <SortableContext items={dropItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                    {dropItems.map((item) => (
                      <SortableItem key={item.id} id={item.id} word={item.word} />
                    ))}
                  </SortableContext>
                </DroppableArea>
              </div>
            </div>
          </DndContext>
        </div>

        {showAnswers && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium mb-2 text-blue-800">Correct Answers:</h3>
            <ul className="list-disc list-inside space-y-1">
              {exercise.blanks &&
                exercise.blanks.map((blank, index) => (
                  <li key={index} className="text-blue-700">
                    Blank {index + 1}: <span className="font-medium">{blank.correctAnswer}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return <div>Unsupported grammar exercise type</div>
}

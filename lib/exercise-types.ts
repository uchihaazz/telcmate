export interface BaseExercise {
  id: string;
  type: 'reading' | 'listening' | 'grammar' | 'writing';
  part: 'part1' | 'part2' | 'part3';
  title: string;
  description: string;
  timeLimit: number;
}

export interface ReadingPart1Exercise extends BaseExercise {
  type: 'reading';
  part: 'part1';
  texts: Array<{
    content: string;
    correctTitle: string;
  }>;
}

export interface ReadingPart2Exercise extends BaseExercise {
  type: 'reading';
  part: 'part2';
  content: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export interface ReadingPart3Exercise extends BaseExercise {
  type: 'reading';
  part: 'part3';
  content: string[];
  options: string[];
  correctAnswers: number[];
}

export interface ListeningExercise extends BaseExercise {
  type: 'listening';
  audioUrl: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  transcript?: string;
}

export interface GrammarPart1Exercise extends BaseExercise {
  type: 'grammar';
  part: 'part1';
  textWithBlanks: string;
  blanks: Array<{
    options: string[];
    correctAnswer: number;
  }>;
}

export interface GrammarPart2Exercise extends BaseExercise {
  type: 'grammar';
  part: 'part2';
  textWithBlanks: string;
  blanks: Array<{
    correctWord: string;
  }>;
  wordBank: string[];
}

export interface WritingExercise extends BaseExercise {
  type: 'writing';
  prompt: string;
  evaluationCriteria: string[];
}

export type Exercise =
  | ReadingPart1Exercise
  | ReadingPart2Exercise
  | ReadingPart3Exercise
  | ListeningExercise
  | GrammarPart1Exercise
  | GrammarPart2Exercise
  | WritingExercise; 
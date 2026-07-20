// Zentrale Datentypen der App. Content (Items) und Lernfortschritt (UserState)
// sind strikt getrennt und werden nur über die deterministische item.id verknüpft —
// ein erneuter Ingest überschreibt dadurch nie den Lernfortschritt (06-App-Datenmodell.md).

export type ItemType = 'flashcard' | 'calc' | 'trace'
export type Ap1Status = 'core' | 'supporting' | 'ap2-grundlagen'
export type Grade = 1 | 2 | 3 | 4

export interface FlashcardItem {
  id: string
  topicId: string
  type: 'flashcard'
  tags: string[]
  examFrequency: number
  ap1Status: Ap1Status
  peripheral?: boolean // AP1-Randstoff: kann drankommen, aber peripher/seltener — bleibt voll sichtbar, nur markiert
  operator: string | null
  afb: string | null
  points: number | null
  front: string
  back: string
  source: string
}

export interface RubricEntry {
  criterion: string
  points: number
}

export interface CalcItem {
  id: string
  topicId: string
  type: 'calc'
  tags: string[]
  examFrequency: number
  ap1Status: Ap1Status
  peripheral?: boolean
  operator: 'berechnen'
  afb: string
  points: number
  prompt: string
  solutionSteps: string[]
  answer: string
  unit: string
  rubric: RubricEntry[]
  pitfalls: string[]
  source: string
}

export interface TraceItem {
  id: string
  topicId: string
  type: 'trace'
  tags: string[]
  examFrequency: number
  ap1Status: Ap1Status
  peripheral?: boolean
  operator: 'entwickeln'
  afb: string
  points: number
  prompt: string
  pseudocode: string[] // Zeilen des Pseudocodes
  columns: string[] // Spalten der Wertetabelle (Variablen, ggf. Schritt-Label)
  rows: string[][] // Muster-Wertetabelle, jede Zeile aligned zu columns
  output: string
  rubric: RubricEntry[]
  pitfalls: string[]
  source: string
}

export type Item = FlashcardItem | CalcItem | TraceItem

export interface ReviewEntry {
  date: string // ISO YYYY-MM-DD
  grade: Grade
}

/** SM-2-Lernzustand pro Item — lokal in IndexedDB (Dexie). */
export interface UserState {
  itemId: string
  ef: number
  interval: number
  reps: number
  due: string // ISO YYYY-MM-DD
  lastReviewed: string | null
  history: ReviewEntry[]
}

export interface Topic {
  id: string
  label: string
  examFrequency: number
  ap1Status: Ap1Status
}

export interface OperatorInfo {
  operator: string
  afb: string
  expectation: string
}

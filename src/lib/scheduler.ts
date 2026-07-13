import type { CalcItem, FlashcardItem, Item, UserState } from '../types'
import { ALL_ITEMS, CALCS, FLASHCARDS, flashcardsByTopic } from '../data/content'
import { todayISO } from './date'
import { isMastered } from './mastery'

// Session-Aufbau: Fälligkeit (SM-2), Interleaving (Themen mischen statt Blocklernen)
// und Prüfungssimulation (4 unabhängige Aufgabenbereiche). 05-Lernstrategie.md.

/** Fisher-Yates-Shuffle (nicht mutierend). */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Interleaving: verteilt Items so, dass aufeinanderfolgende möglichst aus
 * verschiedenen Themen stammen (Round-Robin über gemischte Themen-Buckets).
 */
export function interleaveByTopic<T extends { topicId: string }>(items: readonly T[]): T[] {
  const buckets = new Map<string, T[]>()
  for (const it of items) {
    const b = buckets.get(it.topicId) ?? []
    b.push(it)
    buckets.set(it.topicId, b)
  }
  const order = shuffle([...buckets.values()].map((b) => shuffle(b)))
  const out: T[] = []
  let added = true
  while (added) {
    added = false
    for (const b of order) {
      const next = b.shift()
      if (next) {
        out.push(next)
        added = true
      }
    }
  }
  return out
}

export function isDueOrNew(item: Item, states: Map<string, UserState>, today: string): boolean {
  const st = states.get(item.id)
  if (!st) return true // neue Karte = sofort fällig
  return st.due <= today
}

export function dueItems(
  states: Map<string, UserState>,
  today = todayISO(),
  coreOnly = false,
): Item[] {
  return ALL_ITEMS.filter(
    (i) => (!coreOnly || i.ap1Status === 'core') && isDueOrNew(i, states, today),
  )
}

export function dueCount(
  states: Map<string, UserState>,
  today = todayISO(),
  coreOnly = false,
): number {
  return dueItems(states, today, coreOnly).length
}

/** Karteikarten-SR-Session: fällige + neue Karten, interleaved. Optional gedeckelt. */
export function buildFlashcardSession(
  states: Map<string, UserState>,
  limit = 40,
  today = todayISO(),
  coreOnly = false,
): FlashcardItem[] {
  const due = FLASHCARDS.filter(
    (i) => (!coreOnly || i.ap1Status === 'core') && isDueOrNew(i, states, today),
  )
  return interleaveByTopic(due).slice(0, limit)
}

/**
 * Themen-Quiz: über gewählte Themen, interleaved. Priorisiert ungesehene und
 * schwache Karten, füllt dann mit dem Rest auf.
 */
export function buildQuiz(
  topicIds: string[],
  count: number,
  states: Map<string, UserState>,
): FlashcardItem[] {
  const pool = topicIds.flatMap((t) => flashcardsByTopic(t))
  const priority: FlashcardItem[] = []
  const rest: FlashcardItem[] = []
  for (const it of pool) {
    const st = states.get(it.id)
    if (!st || st.reps === 0 || !isMastered(st)) priority.push(it)
    else rest.push(it)
  }
  const picked = [...interleaveByTopic(priority), ...interleaveByTopic(rest)].slice(0, count)
  return interleaveByTopic(picked)
}

// ---- Prüfungssimulation -------------------------------------------------

export const FLASHCARD_EXAM_POINTS = 4

export interface ExamQuestion {
  item: Item
  maxPoints: number
}

export interface ExamArea {
  title: string
  questions: ExamQuestion[]
}

export interface Exam {
  areas: ExamArea[]
  totalPoints: number
  durationMin: number
}

const AREA_DEFS: { title: string; topics: string[]; calcTopics: string[] }[] = [
  { title: 'Aufgabenbereich 1 — Arbeitsplatz: Hardware & Netzwerk', topics: ['hardware', 'netzwerke'], calcTopics: ['netzwerke', 'hardware'] },
  { title: 'Aufgabenbereich 2 — Wirtschaftlichkeit & Beschaffung', topics: ['wirtschaftlichkeit', 'kommunikation'], calcTopics: ['wirtschaftlichkeit'] },
  { title: 'Aufgabenbereich 3 — Softwareentwicklung & Qualität', topics: ['softwareentwicklung', 'projektmanagement', 'qs-vertraege'], calcTopics: ['betriebssysteme'] },
  { title: 'Aufgabenbereich 4 — Sicherheit, Datenschutz & Neu 2025', topics: ['it-sicherheit', 'datenschutz', 'neu-2025'], calcTopics: ['neu-2025'] },
]

function pickN<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

/** Baut eine Prüfung: 4 unabhängige Aufgabenbereiche, je ~1 Rechenaufgabe + Wissensfragen. */
export function buildExam(): Exam {
  const usedCalc = new Set<string>()
  const areas: ExamArea[] = AREA_DEFS.map((def) => {
    const questions: ExamQuestion[] = []

    // eine Rechenaufgabe pro Bereich (falls verfügbar)
    const calcPool = CALCS.filter((c) => def.calcTopics.includes(c.topicId) && !usedCalc.has(c.id))
    const calc = pickN(calcPool, 1)[0] as CalcItem | undefined
    if (calc) {
      usedCalc.add(calc.id)
      questions.push({ item: calc, maxPoints: calc.points })
    }

    // fünf Wissensfragen aus den Bereichs-Themen
    const fcPool = def.topics.flatMap((t) => flashcardsByTopic(t))
    for (const fc of pickN(fcPool, 5)) {
      questions.push({ item: fc, maxPoints: FLASHCARD_EXAM_POINTS })
    }
    return { title: def.title, questions }
  })

  const totalPoints = areas.reduce(
    (sum, a) => sum + a.questions.reduce((s, q) => s + q.maxPoints, 0),
    0,
  )
  return { areas, totalPoints, durationMin: 90 }
}

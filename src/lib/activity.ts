import type { UserState } from '../types'

// Aktivitäts-Log: EIN Ereignis je Antwort bzw. Runde aus ALLEN Modi — Karteikarten,
// Rechnen, Schreibtischtest, alle Drills, Prüfungssimulation, Prüfungsaufgaben.
// Grundlage für „heute", Aktivitätsstreifen/Heatmap, Streak, Tagesziel und Meilensteine.
// Vorher zählten nur Karteikarten-Bewertungen: ein reiner Drill- oder Prüfungstag war
// in Heatmap und Streak unsichtbar.

export interface ActivityEvent {
  ts: string // ISO-Zeitstempel
  date: string // YYYY-MM-DD (lokal)
  mode: string // 'Karteikarten' | 'Rechnen' | 'Schreibtischtest' | Drill-Name | Prüfungsart
  correct: number // richtige Antworten bzw. erreichte Punkte
  total: number // Antworten bzw. erreichbare Punkte
  topicId?: string
  typed?: boolean // Antwort wurde eingetippt (strengere Selbstprüfung als nur aufdecken)
}

export const ACTIVITY_CAP = 4000
export const EXAM_MODES = new Set(['Prüfungssimulation', 'Prüfungsaufgabe'])

/** Gewicht eines Ereignisses in „Antworten": eine Prüfung zählt als 1, sonst total. */
export function answersOf(ev: ActivityEvent): number {
  return EXAM_MODES.has(ev.mode) ? 1 : ev.total
}

/** Richtige Antworten: bei Prüfungen 1, wenn bestanden (≥ 50 %). */
export function correctOf(ev: ActivityEvent): number {
  if (EXAM_MODES.has(ev.mode)) return ev.total > 0 && ev.correct / ev.total >= 0.5 ? 1 : 0
  return ev.correct
}

export interface DayStats {
  answers: number
  correct: number
  events: number
}

export function statsForDate(log: ActivityEvent[], date: string): DayStats {
  let answers = 0
  let correct = 0
  let events = 0
  for (const ev of log) {
    if (ev.date !== date) continue
    answers += answersOf(ev)
    correct += correctOf(ev)
    events++
  }
  return { answers, correct, events }
}

export function perDayAnswers(log: ActivityEvent[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const ev of log) m.set(ev.date, (m.get(ev.date) ?? 0) + answersOf(ev))
  return m
}

export function totalAnswers(log: ActivityEvent[]): number {
  return log.reduce((s, ev) => s + answersOf(ev), 0)
}

/**
 * Einmalige Rückfüllung aus der Karteikarten-Historie (Stand vor Einführung des Logs),
 * damit Aktivitätsstreifen/Heatmap beim Umstieg nichts verlieren. Drills lassen sich
 * nicht rückfüllen (bisher ohne Datum gezählt).
 */
export function backfillFromStates(states: Map<string, UserState>): ActivityEvent[] {
  const out: ActivityEvent[] = []
  for (const st of states.values()) {
    for (const h of st.history) {
      out.push({
        ts: `${h.date}T12:00:00.000Z`,
        date: h.date,
        mode: 'Karteikarten',
        correct: h.grade >= 3 ? 1 : 0,
        total: 1,
      })
    }
  }
  out.sort((a, b) => a.ts.localeCompare(b.ts))
  return out.slice(-ACTIVITY_CAP)
}

// ---- Meilensteine: ehrlich, an echtes Lernen gebunden (keine XP-Ökonomie) ----

export interface Milestone {
  id: string
  title: string
  desc: string
}

export const MILESTONES: Milestone[] = [
  { id: 'antworten-50', title: 'Warmgelaufen', desc: '50 Antworten' },
  { id: 'antworten-250', title: 'Dranbleiber', desc: '250 Antworten' },
  { id: 'antworten-1000', title: 'Prüfungsmaschine', desc: '1000 Antworten' },
  { id: 'streak-7', title: 'Eine Woche', desc: '7 Tage in Folge gelernt' },
  { id: 'streak-30', title: 'Ein Monat', desc: '30 Tage in Folge gelernt' },
  { id: 'drill-perfekt', title: 'Fehlerfrei', desc: 'Eine Übungsrunde ohne einen Fehler' },
  { id: 'thema-80', title: 'Thema sitzt', desc: 'Erstes Thema zu 80 % gemeistert' },
  { id: 'exam-bestanden', title: 'Bestanden', desc: 'Prüfungssimulation mit ≥ 50 P' },
  { id: 'exam-sehr-gut', title: 'Sehr gut', desc: 'Prüfungssimulation mit ≥ 92 P' },
]

export const MILESTONE_BY_ID: Record<string, Milestone> = Object.fromEntries(
  MILESTONES.map((m) => [m.id, m]),
)

export interface MilestoneCtx {
  log: ActivityEvent[]
  streak: number
  topicMastered80: boolean
}

/** Alle aktuell erfüllten Meilensteine (Ids). */
export function achievedMilestones(ctx: MilestoneCtx): string[] {
  const total = totalAnswers(ctx.log)
  const perfect = ctx.log.some(
    (ev) => !EXAM_MODES.has(ev.mode) && ev.mode !== 'Karteikarten' && ev.total >= 3 && ev.correct === ev.total,
  )
  let examBest = 0
  for (const ev of ctx.log) {
    if (ev.mode === 'Prüfungssimulation' && ev.total > 0) examBest = Math.max(examBest, (ev.correct / ev.total) * 100)
  }
  const ids: string[] = []
  if (total >= 50) ids.push('antworten-50')
  if (total >= 250) ids.push('antworten-250')
  if (total >= 1000) ids.push('antworten-1000')
  if (ctx.streak >= 7) ids.push('streak-7')
  if (ctx.streak >= 30) ids.push('streak-30')
  if (perfect) ids.push('drill-perfekt')
  if (ctx.topicMastered80) ids.push('thema-80')
  if (examBest >= 50) ids.push('exam-bestanden')
  if (examBest >= 92) ids.push('exam-sehr-gut')
  return ids
}

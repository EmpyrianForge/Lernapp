import type { Item, Topic, UserState } from '../types'
import { TOPICS } from '../data/topics'
import { ALL_ITEMS, itemsByTopic } from '../data/content'

// Mastery pro Themengebiet (nicht global-%): „gemeistert" = Intervall über Schwelle
// UND die letzten N Antworten korrekt. Schwache Gebiete werden rot markiert und im
// Scheduler priorisiert (05-Lernstrategie.md).

const MASTERY_INTERVAL_THRESHOLD = 14 // Tage
const MASTERY_RECENT_N = 2
const GOOD_GRADE = 3 // Self-Grade ≥ 3 gilt als „gekonnt"

export function isMastered(state: UserState | undefined): boolean {
  if (!state || state.reps === 0) return false
  if (state.interval < MASTERY_INTERVAL_THRESHOLD) return false
  const recent = state.history.slice(-MASTERY_RECENT_N)
  return recent.length >= 1 && recent.every((r) => r.grade >= GOOD_GRADE)
}

export interface TopicMastery {
  topic: Topic
  total: number
  seen: number
  mastered: number
  fraction: number // 0..1, Anteil gemeisterter Items
  weak: boolean
}

export function topicMastery(topic: Topic, states: Map<string, UserState>): TopicMastery {
  const items = itemsByTopic(topic.id)
  let seen = 0
  let mastered = 0
  for (const it of items) {
    const st = states.get(it.id)
    if (st && st.reps > 0) seen++
    if (isMastered(st)) mastered++
  }
  const total = items.length
  const fraction = total === 0 ? 0 : mastered / total
  return { topic, total, seen, mastered, fraction, weak: fraction < 0.5 }
}

export function allTopicMastery(states: Map<string, UserState>): TopicMastery[] {
  return TOPICS.map((t) => topicMastery(t, states))
}

/**
 * Prüfungsreife-Score 0..100: nach examFrequency gewichteter Mittelwert der
 * Themen-Mastery. Spiegelt, wie gut die prüfungsrelevanten Gebiete sitzen.
 */
export function examReadiness(states: Map<string, UserState>): number {
  const masteries = allTopicMastery(states)
  let weightSum = 0
  let acc = 0
  for (const m of masteries) {
    const w = m.topic.examFrequency
    weightSum += w
    acc += w * m.fraction
  }
  return weightSum === 0 ? 0 : Math.round((acc / weightSum) * 100)
}

export interface Overview {
  totalItems: number
  seen: number
  mastered: number
  dueCount: number
}

export function overview(states: Map<string, UserState>, dueCount: number): Overview {
  let seen = 0
  let mastered = 0
  for (const it of ALL_ITEMS as Item[]) {
    const st = states.get(it.id)
    if (st && st.reps > 0) seen++
    if (isMastered(st)) mastered++
  }
  return { totalItems: ALL_ITEMS.length, seen, mastered, dueCount }
}

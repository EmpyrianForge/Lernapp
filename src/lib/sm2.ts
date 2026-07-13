// SM-2 Spaced-Repetition-Algorithmus (SuperMemo-2), deterministisch, ~20 Zeilen.
// Bewusst KEIN FSRS: für eine Solo-App mit fixer Deadline overkill (05-Lernstrategie.md).
//
// Selbstbewertung (Self-Grade) in der App: 1..4
//   1 = nicht gewusst · 2 = kaum · 3 = gut · 4 = perfekt
// Mapping auf SM-2-Qualität q (0..5): 1→2, 2→3, 3→4, 4→5.
// Nur Self-Grade 1 (q=2 < 3) löst einen Reset aus.

import type { Grade, UserState } from '../types'
import { EXAM_DATE, addDays, daysUntilExam, todayISO } from './date'

const EF_MIN = 1.3
export const EF_START = 2.5

export interface Sm2Core {
  ef: number
  interval: number
  reps: number
}

/** Neue Karte: sofort fällig, Standard-Easiness. */
export function initialState(itemId: string, today: string = todayISO()): UserState {
  return {
    itemId,
    ef: EF_START,
    interval: 0,
    reps: 0,
    due: today,
    lastReviewed: null,
    history: [],
  }
}

/** Ein SM-2-Schritt: alter Kernzustand + Self-Grade → neuer Kernzustand. */
export function sm2Next(prev: Sm2Core, grade: Grade): Sm2Core {
  const q = grade + 1 // 1..4 → 2..5
  const efPrime = prev.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const ef = Math.max(EF_MIN, Number(efPrime.toFixed(4)))

  if (q < 3) {
    return { ef, interval: 1, reps: 0 } // Reset (Self-Grade 1)
  }
  const reps = prev.reps + 1
  const interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(prev.interval * ef)
  return { ef, interval, reps }
}

/**
 * Fälligkeitsdatum aus einem Intervall.
 * - Harter Deadline-Cap: nie hinter den Prüfungstermin planen.
 * - Cram-Modus: in den letzten 14 Tagen Intervalle stauchen (halbieren),
 *   damit schwacher Stoff vor der Prüfung nochmal drankommt.
 */
export function dueFromInterval(interval: number, today: string = todayISO()): string {
  const left = daysUntilExam(today)
  let eff = interval
  if (left <= 14) eff = Math.max(1, Math.ceil(interval / 2))
  const due = addDays(today, eff)
  return due > EXAM_DATE ? EXAM_DATE : due
}

/** Vollständiger Review: liefert den neuen UserState (SM-2 + Datum + Historie). */
export function review(state: UserState, grade: Grade, today: string = todayISO()): UserState {
  const core = sm2Next({ ef: state.ef, interval: state.interval, reps: state.reps }, grade)
  return {
    ...state,
    ef: core.ef,
    interval: core.interval,
    reps: core.reps,
    due: dueFromInterval(core.interval, today),
    lastReviewed: today,
    history: [...state.history, { date: today, grade }],
  }
}

// Bundeseinheitlicher Blockschlüssel (100-Punkte-Basis) aus 00-Pruefungsrahmen.md.

export interface GradeInfo {
  note: number
  label: string
}

const SCALE: { min: number; note: number; label: string }[] = [
  { min: 92, note: 1, label: 'sehr gut' },
  { min: 81, note: 2, label: 'gut' },
  { min: 67, note: 3, label: 'befriedigend' },
  { min: 50, note: 4, label: 'ausreichend' },
  { min: 30, note: 5, label: 'mangelhaft' },
  { min: 0, note: 6, label: 'ungenügend' },
]

/** Note aus erreichten Punkten (auf 100-Punkte-Basis normiert). */
export function gradeForPoints(points: number, max = 100): GradeInfo {
  const normalized = max === 100 ? points : (points / max) * 100
  const row = SCALE.find((s) => normalized >= s.min) ?? SCALE[SCALE.length - 1]
  return { note: row.note, label: row.label }
}

export const PASS_THRESHOLD = 50
export const TARGET_POINTS = 92 // Ziel „sehr gut"

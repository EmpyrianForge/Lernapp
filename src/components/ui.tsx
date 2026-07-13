import type { Grade } from '../types'

// Kleine, wiederverwendbare UI-Bausteine.

/** Text mit erhaltenen Zeilenumbrüchen rendern (Antworten sind teils mehrzeilig). */
export function MultilineText({ text }: { text: string }) {
  return <span style={{ whiteSpace: 'pre-line' }}>{text}</span>
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function ScoreRing({ value, caption }: { value: number; caption?: string }) {
  const r = 52
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, value))
  const offset = c - (clamped / 100) * c
  const tone = clamped >= 75 ? 'var(--good)' : clamped >= 50 ? 'var(--warn)' : 'var(--bad)'
  return (
    <div className="ring">
      <svg viewBox="0 0 128 128" width="128" height="128" aria-hidden="true">
        <circle cx="64" cy="64" r={r} className="ring-track" />
        <circle
          cx="64"
          cy="64"
          r={r}
          className="ring-value"
          style={{ stroke: tone, strokeDasharray: c, strokeDashoffset: offset }}
        />
      </svg>
      <div className="ring-center">
        <strong>{clamped}</strong>
        <span>{caption ?? '%'}</span>
      </div>
    </div>
  )
}

const GRADE_META: Record<Grade, { label: string; hint: string; cls: string }> = {
  1: { label: 'Nicht gewusst', hint: '1', cls: 'g1' },
  2: { label: 'Kaum', hint: '2', cls: 'g2' },
  3: { label: 'Gut', hint: '3', cls: 'g3' },
  4: { label: 'Perfekt', hint: '4', cls: 'g4' },
}

export function GradeButtons({ onGrade }: { onGrade: (g: Grade) => void }) {
  return (
    <div className="grades" role="group" aria-label="Selbstbewertung">
      {([1, 2, 3, 4] as Grade[]).map((g) => (
        <button key={g} className={`grade ${GRADE_META[g].cls}`} onClick={() => onGrade(g)}>
          <kbd>{GRADE_META[g].hint}</kbd>
          <span>{GRADE_META[g].label}</span>
        </button>
      ))}
    </div>
  )
}

export function Pill({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <span className="pill" style={tone ? { background: tone } : undefined}>
      {children}
    </span>
  )
}

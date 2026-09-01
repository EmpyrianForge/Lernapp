import { useMemo } from 'react'
import { usePrefersReducedMotion } from '../lib/motion'

// Kurzer Konfetti-Regen für echte Erfolgsmomente (fehlerfreie Runde, Session
// geschafft). Reine CSS-Animation auf ein paar <span>, kein Canvas, keine Library —
// läuft einmal ab und blockiert nichts. Wer Bewegung reduziert, sieht nichts.

const TONES = [
  'var(--tone-indigo)', 'var(--tone-blue)', 'var(--tone-teal)',
  'var(--tone-amber)', 'var(--tone-rose)', 'var(--tone-purple)', 'var(--good)',
]

export function Confetti({ count = 28 }: { count?: number }) {
  const reduced = usePrefersReducedMotion()
  // Positionen einmalig würfeln, damit sie bei Re-Renders stabil bleiben.
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.45,
        duration: 1.5 + Math.random() * 1.1,
        drift: (Math.random() - 0.5) * 90,
        spin: 180 + Math.random() * 540,
        color: TONES[i % TONES.length],
        round: Math.random() < 0.35,
      })),
    [count],
  )
  if (reduced) return null

  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          className={`confetti-bit ${b.round ? 'round' : ''}`}
          style={
            {
              left: `${b.left}%`,
              background: b.color,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              '--drift': `${b.drift}px`,
              '--spin': `${b.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

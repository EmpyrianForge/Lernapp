import { useEffect, useRef, useState } from 'react'

// Kleine Animations-Helfer. Alles respektiert prefers-reduced-motion:
// wer Bewegung reduziert, sieht sofort den Endwert statt einer Animation.

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Weiches Auslaufen — schnell starten, sanft ankommen. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Zählt eine Zahl animiert auf den Zielwert hoch (Dashboard-Kennzahlen).
 * Ändert sich `target`, läuft die Animation vom aktuellen Stand weiter.
 */
export function useCountUp(target: number, durationMs = 850): number {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(reduced ? target : 0)
  const fromRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (reduced || durationMs <= 0) {
      setValue(target)
      return
    }
    const from = fromRef.current
    const delta = target - from
    if (delta === 0) return
    const start = performance.now()

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs)
      const v = from + delta * easeOut(p)
      const shown = Math.round(v)
      setValue(shown)
      fromRef.current = shown
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, durationMs, reduced])

  return value
}

/**
 * Liefert nach dem ersten Frame `true`. Damit lassen sich Balken/Ringe
 * von 0 auf ihren Wert animieren, statt fertig zu erscheinen.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return mounted
}

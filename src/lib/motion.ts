import { useEffect, useReducer, useRef, useState } from 'react'

// Kleine Animations-Helfer. Alles respektiert prefers-reduced-motion — ABER der Nutzer
// kann das in den Einstellungen überstimmen („Erfolgs-Effekte": Auto / An / Aus).
// Grund: wer im System „Bewegung reduzieren" aktiv hat, sah bisher keinerlei
// Belohnung (Konfetti, Hochzählen) — ohne Notausgang. 'on' zeigt die Effekte trotzdem,
// 'off' unterdrückt sie auch dann, wenn das System Bewegung erlaubt.

export type Effects = 'auto' | 'on' | 'off'

let effectsMode: Effects = 'auto'
const subscribers = new Set<() => void>()

/** Wird vom AppState gesetzt, sobald die Einstellung geladen ist oder sich ändert. */
export function setEffectsMode(m: Effects): void {
  if (m === effectsMode) return
  effectsMode = m
  subscribers.forEach((fn) => fn())
}

export function getEffectsMode(): Effects {
  return effectsMode
}

/** Rohe OS-Präferenz „Bewegung reduzieren" (ohne App-Schalter) — für den Hinweis in den Einstellungen. */
export function useOsReducedMotion(): boolean {
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

/** Effektiv reduziert? App-Schalter überstimmt die OS-Präferenz. */
export function usePrefersReducedMotion(): boolean {
  const os = useOsReducedMotion()
  const [, bump] = useReducer((x: number) => x + 1, 0)
  useEffect(() => {
    subscribers.add(bump)
    return () => {
      subscribers.delete(bump)
    }
  }, [])
  if (effectsMode === 'on') return false
  if (effectsMode === 'off') return true
  return os
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

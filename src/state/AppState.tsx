import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { FlashcardItem, Grade, UserState } from '../types'
import {
  getKV,
  loadAllStates,
  loadUserCards,
  putUserCard,
  removeUserCard,
  saveState,
  setKV,
} from '../db/db'
import { initialState, review as reviewSm2 } from '../lib/sm2'
import { addDays, todayISO } from '../lib/date'
import { dueCount } from '../lib/scheduler'
import { registerUserCards, USER_CARD_PREFIX } from '../data/content'
import { examReadiness } from '../lib/mastery'

export type Theme = 'system' | 'light' | 'dark'
export interface ReadinessPoint {
  date: string
  value: number
}

// Zentraler App-Zustand: hält den geladenen Lernfortschritt (UserState-Map) im
// Speicher, persistiert Änderungen nach IndexedDB und stellt abgeleitete Werte bereit.

interface AppStateValue {
  ready: boolean
  today: string
  states: Map<string, UserState>
  stateOf: (itemId: string) => UserState | undefined
  review: (itemId: string, grade: Grade) => Promise<void>
  streak: number
  dueTotal: number
  coreOnly: boolean
  setCoreOnly: (v: boolean) => void
  drillStats: DrillStats
  recordDrill: (type: string, correct: number, total: number) => void
  bookmarks: Set<string>
  toggleBookmark: (id: string) => void
  userCards: FlashcardItem[]
  addUserCard: (front: string, back: string, topicId: string) => Promise<void>
  deleteUserCard: (id: string) => Promise<void>
  theme: Theme
  setTheme: (t: Theme) => void
  fontScale: number
  setFontScale: (n: number) => void
  readinessHistory: ReadinessPoint[]
  lastExport: string | null
  markExported: () => void
  reloadStates: () => Promise<void>
}

export type DrillStats = Record<string, { correct: number; total: number }>

const Ctx = createContext<AppStateValue | null>(null)

const STREAK_KEY = 'streak'
const CORE_ONLY_KEY = 'coreOnly'
const DRILL_STATS_KEY = 'drillStats'
const BOOKMARKS_KEY = 'bookmarks'
const THEME_KEY = 'theme'
const FONT_SCALE_KEY = 'fontScale'
const READINESS_KEY = 'readinessHistory'
const LAST_EXPORT_KEY = 'lastExport'
interface StreakData {
  count: number
  lastStudy: string | null
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const today = todayISO()
  const [ready, setReady] = useState(false)
  const [states, setStates] = useState<Map<string, UserState>>(new Map())
  const [streak, setStreak] = useState(0)
  const [coreOnly, setCoreOnlyState] = useState(false)
  const [drillStats, setDrillStats] = useState<DrillStats>({})
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [userCards, setUserCards] = useState<FlashcardItem[]>([])
  const [theme, setThemeState] = useState<Theme>('system')
  const [fontScale, setFontScaleState] = useState(1)
  const [readinessHistory, setReadinessHistory] = useState<ReadinessPoint[]>([])
  const [lastExport, setLastExport] = useState<string | null>(null)

  const reloadStates = useCallback(async () => {
    const map = await loadAllStates()
    setStates(map)
  }, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      const map = await loadAllStates()
      const sd = (await getKV<StreakData>(STREAK_KEY)) ?? { count: 0, lastStudy: null }
      const core = (await getKV<boolean>(CORE_ONLY_KEY)) ?? false
      const ds = (await getKV<DrillStats>(DRILL_STATS_KEY)) ?? {}
      const bm = (await getKV<string[]>(BOOKMARKS_KEY)) ?? []
      const th = (await getKV<Theme>(THEME_KEY)) ?? 'system'
      const fs = (await getKV<number>(FONT_SCALE_KEY)) ?? 1
      const rh = (await getKV<ReadinessPoint[]>(READINESS_KEY)) ?? []
      const le = (await getKV<string>(LAST_EXPORT_KEY)) ?? null
      const cards = await loadUserCards()
      registerUserCards(cards)
      if (!active) return
      setStates(map)
      setCoreOnlyState(core)
      setDrillStats(ds)
      setBookmarks(new Set(bm))
      setThemeState(th)
      setFontScaleState(fs)
      setUserCards(cards)
      setLastExport(le)
      // Streak nur zeigen, wenn er noch „lebt" (letzter Lerntag >= vorgestern, 1 Tag Freeze-Kulanz).
      const alive = sd.lastStudy != null && sd.lastStudy >= addDays(today, -2)
      setStreak(alive ? sd.count : 0)
      // Prüfungsreife-Snapshot (ein Wert pro Tag) für die Verlaufskurve.
      const todayReadiness = examReadiness(map)
      const hist = rh.filter((p) => p.date !== today)
      hist.push({ date: today, value: todayReadiness })
      const trimmed = hist.slice(-120)
      setReadinessHistory(trimmed)
      void setKV(READINESS_KEY, trimmed)
      setReady(true)
    })()
    return () => {
      active = false
    }
  }, [today])

  const bumpStreak = useCallback(async () => {
    const sd = (await getKV<StreakData>(STREAK_KEY)) ?? { count: 0, lastStudy: null }
    if (sd.lastStudy === today) return // heute schon gezählt
    let count: number
    if (sd.lastStudy === addDays(today, -1)) count = sd.count + 1 // gestern → fortsetzen
    else if (sd.lastStudy === addDays(today, -2)) count = sd.count + 1 // 1 Tag Freeze-Kulanz
    else count = 1 // Lücke → Neustart
    const next: StreakData = { count, lastStudy: today }
    await setKV(STREAK_KEY, next)
    setStreak(count)
  }, [today])

  const review = useCallback(
    async (itemId: string, grade: Grade) => {
      const prev = states.get(itemId) ?? initialState(itemId, today)
      const next = reviewSm2(prev, grade, today)
      await saveState(next)
      setStates((prevMap) => {
        const m = new Map(prevMap)
        m.set(itemId, next)
        return m
      })
      await bumpStreak()
    },
    [states, today, bumpStreak],
  )

  const stateOf = useCallback((itemId: string) => states.get(itemId), [states])

  const setCoreOnly = useCallback((v: boolean) => {
    setCoreOnlyState(v)
    void setKV(CORE_ONLY_KEY, v)
  }, [])

  const recordDrill = useCallback((type: string, correct: number, total: number) => {
    setDrillStats((prev) => {
      const cur = prev[type] ?? { correct: 0, total: 0 }
      const next = { ...prev, [type]: { correct: cur.correct + correct, total: cur.total + total } }
      void setKV(DRILL_STATS_KEY, next)
      return next
    })
  }, [])

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      void setKV(BOOKMARKS_KEY, [...next])
      return next
    })
  }, [])

  const addUserCard = useCallback(
    async (front: string, back: string, topicId: string) => {
      const slug = front.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
      const id = `${USER_CARD_PREFIX}${topicId}--${slug || 'karte'}-${Date.now()}`
      const card: FlashcardItem = {
        id,
        topicId,
        type: 'flashcard',
        tags: ['ap1', 'eigen', topicId],
        examFrequency: 0.5,
        ap1Status: 'supporting',
        operator: null,
        afb: null,
        points: null,
        front: front.trim(),
        back: back.trim(),
        source: 'Eigene Karte',
      }
      await putUserCard(card)
      const next = [...userCards, card]
      registerUserCards(next)
      setUserCards(next)
    },
    [userCards],
  )

  const deleteUserCard = useCallback(
    async (id: string) => {
      await removeUserCard(id)
      const next = userCards.filter((c) => c.id !== id)
      registerUserCards(next)
      setUserCards(next)
      setStates((prev) => {
        if (!prev.has(id)) return prev
        const m = new Map(prev)
        m.delete(id)
        return m
      })
    },
    [userCards],
  )

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    void setKV(THEME_KEY, t)
  }, [])

  const setFontScale = useCallback((n: number) => {
    setFontScaleState(n)
    void setKV(FONT_SCALE_KEY, n)
  }, [])

  const markExported = useCallback(() => {
    const d = todayISO()
    setLastExport(d)
    void setKV(LAST_EXPORT_KEY, d)
  }, [])

  // Theme + Schriftgröße auf das Wurzelelement anwenden.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    root.style.fontSize = `${Math.round(fontScale * 100)}%`
  }, [theme, fontScale])

  const dueTotal = useMemo(() => dueCount(states, today, coreOnly), [states, today, coreOnly])

  const value = useMemo<AppStateValue>(
    () => ({
      ready, today, states, stateOf, review, streak, dueTotal,
      coreOnly, setCoreOnly, drillStats, recordDrill,
      bookmarks, toggleBookmark, userCards, addUserCard, deleteUserCard,
      theme, setTheme, fontScale, setFontScale, readinessHistory, lastExport, markExported,
      reloadStates,
    }),
    [
      ready, today, states, stateOf, review, streak, dueTotal,
      coreOnly, setCoreOnly, drillStats, recordDrill,
      bookmarks, toggleBookmark, userCards, addUserCard, deleteUserCard,
      theme, setTheme, fontScale, setFontScale, readinessHistory, lastExport, markExported,
      reloadStates,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppState(): AppStateValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAppState außerhalb des AppStateProvider verwendet')
  return v
}

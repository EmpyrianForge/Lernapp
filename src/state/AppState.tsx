import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cloudGet, cloudHealth, cloudPut, type CloudResult } from '../lib/cloud'
import { exportJSON, importJSON } from '../db/db'
import type { FlashcardItem, Grade, Track, UserState } from '../types'
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
import { ITEM_BY_ID, registerUserCards, setActiveTrack, USER_CARD_PREFIX } from '../data/content'
import { allTopicMastery, examReadiness } from '../lib/mastery'
import {
  ACTIVITY_CAP,
  achievedMilestones,
  backfillFromStates,
  MILESTONE_BY_ID,
  statsForDate,
  type ActivityEvent,
} from '../lib/activity'
import { setEffectsMode, useOsReducedMotion, type Effects } from '../lib/motion'

export type Theme = 'system' | 'light' | 'dark'
export interface ReadinessPoint {
  date: string
  value: number
}
export interface ToastMsg {
  title: string
  desc: string
}
export type ExamKind = 'Prüfungssimulation' | 'Prüfungsaufgabe'

// Zentraler App-Zustand: hält den geladenen Lernfortschritt (UserState-Map) im
// Speicher, persistiert Änderungen nach IndexedDB und stellt abgeleitete Werte bereit.
// Neu: ein Aktivitäts-Log über ALLE Modi (lib/activity.ts) speist Streak, „heute",
// Tagesziel und Meilensteine — jede Antwort zählt, nicht nur Karteikarten.

interface AppStateValue {
  ready: boolean
  today: string
  track: Track
  setTrack: (t: Track) => void
  states: Map<string, UserState>
  stateOf: (itemId: string) => UserState | undefined
  review: (itemId: string, grade: Grade) => Promise<void>
  streak: number
  dueTotal: number
  coreOnly: boolean
  setCoreOnly: (v: boolean) => void
  drillStats: DrillStats
  recordDrill: (type: string, correct: number, total: number) => void
  recordExam: (kind: ExamKind, points: number, max: number, topicId?: string) => void
  activity: ActivityEvent[]
  dailyGoal: number
  setDailyGoal: (n: number) => void
  milestones: Record<string, string> // id -> Datum (YYYY-MM-DD) des Erreichens
  toast: ToastMsg | null
  dismissToast: () => void
  effects: Effects
  setEffects: (e: Effects) => void
  osReducedMotion: boolean
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
  cloudUrl: string
  cloudKey: string
  cloudAuto: boolean
  lastCloudBackup: string | null
  setCloudConfig: (url: string, key: string) => void
  setCloudAuto: (v: boolean) => void
  cloudTest: () => Promise<CloudResult>
  cloudBackup: () => Promise<CloudResult>
  cloudRestore: () => Promise<CloudResult>
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
const CLOUD_URL_KEY = 'cloudUrl'
const CLOUD_KEY_KEY = 'cloudKey'
const CLOUD_AUTO_KEY = 'cloudAuto'
const LAST_CLOUD_KEY = 'lastCloudBackup'
const ACTIVITY_KEY = 'activityLog'
const GOAL_KEY = 'dailyGoal'
const GOAL_DONE_KEY = 'goalCelebrated'
const MILESTONES_KEY = 'milestones'
const EFFECTS_KEY = 'effects'
const DEFAULT_GOAL = 30

interface StreakData {
  count: number
  lastStudy: string | null
}

function modeOfItem(itemId: string): { mode: string; topicId?: string } {
  const it = ITEM_BY_ID.get(itemId)
  const mode = it?.type === 'calc' ? 'Rechnen' : it?.type === 'trace' ? 'Schreibtischtest' : 'Karteikarten'
  return { mode, topicId: it?.topicId }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const today = todayISO()
  const [ready, setReady] = useState(false)
  const [track, setTrackState] = useState<Track>('ap1')
  const [states, setStates] = useState<Map<string, UserState>>(new Map())
  const [streak, setStreak] = useState(0)
  const [coreOnly, setCoreOnlyState] = useState(false)
  const [drillStats, setDrillStats] = useState<DrillStats>({})
  const [activity, setActivity] = useState<ActivityEvent[]>([])
  const [dailyGoal, setDailyGoalState] = useState(DEFAULT_GOAL)
  const [goalDone, setGoalDone] = useState<string | null>(null)
  const [milestones, setMilestones] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<ToastMsg | null>(null)
  const [effects, setEffectsState] = useState<Effects>('auto')
  const osReducedMotion = useOsReducedMotion()
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [userCards, setUserCards] = useState<FlashcardItem[]>([])
  const [theme, setThemeState] = useState<Theme>('system')
  const [fontScale, setFontScaleState] = useState(1)
  const [readinessHistory, setReadinessHistory] = useState<ReadinessPoint[]>([])
  const [lastExport, setLastExport] = useState<string | null>(null)
  const [cloudUrl, setCloudUrlState] = useState('')
  const [cloudKey, setCloudKeyState] = useState('')
  const [cloudAuto, setCloudAutoState] = useState(false)
  const [lastCloudBackup, setLastCloudBackup] = useState<string | null>(null)
  const autoTimer = useRef<number | null>(null)
  const firstMilestoneEval = useRef(true)

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
      const cUrl = (await getKV<string>(CLOUD_URL_KEY)) ?? ''
      const cKey = (await getKV<string>(CLOUD_KEY_KEY)) ?? ''
      const cAuto = (await getKV<boolean>(CLOUD_AUTO_KEY)) ?? false
      const cLast = (await getKV<string>(LAST_CLOUD_KEY)) ?? null
      const goal = (await getKV<number>(GOAL_KEY)) ?? DEFAULT_GOAL
      const gDone = (await getKV<string>(GOAL_DONE_KEY)) ?? null
      const ms = (await getKV<Record<string, string>>(MILESTONES_KEY)) ?? {}
      const ef = (await getKV<Effects>(EFFECTS_KEY)) ?? 'auto'
      // Aktivitäts-Log: beim ersten Start aus der Karteikarten-Historie rückfüllen,
      // damit Streifen/Heatmap beim Umstieg nichts verlieren.
      let al = await getKV<ActivityEvent[]>(ACTIVITY_KEY)
      if (!al) {
        al = backfillFromStates(map)
        await setKV(ACTIVITY_KEY, al)
      }
      const cards = await loadUserCards()
      registerUserCards(cards)
      if (!active) return
      setStates(map)
      setCoreOnlyState(core)
      setDrillStats(ds)
      setActivity(al)
      setDailyGoalState(goal)
      setGoalDone(gDone)
      setMilestones(ms)
      setEffectsState(ef)
      setBookmarks(new Set(bm))
      setThemeState(th)
      setFontScaleState(fs)
      setUserCards(cards)
      setLastExport(le)
      setCloudUrlState(cUrl)
      setCloudKeyState(cKey)
      setCloudAutoState(cAuto)
      setLastCloudBackup(cLast)
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

  // Jede Antwort/Runde aus jedem Modus landet hier — und zählt für den Streak.
  const logActivity = useCallback(
    (ev: Omit<ActivityEvent, 'ts' | 'date'>) => {
      const full: ActivityEvent = { ...ev, ts: new Date().toISOString(), date: today }
      setActivity((prev) => {
        const next = [...prev, full].slice(-ACTIVITY_CAP)
        void setKV(ACTIVITY_KEY, next)
        return next
      })
      void bumpStreak()
    },
    [today, bumpStreak],
  )

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
      const { mode, topicId } = modeOfItem(itemId)
      logActivity({ mode, correct: grade >= 3 ? 1 : 0, total: 1, topicId })
    },
    [states, today, logActivity],
  )

  const stateOf = useCallback((itemId: string) => states.get(itemId), [states])

  const setCoreOnly = useCallback((v: boolean) => {
    setCoreOnlyState(v)
    void setKV(CORE_ONLY_KEY, v)
  }, [])

  // Track wechseln (AP1 / AP2 / Hydra): den Content-Pool in-place auf den Track
  // filtern UND den React-State setzen -> Re-Render + abgeleitete Werte (dueTotal)
  // rechnen neu. Der Lernstand (states) ist per itemId getrennt, bleibt also erhalten.
  const setTrack = useCallback((t: Track) => {
    setActiveTrack(t)
    setTrackState(t)
  }, [])

  const recordDrill = useCallback(
    (type: string, correct: number, total: number) => {
      setDrillStats((prev) => {
        const cur = prev[type] ?? { correct: 0, total: 0 }
        const next = { ...prev, [type]: { correct: cur.correct + correct, total: cur.total + total } }
        void setKV(DRILL_STATS_KEY, next)
        return next
      })
      logActivity({ mode: type, correct, total })
    },
    [logActivity],
  )

  // Prüfungssimulation / Prüfungsaufgabe: Punkte gegen erreichbare Punkte.
  const recordExam = useCallback(
    (kind: ExamKind, points: number, max: number, topicId?: string) => {
      logActivity({ mode: kind, correct: points, total: max, topicId })
    },
    [logActivity],
  )

  const setDailyGoal = useCallback((n: number) => {
    setDailyGoalState(n)
    void setKV(GOAL_KEY, n)
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  const setEffects = useCallback((e: Effects) => {
    setEffectsState(e)
    void setKV(EFFECTS_KEY, e)
  }, [])

  // Effekte-Schalter an die Animations-Helfer und ans CSS (data-effects) durchreichen.
  useEffect(() => {
    setEffectsMode(effects)
    document.documentElement.dataset.effects = effects
  }, [effects])

  // Meilensteine: neu erreichte werden gespeichert und (außer beim ersten Durchlauf
  // nach dem Laden) mit einem Toast gefeiert.
  useEffect(() => {
    if (!ready) return
    const topicMastered80 = allTopicMastery(states).some((m) => m.total >= 5 && m.fraction >= 0.8)
    const achieved = achievedMilestones({ log: activity, streak, topicMastered80 })
    const fresh = achieved.filter((id) => !(id in milestones))
    if (fresh.length === 0) {
      firstMilestoneEval.current = false
      return
    }
    const next = { ...milestones }
    for (const id of fresh) next[id] = today
    setMilestones(next)
    void setKV(MILESTONES_KEY, next)
    if (firstMilestoneEval.current) {
      firstMilestoneEval.current = false // bereits Erreichtes still übernehmen
      return
    }
    const m = MILESTONE_BY_ID[fresh[0]]
    if (m) setToast({ title: `Meilenstein: ${m.title}`, desc: m.desc })
  }, [ready, activity, streak, states, milestones, today])

  // Tagesziel: einmal pro Tag feiern, sobald erreicht.
  useEffect(() => {
    if (!ready) return
    const s = statsForDate(activity, today)
    if (s.answers >= dailyGoal && goalDone !== today) {
      setGoalDone(today)
      void setKV(GOAL_DONE_KEY, today)
      setToast({ title: 'Tagesziel geschafft!', desc: `${s.answers} Antworten heute — weiter so.` })
    }
  }, [ready, activity, dailyGoal, goalDone, today])

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

  const setCloudConfig = useCallback((url: string, key: string) => {
    setCloudUrlState(url)
    setCloudKeyState(key)
    void setKV(CLOUD_URL_KEY, url)
    void setKV(CLOUD_KEY_KEY, key)
  }, [])

  const setCloudAuto = useCallback((v: boolean) => {
    setCloudAutoState(v)
    void setKV(CLOUD_AUTO_KEY, v)
  }, [])

  const cloudTest = useCallback(() => cloudHealth(cloudUrl), [cloudUrl])

  const cloudBackup = useCallback(async (): Promise<CloudResult> => {
    if (!cloudUrl || !cloudKey) return { ok: false, error: 'Nicht konfiguriert' }
    const blob = await exportJSON()
    const res = await cloudPut(cloudUrl, cloudKey, blob)
    if (res.ok) {
      const d = res.savedAt || todayISO()
      setLastCloudBackup(d)
      void setKV(LAST_CLOUD_KEY, d)
    }
    return res
  }, [cloudUrl, cloudKey])

  const cloudRestore = useCallback(async (): Promise<CloudResult> => {
    if (!cloudUrl || !cloudKey) return { ok: false, error: 'Nicht konfiguriert' }
    const res = await cloudGet(cloudUrl, cloudKey)
    if (res.ok && res.payload !== undefined) {
      await importJSON(JSON.stringify(res.payload))
      await reloadStates()
    }
    return { ok: res.ok, savedAt: res.savedAt, error: res.error }
  }, [cloudUrl, cloudKey, reloadStates])

  // Auto-Backup: 20 s nach der letzten Änderung sichern (entprellt), wenn aktiviert.
  useEffect(() => {
    if (!ready || !cloudAuto || !cloudUrl || !cloudKey) return
    if (autoTimer.current) window.clearTimeout(autoTimer.current)
    autoTimer.current = window.setTimeout(() => {
      void cloudBackup()
    }, 20000)
    return () => {
      if (autoTimer.current) window.clearTimeout(autoTimer.current)
    }
  }, [states, drillStats, activity, bookmarks, userCards, cloudAuto, cloudUrl, cloudKey, ready, cloudBackup])

  // Theme + Schriftgröße auf das Wurzelelement anwenden.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    root.style.fontSize = `${Math.round(fontScale * 100)}%`
  }, [theme, fontScale])

  const dueTotal = useMemo(() => dueCount(states, today, coreOnly), [states, today, coreOnly, track])

  const value = useMemo<AppStateValue>(
    () => ({
      ready, today, track, setTrack, states, stateOf, review, streak, dueTotal,
      coreOnly, setCoreOnly, drillStats, recordDrill, recordExam,
      activity, dailyGoal, setDailyGoal, milestones, toast, dismissToast,
      effects, setEffects, osReducedMotion,
      bookmarks, toggleBookmark, userCards, addUserCard, deleteUserCard,
      theme, setTheme, fontScale, setFontScale, readinessHistory, lastExport, markExported,
      cloudUrl, cloudKey, cloudAuto, lastCloudBackup, setCloudConfig, setCloudAuto,
      cloudTest, cloudBackup, cloudRestore,
      reloadStates,
    }),
    [
      ready, today, track, setTrack, states, stateOf, review, streak, dueTotal,
      coreOnly, setCoreOnly, drillStats, recordDrill, recordExam,
      activity, dailyGoal, setDailyGoal, milestones, toast, dismissToast,
      effects, setEffects, osReducedMotion,
      bookmarks, toggleBookmark, userCards, addUserCard, deleteUserCard,
      theme, setTheme, fontScale, setFontScale, readinessHistory, lastExport, markExported,
      cloudUrl, cloudKey, cloudAuto, lastCloudBackup, setCloudConfig, setCloudAuto,
      cloudTest, cloudBackup, cloudRestore,
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

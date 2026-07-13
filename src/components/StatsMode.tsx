import { useMemo } from 'react'
import type { Grade, Item } from '../types'
import { useAppState } from '../state/AppState'
import { ITEM_BY_ID } from '../data/content'
import { addDays, formatDE } from '../lib/date'
import { allTopicMastery } from '../lib/mastery'
import { ProgressBar } from './ui'
import { Icon } from './Icon'

function itemTitle(item: Item): string {
  const t = item.type === 'flashcard' ? item.front : item.prompt
  return t.length > 64 ? t.slice(0, 63) + '…' : t
}

// Statistik: Aktivitäts-Heatmap (letzte 12 Wochen), Antworten gesamt/heute,
// Noten-Verteilung, Mastery je Thema. Rein aus den lokalen UserState-Historien.

const WEEKS = 12
const DAYS = WEEKS * 7

function bucket(n: number): number {
  if (n === 0) return 0
  if (n <= 2) return 1
  if (n <= 5) return 2
  if (n <= 10) return 3
  return 4
}

function ReadinessChart({ points }: { points: { date: string; value: number }[] }) {
  const data = points.slice(-30)
  const n = data.length
  const W = 300, H = 80, pad = 6
  const x = (i: number) => (n <= 1 ? W / 2 : pad + (i / (n - 1)) * (W - 2 * pad))
  const y = (v: number) => H - pad - (v / 100) * (H - 2 * pad)
  const line = data.map((p, i) => `${x(i)},${y(p.value)}`).join(' ')
  const last = data[data.length - 1]
  return (
    <div className="readiness-chart">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="90" preserveAspectRatio="none" aria-label="Prüfungsreife-Verlauf">
        <line x1={pad} y1={y(50)} x2={W - pad} y2={y(50)} className="rc-base" strokeDasharray="3 3" />
        <polyline points={line} className="rc-line" fill="none" />
        <circle cx={x(n - 1)} cy={y(last.value)} r={3} className="rc-dot" />
      </svg>
      <p className="muted small">Aktuell {last.value}% · {n} {n === 1 ? 'Messpunkt' : 'Messpunkte'} (1×/Tag)</p>
    </div>
  )
}

export function StatsMode({ onExit }: { onExit: () => void }) {
  const { states, today, streak, drillStats, readinessHistory } = useAppState()

  const stats = useMemo(() => {
    const perDay = new Map<string, number>()
    const gradeDist: Record<Grade, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
    let total = 0
    for (const st of states.values()) {
      for (const h of st.history) {
        perDay.set(h.date, (perDay.get(h.date) ?? 0) + 1)
        gradeDist[h.grade]++
        total++
      }
    }
    // Heatmap-Tage: älteste zuerst, so ausgerichtet, dass „heute" die letzte Zelle ist.
    const days: { date: string; count: number }[] = []
    for (let k = DAYS - 1; k >= 0; k--) {
      const date = addDays(today, -k)
      days.push({ date, count: perDay.get(date) ?? 0 })
    }
    const activeDays = [...perDay.keys()].length
    return { perDay, gradeDist, total, days, todayCount: perDay.get(today) ?? 0, activeDays }
  }, [states, today])

  const masteries = allTopicMastery(states)
  const maxGrade = Math.max(1, ...(Object.values(stats.gradeDist) as number[]))

  const drillEntries = Object.entries(drillStats).filter(([, v]) => v.total > 0)

  const weakest = useMemo(() => {
    // „geübt" = hat Historie (auch Grade-1-Karten, die per SM-2-Reset reps=0 haben —
    // gerade die sind schwach und gehören hierher).
    const seen = [...states.values()].filter((s) => s.history.length > 0)
    return seen
      .map((s) => ({
        state: s,
        item: ITEM_BY_ID.get(s.itemId),
        lapses: s.history.filter((h) => h.grade === 1).length,
      }))
      .filter((w) => w.item)
      .sort((a, b) => b.lapses - a.lapses || a.state.ef - b.state.ef)
      .slice(0, 8)
  }, [states])

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>Statistik</h2>
      </header>

      <div className="stat-cards">
        <div className="mini-stat"><strong>{stats.total}</strong><span>Antworten gesamt</span></div>
        <div className="mini-stat"><strong>{stats.todayCount}</strong><span>heute</span></div>
        <div className="mini-stat"><strong>{stats.activeDays}</strong><span>aktive Tage</span></div>
        <div className="mini-stat"><strong className="streak-num">{streak}<Icon name="flame" size={16} className="streak-ico" /></strong><span>Streak</span></div>
      </div>

      {readinessHistory.length >= 2 && (
        <>
          <h3 className="sec">Prüfungsreife-Verlauf</h3>
          <ReadinessChart points={readinessHistory} />
        </>
      )}

      <h3 className="sec">Aktivität (letzte {WEEKS} Wochen)</h3>
      <div className="heatmap" role="img" aria-label={`Aktivität der letzten ${DAYS} Tage`}>
        {stats.days.map((d) => (
          <span
            key={d.date}
            className={`hm hm-${bucket(d.count)}`}
            title={`${formatDE(d.date)}: ${d.count} Antworten`}
          />
        ))}
      </div>
      <div className="heatmap-legend muted small">
        weniger
        <span className="hm hm-0" /><span className="hm hm-1" /><span className="hm hm-2" /><span className="hm hm-3" /><span className="hm hm-4" />
        mehr
      </div>

      <h3 className="sec">Noten-Verteilung (Selbstbewertung)</h3>
      <div className="grade-bars">
        {([1, 2, 3, 4] as Grade[]).map((g) => (
          <div key={g} className="grade-bar">
            <span className="gb-label">Note {g}</span>
            <div className="gb-track">
              <div className={`gb-fill g${g}`} style={{ width: `${(stats.gradeDist[g] / maxGrade) * 100}%` }} />
            </div>
            <span className="gb-num">{stats.gradeDist[g]}</span>
          </div>
        ))}
      </div>

      {drillEntries.length > 0 && (
        <>
          <h3 className="sec">Interaktive Übungen</h3>
          <div className="drill-stats">
            {drillEntries.map(([name, v]) => {
              const pct = Math.round((v.correct / v.total) * 100)
              return (
                <div key={name} className="drill-stat">
                  <span className="ds-name">{name}</span>
                  <div className="gb-track"><div className="gb-fill g4" style={{ width: `${pct}%` }} /></div>
                  <span className="ds-num">{pct}% · {v.correct}/{v.total}</span>
                </div>
              )
            })}
          </div>
        </>
      )}

      <h3 className="sec">Mastery je Thema</h3>
      <ul className="mastery-list">
        {masteries.map((m) => (
          <li key={m.topic.id} className={m.weak && m.seen > 0 ? 'weak' : ''}>
            <div className="mastery-top">
              <span className="mastery-name">{m.topic.label}</span>
              <span className="mastery-num muted small">{m.mastered}/{m.total} · gesehen {m.seen}</span>
            </div>
            <ProgressBar value={m.fraction} label={`${m.topic.label} Mastery`} />
          </li>
        ))}
      </ul>

      {weakest.length > 0 && (
        <>
          <h3 className="sec">Schwächste Karten</h3>
          <p className="muted small">Nach „nicht gewusst"-Antworten und Easiness sortiert — hier lohnt Wiederholung.</p>
          <ul className="weak-list">
            {weakest.map((w) => (
              <li key={w.state.itemId}>
                <span className="weak-front">{w.item ? itemTitle(w.item) : w.state.itemId}</span>
                <span className="weak-meta muted small">
                  EF {w.state.ef.toFixed(2)} · Intervall {w.state.interval}d · fällig {formatDE(w.state.due)}
                  {w.lapses > 0 && <span className="weak-lapse"> · {w.lapses}× vergessen</span>}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

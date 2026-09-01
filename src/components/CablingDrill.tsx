import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { randomCabling, MEDIA, MAX_CHANNEL, MAX_PERMANENT_LINK, type CablingTask, type Medium } from '../lib/cabling'
import { Pill } from './ui'
import { Icon } from './Icon'
import { useGuide } from './DrillGuide'

// Verkabelungs-Drill in zwei Teilen:
//  a) Strecke rechnen — Permanent Link (max. 90 m) und Channel (max. 100 m)
//  b) Medium wählen — Kupfer vs. Multimode vs. Singlemode begründet entscheiden

const num = (s: string) => Number(s.trim().replace(',', '.'))
/** 84,53 / 84.53 / 84,530 gelten als gleich; 1 cm Toleranz für Rundung. */
const nearly = (s: string, soll: number) => Number.isFinite(num(s)) && Math.abs(num(s) - soll) <= 0.01

export function CablingDrill({ onExit }: { onExit: () => void }) {
  const { recordDrill } = useAppState()
  const guide = useGuide('cabling')
  const [task, setTask] = useState<CablingTask>(() => randomCabling())
  const [pl, setPl] = useState('')
  const [ch, setCh] = useState('')
  const [medium, setMedium] = useState<Medium | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const plOk = nearly(pl, task.permanentLink)
  const chOk = nearly(ch, task.channel)
  const medOk = medium === task.medium.correct
  const allOk = plOk && chOk && medOk
  const fest = task.segments.reduce((a, s) => a + s.m, 0)

  const check = () => {
    if (checked) return
    setChecked(true)
    setScore((s) => ({ correct: s.correct + (allOk ? 1 : 0), total: s.total + 1 }))
    recordDrill('Verkabelung', allOk ? 1 : 0, 1)
  }

  const next = () => {
    setTask(randomCabling())
    setPl('')
    setCh('')
    setMedium(null)
    setChecked(false)
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><Pill>Verkabelung</Pill>{guide.button}</div>
        <span className="counter">{score.correct}/{score.total} ✓</span>
      </header>
      {guide.panel}

      <div className="card">
        <p className="q">a) Strecke prüfen — {task.ort}</p>
        <p className="muted small">
          Ein Arbeitsplatz wird an den Etagenverteiler angebunden. Fest verlegt werden:
        </p>
        <ul className="cab-segments">
          {task.segments.map((s) => (
            <li key={s.label}><span>{s.label}</span><strong>{s.m} m</strong></li>
          ))}
          <li className="sum"><span>Summe fest verlegt</span><strong>{fest} m</strong></li>
        </ul>
        <p className="muted small">
          Verlegezuschlag <strong>{task.zuschlagPct} %</strong> für Schlaufen und Reserve ·
          Rangierkabel im Verteiler <strong>{task.patchVerteiler} m</strong> ·
          Anschlusskabel am Arbeitsplatz <strong>{task.patchArbeitsplatz} m</strong>
        </p>

        <div className="cab-fields">
          <label className={`cf ${checked ? (plOk ? 'ok' : 'bad') : ''}`}>
            <span className="cf-label">Permanent Link (m)</span>
            <input value={pl} onChange={(e) => setPl(e.target.value)} disabled={checked} inputMode="decimal" placeholder="z. B. 84,53" aria-label="Permanent Link in Metern" />
            {checked && !plOk && <span className="cf-fix">→ {task.permanentLink.toFixed(2).replace('.', ',')} m</span>}
          </label>
          <label className={`cf ${checked ? (chOk ? 'ok' : 'bad') : ''}`}>
            <span className="cf-label">Channel (m)</span>
            <input value={ch} onChange={(e) => setCh(e.target.value)} disabled={checked} inputMode="decimal" placeholder="z. B. 92,53" aria-label="Channel in Metern" />
            {checked && !chOk && <span className="cf-fix">→ {task.channel.toFixed(2).replace('.', ',')} m</span>}
          </label>
        </div>
      </div>

      <div className="card">
        <p className="q">b) Welches Medium ist hier richtig?</p>
        <p className="cab-case">{task.medium.text}</p>
        <div className="cab-media" role="group" aria-label="Übertragungsmedium wählen">
          {MEDIA.map((m) => (
            <button
              key={m.key}
              className={`cab-med ${medium === m.key ? 'sel' : ''} ${checked && task.medium.correct === m.key ? 'right' : ''} ${checked && medium === m.key && !medOk ? 'wrong' : ''}`}
              disabled={checked}
              aria-pressed={medium === m.key}
              onClick={() => setMedium(m.key)}
            >
              <strong>{m.kurz}</strong>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {!checked ? (
        <button className="btn primary wide" disabled={!pl || !ch || !medium} onClick={check}>Prüfen</button>
      ) : (
        <>
          <div className={`feedback ${allOk ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={allOk ? 'check' : 'x'} size={16} className="fb-ico" />
            <span>
              {allOk ? 'Alles korrekt!' : 'Noch nicht ganz — die richtigen Werte stehen oben.'}
              {' '}Strecke: Permanent Link {task.permanentLink.toFixed(2).replace('.', ',')} m{' '}
              {task.linkOk ? `≤ ${MAX_PERMANENT_LINK} m ✓` : `> ${MAX_PERMANENT_LINK} m — Grenzwert gerissen!`},
              Channel {task.channel.toFixed(2).replace('.', ',')} m{' '}
              {task.channelOk ? `≤ ${MAX_CHANNEL} m ✓` : `> ${MAX_CHANNEL} m — Strecke so nicht normgerecht!`}
            </span>
          </div>
          <div className="cab-why">
            <strong>Warum {MEDIA.find((m) => m.key === task.medium.correct)?.kurz}?</strong>{' '}
            {task.medium.begruendung}
          </div>
          <button className="btn primary wide" onClick={next}>Nächste Aufgabe</button>
        </>
      )}
    </section>
  )
}

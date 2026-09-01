import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { randomVlsm, type VlsmTask } from '../lib/vlsm'
import { Pill } from './ui'
import { Icon } from './Icon'
import { Confetti } from './Confetti'
import { useGuide } from './DrillGuide'

// VLSM-Drill: einen /24-Block bedarfsgerecht aufteilen. Für jeden Bereich sind
// Präfix, Netzadresse und Broadcast einzutragen — genau die Kette, die in der
// AP1 gefordert wird. Ein Balken zeigt die Belegung des Blocks.

type Field = 'cidr' | 'network' | 'broadcast'
const FIELDS: { key: Field; label: string; hint: string }[] = [
  { key: 'cidr', label: 'Präfix', hint: '/26' },
  { key: 'network', label: 'Netzadresse', hint: '192.168.1.0' },
  { key: 'broadcast', label: 'Broadcast', hint: '192.168.1.63' },
]

type Answers = Record<number, Partial<Record<Field, string>>>

const expected = (task: VlsmTask, i: number, f: Field): string => {
  const p = task.parts[i]
  if (f === 'cidr') return String(p.cidr)
  if (f === 'network') return p.info.networkStr
  return p.info.broadcastStr
}

/** „/26", „26" und „ 26 " gelten alle als richtig. */
const norm = (f: Field, s: string) => (f === 'cidr' ? s.trim().replace(/^\//, '') : s.trim())

function Belegung({ task }: { task: VlsmTask }) {
  const total = 2 ** (32 - task.baseCidr)
  return (
    <div className="vlsm-bar" aria-hidden="true">
      {task.parts.map((p, i) => (
        <span
          key={i}
          className={`vlsm-seg s${i % 4}`}
          style={{ width: `${(p.blockSize / total) * 100}%` }}
          title={`${p.name}: ${p.blockSize} Adressen`}
        >
          <span className="vlsm-seg-label">/{p.cidr}</span>
        </span>
      ))}
      {task.free > 0 && (
        <span className="vlsm-seg frei" style={{ width: `${(task.free / total) * 100}%` }} title={`frei: ${task.free} Adressen`}>
          <span className="vlsm-seg-label">frei</span>
        </span>
      )}
    </div>
  )
}

export function VlsmDrill({ onExit }: { onExit: () => void }) {
  const { recordDrill } = useAppState()
  const guide = useGuide('vlsm')
  const [task, setTask] = useState<VlsmTask>(() => randomVlsm())
  const [ans, setAns] = useState<Answers>({})
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const isCorrect = (i: number, f: Field) => norm(f, ans[i]?.[f] ?? '') === expected(task, i, f)
  const allCorrect = task.parts.every((_, i) => FIELDS.every((f) => isCorrect(i, f.key)))
  const richtige = task.parts.reduce((n, _, i) => n + FIELDS.filter((f) => isCorrect(i, f.key)).length, 0)
  const felder = task.parts.length * FIELDS.length

  const set = (i: number, f: Field, v: string) =>
    setAns((a) => ({ ...a, [i]: { ...a[i], [f]: v } }))

  const check = () => {
    if (checked) return
    setChecked(true)
    setScore((s) => ({ correct: s.correct + (allCorrect ? 1 : 0), total: s.total + 1 }))
    recordDrill('VLSM', allCorrect ? 1 : 0, 1)
  }

  const next = () => {
    setTask(randomVlsm())
    setAns({})
    setChecked(false)
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><Pill>VLSM</Pill>{guide.button}</div>
        <span className="counter">{score.correct}/{score.total} ✓</span>
      </header>
      {guide.panel}

      <div className="card">
        <p className="q">
          Teile den Block <strong>{task.baseIp}/{task.baseCidr}</strong> per VLSM bedarfsgerecht auf.
        </p>
        <p className="muted small">
          Größter Bedarf zuerst. Trage je Bereich Präfix, Netzadresse und Broadcast ein.
        </p>

        <div className="vlsm-table-wrap">
          <table className="vlsm-table">
            <thead>
              <tr>
                <th>Bereich</th>
                <th>Hosts</th>
                {FIELDS.map((f) => <th key={f.key}>{f.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {task.parts.map((p, i) => (
                <tr key={i}>
                  <td className="vlsm-name">{p.name}</td>
                  <td className="vlsm-need">{p.need}</td>
                  {FIELDS.map((f) => (
                    <td key={f.key} className={checked ? (isCorrect(i, f.key) ? 'ok' : 'bad') : ''}>
                      <input
                        value={ans[i]?.[f.key] ?? ''}
                        onChange={(e) => set(i, f.key, e.target.value)}
                        disabled={checked}
                        placeholder={f.hint}
                        inputMode={f.key === 'cidr' ? 'numeric' : 'text'}
                        aria-label={`${p.name} ${f.label}`}
                      />
                      {checked && !isCorrect(i, f.key) && (
                        <span className="vlsm-fix">→ {f.key === 'cidr' ? '/' : ''}{expected(task, i, f.key)}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {checked && (
          <>
            <p className="muted small" style={{ marginTop: '0.7rem' }}>Belegung des Blocks:</p>
            <Belegung task={task} />
            <p className="muted small">
              Verbraucht: <strong>{task.used}</strong> Adressen · frei:{' '}
              <strong>{task.free}</strong>
              {task.freeFromStr && <> (ab {task.freeFromStr})</>} · bei fester Maske wären{' '}
              {task.parts.length} × {task.parts[0].blockSize} = {task.parts.length * task.parts[0].blockSize} Adressen nötig.
            </p>
          </>
        )}
      </div>

      {!checked ? (
        <button className="btn primary wide" onClick={check}>Prüfen</button>
      ) : (
        <>
          {allCorrect && <Confetti />}
          <div className={`feedback ${allCorrect ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={allCorrect ? 'check' : 'x'} size={16} className="fb-ico" />
            <span>
              {allCorrect
                ? 'Alles korrekt — Blockgrenzen sauber eingehalten!'
                : `${richtige} von ${felder} Feldern richtig. Die korrigierten Werte stehen unter den Feldern.`}
            </span>
          </div>
          <button className="btn primary wide" onClick={next}>Nächste Aufgabe</button>
        </>
      )}
    </section>
  )
}

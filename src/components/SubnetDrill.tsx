import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { maskBits, randomDrill, type SubnetDrill as Drill } from '../lib/net'
import { Icon } from './Icon'

// Generativer Subnetting-Drill mit visueller Bit-Leiste der Netzmaske.
// Netzwerke — die häufigste Rechenaufgabe der AP1 (02-Aufgabentypen-Operatoren.md).

interface Field {
  key: keyof Answers
  label: string
  expected: (d: Drill) => string
}
interface Answers {
  network: string
  broadcast: string
  firstHost: string
  lastHost: string
  hosts: string
}

const FIELDS: Field[] = [
  { key: 'network', label: 'Netzadresse', expected: (d) => d.info.networkStr },
  { key: 'broadcast', label: 'Broadcast-Adresse', expected: (d) => d.info.broadcastStr },
  { key: 'firstHost', label: 'erste Host-Adresse', expected: (d) => d.info.firstHostStr },
  { key: 'lastHost', label: 'letzte Host-Adresse', expected: (d) => d.info.lastHostStr },
  { key: 'hosts', label: 'nutzbare Hosts', expected: (d) => String(d.info.usableHosts) },
]

const empty: Answers = { network: '', broadcast: '', firstHost: '', lastHost: '', hosts: '' }

function BitRuler({ cidr }: { cidr: number }) {
  const bits = maskBits(cidr)
  return (
    <div className="bit-ruler" aria-hidden="true">
      {[0, 1, 2, 3].map((oct) => (
        <div key={oct} className="octet">
          {bits.slice(oct * 8, oct * 8 + 8).map((net, i) => (
            <span key={i} className={`bit ${net ? 'net' : 'host'}`}>{net ? '1' : '0'}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

export function SubnetDrill({ onExit }: { onExit: () => void }) {
  const { recordDrill } = useAppState()
  const [drill, setDrill] = useState<Drill>(() => randomDrill())
  const [ans, setAns] = useState<Answers>(empty)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const norm = (s: string) => s.trim()
  const isCorrect = (f: Field) => norm(ans[f.key]) === f.expected(drill)
  const allCorrect = FIELDS.every(isCorrect)

  const check = () => {
    if (checked) return
    setChecked(true)
    setScore((s) => ({ correct: s.correct + (allCorrect ? 1 : 0), total: s.total + 1 }))
    recordDrill('Subnetting', allCorrect ? 1 : 0, 1)
  }

  const next = () => {
    setDrill(randomDrill())
    setAns(empty)
    setChecked(false)
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><span className="pill">Subnetting</span></div>
        <span className="counter">{score.correct}/{score.total} ✓</span>
      </header>

      <div className="card">
        <p className="q">Gegeben: <strong>{drill.ip}/{drill.cidr}</strong></p>
        <BitRuler cidr={drill.cidr} />
        <p className="muted small">
          <span className="legend-net">■</span> Netzanteil ({drill.cidr} Bit) ·
          <span className="legend-host"> ■</span> Hostanteil · Maske <strong>{drill.info.maskStr}</strong> · Blockgröße {drill.info.blockSize}
        </p>

        <div className="subnet-fields">
          {FIELDS.map((f) => (
            <label
              key={f.key}
              className={`sf ${checked ? (isCorrect(f) ? 'ok' : 'bad') : ''}`}
            >
              <span className="sf-label">{f.label}</span>
              <input
                value={ans[f.key]}
                onChange={(e) => setAns((a) => ({ ...a, [f.key]: e.target.value }))}
                disabled={checked}
                inputMode={f.key === 'hosts' ? 'numeric' : 'text'}
                aria-label={f.label}
              />
              {checked && !isCorrect(f) && <span className="sf-correct">→ {f.expected(drill)}</span>}
            </label>
          ))}
        </div>
      </div>

      {!checked ? (
        <button className="btn primary wide" onClick={check}>Prüfen</button>
      ) : (
        <>
          <div className={`feedback ${allCorrect ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={allCorrect ? 'check' : 'x'} size={16} className="fb-ico" />
            <span>{allCorrect ? 'Alles korrekt!' : 'Fast — korrigierte Werte stehen rechts neben den Feldern.'}</span>
          </div>
          <button className="btn primary wide" onClick={next}>Nächste Aufgabe</button>
        </>
      )}
    </section>
  )
}

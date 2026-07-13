import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { Icon } from './Icon'

// Zahlensystem-Umrechner: klickbare Bits (128..1) bilden ein Byte; Dezimal/Hex/Binär
// aktualisieren sich live. Aufgabe: gegebene Zahl (dez oder hex) mit den Bits darstellen.
// Grundlage für IPv4, chmod-Oktal, ASCII (01-Themenkatalog / 03-Rechenschemata §6).

const PLACES = [128, 64, 32, 16, 8, 4, 2, 1]

type Base = 'dec' | 'hex'

function randTarget(): { value: number; base: Base } {
  return { value: Math.floor(Math.random() * 256), base: Math.random() < 0.5 ? 'dec' : 'hex' }
}

const toHex = (n: number) => n.toString(16).toUpperCase().padStart(2, '0')
const toBin = (bits: boolean[]) => bits.map((b) => (b ? '1' : '0')).join('')

export function BaseConvDrill({ onExit }: { onExit: () => void }) {
  const { recordDrill } = useAppState()
  const [target, setTarget] = useState(randTarget)
  const [bits, setBits] = useState<boolean[]>(() => Array(8).fill(false))
  const [checked, setChecked] = useState<null | boolean>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const value = bits.reduce((sum, on, i) => sum + (on ? PLACES[i] : 0), 0)
  const targetDisplay = target.base === 'dec' ? String(target.value) : `0x${toHex(target.value)}`

  const toggle = (i: number) => {
    if (checked !== null) return
    setBits((b) => b.map((v, j) => (j === i ? !v : v)))
  }

  const check = () => {
    const ok = value === target.value
    setChecked(ok)
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }))
    recordDrill('Zahlensysteme', ok ? 1 : 0, 1)
  }

  const next = () => {
    setTarget(randTarget())
    setBits(Array(8).fill(false))
    setChecked(null)
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><span className="pill">Zahlensysteme</span></div>
        <span className="counter">{score.correct}/{score.total} ✓</span>
      </header>

      <div className="card">
        <p className="q">
          Stelle <strong>{targetDisplay}</strong> ({target.base === 'dec' ? 'dezimal' : 'hexadezimal'}) mit den Bits dar:
        </p>

        <div className="byte-row" role="group" aria-label="Bits">
          {PLACES.map((pv, i) => (
            <button
              key={i}
              className={`byte-bit ${bits[i] ? 'on' : ''}`}
              aria-pressed={bits[i]}
              aria-label={`Wertigkeit ${pv}`}
              onClick={() => toggle(i)}
            >
              <span className="bb-val">{bits[i] ? '1' : '0'}</span>
              <span className="bb-place">{pv}</span>
            </button>
          ))}
        </div>

        <div className="base-readout">
          <span>DEZ <strong>{value}</strong></span>
          <span>HEX <strong>{toHex(value)}</strong></span>
          <span>BIN <strong className="mono">{toBin(bits)}</strong></span>
        </div>
      </div>

      {checked === null ? (
        <button className="btn primary wide" onClick={check}>Prüfen</button>
      ) : (
        <>
          <div className={`feedback ${checked ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={checked ? 'check' : 'x'} size={16} className="fb-ico" />
            <span>{checked
              ? `Richtig! ${target.value} = 0x${toHex(target.value)} = ${target.value.toString(2).padStart(8, '0')}`
              : `Dein Wert ist ${value}, gesucht war ${target.value}.`}</span>
          </div>
          <button className="btn primary wide" onClick={next}>Nächste Aufgabe</button>
        </>
      )}
    </section>
  )
}

import { useEffect, useState } from 'react'
import { guideFor } from '../data/drill-guides'
import { MarkdownText } from './markdown'
import { Icon } from './Icon'

// „So löst du das" — vollständige Erklärung zum Thema einer interaktiven Übung.
// Button sitzt in der Kopfzeile der Übung, das Panel klappt darunter auf.
// Der geöffnete Zustand wird je Übung gemerkt (localStorage), damit man beim
// Lernen nicht bei jeder neuen Aufgabe erneut aufklappen muss.

const KEY = (id: string) => `guide-open:${id}`

export function GuideButton({ id, open, onToggle }: { id: string; open: boolean; onToggle: () => void }) {
  if (!guideFor(id)) return null
  return (
    <button
      className={`btn sm guide-btn ${open ? 'on' : ''}`}
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`guide-${id}`}
      title="Vollständige Erklärung zum Thema"
    >
      <Icon name="help" size={15} />
      <span>So löst du das</span>
    </button>
  )
}

export function GuidePanel({ id, open }: { id: string; open: boolean }) {
  const guide = guideFor(id)
  if (!guide || !open) return null
  return (
    <section className="guide" id={`guide-${id}`} aria-label={guide.title}>
      <h3 className="guide-title">{guide.title}</h3>
      <p className="guide-intro"><MarkdownText text={guide.intro} /></p>

      <h4 className="guide-h">So gehst du vor</h4>
      <ol className="guide-steps">
        {guide.steps.map((s, i) => (
          <li key={i}>
            <strong>{s.title}</strong>
            <span><MarkdownText text={s.body} /></span>
          </li>
        ))}
      </ol>

      <h4 className="guide-h">Musterbeispiel</h4>
      <div className="guide-example">
        <p className="ge-task"><MarkdownText text={guide.example.task} /></p>
        <ol className="ge-solution">
          {guide.example.solution.map((s, i) => (
            <li key={i}><MarkdownText text={s} /></li>
          ))}
        </ol>
        <p className="ge-result"><Icon name="check" size={15} /> <span><MarkdownText text={guide.example.result} /></span></p>
      </div>

      <div className="guide-cols">
        <div>
          <h4 className="guide-h">Merksätze</h4>
          <ul className="guide-facts">
            {guide.facts.map((f, i) => <li key={i}><MarkdownText text={f} /></li>)}
          </ul>
        </div>
        <div>
          <h4 className="guide-h warn">Typische Punktefallen</h4>
          <ul className="guide-pitfalls">
            {guide.pitfalls.map((p, i) => <li key={i}><MarkdownText text={p} /></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** Zustand + fertige Bausteine für eine Übung: `const g = useGuide('subnet')`. */
export function useGuide(id: string) {
  const [open, setOpen] = useState(() => {
    try { return localStorage.getItem(KEY(id)) === '1' } catch { return false }
  })
  useEffect(() => {
    try { localStorage.setItem(KEY(id), open ? '1' : '0') } catch { /* ignore */ }
  }, [id, open])
  const toggle = () => setOpen((o) => !o)
  return {
    open,
    button: <GuideButton id={id} open={open} onToggle={toggle} />,
    panel: <GuidePanel id={id} open={open} />,
  }
}

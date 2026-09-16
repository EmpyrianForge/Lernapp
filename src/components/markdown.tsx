import { Fragment, type ReactNode } from 'react'

// Minimaler, sicherer Inline-Markdown-Renderer: **fett**, *kursiv*, `code`,
// Zeilenumbrüche. Bewusst KEIN dangerouslySetInnerHTML und keine Fremd-Lib —
// der Content stammt aus dem eigenen Vault (vertrauenswürdig), es entstehen nur
// React-Knoten. Kein XSS-Risiko, minimaler Umfang (YAGNI).
// Dazu einfache Pipe-Tabellen (Kopfzeile + |---|-Trenner), z. B. für eine Liste im
// Aufgabenszenario (data/exam-erm.ts). Nur in Blöcken verwenden, nicht innerhalb von <p>.

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
const SEP = /^\|(\s*:?-{3,}:?\s*\|)+$/

function renderLine(line: string, keyPrefix: string): ReactNode[] {
  const parts = line.split(TOKEN)
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={key}>{part.slice(1, -1)}</code>
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>
    }
    return <Fragment key={key}>{part}</Fragment>
  })
}

const cells = (row: string) => row.trim().slice(1, -1).split('|').map((c) => c.trim())

function Table({ rows, k }: { rows: string[]; k: string }) {
  const [head, , ...body] = rows
  return (
    <div className="md-table-wrap">
      <table className="md-table">
        <thead>
          <tr>{cells(head).map((c, i) => <th key={i}>{renderLine(c, `${k}-h${i}`)}</th>)}</tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri}>{cells(r).map((c, i) => <td key={i}>{renderLine(c, `${k}-${ri}-${i}`)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n')
  const out: ReactNode[] = []
  let afterTable = false // die Tabelle ist ein Block: die nächste Zeile braucht keinen eigenen Umbruch
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()
    // Tabelle: Zeile mit | am Anfang, direkt darunter die Trennzeile |---|
    if (t.startsWith('|') && SEP.test((lines[i + 1] ?? '').trim())) {
      const rows: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++])
      i--
      out.push(<Table key={i} rows={rows} k={String(i)} />)
      afterTable = true
      continue
    }
    out.push(
      <Fragment key={i}>
        {i > 0 && !afterTable && <br />}
        {renderLine(lines[i], String(i))}
      </Fragment>,
    )
    afterTable = false
  }
  return <>{out}</>
}

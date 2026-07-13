import { Fragment, type ReactNode } from 'react'

// Minimaler, sicherer Inline-Markdown-Renderer: **fett**, *kursiv*, `code`,
// Zeilenumbrüche. Bewusst KEIN dangerouslySetInnerHTML und keine Fremd-Lib —
// der Content stammt aus dem eigenen Vault (vertrauenswürdig), es entstehen nur
// React-Knoten. Kein XSS-Risiko, minimaler Umfang (YAGNI).

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g

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

export function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {renderLine(line, String(i))}
        </Fragment>
      ))}
    </>
  )
}

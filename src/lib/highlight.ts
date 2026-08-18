// Minimaler Syntax-Highlighter für die drei Code-Formen der App (Pseudocode, Java, Python).
// Bewusst ohne Fremd-Library: ~100 Zeilen statt ~100 KB Bundle, offline-tauglich, und
// die Sprachen sind bekannt und klein. Liefert Tokens, die React als <span> rendert
// (kein dangerouslySetInnerHTML → kein XSS-Risiko bei eigenen Karten).

export type Lang = 'pseudocode' | 'java' | 'python'
export type TokenKind = 'kw' | 'str' | 'num' | 'com' | 'fn' | 'op' | 'txt'

export interface Token {
  kind: TokenKind
  text: string
}

// Schlüsselwörter je Sprache. Pseudocode folgt der AP1-Prüfungsnotation (deutsch, GROSS).
const KEYWORDS: Record<Lang, Set<string>> = {
  pseudocode: new Set([
    'WENN', 'DANN', 'SONST', 'ENDE', 'FÜR', 'FUER', 'JEDES', 'VON', 'BIS', 'SCHRITT', 'IN',
    'SOLANGE', 'WIEDERHOLE', 'BIS_DASS', 'AUSGABE', 'EINGABE', 'ABBRUCH', 'VERLASSE', 'SCHLEIFE',
    'KLASSE', 'METHODE', 'FUNKTION', 'KONSTRUKTOR', 'ATTRIBUT', 'RUECKGABE', 'RÜCKGABE',
    'NEU', 'MOD', 'DIV', 'UND', 'ODER', 'NICHT', 'WAHR', 'FALSCH', 'PRIVAT', 'OEFFENTLICH',
  ]),
  java: new Set([
    'abstract', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'continue', 'default',
    'do', 'double', 'else', 'extends', 'final', 'finally', 'float', 'for', 'if', 'implements',
    'import', 'instanceof', 'int', 'interface', 'long', 'new', 'null', 'package', 'private',
    'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'this', 'throw',
    'throws', 'try', 'void', 'while', 'true', 'false', 'String',
  ]),
  python: new Set([
    'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
    'False', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None',
    'not', 'or', 'pass', 'raise', 'return', 'self', 'True', 'try', 'while', 'with', 'yield',
  ]),
}

// Eingebaute Funktionen/Ausgaben — als 'fn' eingefärbt, auch ohne folgende Klammer.
const BUILTINS: Record<Lang, Set<string>> = {
  pseudocode: new Set(['TEXT', 'ZAHL', 'LÄNGE', 'LAENGE']),
  java: new Set(['System', 'println', 'print', 'length', 'charAt', 'equals', 'Math']),
  python: new Set(['print', 'range', 'len', 'str', 'int', 'float', 'input', 'round', 'abs', 'sum']),
}

const WORD = /[A-Za-zÄÖÜäöüß_][A-Za-zÄÖÜäöüß0-9_]*/y
const NUMBER = /\d+(?:\.\d+)?/y
const SPACE = /[ \t\r\n]+/y
const OP = /[+\-*/%=<>!&|^~?:;,.(){}[\]]+/y

function matchAt(re: RegExp, src: string, i: number): string | null {
  re.lastIndex = i
  const m = re.exec(src)
  return m ? m[0] : null
}

/** Zerlegt Quelltext in eingefärbte Tokens. Unbekanntes bleibt 'txt' — nie Textverlust. */
export function tokenize(code: string, lang: Lang): Token[] {
  const kw = KEYWORDS[lang]
  const builtins = BUILTINS[lang]
  const lineComment = lang === 'java' ? '//' : '#'
  const tokens: Token[] = []
  const push = (kind: TokenKind, text: string) => {
    const last = tokens[tokens.length - 1]
    if (last && last.kind === kind) last.text += text // gleichartige Nachbarn zusammenfassen
    else tokens.push({ kind, text })
  }

  let i = 0
  while (i < code.length) {
    const ch = code[i]

    // Zeilenkommentar (Pseudocode kennt beide Formen)
    const isComment =
      code.startsWith(lineComment, i) || (lang === 'pseudocode' && code.startsWith('//', i))
    if (isComment) {
      const end = code.indexOf('\n', i)
      const stop = end === -1 ? code.length : end
      push('com', code.slice(i, stop))
      i = stop
      continue
    }

    // Zeichenkette (einfache oder doppelte Anführungszeichen, mit Escapes)
    if (ch === '"' || ch === "'") {
      let j = i + 1
      while (j < code.length && code[j] !== ch && code[j] !== '\n') {
        j += code[j] === '\\' ? 2 : 1
      }
      const stop = Math.min(j + 1, code.length)
      push('str', code.slice(i, stop))
      i = stop
      continue
    }

    const space = matchAt(SPACE, code, i)
    if (space) {
      push('txt', space)
      i += space.length
      continue
    }

    const num = matchAt(NUMBER, code, i)
    if (num) {
      push('num', num)
      i += num.length
      continue
    }

    const word = matchAt(WORD, code, i)
    if (word) {
      const nextChar = code[i + word.length]
      const isCall = nextChar === '('
      push(kw.has(word) ? 'kw' : builtins.has(word) || isCall ? 'fn' : 'txt', word)
      i += word.length
      continue
    }

    const op = matchAt(OP, code, i)
    if (op) {
      push('op', op)
      i += op.length
      continue
    }

    push('txt', ch) // Fallback: nichts geht verloren
    i += 1
  }
  return tokens
}

// IPv6-Kürzung nach RFC 5952: führende Nullen je Block weg, längste Folge von
// Null-Blöcken (>= 2) durch "::" ersetzen (bei Gleichstand die linke).

/** Kanonische Kurzform aus einer vollständigen IPv6-Adresse (8 Blöcke à 4 Hex). */
export function compress(full: string): string {
  const groups = full.split(':').map((g) => g.replace(/^0+/, '') || '0')

  let bestStart = -1
  let bestLen = 0
  let i = 0
  while (i < groups.length) {
    if (groups[i] === '0') {
      let j = i
      while (j < groups.length && groups[j] === '0') j++
      if (j - i > bestLen) {
        bestLen = j - i
        bestStart = i
      }
      i = j
    } else {
      i++
    }
  }

  if (bestLen >= 2) {
    const before = groups.slice(0, bestStart).join(':')
    const after = groups.slice(bestStart + bestLen).join(':')
    return `${before}::${after}`
  }
  return groups.join(':')
}

function rndGroup(): string {
  return (1 + Math.floor(Math.random() * 0xffff)).toString(16).padStart(4, '0')
}

export interface IPv6Drill {
  full: string
  short: string
}

/** Generiert eine volle IPv6-Adresse mit genau einer Null-Folge (>= 2) zum Kürzen. */
export function randomIPv6(): IPv6Drill {
  const len = 2 + Math.floor(Math.random() * 3) // 2..4 Null-Blöcke
  const start = Math.floor(Math.random() * (8 - len + 1)) // Folge passt in 8 Blöcke
  const groups: string[] = []
  for (let k = 0; k < 8; k++) {
    groups.push(k >= start && k < start + len ? '0000' : rndGroup())
  }
  const full = groups.join(':')
  return { full, short: compress(full) }
}

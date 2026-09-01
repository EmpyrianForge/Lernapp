// VLSM (Variable Length Subnet Mask): einen Adressblock bedarfsgerecht in
// unterschiedlich große Subnetze zerlegen. Vorgehen wie in der Prüfung —
// Bedarf absteigend sortieren, je Bereich die nächstgrößere Zweierpotenz wählen
// und die Blöcke lückenlos ab der Netzadresse vergeben.

import { subnetInfo, type SubnetInfo } from './net'

export interface VlsmPart {
  name: string
  /** geforderte Anzahl nutzbarer Hosts */
  need: number
  cidr: number
  /** Adressen im Block (2^Hostbits) */
  blockSize: number
  info: SubnetInfo
}

export interface VlsmTask {
  baseIp: string
  baseCidr: number
  parts: VlsmPart[]
  /** verbrauchte Adressen über alle Bereiche */
  used: number
  /** freie Adressen im Restblock */
  free: number
  /** erste freie Adresse (Beginn der Reserve) oder null, wenn alles vergeben */
  freeFromStr: string | null
}

const BEREICHE = [
  'Vertrieb', 'Produktion', 'Verwaltung', 'Entwicklung', 'Lager', 'Empfang',
  'Buchhaltung', 'Support', 'Schulungsraum', 'Gästenetz',
]

/** Kleinstes Präfix, dessen Block mindestens `need` nutzbare Hosts bietet. */
export function cidrForHosts(need: number): number {
  for (let hostBits = 2; hostBits <= 16; hostBits++) {
    if (2 ** hostBits - 2 >= need) return 32 - hostBits
  }
  return 16
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}

function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, o) => ((acc << 8) + Number(o)) >>> 0, 0) >>> 0
}

/**
 * Erzeugt eine lösbare VLSM-Aufgabe aus einem /24-Block.
 * Die Bedarfe werden so gewählt, dass die Summe der Blöcke in das /24 passt.
 */
export function randomVlsm(): VlsmTask {
  const baseIp = `192.168.${Math.floor(Math.random() * 200) + 10}.0`
  const baseCidr = 24
  const total = 2 ** (32 - baseCidr)

  // Bedarfe würfeln, bis die Summe der aufgerundeten Blöcke sicher hineinpasst.
  let needs: number[] = []
  for (let versuch = 0; versuch < 60; versuch++) {
    const anzahl = 3 + Math.floor(Math.random() * 2) // 3 oder 4 Bereiche
    const kandidat = [
      25 + Math.floor(Math.random() * 36), // 25..60  -> /26
      12 + Math.floor(Math.random() * 17), // 12..28  -> /27
      5 + Math.floor(Math.random() * 8), //  5..12  -> /28
      2, //                                            -> /30 (WAN-Kopplung)
    ].slice(0, anzahl)
    const summe = kandidat.reduce((a, n) => a + 2 ** (32 - cidrForHosts(n)), 0)
    if (summe <= total) {
      needs = kandidat
      break
    }
  }
  if (!needs.length) needs = [60, 28, 12, 2]

  // absteigend vergeben (Kernregel des Verfahrens)
  needs.sort((a, b) => b - a)
  const namen = [...BEREICHE].sort(() => Math.random() - 0.5)

  let cursor = ipToInt(baseIp)
  const parts: VlsmPart[] = needs.map((need, i) => {
    const cidr = cidrForHosts(need)
    const blockSize = 2 ** (32 - cidr)
    const netIp = intToIp(cursor)
    cursor = (cursor + blockSize) >>> 0
    const name = i === needs.length - 1 && need === 2 ? 'WAN-Kopplung' : namen[i]
    return { name, need, cidr, blockSize, info: subnetInfo(netIp, cidr) }
  })

  const used = parts.reduce((a, p) => a + p.blockSize, 0)
  return {
    baseIp,
    baseCidr,
    parts,
    used,
    free: total - used,
    freeFromStr: total - used > 0 ? intToIp(cursor) : null,
  }
}

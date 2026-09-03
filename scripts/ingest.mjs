// Ingest-Pipeline: liest die faktengeprüften Karteikarten-Decks aus dem Obsidian-Vault
// (natives Spaced-Repetition-Format: Frage / "?" / Antwort, Karten durch "---" getrennt)
// und erzeugt daraus den gebündelten Content-Seed src/data/content.generated.json.
//
// Ausführung: `npm run ingest` (läuft automatisch vor dev/build via pre-Scripts).
// Robust: Fällt die Vault-Quelle weg, bleibt eine bereits erzeugte content.generated.json
// bestehen — die App startet also nie leer (Anforderung aus 06-App-Datenmodell.md).
//
// Quelle überschreibbar per Env: CONTENT_SRC="D:/pfad/zu/Karteikarten"
// AP2-Algorithmen-Quelle überschreibbar per Env: CONTENT_SRC_AP2="…"

import matter from 'gray-matter'
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')
const OUT_FILE = join(PROJECT_ROOT, 'src', 'data', 'content.generated.json')

const CONTENT_SRC =
  process.env.CONTENT_SRC || 'C:/Obsidian/Empy/wiki/Lernapp/Karteikarten'

// Themen-Metadaten je Deck-Nummer. examFrequency = Lern-Heuristik (KEIN IHK-Fakt,
// eigene Häufigkeitsanalyse 2021–2025) → dient als SR-Gewicht. Quelle: 01-Themenkatalog.md.
const TOPIC_BY_DECK = {
  '01': { topicId: 'hardware', label: 'Hardware', examFrequency: 1.0, ap1Status: 'core' },
  '02': { topicId: 'netzwerke', label: 'Netzwerke', examFrequency: 0.88, ap1Status: 'core' },
  '03': { topicId: 'wirtschaftlichkeit', label: 'Wirtschaftlichkeit', examFrequency: 1.0, ap1Status: 'core' },
  '04': { topicId: 'projektmanagement', label: 'Projektmanagement', examFrequency: 0.88, ap1Status: 'core' },
  '05': { topicId: 'it-sicherheit', label: 'IT-Sicherheit', examFrequency: 0.75, ap1Status: 'core' },
  '06': { topicId: 'datenschutz', label: 'Datenschutz', examFrequency: 0.5, ap1Status: 'supporting' },
  '07': { topicId: 'betriebssysteme', label: 'Betriebssysteme', examFrequency: 0.63, ap1Status: 'supporting' },
  '08': { topicId: 'softwareentwicklung', label: 'Softwareentwicklung', examFrequency: 0.88, ap1Status: 'core' },
  '09': { topicId: 'qs-vertraege', label: 'QS, Verträge & Leistung', examFrequency: 0.55, ap1Status: 'supporting' },
  '10': { topicId: 'kommunikation', label: 'Kommunikation & Markt', examFrequency: 0.75, ap1Status: 'supporting' },
  '11': { topicId: 'neu-2025', label: 'Neu im Katalog 2025', examFrequency: 0.9, ap1Status: 'core' },
  '12': { topicId: 'multimedia', label: 'Multimedia', examFrequency: 0.38, ap1Status: 'supporting' },
  '13': { topicId: 'internet', label: 'Internet & Web', examFrequency: 0.45, ap1Status: 'supporting' },
  '14': { topicId: 'software-lizenzen', label: 'Software & Lizenzen', examFrequency: 0.45, ap1Status: 'supporting' },
}

// AP2-Erweiterung: eigener Prüfungsbereich „Entwicklung und Umsetzung von Algorithmen".
// Eigene Quelle (Ordner AP2-Algorithmen/Karteikarten), track='ap2', ap1Status='ap2-grundlagen'
// → erscheinen NUR im AP2-Track (Topbar-Umschalter), nicht im AP1-Pool. examFrequency = Lern-
// Heuristik innerhalb AP2. Pfad aus CONTENT_SRC abgeleitet (Geschwisterordner) oder CONTENT_SRC_AP2.
const AP2_SRC =
  process.env.CONTENT_SRC_AP2 || join(dirname(CONTENT_SRC), 'AP2-Algorithmen', 'Karteikarten')

const TOPIC_BY_DECK_AP2 = {
  '01': { topicId: 'algo-grundlagen', label: 'Algorithmen-Grundlagen', examFrequency: 0.85, ap1Status: 'ap2-grundlagen' },
  '02': { topicId: 'algo-sortier-suche', label: 'Sortier- & Suchverfahren', examFrequency: 0.85, ap1Status: 'ap2-grundlagen' },
  '03': { topicId: 'algo-sql', label: 'SQL & Datenbank', examFrequency: 0.85, ap1Status: 'ap2-grundlagen' },
  '04': { topicId: 'algo-testing-oop', label: 'Testing, OOP & UML', examFrequency: 0.85, ap1Status: 'ap2-grundlagen' },
}

// Quellen in Ingest-Reihenfolge. track=null → AP1-Bestand (Standard-Track).
const SOURCES = [
  { dir: CONTENT_SRC, map: TOPIC_BY_DECK, track: null, srcLabel: 'Lernapp/Karteikarten' },
  { dir: AP2_SRC, map: TOPIC_BY_DECK_AP2, track: 'ap2', srcLabel: 'Lernapp/AP2-Algorithmen/Karteikarten' },
]

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-').slice(0, 9).join('-')
}

// Zerlegt einen Deck-Body in einzelne Karten. Trenner zwischen Karten = Zeile nur "---",
// Trenner Frage/Antwort = Zeile nur "?". Führende Überschrift (#) und Intro-Blockquote (>)
// werden pro Chunk entfernt, damit die erste Karte sauber geparst wird.
function parseCards(body) {
  const chunks = body.split(/^\s*---\s*$/m)
  const cards = []
  for (const rawChunk of chunks) {
    const lines = rawChunk
      .split('\n')
      .filter((l) => !/^\s*#/.test(l) && !/^\s*>/.test(l))
    const sepIndex = lines.findIndex((l) => l.trim() === '?')
    if (sepIndex === -1) continue // Chunk ohne Karte (z. B. reiner Header)
    const front = lines.slice(0, sepIndex).join('\n').trim()
    const back = lines.slice(sepIndex + 1).join('\n').trim()
    if (!front || !back) continue
    cards.push({ front, back })
  }
  return cards
}

function main() {
  mkdirSync(dirname(OUT_FILE), { recursive: true })

  // Primärquelle (AP1) fehlt → bestehenden Seed behalten, nie leer überschreiben.
  if (!existsSync(CONTENT_SRC)) {
    if (existsSync(OUT_FILE)) {
      console.warn(
        `[ingest] Primärquelle nicht gefunden (${CONTENT_SRC}) — behalte bestehende ${OUT_FILE}.`,
      )
      return
    }
    console.warn(
      `[ingest] Quelle nicht gefunden (${CONTENT_SRC}) und kein Seed vorhanden — schreibe leeren Seed.`,
    )
    writeFileSync(OUT_FILE, JSON.stringify({ generatedAt: null, items: [] }, null, 2))
    return
  }

  const items = []
  const usedIds = new Set()

  for (const src of SOURCES) {
    if (!existsSync(src.dir)) {
      console.warn(`[ingest] Quelle nicht gefunden (${src.dir}) — übersprungen.`)
      continue
    }
    const files = readdirSync(src.dir)
      .filter((f) => /^\d{2}-.*\.md$/.test(f))
      .sort()

    for (const file of files) {
      const deckNo = file.slice(0, 2)
      const meta = src.map[deckNo]
      if (!meta) {
        console.warn(`[ingest] Kein Themen-Mapping für Deck ${file} (${src.srcLabel}) — übersprungen.`)
        continue
      }
      const raw = readFileSync(join(src.dir, file), 'utf8')
      const parsed = matter(raw)
      const tags = Array.isArray(parsed.data.tags) ? parsed.data.tags : []
      const cards = parseCards(parsed.content)

      for (const card of cards) {
        // Per-Karten-Marker [AP2] am Anfang der Frage → als Vertiefung/AP2-Grundlagen
        // kennzeichnen (über AP1 hinaus). Marker wird aus der Anzeige entfernt.
        let front = card.front
        let ap1Status = meta.ap1Status
        const marker = front.match(/^\[AP2\]\s*/)
        if (marker) {
          ap1Status = 'ap2-grundlagen'
          front = front.slice(marker[0].length)
        }
        // Per-Karten-Marker [RAND] am Anfang → Prüfungs-Randstoff (peripher, aber AP1).
        // Bleibt sichtbar/lernbar (kein Ausblenden), nur als „Randstoff" markiert.
        let peripheral = false
        const randMarker = front.match(/^\[RAND\]\s*/)
        if (randMarker) {
          peripheral = true
          front = front.slice(randMarker[0].length)
        }

        let id = `${meta.topicId}--${slugify(front)}`
        let n = 2
        while (usedIds.has(id)) id = `${meta.topicId}--${slugify(front)}-${n++}`
        usedIds.add(id)

        items.push({
          id,
          topicId: meta.topicId,
          type: 'flashcard',
          tags,
          examFrequency: meta.examFrequency,
          ap1Status,
          ...(src.track ? { track: src.track } : {}),
          ...(peripheral ? { peripheral: true } : {}),
          operator: null,
          afb: null,
          points: null,
          front,
          back: card.back,
          source: `${src.srcLabel}/${file}`,
        })
      }
      console.log(`[ingest] ${src.srcLabel}/${file}: ${cards.length} Karten`)
    }
  }

  const seed = { generatedAt: new Date().toISOString(), count: items.length, items }
  writeFileSync(OUT_FILE, JSON.stringify(seed, null, 2))
  console.log(`[ingest] ✔ ${items.length} Karteikarten → ${OUT_FILE}`)
}

main()

# 🎓 AP1 Lernapp — FIAE

Interaktive, **offline-fähige** Lernapp zur Vorbereitung auf die **IHK-Abschlussprüfung Teil 1** (Fachinformatiker Anwendungsentwicklung). Prüfung: **30.09.2026**. Ziel: **≥ 92 P (sehr gut)**.

Kein Backend, kein Konto, kein Tracking, keine personenbezogenen Daten. Der Lernstand liegt lokal in IndexedDB; einziges Backup ist der JSON-Export.

---

## Schnellstart

```bash
npm install
npm run dev        # startet Vite (führt vorher automatisch den Content-Ingest aus)
```

Die App läuft dann auf `http://localhost:5173` (bzw. dem in der Konsole genannten Port).

```bash
npm run build      # Produktions-Build (PWA)
npm run preview    # Build lokal testen
npm run typecheck  # nur TypeScript prüfen
npm run ingest     # Karteikarten aus dem Vault neu einlesen
```

## Datenquelle & Ingest

Der Content stammt aus der kuratierten Wissensbasis im Obsidian-Vault:

```
C:\Obsidian\Empy\wiki\Lernapp\Karteikarten\*.md   (11 faktengeprüfte Q&A-Decks)
```

`npm run ingest` (läuft automatisch vor `dev`/`build`) parst diese Decks im nativen
Obsidian-SR-Format (`Frage / ? / Antwort`, Karten durch `---` getrennt) und erzeugt
`src/data/content.generated.json` — den gebündelten Content-Seed. Die Rechenaufgaben
(`type: "calc"`) sind in `src/data/calc-seed.ts` handkuratiert.

> Andere Vault-Position? `CONTENT_SRC="D:/pfad/zu/Karteikarten" npm run ingest`

## Lernmodi

| Modus | Beschreibung |
|-------|--------------|
| 🗂️ Karteikarten | Fällige + neue Karten, **SM-2 Spaced Repetition**, interleaved, Active Recall |
| ❓ Themen-Quiz | Frei gewählte Themen, gemischt, Sofort-Feedback |
| 🩹 Schwachstellen | Gezielt die schwächsten Karten (oft „nicht gewusst") üben |
| 🧮 Rechnen | Rechenaufgaben mit Rechenweg, **Teilpunkten (Rubric)** und typischen Fallen |
| 🧩 Schreibtischtest | Pseudocode Zeile für Zeile in einer interaktiven **Wertetabelle** durchspielen |
| 📄 Prüfungsaufgaben | Authentische **mehrteilige** Aufgaben mit Musterlösung + Punkte-Selbstbewertung |
| 📝 Prüfungssimulation | 90-Min-Timer, 4 unabhängige Aufgabenbereiche, Auswertung gegen 100 P + Notenschlüssel |
| 🎯 Operatoren | Was jeder Operator (nennen/begründen/…) für die volle Punktzahl verlangt |
| 📊 Statistik | Aktivitäts-Heatmap, **Prüfungsreife-Verlauf**, Noten-Verteilung, schwächste Karten |

**Werkzeuge:** 🔎 Nachschlagen (Volltextsuche, Formelsammlung, Lesezeichen) · ➕ Meine Karten (eigene Karteikarten) · ⚙️ Einstellungen (Design hell/dunkel, Schriftgröße, Backup). Dazu eine **„Auf Kurs?"-Ampel** mit Tagesziel und eine Backup-Erinnerung auf dem Dashboard, sowie ein Tastatur-Kürzel-Overlay (`?`).

Dazu: **„Nur Kernthemen"-Filter** (beschränkt Karteikarten & Quiz auf 🔴 Kernthemen)
und ein **Cram-Banner** in den letzten 14 Tagen vor der Prüfung.

### 🎮 Interaktive Übungen

Visuelle, klick-/generative Drills (touch- und tastaturfreundlich):

| Übung | Beschreibung |
|-------|--------------|
| 🔢 chmod-Rechte | rwx-Matrix anklicken → Oktalzahl + symbolische Form live, gegen Zielvorgabe prüfen |
| 🌐 Subnetting | generative Aufgaben mit **visueller Bit-Leiste** der Maske; Netz/Broadcast/Hosts eintragen |
| 💡 Zahlensysteme | klickbare Bits (128…1) → Dezimal/Hex/Binär live; gegebene Zahl darstellen |
| ⚖️ Nutzwertanalyse | generative Bewertungsmatrix; Nutzwerte berechnen und Sieger benennen |
| 🕸️ Netzplan | FAZ/FEZ/SAZ/SEZ + Gesamtpuffer je Knoten; kritischer Pfad wird hervorgehoben |
| 🔗 Zuordnung | Tap-to-Pair: Ports, Cloud, Backup, Verschlüsselung, IPv6, OSI-Geräte, Verträge, USV |
| 🧾 UML/BPMN-Symbole | gezeichnetes Symbol → Bedeutung (BPMN-Grundelemente, UML-Aktivitätsdiagramm) |
| ↕️ Reihenfolge | Sortieren via ▲/▼: OSI, Handshake, DORA, Boot, Phasen, PDCA, Tuckman, AIDA, u. a. |

Fortschritt der Drills und die **schwächsten Karten** erscheinen in der Statistik-Ansicht.

## Doku

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Aufbau, Datenfluss, SM-2, Datenmodell, Komponentenkarte, Design-Entscheidungen, Roadmap.
- **[DEPLOY.md](DEPLOY.md)** — auf dem Handy nutzen / installierbare PWA (HTTPS-Hosting + lokale LAN-Vorschau).
- Fachliche Wissensbasis + Belege: `C:\Obsidian\Empy\wiki\Lernapp\` (Referenzseiten 00–07).

## Stack

Vite · TypeScript (strict) · React 18 · Dexie (IndexedDB) · vite-plugin-pwa · gray-matter (Ingest).

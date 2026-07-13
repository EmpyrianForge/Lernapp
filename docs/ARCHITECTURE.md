# Architektur & Implementierung — AP1 Lernapp

Dieses Dokument ist die **Development-/Implementierungs-Referenz** der App. Es ersetzt
den ursprünglich auf `E:\Claude\ap1-lernapp\BUILD-PROMPT.md` geplanten (nicht mehr
erreichbaren) Bau-Prompt und hält den Ist-Stand fest.

Fachliche Grundlage: die Wissensbasis im Vault `C:\Obsidian\Empy\wiki\Lernapp\`
(Referenzseiten 00–07 + `Karteikarten/`).

---

## 1. Leitprinzipien

- **Offline-first PWA**, kein Backend, kein Konto, **keine personenbezogenen Daten** →
  DSGVO-Aufwand entfällt. Einziges Backup: JSON-Export/-Import.
- **Content ⟂ Lernfortschritt.** Items (Content) und `UserState` (SM-2) sind strikt
  getrennt und nur über die **deterministische `item.id`** verknüpft. Ein erneuter
  Ingest überschreibt deshalb nie den Fortschritt.
- **Fixe Deadline 30.09.2026** prägt den Scheduler: harter Cap + Cram-Stauchung.
- **Evidenzbasierte Didaktik**: Active Recall, Interleaving, Sofort-Feedback,
  Mastery pro Thema (nicht global-%), ehrliche Gamification (nur Streak, keine XP/Badges).
- **Höchste Code-Qualität**: TypeScript strict, kleine reine Funktionen, YAGNI
  (SM-2 statt FSRS, kein State-Management-Framework, kein Router).

## 2. Datenfluss

```
Vault-Decks (Obsidian SR-MD)                calc-seed.ts (handkuratiert)
  Karteikarten/01..11.md                        9 Rechenaufgaben
        │  scripts/ingest.mjs (gray-matter)           │
        ▼                                              │
  src/data/content.generated.json  ◄─── gebündelt ────┤
        │                                              │
        └──────────────► src/data/content.ts ◄─────────┘
                              │  (ALL_ITEMS, ITEM_BY_ID, byTopic)
                              ▼
        lib/scheduler.ts  ── Sessions (due, quiz, exam) ──►  UI (React)
                              ▲                                   │
        lib/sm2.ts (review) ──┘                                  │ review(id, grade)
                              ▼                                   ▼
        db/db.ts (Dexie / IndexedDB)  ◄── state/AppState.tsx (Context) ──┘
```

## 3. Ingest-Pipeline (`scripts/ingest.mjs`)

- Liest `CONTENT_SRC` (Default: `C:/Obsidian/Empy/wiki/Lernapp/Karteikarten`).
- Parse-Regel: Karten getrennt durch Zeile `---`; innerhalb einer Karte trennt eine
  Zeile `?` Frage/Antwort. Führende Überschriften (`#`) und Intro-Blockquotes (`>`)
  werden je Chunk verworfen.
- **Deterministische ID**: `${topicId}--${slug(frage)}` (Umlaut-normalisiert, erste
  9 Wörter). Kollisionen werden mit `-2`, `-3`, … eindeutig gemacht.
- Robust: fehlt die Vault-Quelle, bleibt eine vorhandene `content.generated.json`
  bestehen (die App startet nie leer).
- Aktueller Stand: **204 Karteikarten** über 11 Decks + 9 Rechenaufgaben = **213 Items**.

Themen-/Gewichtungs-Mapping (`examFrequency`, `ap1Status`) liegt sowohl im Ingest-Skript
als auch in `src/data/topics.ts` (Anzeige). `examFrequency` ist eine **Lern-Heuristik**
(eigene Häufigkeitsanalyse 2021–2025), **kein IHK-Fakt**.

## 4. SM-2 (`src/lib/sm2.ts`)

Selbstbewertung 1–4 → SM-2-Qualität q = grade+1 (also 2..5). Nur Grade 1 (q=2) resettet.

```
EF' = EF + (0.1 − (5−q)·(0.08 + (5−q)·0.02));  EF = max(EF', 1.3)
q < 3 → reps=0, interval=1
sonst → reps++; interval = reps==1?1 : reps==2?6 : round(prevInterval·EF)
```

- `dueFromInterval` setzt **`due = min(heute+interval, 2026-09-30)`** (harter Cap) und
  **halbiert Intervalle in den letzten 14 Tagen** (Cram-Modus).
- Verifiziert: Grade 4×4 → Intervalle 1 / 6 / 17 / 49; Grade 1 → Reset + EF-Abzug;
  EF-Floor 1,3.

## 5. Datenmodell

- **Item** (`FlashcardItem | CalcItem`) — Content, siehe `src/types.ts`.
- **UserState** — `{ itemId, ef, interval, reps, due, lastReviewed, history[] }`, in
  IndexedDB (`db.states`, Primärschlüssel `itemId`, Index `due`).
- **KV** (`db.kv`) — Settings/Streak.
- Neue Karte: `ef=2.5, interval=0, reps=0, due=heute` (sofort fällig).

## 6. Scheduler & Mastery

- `dueItems` / `buildFlashcardSession` — fällige + neue Items, `interleaveByTopic`
  (Round-Robin über gemischte Themen-Buckets).
- `buildQuiz(topics, count)` — priorisiert ungesehene/schwache Karten.
- `buildExam()` — 4 Aufgabenbereiche × (1 Rechenaufgabe + 5 Wissensfragen), ~91–100 P.
- `mastery.ts`: „gemeistert" = `interval ≥ 14` UND letzte 2 Antworten ≥ 3.
  `examReadiness` = nach `examFrequency` gewichteter Mastery-Mittelwert (0..100).
- `grade.ts`: bundeseinheitlicher Blockschlüssel (100/92/81/67/50/30).

## 7. Komponentenkarte

```
main.tsx → AppStateProvider → App.tsx (Topbar + View-Switch + Backup)
  ├─ Dashboard.tsx     Prüfungsreife-Ring, Stats, Modus-Launcher, Mastery-Liste
  ├─ FlashcardMode ─┐
  ├─ QuizMode      ─┼─► Reviewer.tsx  (Active-Recall-Loop, Tastatur 1–4/Space/Esc)
  ├─ CalcMode          Rechenweg + Rubric + Fallen + Selbstbewertung
  ├─ ExamMode          90-Min-Timer, Frage-Navigator, Punktevergabe, Auswertung
  ├─ OperatorMode      Referenz aus 02-Aufgabentypen-Operatoren
  ├─ StatsMode         Heatmap, Noten-Verteilung, Mastery
  └─ Interaktive Übungen (eigene Dashboard-Sektion, standalone Drills):
       ChmodDrill      rwx-Matrix → Oktal live (lib/chmod.ts)
       SubnetDrill     generativ, Bit-Leiste der Maske (lib/net.ts)
       BaseConvDrill   klickbare Bits → Dez/Hex/Bin (Zahlensysteme)
       NutzwertDrill   generative Bewertungsmatrix, Nutzwert + Sieger
       NetzplanDrill   FAZ/FEZ/SAZ/SEZ/GP + kritischer Pfad (lib/netzplan.ts)
       MatchDrill      Tap-to-Pair (data/interactive.ts → MATCH_DECKS)
       SymbolDrill     UML/BPMN-SVG-Symbole → Bedeutung (Tap-to-Pair)
       OrderDrill      Sortieren via ▲/▼ (data/interactive.ts → ORDER_TASKS)

     Alle Drills melden ihr Ergebnis via AppState.recordDrill(type, correct, total) →
     KV-persistierte drillStats, angezeigt in StatsMode. StatsMode zeigt zusätzlich die
     „schwächsten Karten" (nach Grade-1-Lapses/EF, Filter history.length > 0).
  ui.tsx: MultilineText, ProgressBar, ScoreRing, GradeButtons, Pill
  markdown.tsx: MarkdownText (fett/kursiv/code/Umbruch, sicher)

Die interaktiven Drills sind bewusst vom SM-2/Content-Modell entkoppelt (kein item.id,
kein UserState) — sie sind generative bzw. daten­getriebene Übungen mit In-Session-Score.
chmod- und Subnetting-Antworten werden berechnet (lib/chmod.ts, lib/net.ts), nicht
hand-authored; beide Rechenkerne wurden numerisch verifiziert.
```

`AppState.tsx` lädt beim Start alle `UserState` in eine In-Memory-Map (max. ~213
Items → trivial), persistiert Reviews nach Dexie und stellt abgeleitete Werte
(`dueTotal`, `streak`, `review()`) bereit.

## 8. Barrierefreiheit

Volle Tastaturbedienung (1–4 bewerten, Space/Enter aufdecken, Esc verlassen),
`aria-live` auf Frage/Antwort & Lösung, `role="progressbar"/"timer"`, sichtbarer
Fokus-Ring, `prefers-reduced-motion`, `prefers-color-scheme` (Dark/Light), Kontrast AA.

## 9. Design-Entscheidungen (bewusst)

- **SM-2 statt FSRS** — Solo-App mit Deadline, deterministisch, ~20 Zeilen.
- **Kein State-Framework / kein Router** — ein Context + View-`useState` genügen.
- **Build-Time-Ingest statt Runtime** — der Content ist gebündelt, App startet nie leer.
- **SVG-PWA-Icon** — kein Bild-Toolchain-Aufwand; Chromium akzeptiert SVG-Icons.
- **Exam getrennt vom SR** — Prüfungs-Selbstbewertung verfälscht den SR-Verlauf nicht.
- **Design an Linear orientiert** — reduziertes Token-System in `src/styles.css`: flache
  Flächen (near-black/off-white, kein Verlauf), haarfeine Ränder, ein dezenter
  Indigo-Akzent (`--accent-solid #5e6ad2` für Füllungen, hellere `--accent` als Text),
  kleine Radien (~8px), sehr subtile Schatten, Inter-Stack mit negativem letter-spacing.
  Beide Themes über `--accent-fg` (Text auf Akzent) sauber getrennt.
- **Eigenes Icon-Set statt Emoji** — `src/components/Icon.tsx` liefert ein monochromes
  SVG-Line-Icon-Set (currentColor, `<Icon name size />`). Ersetzt alle Emoji in
  Kacheln, Header, Chrome, Feedback-Bannern. Reine Typografie (← → ✓) bleibt.

## 10. Roadmap / offene Punkte

Erledigt (2026-07-13):
- [x] **Schreibtischtest-/Pseudocode-Aufgabentyp** (`type:"trace"`, interaktive
      Wertetabelle) — `src/data/trace-seed.ts`, `components/TraceMode.tsx`.
- [x] **PNG-Icons** (192/512/maskable) + Apple-Touch-Icon — `scripts/gen-icons.mjs`
      (sharp), verdrahtet in Manifest + `index.html`.
- [x] **Statistik-Ansicht** (Aktivitäts-Heatmap, Noten-Verteilung, Mastery) —
      `components/StatsMode.tsx`.
- [x] **„Nur Kernthemen"-Filter** (persistent) + **Cram-Countdown-Banner** (≤ 14 Tage).
- [x] **Markdown-Renderer** für formatierte Antworten — `components/markdown.tsx`.

- [x] **Interaktive Übungen** (eigene Dashboard-Sektion, 8 Stück): chmod-Grid,
      Subnetting, Zahlensysteme, Nutzwertanalyse, Netzplan, Zuordnung, UML/BPMN-Symbole,
      Reihenfolge.
- [x] **Drill-Statistik** (recordDrill → drillStats) + **Detail „schwächste Karten"**
      in StatsMode.
- [x] Mehr Inhalt: zusätzliche Match-/Order-Decks, 2 Rechenaufgaben (ROI, AfA),
      1 Schreibtischtest (Fakultät).
- [x] Mobil-Layout geprüft (kein horizontaler Überlauf bei 375 px).

- [x] **Prüfungsaufgaben-Bank** (`data/exam-tasks.ts`, `ExamTasksMode`): 6 authentische
      mehrteilige Aufgaben mit Rubric + Punkte-Selbstbewertung (Frühjahr-2025-Blueprint).
- [x] **„Auf Kurs?"-Tagesziel** + **Backup-Erinnerung** (Dashboard).
- [x] **Schwachstellen-Training** (`WeakTraining`): schwächste Karten gezielt üben.
- [x] **3 neue Vault-Decks** (12-Multimedia, 13-Internet-Web, 14-Software-Lizenzen) →
      37 Karten; Themen/Ingest/Index aktualisiert. Content jetzt 257 Items.
- [x] **Nachschlagen** (`ReferenceMode`): Volltextsuche, Formelsammlung, Lesezeichen.
- [x] **Eigene Karten** (`MyCardsMode`, Dexie `userCards`, `registerUserCards`) — fließen
      in SR/Quiz/Suche ein, bleiben beim Re-Ingest erhalten.
- [x] **Prüfungsreife-Verlaufskurve** (KV-Snapshot 1×/Tag, SVG-Chart in StatsMode).
- [x] **Einstellungen**: Theme (System/Hell/Dunkel via `data-theme`), Schriftgröße,
      Backup, Tastatur-Kürzel. **Shortcut-Overlay** (`?`).

- [x] **Mehr Inhalt**: 9 authentische Prüfungsaufgaben (jetzt +Hardware/Datenschutz/OS),
      12 Rechen- + 5 Schreibtischtest-Aufgaben, zusätzliche Match-Decks. Content = 258 Items.
- [x] **Lernplan** als Wiki-Doku (`15-Lernplan.md`, 11-Wochen-Fahrplan bis 30.09.).
- [x] **Deploy vorbereitet**: PWA-Build verifiziert (Manifest/SW/standalone), `DEPLOY.md`
      mit HTTPS-Hosting-Anleitung (Netlify Drop u. a.) + LAN-Preview (`lernapp-preview`).
      Der externe Upload bleibt beim User (Publish-Aktion).

Offen:
- [ ] Externer HTTPS-Upload zur echten Handy-Installation (durch den User).
- [ ] Noch mehr Decks/Aufgaben nach Bedarf.
- [ ] Echte Manifest-Screenshots (Install-Dialog Android/Desktop).
- [ ] Verlaufs-Detailansicht je Item (EF/Intervall-Kurve).

**Zurückgestellt (bewusst, Fokus liegt aktuell nur auf AP1):**
- [ ] AP2-Grundlagen-Items (RAID/SQL/SAN/Struktogramm/Vererbung) als
      `ap1Status:"ap2-grundlagen"` — kommt erst später dazu, nicht Teil des AP1-Fokus.

Fachliche Fixpunkte, Belege und Widersprüche: Vault `07-Quellen-Offene-Punkte.md`.

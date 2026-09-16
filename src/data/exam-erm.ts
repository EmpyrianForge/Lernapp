// Prüfungsaufgaben zu Datenbanken: ERM, Tabellenmodell, Redundanz (Nachtrag 16.09.2026, Lückencheck AP1
// Abschnitt 3 Nr. 1: ERM-Schlagwort in 5 von 10 AP1 (H2022, H2023, H2024, H2025, F2026), zuletzt H2025 „zeichnen“
// und F2026 „ergänzen“ –, Redundanz in F2025; im Bestand gab es dazu keine einzige Aufgabe).
// Eigene Szenarien (Fahrradwerkstatt, Schulungsanbieter, Werkzeugverleih im Baumarkt) statt IHK-/WBS-Originalen;
// gleiche Aufgabentypen: ERM ergänzen, ERM aus Text erstellen und ins Tabellenmodell überführen, Redundanz und Anomalien.
// Scope laut Themenliste zum Katalog Okt. 2024 (it-berufe-podcast) und #190/#194: einfache ER-Modelle mit ERM und
// Tabellenmodell, PK/FK, Auflösung von n:m, Bedeutung von Redundanz mit Folge Inkonsistenz = Kern;
// Einfüge-/Löschanomalie, Normalisierung als Begriff, Datentypen im Tabellenmodell, künstliche Schlüssel = [RAND];
// Normalformen im Detail und (min,max)-Notation = [AP2]; SQL ist seit 2025 Teil 2 und kommt hier nicht vor.
// Notation: Die IHK schreibt keine vor. Referenz ist die Chen-Notation (Rechteck, Raute, Ellipse, PK unterstrichen,
// Kardinalitäten 1/n/m am Entitätstyp, von dem es 1 bzw. viele gibt); im ERM keine Fremdschlüssel, n:m bleibt stehen.
// Tabellenmodell: PK unterstrichen und mit „PK“ markiert, FK mit „FK“, 1 und n an den Beziehungslinien.
// Randstoff-Teile tragen den Marker [RAND] direkt im Prompt und in der Rubric.
// part.figure verweist auf ein Musterlösungs-Diagramm in components/ErmFigure.tsx (IDs „erm-…“), gefunden über UmlFigure.

import type { ExamTask } from './exam-tasks'

export const EXAM_ERM: ExamTask[] = [
  {
    id: 'task-erm-fahrradwerkstatt-ergaenzen',
    title: 'ERM ergänzen: Reparaturaufträge der Fahrradwerkstatt',
    topicId: 'datenbanken',
    scenario:
      'Eine Fahrradwerkstatt ersetzt ihre Karteikarten durch eine kleine Datenbankanwendung. Aus dem Gespräch mit dem Inhaber stammen folgende Anforderungen:\n\n' +
      '- Von jedem **Kunden** werden Kundennummer, Name und Telefonnummer gespeichert. Ein Kunde kann mehrere Fahrräder in die Werkstatt bringen; jedes erfasste Fahrrad gehört genau einem Kunden.\n' +
      '- Jedes **Fahrrad** wird mit seiner eindeutigen Rahmennummer, der Marke und dem Typ (z. B. E-Bike, Trekkingrad) erfasst.\n' +
      '- Für jede Reparatur wird ein **Auftrag** mit Auftragsnummer, Annahmedatum und Fehlerbild angelegt. Ein Auftrag betrifft genau ein Fahrrad; für ein Fahrrad kommen im Lauf der Jahre viele Aufträge zusammen.\n' +
      '- In einem Auftrag können mehrere **Ersatzteile** (Artikelnummer, Bezeichnung, Preis) verbaut werden, und dasselbe Ersatzteil, etwa ein Satz Bremsbeläge, wird in vielen Aufträgen verwendet. Je Auftrag und Ersatzteil wird die verbaute Stückzahl festgehalten.\n' +
      '- Neu hinzugekommen: Jeder Auftrag wird von genau einem **Mechaniker** (Personalnummer, Name) bearbeitet; ein Mechaniker bearbeitet viele Aufträge.\n\n' +
      'Ein Kollege hat ein ERM in Chen-Notation begonnen. **Bisher ist gezeichnet:**\n\n' +
      '- die Entitätstypen `Kunde`, `Fahrrad`, `Auftrag` und `Ersatzteil` als Rechtecke\n' +
      '- ihre Attribute als Ellipsen: Kunde mit `Kundennr`, `Name`, `Telefon`; Fahrrad mit `Rahmennr`, `Marke`, `Typ`; Auftrag mit `Auftragsnr`, `Annahmedatum`, `Fehlerbild`; Ersatzteil mit `Artikelnr`, `Bezeichnung`, `Preis`. Noch ist kein Attribut unterstrichen.\n' +
      '- die Beziehungen als Rauten: `besitzt` zwischen Kunde und Fahrrad, `betrifft` zwischen Fahrrad und Auftrag, `verbaut` zwischen Auftrag und Ersatzteil, jeweils **ohne Kardinalitäten**\n\n' +
      'Der Mechaniker und die Stückzahl fehlen noch. Bleiben Sie bei Ihren Ergänzungen in der Chen-Notation der Vorgabe und schreiben Sie Kardinalitäten als 1, n oder m an die Linien.\n\n' +
      '**Einordnung:** Kern. ERM-Ergänzungsaufgaben gab es laut Forenberichten in H2023 und F2026. Bei diesem Aufgabentyp ist die Notation vorgegeben, und man arbeitet in ihr weiter, statt sie zu wechseln.',
    parts: [
      {
        label: 'a)',
        operator: 'ergänzen',
        points: 4,
        prompt:
          'Ergänzen Sie an den drei vorhandenen Beziehungen die Kardinalitäten. Begründen Sie jede Kardinalität mit zwei Sätzen, einem je Richtung, die jeweils mit „Ein …“ beginnen (auf Papier skizzieren, dann mit der Musterlösung vergleichen).',
        modelAnswer:
          '**besitzt: Kunde 1 : n Fahrrad**\n' +
          'Ein Kunde besitzt **n** (mehrere) Fahrräder. Ein Fahrrad gehört **1** (genau einem) Kunden. → **1** an der Linie zum Kunden, **n** an der Linie zum Fahrrad.\n' +
          '**betrifft: Fahrrad 1 : n Auftrag**\n' +
          'Ein Fahrrad hat im Lauf der Zeit **n** Aufträge. Ein Auftrag betrifft **1** Fahrrad. → **1** am Fahrrad, **n** am Auftrag.\n' +
          '**verbaut: Auftrag n : m Ersatzteil**\n' +
          'Ein Auftrag enthält **m** Ersatzteile. Ein Ersatzteil wird in **n** Aufträgen verbaut. → **n** am Auftrag, **m** am Ersatzteil. Die zwei verschiedenen Buchstaben zeigen, dass beide Seiten unabhängig voneinander „viele“ sein können; m : n ist ebenso richtig.\n' +
          '**Leseregel:** Die Angabe steht bei dem Entitätstyp, von dem es 1 bzw. viele gibt („1 Kunde, n Fahrräder“). Achtung, [AP2]: In der (min,max)-Notation aus Studium und Fachbüchern steht die Angabe an der eigenen Seite, also genau umgekehrt.\n' +
          '**Typische Fehler:** nur eine Richtung durchdenken (dann wird aus n : m schnell 1 : n), die Angaben an die falsche Seite schreiben oder die n : m-Beziehung schon im ERM über eine Zwischentabelle auflösen. Das gehört erst ins Tabellenmodell.\n' +
          'Das vollständige ERM mit den Ergänzungen aus b) und c) zeigt die Grafik in der Musterlösung zu c).',
        rubric: [
          'besitzt als 1 : n mit 1 beim Kunden und n beim Fahrrad (1 P)',
          'betrifft als 1 : n mit 1 beim Fahrrad und n beim Auftrag (1 P)',
          'verbaut als n : m bzw. m : n (1 P)',
          'Begründung je Beziehung mit beiden Richtungen, nicht nur mit einer (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'ergänzen',
        points: 3,
        prompt:
          'Ergänzen Sie das ERM um den Mechaniker mit seinen Attributen, der passenden Beziehung und deren Kardinalität. Tragen Sie außerdem die Stückzahl der verbauten Ersatzteile an der fachlich richtigen Stelle ein und begründen Sie diese Stelle.',
        modelAnswer:
          '**Neuer Entitätstyp:** `Mechaniker` (Rechteck) mit den Attributen `Personalnr` und `Name` (Ellipsen).\n' +
          '**Neue Beziehung:** Raute `bearbeitet` zwischen Mechaniker und Auftrag, **Mechaniker 1 : n Auftrag**. Ein Mechaniker bearbeitet n Aufträge, ein Auftrag wird von 1 Mechaniker bearbeitet. → **1** am Mechaniker, **n** am Auftrag.\n' +
          '**Stückzahl:** Attribut `Menge` als Ellipse **an der Raute** `verbaut`. Die Menge gehört nicht allein zum Auftrag, denn ein Auftrag enthält verschiedene Teile in verschiedener Anzahl. Sie gehört auch nicht allein zum Ersatzteil, denn in jedem Auftrag wird eine andere Anzahl verbaut. Erst die Kombination aus einem Auftrag und einem Ersatzteil legt die Menge fest, also die Beziehung.\n' +
          '**Kontrolle:** Kein Attribut `Personalnr` am Auftrag ergänzen; die Zuordnung zeigt allein die Raute. Im Tabellenmodell wird `Menge` später eine Spalte der Zwischentabelle.',
        rubric: [
          'Mechaniker als Entitätstyp mit Personalnr und Name (1 P)',
          'Beziehung bearbeitet zwischen Mechaniker und Auftrag, 1 beim Mechaniker und n beim Auftrag (1 P)',
          'Menge als Attribut der Beziehung verbaut, begründet mit der Kombination aus Auftrag und Ersatzteil (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'vervollständigen',
        points: 2,
        prompt:
          'Vervollständigen Sie das ERM, indem Sie in allen fünf Entitätstypen den Primärschlüssel kennzeichnen. Begründen Sie, warum der Kundenname als Primärschlüssel ungeeignet ist.',
        modelAnswer:
          '**Primärschlüssel (unterstrichen):** `Kundennr` (Kunde), `Rahmennr` (Fahrrad), `Auftragsnr` (Auftrag), `Artikelnr` (Ersatzteil), `Personalnr` (Mechaniker). In der Chen-Notation wird der Primärschlüssel unterstrichen. `Menge` an der Beziehung ist kein Schlüssel.\n' +
          '**Name ungeeignet:** Ein Primärschlüssel muss jeden Datensatz **eindeutig** identifizieren und sollte sich **nicht ändern**. Namen sind nicht eindeutig, denn zwei Kunden können gleich heißen, und sie können sich ändern, z. B. durch Heirat. Die Kundennummer vergibt die Werkstatt selbst; sie ist eindeutig und bleibt gleich.\n' +
          '[RAND] Die Rahmennummer ist ein natürlicher Schlüssel aus der realen Welt. Fehlt sie bei alten Rädern, vergibt die Werkstatt besser eine eigene Fahrradnummer (künstlicher Schlüssel).\n' +
          '**Gesamtlösung a) bis c):** siehe Grafik.',
        figure: 'erm-fahrradwerkstatt',
        rubric: [
          'alle fünf Primärschlüssel richtig gewählt und unterstrichen (1 P)',
          'Begründung: Name ist nicht eindeutig bzw. kann sich ändern (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'beurteilen',
        points: 1,
        prompt:
          'Ein Kollege möchte beim Fahrrad zusätzlich das Attribut `Kundennr` einzeichnen, „damit man sieht, wem das Rad gehört“. Beurteilen Sie den Vorschlag.',
        modelAnswer:
          '**Nicht übernehmen.** Wem das Rad gehört, zeigt das ERM bereits über die Beziehung `besitzt`. Ein Fremdschlüssel gehört **nicht** ins ERM. Die `Kundennr` erscheint erst beim Überführen ins **Tabellenmodell**, und zwar als Fremdschlüssel in der Tabelle `Fahrrad`, also auf der n-Seite der 1 : n-Beziehung.\n' +
          'ERM und Tabellenmodell zu vermischen (Fremdschlüssel oder Zwischentabellen im ERM) ist ein klassischer Fehler bei dieser Aufgabenart.',
        rubric: [
          'abgelehnt mit Begründung: keine Fremdschlüssel im ERM, Zuordnung über die Beziehung, FK erst im Tabellenmodell auf der n-Seite (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-erm-schulungsanbieter-tabellenmodell',
    title: 'ERM erstellen und ins Tabellenmodell überführen: Kursbuchungen beim Schulungsanbieter',
    topicId: 'datenbanken',
    scenario:
      'Ein Schulungsanbieter bietet Abendkurse zu Tabellenkalkulation, Bildbearbeitung und Programmierung an. Die Buchungen werden bisher in einer Tabellenkalkulation gepflegt; künftig soll eine relationale Datenbank sie verwalten. Die Fachabteilung beschreibt:\n\n' +
      '- Jeder **Dozent** hat eine Dozentennummer, einen Namen und ein Fachgebiet. Ein Dozent leitet mehrere Kurse; jeder Kurs wird von genau einem Dozenten geleitet.\n' +
      '- Jeder **Kurs** hat eine Kursnummer, einen Titel, ein Startdatum und einen Preis.\n' +
      '- Von jedem **Teilnehmer** werden Teilnehmernummer, Name und E-Mail-Adresse gespeichert.\n' +
      '- Ein Teilnehmer kann mehrere Kurse buchen, und ein Kurs wird von vielen Teilnehmern gebucht. Denselben Kurs kann ein Teilnehmer nur einmal buchen. Zu jeder Buchung werden das Buchungsdatum und die Angabe gespeichert, ob die Kursgebühr bereits bezahlt ist.\n' +
      '- Auf der Teilnahmebescheinigung soll der Name des Dozenten stehen.\n\n' +
      '**Einordnung:** Kern (einfache ER-Modelle mit ERM und Tabellenmodell laut Themenliste zum Prüfungskatalog Okt. 2024). Datentypen im Tabellenmodell sind [RAND]. SQL gehört seit 2025 zu Teil 2 und ist hier nicht gefragt.',
    parts: [
      {
        label: 'a)',
        operator: 'erstellen',
        points: 6,
        prompt:
          'Erstellen Sie aus der Beschreibung ein ERM in Chen-Notation mit allen Entitätstypen, Attributen, Primärschlüsseln, Beziehungen und Kardinalitäten (auf Papier zeichnen, dann mit der Musterlösung vergleichen).',
        modelAnswer:
          '**Entitätstypen mit Attributen** (Primärschlüssel unterstrichen):\n' +
          '`Dozent`: `DozentNr`, `Name`, `Fachgebiet`\n' +
          '`Kurs`: `KursNr`, `Titel`, `Startdatum`, `Preis`\n' +
          '`Teilnehmer`: `TeilnehmerNr`, `Name`, `Email`\n' +
          '**Beziehungen:**\n' +
          '`leitet` zwischen Dozent und Kurs: **Dozent 1 : n Kurs**. Ein Dozent leitet n Kurse, ein Kurs wird von 1 Dozent geleitet.\n' +
          '`bucht` zwischen Kurs und Teilnehmer: **Kurs n : m Teilnehmer**. Ein Teilnehmer bucht n Kurse, ein Kurs hat m Teilnehmer.\n' +
          '**Beziehungsattribute:** `Buchungsdatum` und `bezahlt` als Ellipsen an der Raute `bucht`. Sie beschreiben eine einzelne Buchung, also die Kombination aus Teilnehmer und Kurs.\n' +
          '**Kontrolle:** Der Dozentenname für die Bescheinigung ist **kein** zusätzliches Attribut von Kurs. Er ergibt sich über die Beziehung `leitet`; ein zweites Speichern wäre Redundanz. Im ERM stehen **keine Fremdschlüssel**, und die n : m-Beziehung bleibt als Raute stehen. Beides kommt erst im Tabellenmodell. Entitätstypen stehen im Singular („Kurs“, nicht „Kurse“).\n' +
          '[RAND] Guter Stil wäre, `Name` in `Vorname` und `Nachname` zu teilen (atomare Attribute); beides gilt hier als richtig.',
        figure: 'erm-schulung',
        rubric: [
          'drei Entitätstypen Dozent, Kurs, Teilnehmer (1 P)',
          'Attribute vollständig und dem richtigen Entitätstyp zugeordnet, kein Dozentenname am Kurs (1 P)',
          'Primärschlüssel DozentNr, KursNr, TeilnehmerNr unterstrichen (1 P)',
          'leitet als 1 : n mit 1 beim Dozenten und n beim Kurs (1 P)',
          'bucht als n : m (1 P)',
          'Buchungsdatum und bezahlt an der Beziehung bucht; keine Fremdschlüssel und keine Zwischentabelle im ERM (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'erstellen',
        points: 4,
        prompt:
          'Überführen Sie Ihr ERM in ein Tabellenmodell. Geben Sie für jede Tabelle den Namen und alle Spalten an, kennzeichnen Sie Primär- und Fremdschlüssel und tragen Sie die Kardinalitäten an den Beziehungslinien ein. [RAND] Ergänzen Sie freiwillig zu jeder Spalte einen passenden Datentyp (ohne Punkte).',
        modelAnswer:
          '**Dozent:** `DozentNr` (PK), `Name`, `Fachgebiet`\n' +
          '**Kurs:** `KursNr` (PK), `Titel`, `Startdatum`, `Preis`, `DozentNr` (FK)\n' +
          '**Teilnehmer:** `TeilnehmerNr` (PK), `Name`, `Email`\n' +
          '**Buchung:** `KursNr` (PK, FK), `TeilnehmerNr` (PK, FK), `Buchungsdatum`, `bezahlt`\n' +
          '**Beziehungen:** Dozent 1 — n Kurs · Kurs 1 — n Buchung · Teilnehmer 1 — n Buchung. Die 1 steht jeweils am Primärschlüssel, das n am Fremdschlüssel.\n' +
          '**Regeln:** Jeder Entitätstyp wird eine Tabelle. Bei 1 : n kommt der Primärschlüssel der 1-Seite als Fremdschlüssel in die Tabelle der **n-Seite** (`DozentNr` in `Kurs`). Die n : m-Beziehung wird eine eigene Tabelle `Buchung` mit beiden Fremdschlüsseln und den Beziehungsattributen.\n' +
          '**Datentypen [RAND]:** `DozentNr`, `KursNr`, `TeilnehmerNr` INTEGER; `Name`, `Fachgebiet`, `Titel`, `Email` VARCHAR; `Startdatum`, `Buchungsdatum` DATE; `Preis` DECIMAL; `bezahlt` BOOLEAN. NUMBER statt INTEGER oder DECIMAL ist ebenso richtig.\n' +
          '**Schreibweise:** In der Zeichnung PK zusätzlich unterstreichen. Andere eindeutige Kennzeichnungen, etwa ein ↑ vor dem Fremdschlüssel, erfüllen denselben Zweck.\n' +
          '**Typische Fehler:** `KursNr` als Fremdschlüssel in die Tabelle `Dozent` setzen (falsche Seite), in `Buchung` einen der beiden Fremdschlüssel oder die Beziehungsattribute vergessen, den Dozentennamen zusätzlich in `Kurs` speichern.',
        figure: 'erm-schulung-tabellen',
        rubric: [
          'vier Tabellen, darunter eine eigene Tabelle für die Buchungen (1 P)',
          'Primärschlüssel in Dozent, Kurs und Teilnehmer gekennzeichnet (1 P)',
          'DozentNr als Fremdschlüssel in Kurs (n-Seite), Kardinalitäten 1 und n an den Linien (1 P)',
          'Buchung mit beiden Fremdschlüsseln sowie Buchungsdatum und bezahlt (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'erläutern',
        points: 2,
        prompt:
          'Erläutern Sie, warum die Beziehung zwischen Teilnehmer und Kurs eine eigene Tabelle braucht und ein einzelner Fremdschlüssel nicht genügt. Nennen und begründen Sie den Primärschlüssel dieser Tabelle.',
        modelAnswer:
          '**Eigene Tabelle:** In einer Tabellenzelle steht genau ein Wert (Grundregel relationaler Tabellen, als 1. Normalform [AP2] bekannt). Ein Fremdschlüssel `TeilnehmerNr` in `Kurs` könnte je Kurszeile nur **einen** Teilnehmer aufnehmen; für zwanzig Teilnehmer müsste man den Kurs zwanzigmal mit Titel, Startdatum und Preis speichern, also redundant. Zudem stünde dieselbe `KursNr` dann in zwanzig Zeilen und könnte den Kurs nicht mehr eindeutig identifizieren; sie wäre also kein Primärschlüssel mehr. Umgekehrt gilt dasselbe für `KursNr` in `Teilnehmer`. Die Tabelle `Buchung` zerlegt die n : m-Beziehung deshalb in **zwei 1 : n-Beziehungen**. Jede Zeile steht für genau eine Buchung, also ein Paar aus Kurs und Teilnehmer, und nimmt auch `Buchungsdatum` und `bezahlt` auf.\n' +
          '**Primärschlüssel:** zusammengesetzt aus `KursNr` und `TeilnehmerNr`; beide sind zugleich Fremdschlüssel. Einzeln sind sie nicht eindeutig, denn ein Kurs hat viele Buchungen und ein Teilnehmer ebenfalls. Die Kombination ist eindeutig, weil ein Teilnehmer denselben Kurs nur einmal buchen kann.\n' +
          '[RAND] Alternative: ein künstlicher Schlüssel `BuchungNr`. Dann sind `KursNr` und `TeilnehmerNr` nur Fremdschlüssel, und ihre Kombination muss trotzdem eindeutig bleiben.',
        rubric: [
          'Begründung: ein Fremdschlüssel nimmt je Zeile nur einen Wert auf, n : m braucht eine Zeile je Paar (Zerlegung in zwei 1 : n) (1 P)',
          'zusammengesetzter Primärschlüssel aus KursNr und TeilnehmerNr, begründet mit der nur einmal möglichen Buchung (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-erm-werkzeugverleih-redundanz',
    title: 'Redundanz und Anomalien: Ausleihliste des Werkzeugverleihs',
    topicId: 'datenbanken',
    scenario:
      'Ein Baumarkt verleiht Werkzeuge tageweise. Die Ausleihen stehen bisher in einer einzigen Tabelle einer Tabellenkalkulation; pro Ausleihe wird genau ein Werkzeug verliehen. Ein Auszug:\n\n' +
      '| AusleihNr | Datum | KundenNr | Kundenname | E-Mail | InventarNr | Werkzeug | Tagespreis |\n' +
      '|---|---|---|---|---|---|---|---|\n' +
      '| 501 | 02.09.2026 | K12 | Jana Roth | roth@example.org | W07 | Bohrhammer | 18,00 € |\n' +
      '| 502 | 02.09.2026 | K15 | Timo Brandt | brandt@example.org | W03 | Tellerschleifer | 9,50 € |\n' +
      '| 503 | 05.09.2026 | K12 | Jana Roth | roth@example.org | W11 | Fliesenschneider | 12,00 € |\n' +
      '| 504 | 08.09.2026 | K21 | Olga Weiß | weiss@example.org | W07 | Bohrhammer | 18,00 € |\n' +
      '| 505 | 09.09.2026 | K12 | Jana Roth | jana.roth@example.org | W03 | Tellerschleifer | 9,50 € |\n' +
      '| 506 | 12.09.2026 | K15 | Timo Brandt | brandt@example.org | W07 | Bohrhammer | 18,00 € |\n\n' +
      'Die Filialleitung möchte die Liste in eine relationale Datenbank übernehmen.\n\n' +
      '**Einordnung:** Redundanz und ihre Folge Inkonsistenz (Änderungsanomalie) sind Kern; danach wurde in F2025 gefragt. Einfüge- und Löschanomalie sind [RAND]: Die Themenliste zum Katalog Okt. 2024 nennt allgemein mögliche Folgen der Redundanz, der Prüfer Stefan Macke hält die beiden Anomalien für die AP1 aber nicht für nötig (it-berufe-podcast #194). Der Begriff Normalisierung ist [RAND], die Normalformen im Einzelnen sind [AP2].',
    parts: [
      {
        label: 'a)',
        operator: 'erläutern',
        points: 2,
        prompt: 'Erläutern Sie den Begriff Redundanz und zeigen Sie zwei Stellen, an denen die Liste redundante Daten enthält.',
        modelAnswer:
          '**Redundanz** bedeutet, dass dieselbe Information **mehrfach** gespeichert ist, ohne dass dadurch neue Information entsteht. In Datenbanken ist sie unerwünscht, weil jede Kopie gepflegt werden muss.\n' +
          '**Stellen in der Liste (zwei genügen):**\n' +
          '- Der Name von Kunde K12 steht dreimal (501, 503, 505). Auch ihre E-Mail-Adresse ist in jeder dieser Zeilen gespeichert, in 505 allerdings schon mit abweichendem Wert (siehe b)).\n' +
          '- Bezeichnung und Tagespreis von Werkzeug W07 stehen dreimal (501, 504, 506).\n' +
          '- Kunde K15 steht zweimal mit allen Daten (502, 506), Werkzeug W03 ebenfalls (502, 505).\n' +
          '**Kontrolle:** Gleiche Werte sind nicht automatisch redundant. Das Datum 02.09.2026 in 501 und 502 gehört zu zwei verschiedenen Ausleihen und ist jeweils eine eigene Information. Nicht verwechseln mit der **gewollten** Redundanz bei RAID oder Datensicherung, die Ausfälle abfedern soll.',
        rubric: [
          'Definition: dieselbe Information mehrfach gespeichert (1 P)',
          'zwei konkrete Stellen, z. B. der Name von K12 in 501, 503, 505 und Bezeichnung und Tagespreis von W07 in 501, 504, 506 (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'erläutern',
        points: 2,
        prompt:
          'Erläutern Sie, welches Problem die Redundanz beim Ändern von Daten verursacht. In der Liste ist dieses Problem bereits aufgetreten. Nennen Sie die Stelle.',
        modelAnswer:
          '**Änderungsanomalie → Inkonsistenz:** Ändert sich eine Information, muss sie in **jeder** Zeile geändert werden, in der sie steht. Wird eine Zeile vergessen, widersprechen sich die Daten. Beispiel: Jana Roth (K12) nennt eine neue E-Mail-Adresse; sie muss in 501, 503 und 505 geändert werden.\n' +
          '**Bereits aufgetreten:** In Ausleihe **505** steht für K12 die Adresse `jana.roth@example.org`, in 501 und 503 dagegen `roth@example.org`. Welche gilt, lässt sich aus der Liste nicht mehr sagen: Die Daten sind **inkonsistent**.\n' +
          '**Kontrolle:** „Die Liste braucht mehr Speicher“ stimmt zwar, trifft aber nicht den Kern; gefragt ist die Inkonsistenz. Der Tagespreis taugt nur bedingt als Beispiel: Eine Preiserhöhung darf alte Ausleihen nicht nachträglich verteuern. Wer den vereinbarten Preis festhalten will, speichert ihn zusätzlich bei der Ausleihe (siehe d)).',
        rubric: [
          'Änderungsanomalie erläutert: Änderung muss in allen Kopien erfolgen, sonst Inkonsistenz; Beispiel aus der Liste (1 P)',
          'widersprüchliche E-Mail-Adresse von K12 in Ausleihe 505 gefunden (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'erläutern',
        points: 2,
        prompt: '[RAND] Erläutern Sie die Einfügeanomalie und die Löschanomalie jeweils an einem konkreten Beispiel aus der Liste.',
        modelAnswer:
          '**Einfügeanomalie:** Neue Daten lassen sich nicht speichern, ohne andere Daten mitzuerfassen. Jede Zeile ist eine Ausleihe und braucht eine Ausleihnummer. Kauft der Baumarkt einen Betonmischer (W14, 25,00 €), lässt er sich erst eintragen, wenn ihn jemand ausleiht. Ebenso kann ein neuer Kunde nicht ohne Ausleihe erfasst werden.\n' +
          '**Löschanomalie:** Beim Löschen einer Zeile gehen ungewollt weitere Informationen verloren. Wird Ausleihe **503** gelöscht, z. B. nach einer Stornierung, verschwindet der Fliesenschneider W11 samt Tagespreis vollständig aus der Liste. Beim Löschen von **504** geht die Kundin Olga Weiß (K21) verloren.\n' +
          'Zusammen mit der Änderungsanomalie aus b) sind das die drei klassischen Anomalien.',
        rubric: [
          '[RAND] Einfügeanomalie mit passendem Beispiel, z. B. neues Werkzeug ohne Ausleihe (1 P)',
          '[RAND] Löschanomalie mit passendem Beispiel, z. B. W11 verschwindet mit Ausleihe 503 (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'erstellen',
        points: 3,
        prompt:
          'Schlagen Sie eine Aufteilung der Liste auf mehrere Tabellen vor. Erstellen Sie dazu ein Tabellenmodell mit Tabellennamen, Spalten, Primär- und Fremdschlüsseln sowie den Kardinalitäten. Begründen Sie kurz, warum die Probleme aus b) und c) damit entfallen.',
        modelAnswer:
          '**Kunde:** `KundenNr` (PK), `Name`, `Email`\n' +
          '**Werkzeug:** `InventarNr` (PK), `Bezeichnung`, `Tagespreis`\n' +
          '**Ausleihe:** `AusleihNr` (PK), `Datum`, `KundenNr` (FK), `InventarNr` (FK)\n' +
          'PK = Primärschlüssel (in der Zeichnung zusätzlich unterstrichen), FK = Fremdschlüssel. Die Spalten `Kundenname` und `Werkzeug` der Liste heißen in den neuen Tabellen `Name` und `Bezeichnung`; die alten Namen sind ebenso richtig.\n' +
          '**Beziehungen:** Kunde 1 — n Ausleihe · Werkzeug 1 — n Ausleihe. Ein Werkzeug wird oft verliehen, eine Ausleihe umfasst genau ein Werkzeug. Die Fremdschlüssel stehen auf der n-Seite in `Ausleihe`.\n' +
          '**Vereinbarter Preis [RAND]:** Soll der Preis zum Zeitpunkt der Ausleihe erhalten bleiben (siehe b)), bekommt `Ausleihe` zusätzlich eine Spalte `vereinbarterPreis`. Das ist keine Redundanz: Die Spalte hält fest, was bei dieser Ausleihe galt, und ist damit eine eigene Information der Ausleihe, die vom späteren Listenpreis abweichen darf. Der aktuelle `Tagespreis` bleibt in `Werkzeug`. Beide Lösungen gelten als richtig; die Grafik zeigt die Grundlösung ohne diese Spalte.\n' +
          '**Warum die Probleme entfallen:** Jede Kunden- und Werkzeuginformation steht nur noch **einmal**. Eine neue E-Mail-Adresse wird an einer Stelle geändert. Ein neues Werkzeug oder ein neuer Kunde lässt sich ohne Ausleihe anlegen. Wird eine Ausleihe gelöscht, bleiben Kunde und Werkzeug erhalten, denn die Ausleihe verweist nur über die Nummern auf sie.\n' +
          '**Typische Fehler:** den Kundennamen zusätzlich in `Ausleihe` stehen lassen (die Redundanz bleibt), die Fremdschlüssel in `Kunde` oder `Werkzeug` setzen (falsche Seite), `Ausleihe` ohne eigenen Primärschlüssel lassen.\n' +
          'Soll eine Ausleihe später mehrere Werkzeuge umfassen, wird daraus eine n : m-Beziehung mit einer Zwischentabelle, z. B. `Ausleihposition`.',
        figure: 'erm-werkzeugverleih-tabellen',
        rubric: [
          'Kunde und Werkzeug als eigene Tabellen mit Primärschlüssel, Spalten richtig verteilt; eine zusätzliche Spalte für den vereinbarten Preis in Ausleihe ist ebenfalls richtig (1 P)',
          'Ausleihe mit KundenNr und InventarNr als Fremdschlüssel, Kardinalitäten 1 : n (1 P)',
          'Begründung: jede Information nur einmal gespeichert, dadurch entfallen die Anomalien (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'nennen',
        points: 1,
        prompt: '[RAND] Nennen Sie den Fachbegriff für das schrittweise Aufteilen von Tabellen mit dem Ziel, Redundanz zu vermeiden.',
        modelAnswer:
          '**Normalisierung.** Ziel ist, dass jede Information nur einmal gespeichert wird und keine Anomalien auftreten.\n' +
          '[AP2] Die Normalformen im Einzelnen: 1. NF = nur atomare Werte; 2. NF = kein Nichtschlüsselattribut hängt nur von einem Teil eines zusammengesetzten Schlüssels ab; 3. NF = keine Abhängigkeit zwischen Nichtschlüsselattributen. In der Liste hängt z. B. der Kundenname direkt an der `KundenNr` und nur über sie an der `AusleihNr` (transitive Abhängigkeit, Verstoß gegen die 3. NF); genau das behebt die Aufteilung aus d). Ob ein Wert atomar ist, hängt davon ab, was die Anwendung mit ihm tut: Viele Lehrbücher werten auch einen zusammengesetzten Namen als nicht atomar. Muss die Anwendung nach Nachnamen sortieren oder suchen, teilt man ihn deshalb in Vor- und Nachname (guter Stil, siehe Aufgabe 2 a)). Für die Aufteilung in d) ist das nicht nötig.',
        rubric: ['[RAND] Normalisierung genannt (1 P)'],
      },
    ],
  },
]

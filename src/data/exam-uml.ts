// UML-Prüfungsaufgaben aus dem Abgleich mit der Prüfungsvorbereitung PV1, Tag 1 (15.09.2026).
// Eigene Szenarien im AP1-Format — bewusst NICHT die IHK-Originale (Herbst 2024: Use Case,
// Herbst 2025: Aktivitätsdiagramm), sondern gleiche Struktur mit anderem Fachkontext.
// part.figure verweist auf ein Musterlösungs-Diagramm in components/UmlFigure.tsx.

import type { ExamTask } from './exam-tasks'

export const EXAM_UML: ExamTask[] = [
  {
    id: 'task-uml-usecase-bibliothek',
    title: 'Anwendungsfalldiagramm: Ausleihsystem der Stadtbibliothek',
    topicId: 'softwareentwicklung',
    scenario:
      'Die Stadtbibliothek lässt ein neues Ausleihsystem entwickeln. Die Anforderungen sollen als UML-Anwendungsfalldiagramm modelliert werden:\n\n' +
      '- Leser können den Katalog durchsuchen, Medien ausleihen, Ausleihen verlängern und Medien zurückgeben.\n' +
      '- Beim Ausleihen und beim Verlängern wird immer der Leserausweis geprüft.\n' +
      '- Nur wenn beim Zurückgeben die Leihfrist überschritten ist, wird zusätzlich eine Mahngebühr berechnet. Die Mahngebühr wird über das externe Bezahlsystem der Stadt abgerechnet.\n' +
      '- Bibliothekare können alles, was Leser können. Zusätzlich pflegen sie den Medienbestand.',
    parts: [
      {
        label: 'a)',
        operator: 'erstellen',
        points: 8,
        prompt: 'Erstellen Sie das UML-Anwendungsfalldiagramm zu den Anforderungen (auf Papier skizzieren, dann mit der Musterlösung vergleichen).',
        modelAnswer:
          '**Systemgrenze** „Ausleihsystem Stadtbibliothek" mit allen Anwendungsfällen im Inneren.\n' +
          '**Akteure außerhalb:** Leser, Bibliothekar, Bezahlsystem (ein externes System ist ebenfalls ein Akteur).\n' +
          '**Anwendungsfälle:** Katalog durchsuchen, Medium ausleihen, Ausleihe verlängern, Leserausweis prüfen, Medium zurückgeben, Mahngebühr berechnen, Medienbestand pflegen.\n' +
          '**Assoziationen:** Leser – durchsuchen/ausleihen/verlängern/zurückgeben; Bibliothekar – Medienbestand pflegen; Bezahlsystem – Mahngebühr berechnen.\n' +
          '**«include»:** Medium ausleihen → Leserausweis prüfen und Ausleihe verlängern → Leserausweis prüfen (Pfeile zeigen auf den eingebundenen Fall).\n' +
          '**«extend»:** Mahngebühr berechnen → Medium zurückgeben (Pfeil zeigt auf den Basisfall). Im Basisfall steht ein Erweiterungspunkt (z. B. „Fristprüfung"), die Bedingung {Leihfrist überschritten} als Notiz am «extend»-Pfeil.\n' +
          '**Generalisierung:** Bibliothekar → Leser mit hohlem Dreieck am Leser; der Bibliothekar erhält dadurch alle Anwendungsfälle des Lesers.',
        figure: 'uc-bibliothek',
        rubric: [
          'Systemgrenze mit Namen, alle Akteure außerhalb (1 P)',
          'alle sieben Anwendungsfälle sinnvoll benannt (2 P)',
          'Assoziationen der drei Akteure korrekt (1 P)',
          '«include» zweimal, gestrichelt, Pfeil zum eingebundenen Fall (1,5 P)',
          '«extend» mit richtiger Pfeilrichtung, Erweiterungspunkt oder Bedingung angegeben (1,5 P)',
          'Generalisierung Bibliothekar → Leser mit hohlem Dreieck (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'erläutern',
        points: 2,
        prompt: 'Erläutern Sie den Unterschied zwischen «include» und «extend» anhand Ihres Diagramms. Gehen Sie auch auf die Pfeilrichtung ein.',
        modelAnswer:
          '**«include»:** Der Basisfall bindet den anderen Fall **immer** ein – jede Ausleihe und jede Verlängerung prüft zwingend den Leserausweis. Der Pfeil zeigt vom Basisfall auf den eingebundenen Fall („Leserausweis prüfen").\n' +
          '**«extend»:** Der erweiternde Fall wird nur **unter einer Bedingung** ausgeführt – die Mahngebühr fällt nur an, wenn die Leihfrist überschritten ist (Bedingung am Erweiterungspunkt). Der Pfeil zeigt vom erweiternden Fall („Mahngebühr berechnen") auf den Basisfall („Medium zurückgeben").',
        rubric: [
          'include = immer/unbedingt, Pfeil zum eingebundenen Fall (1 P)',
          'extend = nur unter Bedingung, Pfeil zum Basisfall (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'begründen',
        points: 2,
        prompt: 'Das Bezahlsystem ist kein Mensch. Begründen Sie, warum es trotzdem als Akteur modelliert wird, und geben Sie an, wo es im Diagramm stehen muss.',
        modelAnswer:
          'Ein Akteur ist eine **Rolle**, die von außen mit dem System interagiert – das kann ein Mensch oder ein **externes System** sein. Das Bezahlsystem der Stadt wird nicht mitentwickelt, tauscht aber Daten mit dem Ausleihsystem aus (Abrechnung der Mahngebühr). ' +
          'Deshalb steht es als Akteur **außerhalb der Systemgrenze** und ist mit „Mahngebühr berechnen" assoziiert.',
        rubric: [
          'Akteur = Rolle von außen, auch externe Systeme (1 P)',
          'außerhalb der Systemgrenze, assoziiert mit „Mahngebühr berechnen" (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-uml-aktivitaet-stoerungsticket',
    title: 'Aktivitätsdiagramm: Störungsticket im IT-Support',
    topicId: 'neu-2025',
    scenario:
      'Sie arbeiten im IT-Service eines Unternehmens. Der Ablauf einer Störungsmeldung soll als UML-Aktivitätsdiagramm dokumentiert werden:\n\n' +
      '1. Ein Mitarbeiter erfasst eine Störungsmeldung im Ticketsystem.\n' +
      '2. Der Service-Desk prüft in der Wissensdatenbank, ob eine Lösung bekannt ist.\n' +
      '3. Ist eine Lösung bekannt, wendet der Service-Desk sie an. Andernfalls leitet der Service-Desk das Ticket an den 2nd-Level-Support weiter, der die Störung analysiert und behebt.\n' +
      '4. Anschließend testet der Mitarbeiter, ob die Störung behoben ist. Ist sie nicht behoben, wird die Wissensdatenbank erneut geprüft.\n' +
      '5. Ist die Störung behoben, schließt der Service-Desk das Ticket und dokumentiert gleichzeitig die Lösung in der Wissensdatenbank. Danach ist der Ablauf beendet.',
    parts: [
      {
        label: 'a)',
        operator: 'erstellen',
        points: 9,
        prompt: 'Erstellen Sie ein UML-Aktivitätsdiagramm zu dem beschriebenen Ablauf (ohne Partitionen).',
        modelAnswer:
          'Ablauf von oben nach unten:\n' +
          '1. Startknoten → „Störungsmeldung erfassen"\n' +
          '2. **Zusammenführung** (Raute) → „Wissensdatenbank prüfen" → **Verzweigung** (Raute)\n' +
          '3. [Lösung bekannt] → „Bekannte Lösung anwenden"; [sonst] → „An 2nd-Level weiterleiten" → „Störung analysieren und beheben"\n' +
          '4. beide Zweige → **Zusammenführung** → „Behebung testen" → **Verzweigung**\n' +
          '5. [nicht behoben] → Rücksprung in die erste Zusammenführung vor „Wissensdatenbank prüfen"\n' +
          '6. [behoben] → **Gabelung** (Balken) → parallel „Ticket schließen" und „Lösung dokumentieren" → **Vereinigung** (Balken) → Aktivitätsende',
        figure: 'act-stoerungsticket',
        rubric: [
          'Startknoten und Aktivitätsende vorhanden (1 P)',
          'alle acht Aktionen in richtiger Reihenfolge, als abgerundete Rechtecke (2 P)',
          'Verzweigung „Lösung bekannt" mit zwei sich ausschließenden Guards (1 P)',
          'Zusammenführung beider Zweige vor „Behebung testen" (1 P)',
          'Verzweigung „behoben" mit Guards (1 P)',
          'Rücksprung über eine Zusammenführungsraute vor „Wissensdatenbank prüfen" (1 P)',
          'Gabelung und Vereinigung mit Balken für die parallelen Aktionen (2 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'zuordnen',
        points: 3,
        prompt: 'Das Diagramm soll in Partitionen (Swimlanes) für „Mitarbeiter", „Service-Desk" und „2nd-Level-Support" gegliedert werden. Ordnen Sie jede Aktion der richtigen Partition zu.',
        modelAnswer:
          '**Mitarbeiter:** Störungsmeldung erfassen, Behebung testen\n' +
          '**Service-Desk:** Wissensdatenbank prüfen, Bekannte Lösung anwenden, An 2nd-Level weiterleiten, Ticket schließen, Lösung dokumentieren\n' +
          '**2nd-Level-Support:** Störung analysieren und beheben\n' +
          'Kontrollflüsse dürfen die Grenzen der Partitionen überqueren – genau dort liegen die Übergaben.',
        rubric: [
          'Aktionen des Mitarbeiters korrekt (1 P)',
          'Aktionen des Service-Desks korrekt (1 P)',
          'Aktion des 2nd-Level-Supports korrekt (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'erklären',
        points: 3,
        prompt: 'Erklären Sie den Unterschied zwischen der Raute und dem Synchronisationsbalken in Ihrem Diagramm. Warum dürfen „Ticket schließen" und „Lösung dokumentieren" nicht mit einer Raute zusammengeführt werden?',
        modelAnswer:
          '**Raute** (Verzweigung/Zusammenführung): Es wird genau **ein** Weg genommen, abhängig von den Guards wie [Lösung bekannt]/[sonst]. Die Zusammenführung wartet nicht, weil ohnehin nur ein Zweig ankommt.\n' +
          '**Balken** (Gabelung/Vereinigung): **Alle** ausgehenden Wege werden ausgeführt; die Vereinigung wartet, bis **alle** Stränge fertig sind.\n' +
          'Mit einer Raute würde nicht auf beide Stränge gewartet: Der zuerst fertige Strang liefe sofort zum Aktivitätsende und beendete die Aktivität, obwohl die zweite Aufgabe womöglich noch nicht erledigt ist.',
        rubric: [
          'Raute: genau ein Weg, gesteuert über Guards (1 P)',
          'Balken: alle Wege, Vereinigung wartet auf alle Stränge (1 P)',
          'Begründung: Raute synchronisiert nicht (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-uml-klasse-ticket',
    title: 'Klassendiagramm: Klasse Ticket mit Sichtbarkeiten',
    topicId: 'softwareentwicklung',
    scenario:
      'Für das Ticketsystem soll eine Klasse `Ticket` entworfen werden. Vorgaben:\n\n' +
      '- Jedes Ticket hat eine Ticketnummer (Ganzzahl), einen Titel (Text), eine Priorität (Ganzzahl) und einen Status (Text).\n' +
      '- Die Attribute dürfen nur innerhalb der Klasse direkt verändert werden.\n' +
      '- Ein Ticket wird mit Titel und Priorität erzeugt.\n' +
      '- Von außen kann man den Status abfragen und das Ticket schließen (ohne Rückgabewert).\n' +
      '- Eine interne Hilfsmethode prüft, ob eine übergebene Priorität gültig ist (Rückgabe wahr/falsch); sie ist von außen nicht aufrufbar.',
    parts: [
      {
        label: 'a)',
        operator: 'erstellen',
        points: 6,
        prompt: 'Erstellen Sie das UML-Klassendiagramm der Klasse Ticket mit Attributen, Methoden, Datentypen und Sichtbarkeiten.',
        modelAnswer:
          'Klasse mit drei Bereichen:\n' +
          '**Name:** Ticket\n' +
          '**Attribute:** `- ticketNr : int`, `- titel : String`, `- prioritaet : int`, `- status : String`\n' +
          '**Methoden:** `+ Ticket(titel : String, prioritaet : int)` (Konstruktor, ohne Rückgabetyp), `+ getStatus() : String`, `+ schliessen() : void`, `- pruefePrioritaet(p : int) : boolean`',
        figure: 'class-ticket',
        rubric: [
          'drei Bereiche mit Klassenname (1 P)',
          'vier Attribute mit Datentyp (1 P)',
          'Attribute private (-) (1 P)',
          'Konstruktor mit Parametern, ohne Rückgabetyp (1 P)',
          'getStatus und schliessen public, mit Rückgabetyp (1 P)',
          'Hilfsmethode private, mit Parameter und Rückgabetyp boolean (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'erläutern',
        points: 2,
        prompt: 'Erläutern Sie, welches Prinzip der Objektorientierung mit den gewählten Sichtbarkeiten umgesetzt wird, und nennen Sie einen Vorteil.',
        modelAnswer:
          '**Kapselung** (Geheimnisprinzip): Die Attribute sind private und nur über öffentliche Methoden erreichbar. ' +
          'Vorteil: Das Objekt kontrolliert seinen Zustand selbst – `pruefePrioritaet()` kann ungültige Werte abweisen, und die interne Umsetzung lässt sich ändern, ohne dass aufrufender Code angepasst werden muss.',
        rubric: [
          'Kapselung bzw. Geheimnisprinzip benannt (1 P)',
          'sinnvoller Vorteil, z. B. Schutz vor ungültigem Zustand oder Änderbarkeit (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'angeben',
        points: 2,
        prompt: 'Geben Sie in Pseudocode an, wie ein Ticket „Drucker defekt" mit Priorität 2 erzeugt, anschließend geschlossen und sein Status ausgegeben wird.',
        modelAnswer:
          '`t = new Ticket("Drucker defekt", 2)`\n' +
          '`t.schliessen()`\n' +
          '`ausgabe(t.getStatus())`\n' +
          'Die Methoden werden über das Objekt `t` aufgerufen; ein direkter Zugriff wie `t.status` ist von außen wegen private nicht erlaubt.',
        rubric: [
          'Objekterzeugung mit beiden Konstruktorparametern (1 P)',
          'Methodenaufrufe über das Objekt, kein Direktzugriff auf Attribute (1 P)',
        ],
      },
    ],
  },
]

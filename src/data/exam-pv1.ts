// Prüfungsaufgaben zur Prüfungsvorbereitung PV1 (WBS). Tag 1: Klassendiagramm (Nachtrag 15.09.2026).
// Tag 2 (16.09.2026): USV (Klasse begründen, Scheinleistung mit Reserve, Shutdown-Zeitbudget) und
// Netzwerkdiagnose mit Windows-Befehlen (ipconfig /all, APIPA, ping von innen nach außen, nslookup,
// Gateway-Plausibilität). Eigene Szenarien (Planungsbüro, Physiotherapiepraxis) statt der WBS-Folien und
// -Übungen, alle Zahlen nachgerechnet. Einordnung Tag 2: USV-Klassen, Leistung und Überbrückungszeit = Kern;
// Shutdown-Software und Wartung = [RAND] (Marker direkt am Teil).
// Tag 3 (17.09.2026): Projektmanagement — Projektstart einer Kursbuchungs-App (Projektmerkmale, SMART-Ziel,
// Lasten-/Pflichtenheft, Stakeholder, magisches Dreieck klassisch/agil; Kick-off = [RAND]) und Terminplanung eines
// Kanzleiumzugs (PSP, Netzplan mit Gesamt- und freiem Puffer, Verzögerungen, Gantt mit Wochenende, Fehler finden).
// Eigene Szenarien (Fitnessstudio, Steuerkanzlei) statt der WBS-Folien; Scrum-Begriffe nach dem Scrum Guide 2020,
// weil die Kursfolien ältere bzw. falsche Angaben enthalten; alle Zahlen per Skript nachgerechnet.
// Tag 1 — eigene Szenarien (Musikschule, Mobilitätsstation, Betriebskantine) — bewusst NICHT die IHK-/WBS-Originale
// (AP1 Frühjahr 2026: Einzelklasse mit Attributen, Datentypen, Sichtbarkeit; WBS-Sammlung: Vererbung,
// Aggregation/Komposition, Datentypen zuordnen, OOP-Begriffe), sondern gleiche Aufgabentypen mit anderem Fachkontext.
// Scope laut Abgleich mit Katalog Okt. 2024 (Gegenüberstellung it-berufe-podcast #190): Einzelklasse, Datentypen,
// Klasse/Objekt/Methode = AP1-Kern; Vererbung = [AP2] (aus 04.06 gestrichen), abstrakt = [AP2] (hängt an Vererbung);
// Assoziation/Aggregation/Komposition = [RAND]. AP2-Stoff steht im Titel („(Vertiefung AP2)“), Randstoff im Titel
// („(Randstoff)“); gemischte Teilaufgaben tragen die Marker [AP2]/[RAND] direkt an den Begriffen.
// part.figure verweist auf ein Musterlösungs-Diagramm in components/UmlFigure.tsx.

import type { ExamTask } from './exam-tasks'

const IND = '  ' // geschütztes Leerzeichen: Einrückung im Pseudocode bleibt beim Rendern erhalten

export const EXAM_PV1: ExamTask[] = [
  {
    id: 'task-pv1-klasse-unterrichtsvertrag',
    title: 'Klassendiagramm: Unterrichtsvertrag der Musikschule (Datentypen & Pseudocode)',
    topicId: 'softwareentwicklung',
    scenario:
      'Eine Musikschule lässt ihre Vertragsverwaltung neu programmieren. Für jeden Unterrichtsvertrag soll ein Objekt der Klasse `Unterrichtsvertrag` den monatlichen Beitrag ermitteln. ' +
      'Im Klassendiagramm steht bisher nur die öffentliche Methode `berechneMonatsbeitrag()`, die den Beitrag in Euro als Kommazahl zurückliefert. Die Klasse soll außerdem folgende Daten speichern:\n\n' +
      '- das unterrichtete Instrument, z. B. „Querflöte“\n' +
      '- den Preis einer Unterrichtsstunde in Euro, z. B. 22,50\n' +
      '- die vereinbarte Anzahl Unterrichtsstunden pro Monat\n' +
      '- einen Rabatt in Prozent, z. B. 7,5 bei Geschwisterkindern\n' +
      '- ob ein Leihinstrument der Schule genutzt wird\n' +
      '- die monatliche Leihgebühr in Euro\n\n' +
      'Auf diese Daten darf nur innerhalb der Klasse direkt zugegriffen werden. Der Rabatt gilt nur für den Unterricht, nicht für die Leihgebühr. Die Leihgebühr fällt nur an, wenn ein Leihinstrument genutzt wird.',
    parts: [
      {
        label: 'a)',
        operator: 'vervollständigen',
        points: 6,
        prompt:
          'Vervollständigen Sie das UML-Klassendiagramm: Tragen Sie den Klassennamen sowie alle Attribute mit geeigneten Namen, Datentypen und Sichtbarkeiten ein. Die vorgegebene Methode bleibt erhalten (auf Papier skizzieren, dann mit der Musterlösung vergleichen).',
        modelAnswer:
          '**Name:** Unterrichtsvertrag\n' +
          '**Attribute:** `- instrument : String`, `- preisProStunde : double`, `- stundenProMonat : int`, `- rabattProzent : double`, `- leihinstrument : boolean`, `- leihgebuehr : double`\n' +
          '**Methode (vorgegeben):** `+ berechneMonatsbeitrag() : double`\n' +
          'Alle Attribute sind **private** (`-`), die Methode ist **public** (`+`). Schreibweise je Zeile: `Sichtbarkeit name : Datentyp`. Attributnamen beginnen klein (lowerCamelCase) und enthalten keine Leerzeichen oder Umlaute.',
        figure: 'class-unterrichtsvertrag',
        rubric: [
          'Klassenname im oberen Bereich, drei Bereiche (1 P)',
          'sechs Attribute mit sinnvollen Namen (1 P)',
          'Datentypen fachlich passend: String, double, int, double, boolean, double (2 P)',
          'alle Attribute private (-) (1 P)',
          'Methode unverändert public (+) mit leeren Klammern und Rückgabetyp double (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'begründen',
        points: 4,
        prompt:
          'Begründen Sie Ihre Datentypen für die Stundenanzahl, den Stundenpreis und das Leihinstrument. Die Schule möchte zusätzlich die Postleitzahl des Wohnorts speichern (z. B. 01067). Geben Sie dafür einen geeigneten Datentyp an und begründen Sie ihn.',
        modelAnswer:
          '**stundenProMonat : int** – eine Anzahl ist immer ganzzahlig; man zählt und rechnet damit.\n' +
          '**preisProStunde : double** – Geldbeträge haben Nachkommastellen (Cent), deshalb eine Gleitkommazahl. In der Praxis nimmt man für Geld oft einen exakten Dezimaltyp (z. B. `BigDecimal` in Java), weil double Rundungsfehler haben kann; in der AP1 ist double üblich.\n' +
          '**leihinstrument : boolean** – es gibt nur zwei Zustände (ja/nein), ein Wahrheitswert genügt.\n' +
          '**postleitzahl : String** – eine Postleitzahl ist ein Kennzeichen, keine Rechengröße: Man rechnet nicht damit, und als Ganzzahl ginge die führende Null verloren (01067 würde zu 1067).',
        rubric: [
          'Stundenanzahl als Ganzzahl (int), weil zählbar/ganzzahlig (1 P)',
          'Stundenpreis als Kommazahl (double oder Dezimaltyp), weil Cent-Beträge (1 P)',
          'Leihinstrument als boolean, weil nur ja/nein (1 P)',
          'Postleitzahl als String, weil führende Null und kein Rechnen (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'erstellen',
        points: 4,
        prompt:
          'Formulieren Sie die Methode `berechneMonatsbeitrag()` in Pseudocode. Die Methode arbeitet mit den Attributen des Objekts und gibt den Monatsbeitrag zurück.',
        modelAnswer:
          '`FUNKTION berechneMonatsbeitrag() : double`\n' +
          `\`${IND}unterricht = preisProStunde * stundenProMonat\`\n` +
          `\`${IND}unterricht = unterricht - unterricht * rabattProzent / 100\`\n` +
          `\`${IND}betrag = unterricht\`\n` +
          `\`${IND}WENN leihinstrument = wahr DANN\`\n` +
          `\`${IND}${IND}betrag = betrag + leihgebuehr\`\n` +
          `\`${IND}ENDE WENN\`\n` +
          `\`${IND}RÜCKGABE betrag\`\n` +
          '`ENDE FUNKTION`\n' +
          'Kontrolle: 4 Stunden zu je 22,50 €, 10 % Rabatt, Leihinstrument für 15 € → 90,00 − 9,00 + 15,00 = **96,00 €**. Wer den Rabatt erst nach der Leihgebühr abzieht, kommt auf 94,50 € – das widerspricht der Vorgabe.',
        rubric: [
          'Unterrichtskosten als Stundenpreis mal Stundenanzahl (1 P)',
          'Rabatt prozentual und nur auf die Unterrichtskosten angewendet (1 P)',
          'Leihgebühr nur über eine Verzweigung bei genutztem Leihinstrument addiert (1 P)',
          'Rückgabe des Betrags; Zugriff direkt auf die Attribute, keine Parameter nötig (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-vererbung-mobilitaetsstation',
    title: 'Klassendiagramm: Mietobjekte der Mobilitätsstation (Vertiefung AP2)',
    topicId: 'algo-testing-oop',
    scenario:
      'Die Stadtwerke betreiben Mobilitätsstationen, an denen man Lastenräder und Elektroautos mieten kann. Für die Buchungssoftware liegen zwei Klassen vor:\n\n' +
      '- **Lastenrad:** `inventarNr : String`, `tagespreis : double`, `kaufjahr : int`, `zuladungKg : int`; Methoden `reservieren() : void` und `mietpreisBerechnen(tage : int) : double`\n' +
      '- **Elektroauto:** `inventarNr : String`, `tagespreis : double`, `kaufjahr : int`, `kennzeichen : String`, `reichweiteKm : int`; Methoden `reservieren() : void`, `mietpreisBerechnen(tage : int) : double` und `ladestandAbfragen() : int`\n\n' +
      'Das Reservieren läuft bei beiden gleich ab. Der Mietpreis wird dagegen unterschiedlich berechnet: Lastenräder werden ab dem dritten Tag günstiger, bei Elektroautos kommt eine Ladepauschale hinzu. Vermietet werden nur konkrete Lastenräder und Elektroautos, nie ein „allgemeines“ Mietobjekt.\n\n' +
      '**Einordnung:** [AP2] – Vererbung ist laut der Gegenüberstellung des Katalogs 2025 (it-berufe-podcast #190) aus der AP1 gestrichen; abstrakte Klassen setzen Vererbung voraus und zählen deshalb ebenfalls zu AP2. Beides kam aber in älteren Prüfungen vor. Die Beziehungen der Station (Aggregation/Komposition) sind Randstoff und stehen in der eigenen Aufgabe „Beziehungen der Mobilitätsstation (Randstoff)“.',
    parts: [
      {
        label: 'a)',
        operator: 'erstellen',
        points: 7,
        prompt:
          'Erstellen Sie ein UML-Klassendiagramm mit der gemeinsamen Oberklasse `Mietobjekt` und den Unterklassen `Lastenrad` und `Elektroauto`. Jedes Attribut und jede Methode soll nur so oft wie nötig vorkommen. Kennzeichnen Sie abstrakte Elemente. Sichtbarkeiten und Konstruktoren sind nicht verlangt.',
        modelAnswer:
          '**Oberklasse Mietobjekt (abstrakt):** Name kursiv oder mit `{abstract}`\n' +
          'Attribute: `inventarNr : String`, `tagespreis : double`, `kaufjahr : int`\n' +
          'Methoden: `reservieren() : void` und `mietpreisBerechnen(tage : int) : double` – diese abstrakt (kursiv oder `{abstract}`)\n' +
          '**Unterklasse Lastenrad:** `zuladungKg : int`; `mietpreisBerechnen(tage : int) : double` (überschreibt)\n' +
          '**Unterklasse Elektroauto:** `kennzeichen : String`, `reichweiteKm : int`; `mietpreisBerechnen(tage : int) : double` (überschreibt), `ladestandAbfragen() : int`\n' +
          '**Generalisierung:** Lastenrad —▷ Mietobjekt und Elektroauto —▷ Mietobjekt, durchgezogene Linie mit **hohlem Dreieck an der Oberklasse**; beide Linien dürfen in ein gemeinsames Dreieck münden.\n' +
          'Typische Fehler: gemeinsame Attribute in den Unterklassen wiederholen, Dreieck an der Unterklasse, offene Pfeilspitze oder Raute statt Dreieck.',
        figure: 'class-mietobjekt-hierarchie',
        rubric: [
          'Oberklasse mit den drei gemeinsamen Attributen, diese in den Unterklassen nicht wiederholt (2 P)',
          'reservieren() nur einmal in der Oberklasse (1 P)',
          'Oberklasse und mietpreisBerechnen() dort als abstrakt gekennzeichnet (kursiv oder {abstract}) (1 P)',
          'mietpreisBerechnen() in beiden Unterklassen erneut aufgeführt (Überschreiben) (1 P)',
          'eigene Attribute und ladestandAbfragen() nur in der jeweiligen Unterklasse (1 P)',
          'Generalisierung als durchgezogene Linie mit hohlem Dreieck an der Oberklasse (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'begründen',
        points: 3,
        prompt:
          'Begründen Sie, warum `Mietobjekt` als abstrakte Klasse und `mietpreisBerechnen()` als abstrakte Methode modelliert werden. Erläutern Sie, welchen Vorteil das für eine Methode hat, die den Umsatz aller Mietobjekte einer Station berechnet.',
        modelAnswer:
          '**Abstrakte Klasse:** Von Mietobjekt sollen nie Objekte entstehen – vermietet werden nur Lastenräder und Elektroautos. Die Oberklasse sammelt nur das Gemeinsame.\n' +
          '**Abstrakte Methode:** Jedes Mietobjekt muss seinen Mietpreis berechnen können, die Rechenregel ist aber je Unterklasse verschieden. Oben steht deshalb nur die Signatur ohne Rumpf; jede konkrete Unterklasse **muss** die Methode überschreiben.\n' +
          '**Vorteil (Polymorphie):** Die Umsatzmethode durchläuft eine Liste vom Typ `Mietobjekt` und ruft für jedes Element `mietpreisBerechnen(tage)` auf. Zur Laufzeit wird automatisch die passende Umsetzung von Lastenrad oder Elektroauto ausgeführt – ohne Fallunterscheidung nach dem Typ. Kommt später z. B. ein E-Roller hinzu, bleibt die Umsatzmethode unverändert.',
        rubric: [
          'abstrakte Klasse: keine eigenen Objekte, nur konkrete Unterklassen werden vermietet (1 P)',
          'abstrakte Methode: gemeinsame Signatur, Umsetzung je Unterklasse verschieden und dort verpflichtend (1 P)',
          'Polymorphie: Aufruf über den Typ Mietobjekt führt die passende Unterklassen-Methode aus (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-beziehungen-mobilitaetsstation',
    title: 'Klassendiagramm: Beziehungen der Mobilitätsstation (Randstoff)',
    topicId: 'softwareentwicklung',
    scenario:
      'Die Stadtwerke betreiben Mobilitätsstationen, an denen man Mietobjekte (Lastenräder und Elektroautos) mieten kann. Für die Buchungssoftware hat ein Kollege zwei Beziehungen modelliert: **Station ◆— Mietobjekt** (Komposition) und **Mietvertrag ◇— Mietposition** (Aggregation).\n\n' +
      'Mietobjekte werden bei der Schließung einer Station an eine andere Station umgesetzt oder zeitweise ohne Station in der Werkstatt geführt. Die Positionen eines Mietvertrags (z. B. „Lastenrad, 3 Tage“) werden gelöscht, sobald der Vertrag gelöscht wird.\n\n' +
      '**Einordnung:** [RAND] – Aggregation, Komposition und Multiplizitäten sind in der Gegenüberstellung des Katalogs 2025 (it-berufe-podcast #190) nicht als gestrichen aufgeführt, gehören aber nicht zum AP1-Kern. Vererbungswissen ist für diese Aufgabe nicht nötig.',
    parts: [
      {
        label: 'a)',
        operator: 'beurteilen',
        points: 4,
        prompt:
          'Beurteilen Sie die beiden Beziehungen des Kollegen. Begründen Sie jeweils, ob Aggregation oder Komposition richtig ist, und geben Sie die korrigierte Notation mit sinnvollen Multiplizitäten an.',
        modelAnswer:
          '**Station – Mietobjekt: Aggregation statt Komposition.** Ein Mietobjekt gehört zwar zu einer Station, existiert aber unabhängig von ihr: Wird die Station geschlossen, wird das Lastenrad umgesetzt und nicht gelöscht. Notation: **hohle Raute an Station**, Multiplizität `0..1` an Station (höchstens eine Station, in der Werkstatt keine) und `*` an Mietobjekt.\n' +
          '**Mietvertrag – Mietposition: Komposition statt Aggregation.** Die Positionen sind existenzabhängig: Sie gehören zu genau einem Vertrag und werden mit ihm gelöscht. Notation: **gefüllte Raute an Mietvertrag**, Multiplizität `1` an Mietvertrag und `1..*` an Mietposition.\n' +
          'Merkregel: „wird mitgelöscht / gehört exklusiv“ → Komposition; „besteht auch ohne das Ganze / wird weitergegeben“ → Aggregation. Die Raute sitzt immer am Ganzen.',
        figure: 'class-station-beziehungen',
        rubric: [
          'Station – Mietobjekt als Aggregation, begründet mit unabhängiger Existenz (Umsetzen statt Löschen) (1 P)',
          'Mietvertrag – Mietposition als Komposition, begründet mit Löschen samt Vertrag (1 P)',
          'Notation: hohle bzw. gefüllte Raute jeweils am Ganzen (1 P)',
          'sinnvolle Multiplizitäten, z. B. 0..1 zu * und 1 zu 1..* (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-oop-begriffe-kantine',
    title: 'OOP-Grundbegriffe: Bestellsystem der Betriebskantine',
    topicId: 'softwareentwicklung',
    scenario:
      'Für die Kantine eines Maschinenbauunternehmens wird ein Bestellsystem objektorientiert entwickelt. Mitarbeitende wählen Gerichte aus dem Wochenplan, bestellen sie vorab und bezahlen mit dem Guthaben auf ihrem Werksausweis. ' +
      'Ein neuer Kollege im Team hat bisher nur prozedural programmiert und bittet Sie um eine kurze Einführung.\n\n' +
      '**Einordnung:** Teil a) und b) sind AP1-Kern. Teil c) mischt zwei Stufen: Vererbung ist [AP2] (laut der Gegenüberstellung des Katalogs 2025, it-berufe-podcast #190, aus der AP1 gestrichen); Assoziation, Aggregation und Komposition sind [RAND] (nicht gestrichen, aber kein AP1-Kern). Alle vier kamen in älteren Prüfungen vor.',
    parts: [
      {
        label: 'a)',
        operator: 'erläutern',
        points: 3,
        prompt: 'Erläutern Sie die Begriffe Klasse, Objekt und Methode jeweils mit einem Beispiel aus dem Bestellsystem.',
        modelAnswer:
          '**Klasse:** Bauplan für gleichartige Objekte; legt Attribute (Daten) und Methoden (Verhalten) fest. Beispiel: Klasse `Gericht` mit `bezeichnung : String` und `preis : double`.\n' +
          '**Objekt:** konkrete Instanz einer Klasse zur Laufzeit mit eigenen Attributwerten, z. B. das Gericht „Linsen-Curry, 4,90 €“ vom Dienstag. Aus einer Klasse lassen sich beliebig viele Objekte erzeugen.\n' +
          '**Methode:** Operation einer Klasse, die das Verhalten beschreibt und meist mit den Attributen des eigenen Objekts arbeitet, z. B. `bestellung.summeBerechnen()`.',
        rubric: [
          'Klasse als Bauplan mit Attributen und Methoden, passendes Beispiel (1 P)',
          'Objekt als konkrete Instanz mit eigenen Werten, passendes Beispiel (1 P)',
          'Methode als Verhalten/Operation der Klasse, passendes Beispiel (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'erläutern',
        points: 2,
        prompt: 'Erläutern Sie dem Kollegen zwei Vorteile der objektorientierten gegenüber der prozeduralen Programmierung.',
        modelAnswer:
          'Prozedural sind Daten und Funktionen getrennt; objektorientiert bilden sie im Objekt eine Einheit. Daraus folgen z. B.:\n' +
          '**Kapselung:** Attribute sind private und nur über Methoden änderbar – das Guthaben auf dem Werksausweis kann nicht von beliebigem Code versehentlich negativ gesetzt werden.\n' +
          '**Wiederverwendbarkeit:** Eine Klasse wie `Gericht` lässt sich in einem anderen Programm (z. B. der Kiosk-App) wiederverwenden.\n' +
          '**Wartbarkeit und Übersicht:** Änderungen bleiben auf eine Klasse begrenzt; Klassen entsprechen realen Dingen (Gericht, Bestellung), das erleichtert die Abstimmung mit dem Fachbereich.\n' +
          'Zwei begründete Vorteile genügen.',
        rubric: [
          'erster Vorteil mit kurzer Begründung, z. B. Kapselung (1 P)',
          'zweiter Vorteil mit kurzer Begründung, z. B. Wiederverwendbarkeit oder Wartbarkeit (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'erläutern',
        points: 4,
        prompt: 'Erläutern Sie die Begriffe Vererbung [AP2], Assoziation [RAND], Aggregation [RAND] und Komposition [RAND] jeweils mit einem Beispiel aus dem Bestellsystem.',
        modelAnswer:
          '**Vererbung:** „ist-ein“-Beziehung; die Unterklasse übernimmt Attribute und Methoden der Oberklasse und kann sie ergänzen oder überschreiben. Beispiel: `Tagesgericht` ist ein `Gericht`. Notation: hohles Dreieck an der Oberklasse.\n' +
          '**Assoziation:** allgemeine Beziehung zwischen Klassen, deren Objekte sich kennen, aber unabhängig voneinander existieren. Beispiel: `Mitarbeiter` 1 — `0..*` `Bestellung`. Notation: durchgezogene Linie, ggf. mit Multiplizitäten.\n' +
          '**Aggregation:** schwache Teil-Ganzes-Beziehung, die Teile bestehen auch ohne das Ganze. Beispiel: `Wochenplan` ◇— `Gericht`; ein Gericht bleibt erhalten, wenn ein Wochenplan gelöscht wird, und kann in mehreren Plänen stehen. Notation: hohle Raute am Ganzen.\n' +
          '**Komposition:** starke Teil-Ganzes-Beziehung, die Teile hängen in ihrer Existenz vom Ganzen ab. Beispiel: `Bestellung` ◆— `Bestellposition`; wird die Bestellung gelöscht, verschwinden auch ihre Positionen. Notation: gefüllte Raute am Ganzen.',
        rubric: [
          '[AP2] Vererbung als ist-ein-Beziehung mit Übernahme der Merkmale, passendes Beispiel (1 P)',
          '[RAND] Assoziation als allgemeine Beziehung unabhängiger Objekte, passendes Beispiel (1 P)',
          '[RAND] Aggregation als Teil-Ganzes ohne Existenzabhängigkeit, passendes Beispiel (1 P)',
          '[RAND] Komposition als Teil-Ganzes mit Existenzabhängigkeit, passendes Beispiel (1 P)',
        ],
      },
    ],
  },
  // ---------------------------------------------------------------------------------------------
  // PV1 Tag 2 (16.09.2026): USV und Netzwerkdiagnose mit Befehlen
  // ---------------------------------------------------------------------------------------------
  {
    id: 'task-pv1-usv-serverschrank-planungsbuero',
    title: 'USV für den Serverschrank eines Planungsbüros: Klasse, Scheinleistung, Shutdown',
    topicId: 'hardware',
    scenario:
      'Ein Planungsbüro für Haustechnik mit zwölf Mitarbeitenden betreibt im Abstellraum einen kleinen Serverschrank. Auf dem Virtualisierungshost laufen die Projektdatenbank und der Dateiserver; ein Absturz während des Speicherns hat schon einmal Projektdaten beschädigt. ' +
      'Das Büro liegt in einem Gewerbegebiet: Wenn der Nachbarbetrieb seine großen Maschinen anlaufen lässt, flackert das Licht, und die Netzspannung schwankt spürbar. Die Telefone werden über den PoE-Switch mit Strom versorgt.\n\n' +
      'An die geplante USV sollen folgende Geräte (gemessene Leistungsaufnahme):\n\n' +
      '- Virtualisierungshost: 420 W\n' +
      '- NAS für die Datensicherung: 70 W\n' +
      '- PoE-Switch einschließlich der Telefone: 110 W\n' +
      '- Firewall: 30 W\n' +
      '- Internet-Router: 20 W\n\n' +
      'Der Leistungsfaktor der gesamten Last beträgt cos φ = 0,9.\n\n' +
      '**Einordnung:** Teil a) bis d) sind AP1-Kern (Netzstörungen, USV-Klassen nach IEC 62040-3, Scheinleistung, Überbrückungszeit). Teil e) zu Shutdown-Software und Wartung ist [RAND].',
    parts: [
      {
        label: 'a)',
        operator: 'nennen',
        points: 3,
        prompt: 'Nennen Sie drei Netzstörungen, vor denen eine USV die angeschlossenen Geräte schützen kann.',
        modelAnswer:
          'Drei der folgenden Störungen:\n' +
          '**Netzausfall** (länger als etwa 10 ms)\n' +
          '**Spannungseinbruch** (kurzzeitig zu niedrige Spannung)\n' +
          '**kurzzeitige Überspannung** bzw. Spannungsspitze\n' +
          '**dauerhafte Unter- oder Überspannung**\n' +
          '**Frequenzschwankung**\n' +
          '**Transienten** und periodische Störimpulse (Burst)\n' +
          '**Oberschwingungen** (verzerrte Sinusform)\n' +
          'Zur Einordnung: VFD deckt Ausfall, Einbrüche und kurze Überspannungen ab, VI regelt zusätzlich dauerhafte Unter- und Überspannung aus, VFI schützt vor allen genannten Störungen. Gegen **Blitzeinwirkung** hilft auch eine VFI-USV nur zusammen mit einem zusätzlichen Überspannungsschutz.',
        rubric: [
          'erste Netzstörung fachlich richtig benannt (1 P)',
          'zweite Netzstörung (1 P)',
          'dritte Netzstörung; drei verschiedene Störungsarten, nicht dreimal „Stromausfall“ in anderen Worten (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'begründen',
        points: 4,
        prompt:
          'Wählen Sie für den Serverschrank eine USV-Klasse nach IEC 62040-3 (VFD, VI oder VFI). Begründen Sie Ihre Wahl mit Bezug auf die Situation und grenzen Sie sie von den beiden anderen Klassen ab.',
        modelAnswer:
          '**Empfehlung: VFI (Online-USV, Doppelwandler).**\n' +
          '**Funktion:** Die Last hängt ständig am Wechselrichter. Der Netzstrom wird dauernd gleichgerichtet (dabei wird der Akku geladen) und wieder zu Wechselspannung gewandelt. Fällt das Netz aus, speist der Akku ohne Umschaltung weiter – Umschaltzeit **0 ms**. Ausgangsspannung und -frequenz sind vom Netz unabhängig.\n' +
          '**Bezug zur Situation:** Das Netz im Gewerbegebiet schwankt durch den Nachbarbetrieb, und ein Absturz hat schon Daten beschädigt. Eine VFI-USV gleicht auch Spannungs- und Frequenzschwankungen sowie Oberschwingungen aus, bevor sie den Server erreichen.\n' +
          '**Abgrenzung VI (Line-Interactive):** regelt die Spannung mit einem Spannungswandler (AVR) nach, schaltet bei Ausfall aber um (Richtwert 2–4 ms, herstellerabhängig); die Frequenz bleibt netzabhängig. Günstiger und effizienter – vertretbar bei stabilem Netz und weniger kritischer Last.\n' +
          '**Abgrenzung VFD (Offline/Standby):** reicht die Netzspannung nur gefiltert durch und schaltet erst bei Ausfall um (Richtwert 4–10 ms); dauerhafte Spannungsabweichungen regelt sie nicht aus. Nur für unkritische Einzelgeräte.\n' +
          '**Nachteil VFI:** höherer Preis, etwas geringerer Wirkungsgrad und mehr Abwärme – der Abstellraum muss belüftet sein.\n' +
          'Wer VI wählt und das schlüssig begründet (kleiner Einzelserver, Kosten), erhält Teilpunkte. Bei dem hier beschriebenen unruhigen Netz ist VFI die bessere Wahl.',
        rubric: [
          'VFI gewählt; VI nur mit tragfähiger Begründung als Teilleistung (1 P)',
          'Funktionsweise: Doppelwandlung, keine Umschaltzeit, netzunabhängige Ausgangsspannung (1 P)',
          'Bezug zur Situation: Spannungsschwankungen durch den Nachbarbetrieb, Datenschaden beim Absturz (1 P)',
          'Abgrenzung zu VI und VFD mit je einem Unterschied, z. B. Umschaltzeit oder Frequenzabhängigkeit (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'berechnen',
        points: 5,
        prompt:
          'Auf die Last soll eine Reserve von 30 % aufgeschlagen werden. Berechnen Sie die benötigte Wirk- und Scheinleistung. Der Händler bietet drei Geräte der gewählten Klasse an: **Modell X** 1000 VA / 800 W, **Modell Y** 1500 VA / 1350 W, **Modell Z** 3000 VA / 2400 W. Wählen Sie das kleinste geeignete Modell und begründen Sie die Wahl.',
        modelAnswer:
          '**Wirkleistung der Last:** 420 W + 70 W + 110 W + 30 W + 20 W = **650 W**\n' +
          '**Mit 30 % Reserve (Aufschlag):** 650 W × 1,3 = **845 W**\n' +
          '**Scheinleistung:** S = P / cos φ = 845 W / 0,9 = **938,89 VA**\n' +
          '**Modell X:** 1000 VA ≥ 938,89 VA, aber 800 W < 845 W → scheidet aus.\n' +
          '**Modell Y:** 1500 VA ≥ 938,89 VA und 1350 W ≥ 845 W → geeignet.\n' +
          '**Modell Z:** ebenfalls geeignet, aber deutlich überdimensioniert – teurer, und im niedrigen Teillastbereich arbeiten USVs meist weniger effizient.\n' +
          '**Ergebnis: Modell Y.** Eine USV hat zwei Grenzwerte (VA und W), und beide müssen reichen. Wer nur die VA prüft, wählt fälschlich Modell X.\n' +
          'Hinweis: Hieße die Vorgabe „die USV höchstens zu 70 % auslasten“, wäre durch 0,7 zu teilen: 650 W / 0,7 = 928,57 W und 928,57 W / 0,9 = 1.031,75 VA. Dann scheitert X an beiden Werten, das Ergebnis bleibt Y.',
        rubric: [
          'Wirkleistung der Last 650 W (1 P)',
          'Reserve als Aufschlag: 650 W × 1,3 = 845 W (1 P)',
          'Scheinleistung über S = P / cos φ: 938,89 VA (1 P)',
          'beide Nennwerte geprüft: X scheitert an 800 W < 845 W (1 P)',
          'Modell Y gewählt, Z als überdimensioniert verworfen (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'berechnen',
        points: 4,
        prompt:
          'Laut Datenblatt überbrückt Modell Y die aktuelle Last von 650 W für 14 Minuten. Wegen der Akkualterung sollen 25 % dieser Laufzeit als Sicherheitsreserve übrig bleiben. Das geordnete Herunterfahren dauert nacheinander 5 Minuten für die virtuellen Maschinen, 2 Minuten für den Host und 2 Minuten für das NAS. ' +
          'Berechnen Sie, wie lange die Shutdown-Software nach Beginn des Batteriebetriebs höchstens warten darf. Prüfen Sie außerdem, ob das Konzept noch aufgeht, wenn die Akkus nur noch 70 % ihrer ursprünglichen Kapazität haben (vereinfacht: Laufzeit proportional zur Kapazität), und nennen Sie eine Maßnahme.',
        modelAnswer:
          '**Nutzbare Laufzeit:** 14 min × 0,75 = **10,5 min**\n' +
          '**Dauer des Herunterfahrens:** 5 min + 2 min + 2 min = **9 min**\n' +
          '**Spätester Start:** 10,5 min − 9 min = 1,5 min = **90 s** nach Beginn des Batteriebetriebs.\n' +
          '**Gealterte Akkus:** 14 min × 0,7 = 9,8 min Laufzeit, davon 75 % nutzbar = **7,35 min** < 9 min → Das Herunterfahren passt nicht mehr in die nutzbare Zeit; selbst bei sofortigem Start fehlen 1,65 min.\n' +
          '**Maßnahme:** Akkus rechtzeitig tauschen oder ein Erweiterungsbatteriepaket nachrüsten. Kurzfristig hilft es, Host und NAS gleichzeitig herunterzufahren (5 min + 2 min = 7 min ≤ 7,35 min, Auslösung dann spätestens nach 0,35 min = 21 s) – das reicht aber nur knapp und ersetzt den Akkutausch nicht. Die Laufzeit regelmäßig testen.',
        rubric: [
          'nutzbare Laufzeit 10,5 min (1 P)',
          'spätester Auslösezeitpunkt 1,5 min = 90 s (1 P)',
          'gealterte Akkus: 7,35 min < 9 min → reicht nicht (1 P)',
          'passende Maßnahme, z. B. Akkutausch oder Erweiterungsbatterie (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'erläutern',
        points: 3,
        prompt:
          '[RAND] Erläutern Sie, wie die USV den Virtualisierungshost bei einem längeren Stromausfall automatisch und geordnet herunterfahren lässt. Nennen Sie außerdem eine regelmäßige Wartungsmaßnahme für die USV.',
        modelAnswer:
          '**Meldeweg:** Die USV meldet den Batteriebetrieb und die Restlaufzeit über **USB** bzw. eine serielle Schnittstelle direkt an einen Rechner oder über eine **Netzwerkmanagementkarte** (Weboberfläche, **SNMP**) an mehrere Systeme.\n' +
          '**Shutdown-Agent:** Eine Software auf dem Host wertet die Meldung aus. Nach einer eingestellten Zeit oder beim Unterschreiten einer Restlaufzeit fährt sie zuerst die VMs und dann den Host herunter, bevor der Akku leer ist; das NAS erhält den Befehl über das Netz. Zusätzlich benachrichtigt sie die Administration, z. B. per E-Mail oder SNMP-Trap.\n' +
          '**Wartung (eine genügt):** regelmäßigen Selbsttest bzw. Batterietest durchführen; Akkus vor Ablauf ihrer Designlebensdauer tauschen; die USV kühl aufstellen, weil Wärme die Lebensdauer der Blei-Gel-Akkus verkürzt; Altakkus fachgerecht entsorgen, nicht über den Restmüll.',
        rubric: [
          'Meldung des Batteriebetriebs über USB/seriell oder Netzwerkkarte bzw. SNMP (1 P)',
          'Shutdown-Software fährt VMs und Host rechtzeitig vor Akkuende geordnet herunter (1 P)',
          'eine sinnvolle Wartungsmaßnahme, z. B. Selbsttest oder rechtzeitiger Akkutausch (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-netzwerkstoerung-physiopraxis',
    title: 'Netzwerkstörung in der Physiotherapiepraxis: mit Befehlen eingrenzen',
    topicId: 'netzwerke',
    scenario:
      'Eine Physiotherapiepraxis nutzt das Netz 192.168.40.64/27. Der Router mit der Adresse 192.168.40.65 ist zugleich DHCP-Server, Standardgateway und DNS-Server der Praxis; der Netzwerkdrucker hat die feste Adresse 192.168.40.70. ' +
      'Am Montag nach Umbauarbeiten meldet der Empfang, dass der Windows-PC weder die Online-Terminsoftware noch den Drucker erreicht. Sie arbeiten im IT-Support und prüfen den PC mit der Eingabeaufforderung. Der Befehl aus Teil a) zeigt für den Ethernet-Adapter unter anderem:\n\n' +
      '`Physische Adresse . . . . . . . . : 3C-52-A1-07-4E-19`\n' +
      '`DHCP aktiviert. . . . . . . . . . : Ja`\n' +
      '`Autokonfiguration aktiviert . . . : Ja`\n' +
      '`IPv4-Adresse (Auto. Konfiguration): 169.254.83.12(Bevorzugt)`\n' +
      '`Subnetzmaske  . . . . . . . . . . : 255.255.0.0`\n' +
      '`Standardgateway . . . . . . . . . :`\n\n' +
      '**Einordnung:** IP-Konfiguration, APIPA, Subnetting und die Fehlersuche mit ping und nslookup sind AP1-Kern (eigene Einstufung nach dem Themenkatalog; der Prüfungskatalog nennt keine einzelnen Befehle).',
    parts: [
      {
        label: 'a)',
        operator: 'nennen',
        points: 2,
        prompt:
          'Nennen Sie den Befehl, mit dem Sie die vollständige IP-Konfiguration des PCs einschließlich MAC-Adresse und DNS-Server anzeigen. Geben Sie außerdem an, welche Angaben ohne den Zusatz fehlen würden.',
        modelAnswer:
          '**Befehl:** `ipconfig /all`\n' +
          'Ohne den Zusatz zeigt `ipconfig` je Adapter nur IP-Adresse, Subnetzmaske und Standardgateway. Es fehlen unter anderem die **physische Adresse (MAC)**, die **DNS-Server**, die Angabe **DHCP aktiviert**, der **DHCP-Server** und die **Lease-Zeiten**.\n' +
          'PowerShell-Gegenstück: `Get-NetIPConfiguration -Detailed`.',
        rubric: [
          'ipconfig /all genannt (1 P)',
          'mindestens zwei Angaben, die ohne /all fehlen, z. B. MAC-Adresse und DNS-Server (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'erläutern',
        points: 4,
        prompt:
          'Erläutern Sie den Befund im Auszug oben. Nennen Sie zwei mögliche Ursachen und den Befehl, mit dem der PC nach der Behebung ohne Neustart erneut eine Adresse anfordert.',
        modelAnswer:
          '**Befund:** Die Adresse 169.254.83.12 stammt aus dem **APIPA-Bereich** 169.254.0.0/16 („Auto. Konfiguration“). DHCP ist aktiviert, der PC hat aber **keine Antwort von einem DHCP-Server** erhalten und sich die Adresse selbst gegeben. Es ist **kein Standardgateway** eingetragen, und die Adresse gehört nicht zum Praxisnetz 192.168.40.64/27 – deshalb erreicht der PC weder den Drucker noch das Internet.\n' +
          '**Mögliche Ursachen (zwei genügen):** Patchkabel beim Umbau abgezogen oder falsch gesteckt, Netzwerkdose nicht angeschlossen, Switchport defekt oder abgeschaltet, DHCP-Dienst am Router gestört, Adresspool erschöpft.\n' +
          '**Nach der Behebung:** `ipconfig /renew` fordert beim DHCP-Server erneut eine Konfiguration an (DORA). Hat ein Adapter bereits eine gültige Lease, gibt `ipconfig /release` sie vorher ab. Beide Schalter wirken nur bei DHCP.\n' +
          '**Erfolgskontrolle:** `ipconfig /all` zeigt nun eine Adresse zwischen 192.168.40.66 und 192.168.40.94, Gateway und DNS-Server 192.168.40.65 sowie die Lease-Zeiten.',
        rubric: [
          'APIPA-Adresse (169.254.0.0/16) erkannt (1 P)',
          'Bedeutung: keine DHCP-Antwort, Selbstvergabe, kein Gateway, nur im eigenen Segment nutzbar (1 P)',
          'zwei plausible Ursachen, z. B. Kabel/Dose/Switchport oder DHCP-Dienst (1 P)',
          'ipconfig /renew (ggf. vorher /release) zum erneuten Anfordern (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'beschreiben',
        points: 4,
        prompt:
          'Nach der Behebung hat der PC die Adresse 192.168.40.77 erhalten, die Terminsoftware öffnet sich aber weiterhin nicht. Beschreiben Sie, wie Sie mit `ping` systematisch von innen nach außen prüfen. Geben Sie zu jedem Schritt das Ziel an und was eine erfolgreiche Antwort aussagt.',
        modelAnswer:
          '1. `ping 127.0.0.1` (Loopback): Der TCP/IP-Stack des PCs arbeitet.\n' +
          '2. `ping 192.168.40.77` (eigene Adresse): Die Adresse ist am Adapter eingerichtet.\n' +
          '3. `ping 192.168.40.65` (Standardgateway): Kabel, Switch und lokales Netz bis zum Router funktionieren.\n' +
          '4. `ping 9.9.9.9` (externe IP-Adresse): Der Router leitet ins Internet weiter, Routing und Internetzugang funktionieren.\n' +
          '5. `ping` auf einen Namen bzw. `nslookup`: Die Namensauflösung funktioniert.\n' +
          'Der erste Schritt ohne Antwort grenzt den Fehler ein. **Achtung:** ping nutzt ICMP, und viele Server und Firewalls filtern ICMP. Keine Antwort von einem externen Ziel beweist also noch keine Störung – dann ein zweites Ziel testen oder `tracert` einsetzen.',
        rubric: [
          'Loopback bzw. eigene Adresse als innerste Prüfung mit Aussage (1 P)',
          'Standardgateway als Prüfung des lokalen Netzes (1 P)',
          'externe IP-Adresse als Prüfung von Routing und Internetzugang (1 P)',
          'Reihenfolge von innen nach außen, Namensauflösung zuletzt (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'begründen',
        points: 4,
        prompt:
          'Ihre Tests am Empfangs-PC liefern folgende Ergebnisse:\n' +
          '`ping 192.168.40.65` → Antworten, 0 % Verlust\n' +
          '`ping 9.9.9.9` → Antworten, 0 % Verlust\n' +
          '`ping termine.physio.example` → Ping-Anforderung konnte Host "termine.physio.example" nicht finden. …\n' +
          '`nslookup termine.physio.example` → Zeitüberschreitung, der Server 192.168.40.65 antwortet nicht\n' +
          '`nslookup termine.physio.example 9.9.9.9` → liefert eine IPv4-Adresse\n' +
          'Ermitteln Sie die Fehlerursache, begründen Sie Ihre Aussage und schlagen Sie eine Maßnahme mit Nachtest vor.',
        modelAnswer:
          '**Befund:** Gateway und externe IP-Adresse antworten – Verkabelung, IP-Konfiguration und Routing ins Internet funktionieren. Die Meldung „Ping-Anforderung konnte Host … nicht finden“ bedeutet: Der **Name ließ sich nicht auflösen**; ein Leitungsproblem ist es nicht.\n' +
          '**Ursache:** `nslookup` fragt den eingetragenen DNS-Server 192.168.40.65 direkt, und er antwortet nicht. Ein anderer Resolver (9.9.9.9) löst denselben Namen auf. Der Fehler liegt also beim **DNS-Dienst bzw. der DNS-Weiterleitung des Routers** – nicht am PC und nicht am Namen.\n' +
          '**Maßnahme:** DNS-Weiterleitung am Router prüfen und reparieren (Einstellungen, ggf. Neustart). Übergangsweise kann der Router per DHCP einen funktionierenden DNS-Server verteilen; der PC übernimmt ihn mit `ipconfig /renew`. `ipconfig /flushdns` leert zusätzlich den lokalen DNS-Cache.\n' +
          '**Nachtest:** `nslookup termine.physio.example` ohne Serverangabe liefert eine Adresse; danach `ping termine.physio.example` bzw. die Terminsoftware im Browser aufrufen. Wichtig: `nslookup` umgeht den lokalen DNS-Cache und die hosts-Datei. Ob der PC den Namen selbst auflöst, zeigen erst `ping` oder der Browser.',
        rubric: [
          'IP-Verbindung bis ins Internet als intakt erkannt (Gateway und externe IP antworten) (1 P)',
          'Meldung „Host nicht finden“ als Problem der Namensauflösung gedeutet (1 P)',
          'nslookup-Vergleich: DNS-Server des Routers antwortet nicht, anderer Resolver schon (1 P)',
          'Maßnahme am DNS (Router reparieren oder anderen DNS-Server verteilen) mit Nachtest (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'berechnen',
        points: 4,
        prompt:
          'Im Behandlungsraum steht ein Notebook, das ein früherer Dienstleister fest eingerichtet hat: IP-Adresse 192.168.40.90, Subnetzmaske 255.255.255.224, Standardgateway 192.168.40.97. Das Notebook druckt problemlos, erreicht aber das Internet nicht. ' +
          'Berechnen Sie Netzadresse, Broadcast-Adresse und den Bereich der nutzbaren Hostadressen. Begründen Sie damit den Fehler und geben Sie die richtige Gateway-Adresse an.',
        modelAnswer:
          '**Maske** 255.255.255.224 = /27 → Blockgröße 256 − 224 = **32**, 5 Hostbits.\n' +
          '**Netzadresse:** 90 : 32 = 2 Rest 26 → 2 × 32 = 64 → **192.168.40.64**\n' +
          '**Broadcast:** 64 + 32 − 1 = 95 → **192.168.40.95**\n' +
          '**Nutzbare Hosts:** **192.168.40.65 bis 192.168.40.94** (2^5 − 2 = 30 Adressen)\n' +
          '**Fehler:** Das Gateway 192.168.40.97 liegt **außerhalb** dieses Bereichs; es gehört zum Nachbarnetz 192.168.40.96/27. Ein Host muss sein Gateway direkt im eigenen Netz erreichen (per ARP). Für Ziele im eigenen Netz wie den Drucker 192.168.40.70 braucht er kein Gateway – deshalb klappt das Drucken. Pakete ins Internet schickt er dagegen an eine Adresse, die in der Praxis kein Gerät hat.\n' +
          '**Korrektur:** Standardgateway **192.168.40.65** (der Router). Besser noch: das Notebook ebenfalls per DHCP konfigurieren oder die feste Adresse außerhalb des DHCP-Bereichs vergeben.',
        rubric: [
          'Netzadresse 192.168.40.64 (1 P)',
          'Broadcast 192.168.40.95 und Hostbereich .65 bis .94 (1 P)',
          'Begründung: Gateway .97 liegt außerhalb des eigenen Netzes; lokale Ziele brauchen kein Gateway (1 P)',
          'richtige Gateway-Adresse 192.168.40.65 (1 P)',
        ],
      },
    ],
  },
  // ---------------------------------------------------------------------------------------------
  // PV1 Tag 3 (17.09.2026): Projektmanagement
  // ---------------------------------------------------------------------------------------------
  {
    id: 'task-pv1-projektstart-kursbuchungs-app',
    title: 'Projektstart: Kursbuchungs-App für ein Fitnessstudio (Ziele, Lasten-/Pflichtenheft, Stakeholder)',
    topicId: 'projektmanagement',
    scenario:
      'Das Fitnessstudio „Kraftwerk“ hat drei Standorte und rund 2.400 Mitglieder. Kursplätze werden bisher per Telefon und Aushang vergeben; montags ist das Telefon am Empfang oft dauerbesetzt. ' +
      'Die Inhaberin beauftragt Ihren Arbeitgeber, ein Softwarehaus, mit der Entwicklung einer Kursbuchungs-App. Geplanter Start ist der **01.02.2027**, das Budget beträgt **38.000 € netto**.\n\n' +
      'Beteiligt oder betroffen sind außerdem:\n\n' +
      '- die Studioleitungen der drei Standorte\n' +
      '- 20 Kurstrainerinnen und -trainer\n' +
      '- das Empfangspersonal\n' +
      '- der externe Datenschutzbeauftragte des Studios\n' +
      '- ein Zahlungsdienstleister, über den kostenpflichtige Kurse abgerechnet werden\n\n' +
      'Die Vorarbeiten (Projektauftrag, Lastenheft, Grobplanung) laufen klassisch; die Entwicklung selbst organisiert Ihr Team mit Scrum.\n\n' +
      '**Einordnung:** Teil a) bis e) sind AP1-Kern (Projektmerkmale, SMART-Ziele, Lasten- und Pflichtenheft, Stakeholder, magisches Dreieck, klassisches und agiles Vorgehen). Teil f) zum Kick-off ist [RAND].',
    parts: [
      {
        label: 'a)',
        operator: 'erläutern',
        points: 3,
        prompt:
          'Eine Studioleiterin fragt, warum die Einführung der App als Projekt geführt wird, die monatliche Aktualisierung des Kursplans aber nicht. Erläutern Sie den Unterschied anhand von drei Projektmerkmalen.',
        modelAnswer:
          'Nach DIN 69901-5 (sinngemäß) zeichnet sich ein Projekt vor allem dadurch aus, dass seine Rahmenbedingungen zusammengenommen einmalig sind, etwa Ziel, Zeitrahmen, Budget, Personal und Organisation (Stichwort **Einmaligkeit der Bedingungen**). Drei der folgenden Merkmale genügen, jeweils mit Bezug zur Situation:\n' +
          '**Einmaligkeit:** Die App wird einmal neu entwickelt. Der Kursplan wird jeden Monat auf die gleiche Weise aktualisiert – das ist eine wiederkehrende Routineaufgabe.\n' +
          '**zeitliche Begrenzung:** Das Projekt hat einen festen Anfang und ein festes Ende (Start der App am 01.02.2027). Die Pflege des Kursplans endet nie.\n' +
          '**begrenzte Mittel:** festes Budget von 38.000 € netto und ein festes Team.\n' +
          '**klare Zielvorgabe:** eine bestimmte App mit festgelegten Funktionen.\n' +
          '**Neuartigkeit, Komplexität und Risiko:** neue Software, viele Beteiligte, unsichere Aufwandsschätzung.\n' +
          '**eigene Projektorganisation:** Team und feste Ansprechpartner im Studio nur für dieses Vorhaben.\n' +
          'Hinweis: Die alte Norm DIN 69901:1987 nannte zusätzlich die „Abgrenzung gegenüber anderen Vorhaben“; das Merkmal steht noch in vielen Lehrbüchern. Meilensteine sind ein Planungsmittel, kein Projektmerkmal.',
        rubric: [
          'erstes Merkmal mit Bezug auf App und Kursplan (1 P)',
          'zweites Merkmal mit Bezug zur Situation (1 P)',
          'drittes Merkmal mit Bezug; die Kursplanpflege als wiederkehrende Routine erkannt (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'beurteilen',
        points: 4,
        prompt:
          'In der ersten Besprechung formuliert die Inhaberin das Ziel: „Wir wollen bald eine moderne App, mit der unsere Mitglieder einfacher buchen können.“ Beurteilen Sie das Ziel anhand von drei SMART-Kriterien. Formulieren Sie es anschließend so um, dass es alle SMART-Kriterien erfüllt und keinen Lösungsweg vorwegnimmt.',
        modelAnswer:
          '**Beurteilung (drei genügen):**\n' +
          '**nicht spezifisch:** Offen bleibt, was „buchen“ umfasst (Kurse buchen, stornieren, Warteliste?) und für welche Standorte es gilt.\n' +
          '**nicht messbar:** „modern“ und „einfacher“ sind Eindrücke, keine prüfbaren Größen.\n' +
          '**nicht terminiert:** „bald“ ist kein Termin.\n' +
          '**A und R nicht beurteilbar:** Ohne Budget und ohne Abstimmung mit Studioleitungen und Trainern lässt sich nicht sagen, ob das Ziel akzeptiert und realistisch ist.\n' +
          '**Umformulierung (Beispiel):** „Bis zum 01.02.2027 können Mitglieder aller drei Standorte Kursplätze rund um die Uhr per Smartphone buchen und bis zwei Stunden vor Kursbeginn stornieren. Bis zum 30.06.2027 laufen mindestens 70 % aller Kursbuchungen digital. Das Projektbudget beträgt höchstens 38.000 € netto.“\n' +
          '**Lösungsneutral:** Das Ziel nennt kein Framework, keine Datenbank und keinen Hersteller – es beschreibt das WAS; das WIE gehört ins Pflichtenheft. **Akzeptiert** ist es, wenn Inhaberin und Studioleitungen zustimmen (z. B. weil der Empfang weniger Anrufe hat), **realistisch**, wenn die Aufwandsschätzung zu Termin und Budget passt.',
        rubric: [
          'drei verletzte SMART-Kriterien benannt (1 P)',
          'Verletzungen mit dem Wortlaut begründet, z. B. „bald“, „modern/einfacher“, unklarer Umfang (1 P)',
          'neues Ziel spezifisch, messbar (Kennzahl) und terminiert (1 P)',
          'neues Ziel lösungsneutral und mit Budgetrahmen bzw. realistisch (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'zuordnen',
        points: 4,
        prompt:
          'Ordnen Sie die folgenden Aussagen dem Lastenheft oder dem Pflichtenheft zu. Geben Sie außerdem an, wer das jeweilige Dokument erstellt, in welcher Reihenfolge die beiden entstehen und welches nach der Freigabe verbindliche Grundlage für die Abnahme wird.\n' +
          '(1) „Mitglieder sollen Kursplätze bis zwei Stunden vor Kursbeginn kostenfrei stornieren können.“\n' +
          '(2) „Die Stornofrist prüft ein REST-Dienst auf dem Server; die Buchungen werden in einer PostgreSQL-Datenbank gespeichert.“\n' +
          '(3) „Auch Mitglieder ohne Technikerfahrung sollen die App ohne Einweisung bedienen können.“\n' +
          '(4) „Die App wird mit dem Framework Flutter für Android ab Version 12 und iOS ab Version 16 entwickelt.“',
        modelAnswer:
          '**(1) Lastenheft** – funktionale Anforderung aus Sicht der Anwender (WAS).\n' +
          '**(2) Pflichtenheft** – technische Umsetzung (WIE und WOMIT).\n' +
          '**(3) Lastenheft** – nicht-funktionale Anforderung (Benutzbarkeit), lösungsneutral formuliert.\n' +
          '**(4) Pflichtenheft** – Technologie- und Plattformentscheidung des Auftragnehmers.\n' +
          '**Ersteller und Reihenfolge:** Das **Lastenheft** schreibt der Auftraggeber (das Fitnessstudio). Danach schreibt der Auftragnehmer (das Softwarehaus) das **Pflichtenheft** als Antwort auf das Lastenheft.\n' +
          '**Verbindlichkeit:** Das vom Auftraggeber geprüfte und **freigegebene Pflichtenheft** wird Vertragsgrundlage. Bei einer Individualentwicklung liegt meist ein Werkvertrag vor; bei der Abnahme wird das Ergebnis gegen das Pflichtenheft geprüft.\n' +
          '[RAND] Manche Vorgehensweisen unterscheiden ein vorläufiges Pflichtenheft (mit dem Angebot) und ein endgültiges (nach der Feinabstimmung).',
        rubric: [
          'alle vier Zuordnungen richtig (2 P; drei richtig: 1 P)',
          'Lastenheft vom Auftraggeber zuerst, Pflichtenheft vom Auftragnehmer danach (1 P)',
          'freigegebenes Pflichtenheft als verbindliche Grundlage für Umsetzung und Abnahme (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'beurteilen',
        points: 5,
        prompt:
          'Nennen Sie vier Stakeholder des Projekts und ordnen Sie jeden aus Sicht des Fitnessstudios als intern oder extern ein. Schätzen Sie für zwei davon Einfluss und Einstellung zum Projekt ein und leiten Sie jeweils eine Maßnahme ab.',
        modelAnswer:
          '**Stakeholder (vier genügen):**\n' +
          '**intern:** Inhaberin (Auftraggeberin), Studioleitungen, Kurstrainerinnen und -trainer, Empfangspersonal\n' +
          '**extern:** Mitglieder, Softwarehaus (Auftragnehmer), externer Datenschutzbeauftragter, Zahlungsdienstleister\n' +
          '**Einschätzung und Maßnahme (zwei genügen):**\n' +
          '**Kurstrainer:** Einfluss mittel – sie arbeiten täglich mit den Teilnehmerlisten und können die Einführung durch Nichtnutzung ausbremsen. Einstellung eher skeptisch (Sorge vor Mehrarbeit oder Kontrolle). Maßnahme: früh einbinden, zwei Trainer als Key User benennen, schulen und ihre Rückmeldungen in die Sprint Reviews holen.\n' +
          '**Mitglieder:** Einfluss hoch auf den Erfolg – ohne Nutzung kein Nutzen. Einstellung überwiegend positiv, ältere Mitglieder teils zurückhaltend. Maßnahme: Testphase mit ausgewählten Mitgliedern, Buchung am Empfang als Alternative beibehalten, per Aushang und Newsletter informieren.\n' +
          '**Datenschutzbeauftragter:** Einfluss mittel bis hoch – er berät und überwacht die Einhaltung der DSGVO; Beanstandungen können den Start verzögern. Einstellung neutral bis kritisch. Maßnahme: früh beteiligen, Datenschutzhinweise, Rechtsgrundlagen und Verträge mit Dienstleistern (z. B. Hosting) vor dem Start klären.\n' +
          '**Empfangspersonal:** Einstellung gemischt (weniger Anrufe, aber Sorge um die eigene Rolle). Maßnahme: offen informieren und neue Aufgaben klären, z. B. Hilfe bei der App.\n' +
          '[RAND] Zur Darstellung eignet sich eine Einfluss-Interesse-Matrix (Stakeholder-Portfolio).',
        rubric: [
          'vier passende Stakeholder genannt (1 P)',
          'intern/extern schlüssig aus Sicht des Studios zugeordnet (1 P)',
          'Einfluss und Einstellung für zwei Stakeholder nachvollziehbar eingeschätzt (1 P)',
          'passende Maßnahme für den ersten Stakeholder (1 P)',
          'passende Maßnahme für den zweiten Stakeholder (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'erläutern',
        points: 4,
        prompt:
          'Kurz nach dem Projektstart bittet die Inhaberin, die App schon am 04.01.2027 freizugeben, weil im Januar besonders viele Neumitglieder kommen. Das Budget bleibt gleich. Erläutern Sie anhand des magischen Dreiecks zwei mögliche Folgen. Stellen Sie außerdem dar, wie ein klassisch geplantes Projekt und wie das Scrum-Team auf den Wunsch reagieren würden.',
        modelAnswer:
          '**Magisches Dreieck:** Leistung (Umfang und Qualität), Zeit und Kosten hängen voneinander ab; ändert sich eine Größe, muss mindestens eine andere nachgeben. Vier Wochen weniger Zeit bei gleichem Budget führen zu (zwei genügen):\n' +
          '**weniger Leistung:** Funktionen fallen zum Start weg oder kommen später, z. B. Warteliste oder Kursbewertungen.\n' +
          '**Qualitätsrisiko:** weniger Zeit für Tests, mehr Fehler nach dem Start.\n' +
          '**höhere Kosten:** Überstunden oder zusätzliche Entwickler, wenn der Umfang bleiben soll – das widerspricht dem festen Budget und müsste neu verhandelt werden.\n' +
          '**Klassisch:** Der Leistungsumfang steht im Pflichtenheft fest, Zeit und Kosten wurden daraus geplant. Die Projektleitung prüft den Terminplan (kritischer Pfad, Puffer) und legt die Folgen offen. Über einen **Änderungsantrag** wird entschieden: mehr Personal und damit höhere Kosten oder weniger Umfang.\n' +
          '**Scrum:** Zeit (Sprints mit fester Länge) und Kosten (festes Team) sind fest, der **Umfang ist variabel**. Der **Product Owner ordnet das Product Backlog neu**, sodass bis zum 04.01.2027 die wertvollsten Funktionen (buchen, stornieren) als nutzbares Increment fertig sind; weniger wichtige folgen in späteren Sprints. Die Definition of Done wird dafür nicht gelockert.',
        rubric: [
          'erste Folge nach dem magischen Dreieck, begründet (1 P)',
          'zweite Folge (1 P)',
          'klassisch: Umfang fest; Termin, Kosten oder Umfang nur über einen Änderungsantrag anpassen (1 P)',
          'Scrum: Zeit und Kosten fest, Product Owner ordnet das Backlog neu, Umfang variabel (1 P)',
        ],
      },
      {
        label: 'f)',
        operator: 'angeben',
        points: 2,
        prompt:
          '[RAND] Das Softwarehaus plant ein Kick-off-Meeting. Geben Sie an, wann es nach DIN 69901-5 stattfindet, und nennen Sie drei Tagesordnungspunkte.',
        modelAnswer:
          '**Zeitpunkt:** sinngemäß nach DIN 69901-5 **nach Abschluss der Projektplanung und vor Beginn der Durchführung** (so die Kursunterlagen und Sekundärquellen). In der Praxis gibt es oft schon direkt nach dem Projektauftrag einen Start-Workshop – in der Prüfung gilt die Lesart der Aufgabe.\n' +
          '**Teilnehmende:** Projektteam und Auftraggeberin, meist auch Studioleitungen und Key User.\n' +
          '**Tagesordnung (drei genügen):** Ausgangslage und Projektziele (auch Nichtziele) · Projektorganisation und Rollen (Product Owner, Scrum Master, Developers, Ansprechpartner im Studio) · Termin- und Meilensteinplan · Kommunikationsregeln (Sprint Reviews, Statusberichte) · bekannte Risiken und offene Punkte.',
        rubric: [
          'Zeitpunkt: nach der Planung, vor der Durchführung (1 P)',
          'drei passende Tagesordnungspunkte (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-terminplanung-kanzleiumzug',
    title: 'Terminplanung: Umzug der Kanzlei-Buchhaltung (PSP, Netzplan mit Puffern, Gantt)',
    topicId: 'projektmanagement',
    scenario:
      'Die Steuerkanzlei Brandt zieht mit ihrer Buchhaltung in eine neue Etage. Ihr Arbeitgeber, ein Systemhaus, übernimmt die IT. Die Arbeitspakete sind in einer Vorgangsliste erfasst:\n\n' +
      '| Vorgang | Tätigkeit | Dauer (h) | Vorgänger |\n' +
      '|---|---|---|---|\n' +
      '| A | Bestandsaufnahme der Arbeitsplätze | 3 | – |\n' +
      '| B | Netzwerkdosen in der neuen Etage prüfen | 2 | A |\n' +
      '| C | neue Rechner vorkonfigurieren | 6 | A |\n' +
      '| D | Altgeräte abbauen | 2 | A |\n' +
      '| E | Patchfeld und Switch konfigurieren | 4 | B |\n' +
      '| F | Arbeitsplätze aufbauen | 5 | C, D |\n' +
      '| G | Fachanwendungen einrichten | 3 | E, F |\n' +
      '| H | Abnahmetest mit der Kanzlei | 2 | G |\n\n' +
      'Gearbeitet wird von 8 bis 16 Uhr (8 Stunden pro Tag, Pausen bleiben unberücksichtigt), am Wochenende nicht. Für parallele Vorgänge steht genug Personal bereit. Das Projekt beginnt am **Donnerstag, 12.11.2026, um 8:00 Uhr**.\n\n' +
      '**Knotenschema laut Legende:** oben FAZ · Dauer · FEZ, in der Mitte Nummer und Bezeichnung, unten SAZ · GP · SEZ, der freie Puffer (FP) rechts neben dem Knoten. Andere Quellen ordnen die Felder anders an – in der Prüfung gilt immer die Legende der Aufgabe.\n\n' +
      '**Einordnung:** Alle Teile sind AP1-Kern (Projektstrukturplan, Netzplan mit Puffern, Gantt-Diagramm).',
    parts: [
      {
        label: 'a)',
        operator: 'erstellen',
        points: 3,
        prompt:
          'Die Arbeitspakete stammen aus einem phasenorientierten Projektstrukturplan (PSP). Erstellen Sie den PSP mit drei Ebenen und Nummerierung (auf Papier skizzieren). Erläutern Sie außerdem, warum der PSP allein noch kein Terminplan ist.',
        modelAnswer:
          '**Ebene 1:** Umzug der Buchhaltung (Projekt)\n' +
          '**Ebene 2 und 3 (ein möglicher Aufbau):**\n' +
          '**1 Vorbereitung:** 1.1 Bestandsaufnahme (A), 1.2 Netzwerkdosen prüfen (B), 1.3 Rechner vorkonfigurieren (C)\n' +
          '**2 Umsetzung:** 2.1 Altgeräte abbauen (D), 2.2 Patchfeld und Switch konfigurieren (E), 2.3 Arbeitsplätze aufbauen (F), 2.4 Fachanwendungen einrichten (G)\n' +
          '**3 Abschluss:** 3.1 Abnahmetest (H)\n' +
          'Andere schlüssige Phasenzuordnungen sind ebenfalls richtig, solange jedes Arbeitspaket genau einmal vorkommt. Die **Arbeitspakete** bilden die unterste Ebene: kleinste abgegrenzte Einheiten mit einer verantwortlichen Person, deren Aufwand sich schätzen lässt.\n' +
          '**Kein Terminplan:** Der PSP zeigt nur, **was** zu tun ist. Reihenfolge, Abhängigkeiten, Dauern und Termine fehlen – sie kommen erst mit der Vorgangsliste und dem Netzplan bzw. Gantt-Diagramm hinzu.\n' +
          'Zum Vergleich: Ein **objektorientierter** PSP gliedert nach Bestandteilen (z. B. Netzwerk, Arbeitsplätze, Software), ein **funktionsorientierter** nach Tätigkeiten (z. B. prüfen, konfigurieren, aufbauen).',
        rubric: [
          'drei Ebenen (Projekt – Phasen – Arbeitspakete) mit Nummerierung (1 P)',
          'alle acht Arbeitspakete genau einmal schlüssig zugeordnet (1 P)',
          'PSP enthält keine Reihenfolge, Dauern und Termine (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'berechnen',
        points: 6,
        prompt:
          'Erstellen Sie den Netzplan und berechnen Sie für alle Vorgänge FAZ, FEZ, SAZ, SEZ, den Gesamtpuffer (GP) und den freien Puffer (FP) in Stunden.',
        modelAnswer:
          '**Vorwärtsrechnung** (FEZ = FAZ + Dauer; FAZ = größter FEZ aller direkten Vorgänger):\n' +
          '`A: FAZ 0 · FEZ 3`, `B: FAZ 3 · FEZ 5`, `C: FAZ 3 · FEZ 9`, `D: FAZ 3 · FEZ 5`, `E: FAZ 5 · FEZ 9`\n' +
          '`F: FAZ = max(FEZ C 9, FEZ D 5) = 9 · FEZ 14`\n' +
          '`G: FAZ = max(FEZ E 9, FEZ F 14) = 14 · FEZ 17`, `H: FAZ 17 · FEZ 19`\n' +
          '**Rückwärtsrechnung** (SAZ = SEZ − Dauer; SEZ = kleinster SAZ aller direkten Nachfolger):\n' +
          '`H: SAZ 17 · SEZ 19`, `G: SAZ 14 · SEZ 17`, `E: SAZ 10 · SEZ 14`, `F: SAZ 9 · SEZ 14`\n' +
          '`B: SEZ = SAZ E = 10 → SAZ 8`, `C: SEZ = SAZ F = 9 → SAZ 3`, `D: SEZ = SAZ F = 9 → SAZ 7`\n' +
          '`A: SEZ = min(SAZ B 8, SAZ C 3, SAZ D 7) = 3 → SAZ 0` (Kontrolle erfüllt)\n' +
          '**Puffer** (GP = SAZ − FAZ; FP = kleinster FAZ der direkten Nachfolger − eigener FEZ):\n' +
          '`A: GP 0 · FP 0`, `B: GP 5 · FP 0`, `C: GP 0 · FP 0`, `D: GP 4 · FP 4`\n' +
          '`E: GP 5 · FP 5`, `F: GP 0 · FP 0`, `G: GP 0 · FP 0`, `H: GP 0 · FP 0`\n' +
          'Warum hat B keinen freien Puffer? E kann direkt nach B beginnen (FAZ E = FEZ B = 5). Die 5 Stunden Gesamtpuffer teilen sich B und E.',
        rubric: [
          'Vorwärtsrechnung A bis E richtig (1 P)',
          'F und G mit dem größten FEZ der Vorgänger (FAZ 9 bzw. 14), H 17–19 (1 P)',
          'Rückwärtsrechnung H bis B richtig (1 P)',
          'A mit dem kleinsten SAZ der Nachfolger (SEZ 3, SAZ 0) (1 P)',
          'GP aller Vorgänge: B 5, D 4, E 5, sonst 0 (1 P)',
          'FP aller Vorgänge: D 4, E 5, sonst 0 – insbesondere B = 0 (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'ermitteln',
        points: 2,
        prompt: 'Geben Sie die Projektdauer und den kritischen Pfad an und begründen Sie Ihre Angabe.',
        modelAnswer:
          '**Projektdauer: 19 Stunden** (FEZ des Endvorgangs H).\n' +
          '**Kritischer Pfad: A – C – F – G – H**, weil diese Vorgänge den Gesamtpuffer 0 haben; jede Verzögerung auf diesem Weg verschiebt das Projektende. Kontrolle: 3 + 6 + 5 + 3 + 2 = 19 h.\n' +
          'Falle: Die Summe aller Dauern (27 h) ist nicht die Projektdauer – B, C und D laufen parallel.',
        rubric: [
          'Projektdauer 19 h (1 P)',
          'kritischer Pfad A–C–F–G–H, begründet über GP = 0 (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'beurteilen',
        points: 3,
        prompt:
          'Betrachten Sie zwei Störungen jeweils einzeln: (1) Die Prüfung der Netzwerkdosen (B) dauert 3 Stunden länger. (2) Der Abbau der Altgeräte (D) dauert 7 statt 2 Stunden. Beurteilen Sie jeweils die Auswirkungen auf die Nachfolger und auf das Projektende.',
        modelAnswer:
          '**(1) B + 3 h:** B endet bei 8 statt 5. Weil der **freie Puffer von B 0** ist, verschiebt sich E sofort auf 8–12. Die 3 h liegen aber im **Gesamtpuffer von 5 h**: E endet vor seinem SEZ 14, G beginnt weiter bei 14, das **Projektende bleibt bei 19 h** (Montag, 11:00 Uhr). E hat danach nur noch 2 h Puffer.\n' +
          '**(2) D + 5 h:** D endet bei 10 statt 5. Die Verzögerung übersteigt den **Gesamtpuffer von 4 h um 1 h**: F beginnt bei max(9, 10) = 10 und endet bei 15, G läuft von 15 bis 18, H von 18 bis 20 → **Projektende 20 h**, also Montag, 16.11.2026, **12:00 Uhr** statt 11:00 Uhr.\n' +
          'Der **kritische Pfad** wechselt auf **A – D – F – G – H** (3 + 7 + 5 + 3 + 2 = 20 h); C hat jetzt 1 h Puffer. Mögliche Maßnahme: den Abbau mit einer zweiten Person beschleunigen oder die Kanzlei rechtzeitig über die spätere Abnahme informieren.',
        rubric: [
          '(1) E verschiebt sich um 3 h, weil FP von B = 0 (1 P)',
          '(1) Projektende bleibt 19 h, weil 3 h ≤ GP 5 h (1 P)',
          '(2) Projektende 20 h (Mo 12:00 Uhr), weil 5 h > GP 4 h; D wird kritisch (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'erstellen',
        points: 5,
        prompt:
          'Übertragen Sie den Netzplan in ein Gantt-Diagramm (früheste Lage, auf Papier). Geben Sie für jeden Vorgang Beginn und Ende mit Wochentag und Uhrzeit an und tragen Sie das Projektende als Meilenstein „Abnahme erfolgt“ ein. Geben Sie außerdem die späteste Lage von Vorgang E an.',
        modelAnswer:
          'Umrechnung: Stunde 0 = Do 8:00 Uhr, Stunde 8 = Fr 8:00 Uhr, Stunde 16 = Mo 8:00 Uhr (das Wochenende zählt nicht).\n' +
          '**A:** Do 08–11 Uhr\n' +
          '**B:** Do 11–13 Uhr\n' +
          '**C:** Do 11–16 Uhr und Fr 08–09 Uhr\n' +
          '**D:** Do 11–13 Uhr\n' +
          '**E:** Do 13–16 Uhr und Fr 08–09 Uhr\n' +
          '**F:** Fr 09–14 Uhr\n' +
          '**G:** Fr 14–16 Uhr und Mo 16.11. 08–09 Uhr\n' +
          '**H:** Mo 09–11 Uhr\n' +
          '**Meilenstein „Abnahme erfolgt“:** Mo, 16.11.2026, 11:00 Uhr – als Raute ohne Dauer am Ende von H.\n' +
          '**Späteste Lage von E:** SAZ 10 h = **Fr 10:00 Uhr**, SEZ 14 h = **Fr 14:00 Uhr**. Der Pufferbalken reicht vom frühesten Ende (Fr 09:00 Uhr) bis zum spätesten Ende (Fr 14:00 Uhr) – das sind die 5 h Gesamtpuffer.\n' +
          'Falle: Wer Samstag und Sonntag mitzählt, setzt die Abnahme fälschlich auf Samstag, 11:00 Uhr.',
        rubric: [
          'A, B und D richtig am Donnerstag (1 P)',
          'C und E mit Tageswechsel richtig (Fr 08–09 Uhr) (1 P)',
          'F, G und H richtig, Wochenende ausgelassen (1 P)',
          'Meilenstein Mo, 16.11.2026, 11:00 Uhr ohne Dauer (1 P)',
          'späteste Lage von E: Fr 10:00 bis 14:00 Uhr (1 P)',
        ],
      },
      {
        label: 'f)',
        operator: 'beurteilen',
        points: 3,
        prompt:
          'Ein Kollege hat den Netzplan ebenfalls berechnet. In seinem Auszug stecken drei voneinander unabhängige Fehler:\n' +
          '`B: FAZ 3 · FEZ 5 · SAZ 8 · SEZ 10 · GP 5 · FP 5`\n' +
          '`C: FAZ 3 · FEZ 9 · SAZ 3 · SEZ 9 · GP 0 · FP 0`\n' +
          '`D: FAZ 3 · FEZ 5 · SAZ 7 · SEZ 9 · GP −4 · FP 4`\n' +
          '`E: FAZ 5 · FEZ 9 · SAZ 10 · SEZ 14 · GP 5 · FP 5`\n' +
          '`F: FAZ 5 · FEZ 10 · SAZ 9 · SEZ 14 · GP 0 · FP 0`\n' +
          'Benennen Sie die drei Fehler, geben Sie die richtigen Werte an und nennen Sie jeweils die Regel, gegen die verstoßen wurde.',
        modelAnswer:
          '**Fehler 1 – B, FP 5:** richtig ist **FP 0**. Regel: FP = kleinster FAZ der direkten Nachfolger − eigener FEZ = FAZ E 5 − FEZ B 5 = 0. Der Kollege hat den Gesamtpuffer übernommen.\n' +
          '**Fehler 2 – D, GP −4:** richtig ist **GP 4**. Regel: GP = SAZ − FAZ = 7 − 3; gerechnet wurde FAZ − SAZ. Ohne vorgegebenen späteren Endtermin ist ein negativer Puffer immer ein Rechenfehler.\n' +
          '**Fehler 3 – F, FAZ 5 und FEZ 10:** richtig sind **FAZ 9 und FEZ 14**. Regel: Bei mehreren Vorgängern gilt der **größte** FEZ, hier max(FEZ C 9, FEZ D 5) = 9. Wer nur die GP-Spalte nachrechnet, stößt bei F auf 9 − 5 = 4 statt 0 – die eigentliche Ursache ist aber der falsche FAZ.\n' +
          'Die Werte von C und E sind richtig.',
        rubric: [
          'Fehler bei B erkannt und mit FP 0 samt Regel berichtigt (1 P)',
          'Fehler bei D erkannt: GP 4 = SAZ − FAZ (1 P)',
          'Fehler bei F erkannt: FAZ 9 und FEZ 14 über den größten FEZ der Vorgänger (1 P)',
        ],
      },
    ],
  },
  // ---------------------------------------------------------------------------------------------
  // PV1 Nachtrag 18.09.2026: Lücken aus der Auswertung der acht AP1-Originalsätze (H2021–F2025).
  // Englische Fachtexte, Kaufvertrag/Leasing, Phishing/Malware/Logging, IPv6-Adressplan, Hardware
  // aufrüsten. Alle Szenarien, Texte, Geräte und Zahlen sind selbst geschrieben (keine Übernahme aus den
  // Aufgabensätzen); die englischen Texte sind eigene Herstellertexte; Rechnungen per Skript geprüft.
  // ---------------------------------------------------------------------------------------------
  {
    id: 'task-pv1-englisch-herstellerhinweise',
    title: 'Englischer Herstellertext: NAS einrichten und absichern',
    topicId: 'it-sicherheit',
    scenario:
      'Eine Hebammenpraxis mit sechs Mitarbeiterinnen ersetzt ihre externe USB-Festplatte durch ein NAS. Sie sollen das Gerät einrichten. Die Kurzanleitung liegt nur auf Englisch vor:\n\n' +
      '**StoraLine N4 network storage: setup and security notes**\n' +
      '**Before you start.** Place the device on a flat, stable surface in a well-ventilated room. Keep at least 10 cm of free space behind the unit and never cover the air vents. Connect the NAS to an uninterruptible power supply (UPS) to protect your data during power failures.\n' +
      '**Initial setup.** Connect the LAN port to your switch and open the setup wizard in a web browser. The wizard asks you to create a new administrator account; the default account "admin" is disabled afterwards. Choose a password with at least 12 characters.\n' +
      '**Security recommendations.** Enable automatic firmware updates so that security patches are installed as soon as they are released. Turn on two-step verification for every account with administrative rights. Do not make the management interface reachable from the internet; use a VPN connection for remote access instead. Create snapshots on a regular basis and keep at least one backup copy on a separate device.\n' +
      '**Warning.** Never remove a drive while its status LED is flashing.\n\n' +
      'Beantworten Sie die Fragen auf Deutsch; englische Fachbegriffe dürfen Sie übernehmen. Planen Sie für die Aufgabe etwa 20 Minuten ein, das Lesen eingeschlossen.\n\n' +
      '**Einordnung:** Kern. Englischsprachige Texte interpretieren steht im Katalog 2025 (02.03, 02.04) und kam als Lesetext mit Sicherheitshinweisen bereits vor; NAS, 2FA, Updates und Backup gehören zum Kern von 06.04.',
    parts: [
      {
        label: 'a)',
        operator: 'nennen',
        points: 3,
        prompt: 'Nennen Sie drei Vorgaben des Herstellers zum Aufstellen und zur Stromversorgung des NAS.',
        modelAnswer:
          'Drei der folgenden Vorgaben:\n' +
          '**ebene, stabile Fläche** (flat, stable surface)\n' +
          '**gut belüfteter Raum** (well-ventilated room)\n' +
          '**mindestens 10 cm Abstand hinter dem Gerät** (free space behind the unit)\n' +
          '**Lüftungsschlitze nie abdecken** (never cover the air vents)\n' +
          '**Anschluss an eine USV**, damit bei Stromausfall keine Daten verloren gehen (uninterruptible power supply)',
        rubric: [
          'erste Vorgabe sinngemäß richtig wiedergegeben (1 P)',
          'zweite Vorgabe (1 P)',
          'dritte Vorgabe; zwei Aussagen zu Belüftung zählen nur einmal, wenn sie dasselbe meinen (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'wiedergeben',
        points: 4,
        prompt: 'Geben Sie vier Maßnahmen wieder, die der Hersteller zur Absicherung des NAS empfiehlt oder bei der Einrichtung selbst umsetzt.',
        modelAnswer:
          'Vier der folgenden Maßnahmen:\n' +
          '**Firmware automatisch aktualisieren**, damit Sicherheitspatches sofort nach Erscheinen installiert werden.\n' +
          '**Zwei-Schritt-Verifizierung** (2FA) für alle Konten mit Administratorrechten einschalten.\n' +
          '**Verwaltungsoberfläche nicht aus dem Internet erreichbar machen**; Fernzugriff nur über **VPN**.\n' +
          '**Regelmäßig Snapshots** anlegen und **mindestens eine Sicherungskopie auf einem getrennten Gerät** aufbewahren.\n' +
          '**Eigenes Administratorkonto** anlegen; das Standardkonto „admin“ wird danach deaktiviert.\n' +
          '**Passwort mit mindestens 12 Zeichen** wählen.\n' +
          'Bewertung der USV: Sie gehört zur Stromversorgung aus a) und zählt in b) nicht (keine Doppelwertung). Fachlich ist sie durchaus eine Absicherungsmaßnahme, und zwar für das Schutzziel Verfügbarkeit.',
        rubric: [
          'erste Maßnahme sinngemäß richtig, z. B. automatische Firmware-Updates (1 P)',
          'zweite Maßnahme, z. B. Zwei-Schritt-Verifizierung für Admin-Konten (1 P)',
          'dritte Maßnahme, z. B. kein Internetzugriff auf die Verwaltung, Fernzugriff per VPN (1 P)',
          'vierte Maßnahme, z. B. Snapshots und Sicherung auf getrenntem Gerät; die USV aus a) zählt hier nicht noch einmal (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'erklären',
        points: 4,
        prompt: 'Erklären Sie die Begriffe **firmware**, **two-step verification**, **VPN** und **snapshot** jeweils in ein bis zwei Sätzen.',
        modelAnswer:
          '**Firmware:** fest im Gerät gespeicherte Software, die die Hardware steuert (beim NAS das Betriebssystem des Geräts). Updates schließen Sicherheitslücken und beheben Fehler.\n' +
          '**Two-step verification (Zwei-Faktor-Authentisierung):** Die Anmeldung verlangt neben dem Passwort (Wissen) einen zweiten, unabhängigen Nachweis, z. B. einen Code aus einer Authenticator-App (Besitz). Ein erbeutetes Passwort allein reicht dann nicht.\n' +
          '**VPN (Virtual Private Network):** verschlüsselter Tunnel über das Internet ins Praxisnetz. Von außen erreichbar ist nur der VPN-Zugang, nicht die Verwaltungsoberfläche selbst.\n' +
          '**Snapshot:** Momentaufnahme des Datenbestands zu einem Zeitpunkt, auf demselben Gerät gespeichert. Versehentlich gelöschte oder veränderte Dateien lassen sich schnell auf diesen Stand zurücksetzen.',
        rubric: [
          'Firmware als gerätenahe Steuersoftware, Updates schließen Lücken (1 P)',
          'Two-step verification: zweiter, unabhängiger Faktor neben dem Passwort (1 P)',
          'VPN als verschlüsselter Tunnel ins interne Netz (1 P)',
          'Snapshot als Momentaufnahme auf demselben Gerät zum schnellen Zurücksetzen (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'begründen',
        points: 3,
        prompt: 'Begründen Sie die beiden Vorgaben, das Standardkonto „admin“ zu deaktivieren und die Verwaltungsoberfläche nicht aus dem Internet erreichbar zu machen.',
        modelAnswer:
          '**Standardkonto deaktivieren:** Der Name „admin“ ist allgemein bekannt. Ein Angreifer muss dann nur noch das Passwort erraten oder durchprobieren (Brute-Force- bzw. Wörterbuchangriff). Ein selbst gewählter Kontoname ist ein zusätzliches Hindernis, und ein vergessenes Standardkonto mit Werkspasswort ist ausgeschlossen.\n' +
          '**Keine Verwaltung aus dem Internet:** Jede aus dem Internet erreichbare Oberfläche wird von automatisierten Scannern gefunden und angegriffen, z. B. mit Anmeldeversuchen oder über noch nicht gepatchte Schwachstellen. Wer die Verwaltung übernimmt, kann alle Daten lesen, verschlüsseln oder löschen. Über VPN bleibt die **Angriffsfläche** klein: Nur ein gehärteter, verschlüsselter Zugang ist offen.',
        rubric: [
          'Standardname bekannt, Angreifer muss nur noch das Passwort erraten (1 P)',
          'Verwaltung im Internet wird gefunden und angegriffen (Scans, Anmeldeversuche, Schwachstellen) (1 P)',
          'Folge bzw. Gegenmittel: volle Kontrolle über alle Daten; VPN verkleinert die Angriffsfläche (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'erläutern',
        points: 2,
        prompt: 'Erläutern Sie den Warnhinweis am Ende des Textes und warum er wichtig ist.',
        modelAnswer:
          '**Inhalt:** Eine Festplatte darf nie herausgezogen werden, solange ihre Status-LED blinkt.\n' +
          '**Grund:** Das Blinken zeigt, dass gerade auf die Platte zugegriffen wird (Lesen oder Schreiben). Wird sie dabei entfernt, können Dateien bzw. das Dateisystem beschädigt werden und Daten verloren gehen. Deshalb erst warten, bis kein Zugriff mehr läuft, bzw. das Laufwerk vorher in der Verwaltungsoberfläche abmelden.',
        rubric: [
          'Inhalt richtig wiedergegeben: nicht entfernen, solange die LED blinkt (1 P)',
          'Begründung: laufender Zugriff, Gefahr von Datenverlust bzw. beschädigtem Dateisystem (1 P)',
        ],
      },
      {
        label: 'f)',
        operator: 'beurteilen',
        points: 3,
        prompt: 'Die Praxisinhaberin meint: „Wenn das NAS jeden Tag Snapshots macht, brauchen wir die alte USB-Festplatte nicht mehr.“ Beurteilen Sie die Aussage mithilfe des Textes und Ihres Fachwissens.',
        modelAnswer:
          '**Die Aussage stimmt nicht.** Der Text verlangt ausdrücklich zusätzlich eine Sicherungskopie auf einem **getrennten Gerät** (keep at least one backup copy on a separate device).\n' +
          '**Begründung:** Snapshots liegen auf demselben NAS. Fällt das Gerät aus, wird es gestohlen, brennt es oder löscht ein Angreifer mit Administratorrechten die Snapshots und verschlüsselt die Daten, sind Original und Snapshots zugleich verloren. Ein Snapshot schützt vor versehentlichem Löschen, ersetzt aber keine Datensicherung.\n' +
          '**Empfehlung:** Die USB-Festplatte weiter als Sicherungsziel nutzen und nach der Sicherung trennen (offline), besser noch im Wechsel mit einer zweiten Platte außer Haus lagern (3-2-1-Regel).',
        rubric: [
          'Aussage abgelehnt mit Bezug auf die Textstelle „separate device“ (1 P)',
          'Begründung: Snapshots auf demselben Gerät, gemeinsamer Verlust bei Defekt, Diebstahl oder Ransomware (1 P)',
          'Empfehlung: getrennte, möglichst offline bzw. außer Haus gelagerte Sicherung (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-englisch-servicevertrag',
    title: 'Englischer Anbietertext: Service-Levels und Preise eines IT-Dienstleisters',
    topicId: 'qs-vertraege',
    scenario:
      'Ein Reisebüro mit zwei Filialen will die Betreuung seiner Rechner an einen IT-Dienstleister abgeben. Die Filialen sind montags bis freitags von 9 bis 19 Uhr und samstags von 10 bis 14 Uhr geöffnet. Betreut werden sollen 16 Arbeitsplatzrechner, die sich 24 Beschäftigte im Schichtbetrieb teilen, und die 2 Notebooks der Geschäftsführung (eines je Person). Ein Anbieter schickt folgende Leistungsbeschreibung:\n\n' +
      '**Managed Workplace: service levels and pricing**\n' +
      'Our managed workplace service is available in three service levels. Every level includes remote support, patch management and antivirus monitoring. You can choose the level for each device.\n' +
      '**Basic:** Requests are accepted Monday to Friday from 7:30 a.m. to 4:30 p.m. We respond within eight business hours.\n' +
      '**Business:** Support hours are Monday to Friday from 7 a.m. to 7 p.m. Critical incidents receive a response within two hours. Up to four on-site visits per year are included.\n' +
      '**Premium:** Critical incidents are handled 24/7 with a response time of 30 minutes. You get a dedicated contact person.\n' +
      '**Monthly price per device:** Basic EUR 18, Business EUR 29, Premium EUR 47. A one-time setup fee of EUR 35 per device is charged. The minimum contract term is 12 months.\n' +
      '**Pricing models:** Instead of paying per device, you can choose per-user pricing: a fixed monthly price for every named user, who may use up to three devices (Business EUR 44, Premium EUR 69; Basic is only available per device). If you sign for 24 months instead of 12, we reduce all monthly prices by 10 %. The setup fee is never discounted.\n\n' +
      'Beantworten Sie die Fragen auf Deutsch. Alle Preise sind Nettopreise.\n\n' +
      '**Einordnung:** Kern (englischsprachige Texte 02.03/02.04, Support-Level 01.03, Angebote bewerten und vergleichen, Vertragslaufzeit).',
    parts: [
      {
        label: 'a)',
        operator: 'wiedergeben',
        points: 4,
        prompt: 'Geben Sie für die drei Service-Levels jeweils die Servicezeit und die zugesagte Reaktionszeit wieder. Nennen Sie außerdem zwei Leistungen, die in allen Levels enthalten sind, und eine Zusatzleistung, die es erst ab Business gibt.',
        modelAnswer:
          '**Basic:** Anfragen Mo–Fr 7:30–16:30 Uhr, Reaktion innerhalb von **acht Geschäftsstunden**.\n' +
          '**Business:** Servicezeit Mo–Fr 7–19 Uhr, bei kritischen Störungen Reaktion innerhalb von **zwei Stunden**.\n' +
          '**Premium:** kritische Störungen **rund um die Uhr an sieben Tagen** (24/7), Reaktion innerhalb von **30 Minuten**.\n' +
          '**In allen Levels (zwei genügen):** Fernwartung bzw. Remote-Support, Patchmanagement, Überwachung des Virenschutzes.\n' +
          '**Erst ab Business:** bis zu vier Vor-Ort-Einsätze pro Jahr; bei Premium zusätzlich ein fester Ansprechpartner.',
        rubric: [
          'Basic: Mo–Fr 7:30–16:30 Uhr, Reaktion in acht Geschäftsstunden (1 P)',
          'Business: Mo–Fr 7–19 Uhr, zwei Stunden bei kritischen Störungen (1 P)',
          'Premium: 24/7, 30 Minuten (1 P)',
          'zwei Leistungen aller Levels und eine Zusatzleistung (Vor-Ort-Einsätze oder fester Ansprechpartner) (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'erklären',
        points: 3,
        prompt: 'Erklären Sie die Angaben **response time**, **eight business hours** und **minimum contract term**. Zeigen Sie an einem Beispiel, wann der Anbieter im Level Basic spätestens reagieren muss, wenn eine Anfrage am Freitag um 15:00 Uhr eingeht.',
        modelAnswer:
          '**Response time (Reaktionszeit):** Zeit bis zur ersten qualifizierten Rückmeldung bzw. bis zum Beginn der Bearbeitung. Sie sagt **nichts darüber, wann die Störung behoben ist** – das wäre eine Lösungs- bzw. Wiederherstellungszeit, die hier nicht zugesagt wird.\n' +
          '**Eight business hours:** Gezählt werden nur Stunden innerhalb der Servicezeit (Mo–Fr 7:30–16:30 Uhr). Beispiel: Eingang Freitag 15:00 Uhr → bis 16:30 Uhr laufen 1,5 Stunden, die restlichen 6,5 Stunden ab Montag 7:30 Uhr → Reaktion spätestens **Montag, 14:00 Uhr**.\n' +
          '**Minimum contract term:** Mindestvertragslaufzeit von 12 Monaten. Vorher kann das Reisebüro nicht ordentlich kündigen; es bezahlt also mindestens zwölf Monatsbeiträge.',
        rubric: [
          'Reaktionszeit ist nicht Lösungszeit (1 P)',
          'Geschäftsstunden nur innerhalb der Servicezeit; Beispiel ergibt Montag 14:00 Uhr (1 P)',
          'Mindestvertragslaufzeit: frühestens nach 12 Monaten kündbar (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'erläutern',
        points: 4,
        prompt: 'Erläutern Sie die beiden Abrechnungsmodelle, die der Text beschreibt. Geben Sie für das Level Business an, ab wie vielen Geräten je Person sich die Abrechnung je Benutzer lohnt, und begründen Sie, welches Modell zum Reisebüro passt.',
        modelAnswer:
          '**Je Gerät (per device):** Für jedes betreute Gerät fällt der Monatspreis seines Levels an, egal wie viele Personen es nutzen.\n' +
          '**Je Benutzer (per user):** Für jede namentlich benannte Person fällt ein fester Monatspreis an; sie darf bis zu drei Geräte nutzen. Basic gibt es nur je Gerät.\n' +
          '**Vergleich Business:** 1 Gerät je Person: 29 € < 44 € → je Gerät günstiger. 2 Geräte je Person: 2 × 29 € = 58 € > 44 € → **ab dem zweiten Gerät** lohnt sich die Abrechnung je Benutzer. (Premium ebenso: 2 × 47 € = 94 € > 69 €.)\n' +
          '**Reisebüro:** 24 Beschäftigte teilen sich 16 Rechner. Je Benutzer kostete Business 24 × 44 € = 1.056 € im Monat, je Gerät nur 16 × 29 € = 464 €. Auch die Geschäftsführung hat nur ein Gerät je Person (47 € je Gerät < 69 € je Benutzer). → **Abrechnung je Gerät**.\n' +
          'Falle: Die Abrechnung je Benutzer lohnt sich nur, wenn jede Person mehrere Geräte hat (z. B. PC, Notebook und Tablet), nicht bei geteilten Rechnern.',
        rubric: [
          'Abrechnung je Gerät richtig erklärt (1 P)',
          'Abrechnung je Benutzer mit bis zu drei Geräten richtig erklärt (1 P)',
          'Business: je Benutzer lohnt sich ab dem zweiten Gerät je Person (58 € > 44 €) (1 P)',
          'Empfehlung je Gerät, begründet mit geteilten Rechnern bzw. einem Gerät je Person (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'beurteilen',
        points: 3,
        prompt: 'Der Anbieter gewährt bei 24 Monaten Laufzeit 10 % Nachlass. Beurteilen Sie, ob das Reisebüro die längere Laufzeit wählen sollte. Nennen Sie dazu einen Vorteil und einen Nachteil und geben Sie eine begründete Empfehlung.',
        modelAnswer:
          '**Vorteil (einer genügt):** 10 % weniger auf jeden Monatspreis, z. B. Business 26,10 € statt 29 € je Gerät; die Einrichtungsgebühr bleibt gleich. Außerdem sind die Kosten zwei Jahre lang fest und planbar.\n' +
          '**Nachteil (einer genügt):** Die Bindung ist doppelt so lang. Arbeitet der Anbieter schlecht, schließt eine Filiale oder sinkt die Zahl der Rechner, kann das Reisebüro vor Ablauf der 24 Monate nicht ordentlich kündigen und zahlt weiter; günstigere Angebote kann es erst später nutzen.\n' +
          '**Empfehlung (eine begründete Variante genügt):** Ist der Anbieter neu und unbekannt, zuerst 12 Monate testen; der Nachlass wiegt das Risiko einer schlechten Betreuung nicht auf. 24 Monate nur, wenn Referenzen überzeugen und der Gerätebestand stabil bleibt, dann möglichst mit Sonderkündigungsrecht bei wiederholt überschrittenen Reaktionszeiten.',
        rubric: [
          'Vorteil: 10 % Nachlass auf die Monatspreise bzw. planbare Kosten (1 P)',
          'Nachteil: längere Bindung, kein Ausstieg bei schlechter Leistung oder geändertem Bedarf (1 P)',
          'begründete Empfehlung mit Bezug zum Reisebüro (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'berechnen',
        points: 5,
        prompt: 'Das Reisebüro möchte die 16 Arbeitsplatzrechner im Level Business und die 2 Notebooks der Geschäftsführung im Level Premium betreuen lassen, abgerechnet je Gerät bei 12 Monaten Laufzeit. Berechnen Sie die Kosten für das erste Vertragsjahr und für jedes Folgejahr. Berechnen Sie außerdem die durchschnittlichen Kosten je Gerät und Monat im ersten Jahr (auf Cent gerundet).',
        modelAnswer:
          '**Einrichtung (einmalig):** 18 Geräte × 35 € = **630 €**\n' +
          '**Monatlich:** 16 × 29 € + 2 × 47 € = 464 € + 94 € = **558 €**\n' +
          '**Jahresbeitrag:** 558 € × 12 = **6.696 €**\n' +
          '**Erstes Jahr:** 6.696 € + 630 € = **7.326 €**\n' +
          '**Jedes Folgejahr:** **6.696 €** (die Einrichtungsgebühr fällt nur einmal an)\n' +
          '**Durchschnitt im ersten Jahr:** 7.326 € ÷ (18 Geräte × 12 Monate) = 7.326 € ÷ 216 = **33,92 € je Gerät und Monat**\n' +
          'Falle: Die Einrichtungsgebühr gilt je Gerät („per device“), nicht einmal für den ganzen Vertrag.',
        rubric: [
          'Einrichtung 18 × 35 € = 630 € (1 P)',
          'Monatsbeitrag 558 € (1 P)',
          'erstes Jahr 7.326 € (1 P)',
          'Folgejahr 6.696 € ohne Einrichtungsgebühr (1 P)',
          'Durchschnitt 33,92 € je Gerät und Monat (1 P)',
        ],
      },
      {
        label: 'f)',
        operator: 'beurteilen',
        points: 3,
        prompt: 'Beurteilen Sie, ob die gewählte Aufteilung zu den Öffnungszeiten des Reisebüros passt. Machen Sie einen begründeten Vorschlag.',
        modelAnswer:
          '**Werktags:** Business deckt Mo–Fr 7–19 Uhr ab und damit die Öffnungszeit 9–19 Uhr. Basic würde nur bis 16:30 Uhr reichen, und acht Geschäftsstunden Reaktionszeit können bis zum nächsten Tag dauern – für die Buchungsarbeitsplätze zu wenig.\n' +
          '**Samstag:** Die Filialen haben geöffnet, Business gilt aber nur Mo–Fr. Am Samstag ist nur Premium erreichbar – und auch dort ist die 24/7-Reaktion nur für **kritische** Störungen zugesagt. Fällt samstags ein Buchungsrechner aus, gibt es keine vertragliche Hilfe.\n' +
          '**Vorschlag (begründet, eine Variante genügt):** Beim Anbieter eine Samstagserweiterung für Business nachverhandeln; oder die Rechner, an denen samstags gebucht wird (z. B. je einer pro Filiale), in Premium einstufen – Mehrkosten je Gerät (47 € − 29 €) × 12 = 216 € im Jahr; oder bewusst das Risiko tragen und einen Ersatzrechner vorhalten. Premium für die Notebooks der Geschäftsführung ist nur sinnvoll, wenn dort wirklich außerhalb der Geschäftszeiten kritische Arbeit anfällt.',
        rubric: [
          'werktags passt Business zur Öffnungszeit, Basic nicht (1 P)',
          'Lücke am Samstag erkannt, Premium nur für kritische Störungen (1 P)',
          'schlüssiger Vorschlag mit Begründung, z. B. Samstagserweiterung oder Samstagsrechner in Premium (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-beschaffung-kaufvertrag-leasing',
    title: 'Beschaffung für eine Fahrschule: Kaufvertrag, Lieferverzug und Leasing',
    topicId: 'qs-vertraege',
    scenario:
      'Eine Fahrschule mit drei Filialen stellt den Theorieunterricht auf Tablets um. Sie betreuen als Auszubildende bzw. Auszubildender eines IT-Dienstleisters die Beschaffung. Der Ablauf bisher:\n\n' +
      '| Datum | Vorgang |\n' +
      '|---|---|\n' +
      '| 26.10.2026 | Die Inhaberin sieht im Online-Katalog eines Händlers ein passendes Tablet „ab 389 € netto“. |\n' +
      '| 02.11.2026 | Der Händler schickt auf Anfrage ein schriftliches Angebot: 6 Tablets zu je 379 € netto, Lieferung frei Haus **bis spätestens 27.11.2026**, Zahlung innerhalb von 30 Tagen, 2 % Skonto innerhalb von 10 Tagen. „An dieses Angebot halten wir uns bis zum 16.11.2026 gebunden.“ |\n' +
      '| 06.11.2026 | Die Fahrschule bestellt per E-Mail 6 Tablets zu den Bedingungen des Angebots. Eine Auftragsbestätigung kommt nicht. |\n' +
      '| 09.11.2026 | Die Fahrschule bestellt per E-Mail zusätzlich 6 Schutzhüllen zu je 24 € aus der Preisliste; ein Angebot dazu gab es nicht. Der Händler antwortet nicht. |\n' +
      '| 13.11.2026 | Die Schutzhüllen werden geliefert. |\n' +
      '| 01.12.2026 | Die Tablets sind noch nicht da. Der Theorieunterricht muss mit Leihgeräten laufen. |\n\n' +
      'Außerdem braucht die Hauptfiliale ein Farblaser-Multifunktionsgerät. Kaufpreis: **1.290 € netto**. Alternativ bietet eine Leasinggesellschaft das Gerät für **39 € netto im Monat** bei **36 Monaten** Laufzeit an; am Ende kann die Fahrschule es für einen **Restwert von 120 € netto** kaufen.\n\n' +
      '**Einordnung:** Kern (Kaufvertrag und Vertragsstörungen 07.01, Kauf/Miete/Leasing 03.04). Fixkauf und die Leasingarten sind [RAND] und stehen nur als Zusatz in den Lösungen.',
    parts: [
      {
        label: 'a)',
        operator: 'erläutern',
        points: 4,
        prompt: 'Erläutern Sie, wie ein Kaufvertrag zustande kommt. Geben Sie an, ob der Online-Katalog schon ein Angebot im rechtlichen Sinn ist, und bestimmen Sie mit Begründung, an welchem Tag der Kaufvertrag über die Tablets und der über die Schutzhüllen zustande gekommen ist.',
        modelAnswer:
          '**Grundsatz:** Ein Kaufvertrag entsteht durch **zwei übereinstimmende Willenserklärungen**: Antrag (Angebot) und Annahme. Eine bestimmte Form ist grundsätzlich nicht vorgeschrieben; E-Mail genügt.\n' +
          '**Online-Katalog:** kein Antrag, sondern eine **Aufforderung, selbst ein Angebot abzugeben** (invitatio ad offerendum). Der Händler will sich nicht gegenüber jedem Leser binden, etwa weil sein Vorrat begrenzt ist.\n' +
          '**Tablets – 06.11.2026:** Das schriftliche Angebot vom 02.11. ist der **Antrag**, an den der Händler bis zum 16.11. gebunden ist. Die Bestellung vom 06.11. stimmt mit dem Angebot überein und kommt rechtzeitig: Sie ist die **Annahme**. Eine Auftragsbestätigung ist dafür nicht nötig.\n' +
          '**Schutzhüllen – 13.11.2026:** Ohne vorheriges Angebot ist die Bestellung vom 09.11. der **Antrag**. Der Händler nimmt ihn nicht ausdrücklich an, sondern durch **schlüssiges Handeln**: Er liefert. Schweigen allein wäre keine Annahme.\n' +
          '[RAND] Hätte die Fahrschule erst nach dem 16.11. oder mit geänderten Bedingungen bestellt (z. B. 8 statt 6 Tablets), wäre ihre Bestellung ein **neuer Antrag** gewesen, den der Händler erst annehmen müsste. „Freibleibend“ oder „ohne Obligo“ im Angebot schließt die Bindung aus.',
        rubric: [
          'zwei übereinstimmende Willenserklärungen: Antrag und Annahme (1 P)',
          'Katalog ist kein Antrag, sondern Aufforderung zur Abgabe eines Angebots (1 P)',
          'Tablets: Vertrag am 06.11. durch fristgerechte Bestellung auf das bindende Angebot (1 P)',
          'Schutzhüllen: Bestellung als Antrag, Vertrag am 13.11. durch Lieferung (schlüssiges Handeln) (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'nennen',
        points: 4,
        prompt: 'Nennen Sie vier Inhalte, die in einem Kaufvertrag über die Tablets geregelt sein sollten. Geben Sie außerdem die Hauptpflichten des Verkäufers und des Käufers an.',
        modelAnswer:
          '**Inhalte (vier genügen):** Art und Beschaffenheit bzw. Güte der Ware (genaues Modell, Speicher, Ausstattung) · Menge · Preis und Preisnachlässe (Rabatt, Skonto) · Lieferbedingungen (Liefertermin, Versandkosten, z. B. frei Haus) · Zahlungsbedingungen (Zahlungsziel, Skontofrist) · Erfüllungsort und Gerichtsstand · Gewährleistung bzw. zusätzliche Garantie · Eigentumsvorbehalt.\n' +
          '**Pflichten des Verkäufers:** die Ware **übergeben** und das **Eigentum** daran verschaffen, und zwar frei von Sach- und Rechtsmängeln.\n' +
          '**Pflichten des Käufers:** den vereinbarten **Kaufpreis zahlen** und die Ware **abnehmen**.\n' +
          'Diese Hauptpflichten stehen in § 433 BGB; die Inhalte oben legen fest, wie sie im Einzelfall aussehen.',
        rubric: [
          'zwei passende Vertragsinhalte (1 P)',
          'zwei weitere passende Vertragsinhalte (1 P)',
          'Verkäufer: übergeben und Eigentum verschaffen, mangelfrei (1 P)',
          'Käufer: Kaufpreis zahlen und Ware abnehmen (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'prüfen',
        points: 4,
        prompt: 'Prüfen Sie, ob sich der Händler am 01.12.2026 mit den Tablets im Lieferverzug befindet. Erläutern Sie anschließend, welche Rechte die Fahrschule hat.',
        modelAnswer:
          '**Voraussetzungen des Lieferverzugs:**\n' +
          '**Fälligkeit und Nichtlieferung:** Liefertermin war der 27.11.2026; am 01.12. ist nichts geliefert.\n' +
          '**Mahnung:** grundsätzlich nötig, hier aber **entbehrlich**, weil der Termin **kalendermäßig bestimmt** ist („bis spätestens 27.11.2026“). Mit Ablauf des Termins tritt der Verzug ohne Mahnung ein.\n' +
          '**Verschulden:** Der Händler muss die Verspätung zu vertreten haben (Vorsatz oder Fahrlässigkeit). Das wird vermutet; er müsste sich entlasten, z. B. mit höherer Gewalt.\n' +
          '→ Der Händler ist **im Lieferverzug**.\n' +
          '**Rechte ohne Nachfrist:** weiterhin **Lieferung verlangen** und zusätzlich **Ersatz des Verzugsschadens**, z. B. die Kosten der Leihgeräte.\n' +
          '**Rechte nach Ablauf einer angemessenen Nachfrist:** **vom Vertrag zurücktreten** (z. B. um anderswo zu kaufen) und/oder **Schadensersatz statt der Leistung** verlangen, etwa den Mehrpreis eines Ersatzkaufs.\n' +
          '[RAND] Ist der Termin so wichtig, dass eine spätere Lieferung sinnlos wäre, und ist das vereinbart („fix“), liegt ein **Fixkauf** vor; dann ist der Rücktritt auch ohne Nachfrist möglich.',
        rubric: [
          'Fälligkeit und Nichtlieferung zum 27.11. festgestellt (1 P)',
          'Mahnung entbehrlich wegen kalendermäßig bestimmten Termins; Verschulden als Voraussetzung (1 P)',
          'Rechte ohne Nachfrist: Lieferung plus Verzugsschaden (1 P)',
          'Rechte nach angemessener Nachfrist: Rücktritt und/oder Schadensersatz statt der Leistung (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'nennen',
        points: 3,
        prompt: 'Die Fahrschule will künftigen Störungen bei Beschaffungen vorbeugen. Nennen Sie zwei Maßnahmen gegen Lieferverzug und eine Maßnahme gegen mangelhafte Lieferung (Schlechtleistung), die sie vor oder bei Vertragsschluss treffen kann.',
        modelAnswer:
          '**Gegen Lieferverzug (zwei genügen):** verbindlichen, kalendermäßig bestimmten Liefertermin vereinbaren · Vertragsstrafe (Konventionalstrafe) für jede Woche Verspätung vereinbaren · zuverlässigen Lieferanten wählen (Erfahrungen, Bewertungen, Lagerbestand erfragen) · zeitlichen Puffer vor dem Einsatztermin einplanen · einen zweiten Lieferanten als Ausweichmöglichkeit kennen.\n' +
          '**Gegen Schlechtleistung (eine genügt):** Ware im Vertrag genau beschreiben (Modell, Ausstattung) · vorab ein Testgerät bzw. Muster prüfen · Wareneingangskontrolle sofort bei Lieferung einplanen · eine Garantie oder zugesicherte Eigenschaften vereinbaren.\n' +
          'Zur Einordnung: Weitere Störungen des Kaufvertrags gehen vom Käufer aus – **Zahlungsverzug** und **Annahmeverzug**.',
        rubric: [
          'erste Maßnahme gegen Lieferverzug, z. B. fester Termin oder Vertragsstrafe (1 P)',
          'zweite, andere Maßnahme gegen Lieferverzug (1 P)',
          'Maßnahme gegen Schlechtleistung, z. B. genaue Spezifikation oder Wareneingangsprüfung (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'erläutern',
        points: 3,
        prompt: 'Erläutern Sie das Grundprinzip des Leasings am Beispiel des Multifunktionsgeräts. Gehen Sie dabei auf Eigentum und Besitz ein und nennen Sie je einen Vor- und Nachteil für die Fahrschule.',
        modelAnswer:
          '**Prinzip:** Die **Leasinggesellschaft (Leasinggeber)** kauft das Gerät beim Hersteller oder Händler und überlässt es der **Fahrschule (Leasingnehmer)** für eine feste Laufzeit zur Nutzung. Dafür zahlt die Fahrschule monatliche **Leasingraten**.\n' +
          '**Eigentum und Besitz:** Die Leasinggesellschaft bleibt **Eigentümerin** (rechtliche Herrschaft). Die Fahrschule wird **Besitzerin** (tatsächliche Herrschaft): Sie hat das Gerät in der Filiale und nutzt es.\n' +
          '**Vorteil (einer genügt):** keine hohe Anfangsausgabe, die Liquidität bleibt erhalten; feste, planbare Raten; die Raten sind als Betriebsausgaben absetzbar; nach der Laufzeit leicht auf neue Technik wechseln.\n' +
          '**Nachteil (einer genügt):** insgesamt meist teurer als der Kauf; feste Bindung an die Laufzeit; kein Eigentum, deshalb Auflagen z. B. zu Versicherung, Pflege und Rückgabezustand.\n' +
          '[RAND] Beim Finanzierungsleasing trägt der Leasingnehmer Wartung und Risiko; beim Operating- bzw. Full-Service-Leasing sind Wartung und Service oft in der Rate enthalten.',
        rubric: [
          'Prinzip: Leasinggeber kauft, Leasingnehmer nutzt gegen Raten für eine feste Laufzeit (1 P)',
          'Eigentum beim Leasinggeber, Besitz bei der Fahrschule (1 P)',
          'je ein passender Vor- und Nachteil (1 P)',
        ],
      },
      {
        label: 'f)',
        operator: 'beurteilen',
        points: 4,
        prompt: 'Nennen Sie drei Möglichkeiten der Fahrschule am Ende der Leasinglaufzeit. Berechnen Sie, was das Gerät kostet, wenn sie es 36 Monate least und dann zum Restwert kauft, und vergleichen Sie mit dem Sofortkauf. Beurteilen Sie das Ergebnis kurz.',
        modelAnswer:
          '**Möglichkeiten (drei genügen):** Gerät **zurückgeben** · Gerät zum Restwert **kaufen** (Kaufoption) · Vertrag **verlängern** (meist mit niedrigerer Rate) · ein **neues Gerät leasen** (Anschlussleasing bzw. Austausch).\n' +
          '**Leasing mit Kauf:** 39 € × 36 = 1.404 € Raten + 120 € Restwert = **1.524 €**\n' +
          '**Vergleich:** 1.524 € − 1.290 € = **234 € mehr** als beim Sofortkauf.\n' +
          '**Beurteilung:** Rein nach den Zahlen ist der Kauf günstiger (Zinsen und Wartung sind nicht berücksichtigt). Leasing kann sich trotzdem lohnen, wenn die Fahrschule ihr Geld für andere Zwecke braucht (Liquidität) oder wenn Service in der Rate enthalten ist. Wer das Gerät ohnehin behalten will, fährt mit dem Kauf besser.',
        rubric: [
          'drei Möglichkeiten am Laufzeitende (1 P)',
          'Leasing mit Kauf: 1.404 € + 120 € = 1.524 € (1 P)',
          'Mehrkosten gegenüber dem Kauf: 234 € (1 P)',
          'Beurteilung mit Kosten und einem nicht rein finanziellen Argument (Liquidität, Service) (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-sicherheitsvorfall-phishing-malware',
    title: 'Sicherheitsvorfall in einer Hausverwaltung: Phishing, Malware, Passwörter und Protokollierung',
    topicId: 'it-sicherheit',
    scenario:
      'Eine Hausverwaltung mit 18 Beschäftigten verwaltet rund 900 Mietwohnungen; auf dem Server liegen Mietverträge, Bankverbindungen und Nebenkostenabrechnungen. Die Firma nutzt den Maildienst „CloudMail Business“, dessen echte Adressen auf `cloudmail.example` enden. Heute leitet eine Sachbearbeiterin folgende Nachricht an die IT weiter:\n\n' +
      '`Von: CloudMail Business Support <support@cloudmai1-business.example>`\n' +
      '`Betreff: WICHTIG: Ihr Postfach wird heute um 18:00 Uhr gesperrt`\n' +
      '`Anhang: Nutzungsbedingungen_2026.pdf.exe`\n' +
      '„Sehr geehrter Kunde, bei einer Sicherheitsprüfung haben wir ungewöhnliche Anmeldungen auf Ihrem Konto festgestellt. Damit Ihr Postfach nicht gesperrt und alle Nachrichten gelöscht werden, bestätigen Sie bitte umgehend Ihr Passwort über den folgenden Link: Konto jetzt bestätigen. Im Anhang finden Sie unsere neuen Nutzungsbedingungen. Mit freundlichen Grüßen, Ihr Support-Team“\n' +
      'Beim Überfahren des Links mit der Maus zeigt das Mailprogramm: `http://cloudmail-login.verify-account.example/confirm`\n\n' +
      'Ein Kollege aus der Buchhaltung hat vor einer Woche den Anhang einer ähnlichen Mail geöffnet. Seitdem ist sein PC langsam, und heute meldet der Virenscanner einen Keylogger. In den Protokollen der Firewall fallen nächtliche Verbindungen seines PCs zu einem unbekannten Server auf. Sie unterstützen den IT-Verantwortlichen bei der Aufarbeitung.\n\n' +
      '**Einordnung:** Kern (Angriffe und Malware, Passwort-Policy bewerten 06.04, Protokollierung, Datenschutzgrundsätze nach Art. 5 DSGVO). [RAND] sind Rootkit, SPF/DKIM/DMARC und die Mitbestimmung des Betriebsrats; sie stehen nur als Zusatz in den Lösungen.',
    parts: [
      {
        label: 'a)',
        operator: 'nennen',
        points: 3,
        prompt: 'Nennen Sie drei Merkmale, an denen man erkennt, dass es sich bei der weitergeleiteten Nachricht um eine Phishing-Mail handelt. Beziehen Sie sich auf die Mail.',
        modelAnswer:
          'Drei der folgenden Merkmale:\n' +
          '**gefälschte Absenderadresse:** `cloudmai1-business.example` statt `cloudmail.example` – eine Ziffer 1 statt des Buchstabens l und eine fremde Domain.\n' +
          '**Zeitdruck und Drohung:** Sperrung „heute um 18:00 Uhr“, Löschung aller Nachrichten.\n' +
          '**Aufforderung, das Passwort einzugeben:** Seriöse Anbieter fragen Zugangsdaten nie per Mail ab.\n' +
          '**Link-Ziel passt nicht zum Anbieter:** Die Adresse endet auf `verify-account.example`, nicht auf `cloudmail.example`; außerdem ohne https.\n' +
          '**gefährlicher Anhang mit doppelter Endung:** `.pdf.exe` ist ein ausführbares Programm, das sich als PDF tarnt.\n' +
          '**unpersönliche Anrede:** „Sehr geehrter Kunde“ statt des Namens.',
        rubric: [
          'erstes Merkmal mit Bezug zur Mail (1 P)',
          'zweites Merkmal mit Bezug zur Mail (1 P)',
          'drittes Merkmal mit Bezug zur Mail (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'unterscheiden',
        points: 4,
        prompt: 'Nennen Sie zwei Maßnahmen, mit denen sich die Hausverwaltung als Unternehmen gegen Phishing schützt, und zwei Verhaltensregeln für die Beschäftigten beim Umgang mit E-Mails.',
        modelAnswer:
          '**Maßnahmen des Unternehmens (zwei genügen):**\n' +
          'technisch: Spam- und Phishing-Filter bzw. Mail-Gateway; ausführbare Anhänge (.exe, Makros in Office-Dateien) blockieren; externe Mails kennzeichnen; Zwei-Faktor-Authentisierung für Mail- und Cloudkonten, damit ein erbeutetes Passwort allein nicht reicht; Updates und Virenschutz aktuell halten. [RAND] Absenderprüfung mit SPF, DKIM und DMARC.\n' +
          'organisatorisch: regelmäßige Sensibilisierungsschulungen (Awareness), simulierte Phishing-Mails, klarer Meldeweg an die IT, Richtlinie zum Umgang mit E-Mails.\n' +
          '**Verhaltensregeln für Beschäftigte (zwei genügen):** Absenderadresse und Link-Ziel prüfen (Maus darüber halten, nicht klicken) · niemals Zugangsdaten über einen Link aus einer Mail eingeben, sondern die Seite selbst aufrufen · keine unerwarteten Anhänge öffnen, schon gar nicht mit doppelter Endung · im Zweifel über einen bekannten Weg nachfragen (Telefonnummer aus dem eigenen Adressbuch, nicht aus der Mail) · verdächtige Mails sofort der IT melden und nicht weiterleiten, auch nach einem versehentlichen Klick.\n' +
          'Wichtig ist die Trennung: Das Unternehmen schafft Technik und Regeln, die Beschäftigten verhalten sich im Einzelfall richtig.',
        rubric: [
          'erste Maßnahme des Unternehmens (technisch oder organisatorisch) (1 P)',
          'zweite, andere Maßnahme des Unternehmens (1 P)',
          'erste Verhaltensregel für Beschäftigte (1 P)',
          'zweite Verhaltensregel; Unternehmens- und Mitarbeiterebene nicht vermischt (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'zuordnen',
        points: 3,
        prompt:
          'Der IT-Verantwortliche erstellt ein Merkblatt. Ordnen Sie jeder Beschreibung die passende Schadprogrammart zu.\n' +
          '(1) zeichnet unbemerkt alle Tastatureingaben auf und schickt sie an den Angreifer\n' +
          '(2) hängt sich an ein Programm oder Dokument und wird aktiv, sobald dieses geöffnet wird; verbreitet sich über weitergegebene Dateien\n' +
          '(3) verbreitet sich selbstständig über das Netzwerk, indem es Sicherheitslücken anderer Rechner ausnutzt\n' +
          '(4) gibt sich als nützliches Programm aus, z. B. als Rechnungsbetrachter, und führt im Hintergrund Schadfunktionen aus\n' +
          '(5) verschlüsselt Dateien auf dem Rechner und den Netzlaufwerken und verlangt Lösegeld\n' +
          '(6) richtet einen versteckten Zugang ein, über den der Angreifer den Rechner später aus der Ferne steuern kann',
        modelAnswer:
          '**(1) Keylogger** (eine Form der Spyware)\n' +
          '**(2) Virus** – braucht eine Wirtsdatei und das Zutun des Nutzers.\n' +
          '**(3) Wurm** – verbreitet sich ohne Wirtsdatei und ohne Zutun selbstständig.\n' +
          '**(4) Trojaner** (Trojanisches Pferd) – Tarnung als nützliches Programm.\n' +
          '**(5) Ransomware** (Erpressungstrojaner)\n' +
          '**(6) Backdoor** (Hintertür); oft von einem Trojaner installiert.\n' +
          '[RAND] Ein **Rootkit** nistet sich tief im Betriebssystem ein und verbirgt seine Prozesse und Dateien vor Virenscanner und Taskmanager.\n' +
          'Im Fall der Buchhaltung: Der Anhang war vermutlich ein Trojaner, der einen Keylogger nachgeladen hat; die nächtlichen Verbindungen deuten darauf hin, dass Daten abfließen oder eine Backdoor besteht.',
        rubric: [
          '(1) Keylogger und (2) Virus richtig (1 P)',
          '(3) Wurm und (4) Trojaner richtig (1 P)',
          '(5) Ransomware und (6) Backdoor richtig (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'beurteilen',
        points: 4,
        prompt:
          'Nach dem Vorfall müssen alle Passwörter geändert werden. Der IT-Verantwortliche legt dazu eine neue Richtlinie vor: „Passwörter haben mindestens 8 Zeichen und enthalten eine Ziffer. Sie werden alle 30 Tage geändert. Damit man sie sich merken kann, darf das neue Passwort das alte mit einer um eins höheren Zahl am Ende sein.“ ' +
          'Beurteilen Sie die Richtlinie. Nennen Sie drei Kriterien für sichere Passwörter mit ihrer Wirkung und erläutern Sie, warum Passwortregeln allein gegen den gefundenen Keylogger nicht helfen.',
        modelAnswer:
          '**Beurteilung:** Die Richtlinie ist zu schwach. **8 Zeichen** mit nur einer Ziffer ergeben einen kleinen Suchraum, der sich durch Durchprobieren (Brute Force) schnell abarbeiten lässt. Das **Hochzählen am Ende** macht jedes neue Passwort aus dem alten vorhersagbar – ein erbeutetes altes Passwort verrät das neue. Der **Zwangswechsel alle 30 Tage** führt genau zu solchen Mustern; das BSI empfiehlt einen Wechsel deshalb vor allem bei Verdacht auf Kompromittierung, wie jetzt. (Manche Lehrbücher und ältere Lösungen nennen „regelmäßig ändern“ noch als Kriterium; wer es mit Begründung nennt, verliert keinen Punkt.)\n' +
          '**Kriterien mit Wirkung (drei genügen):**\n' +
          '**Länge**, z. B. mindestens 12 Zeichen oder eine lange Passphrase: Jedes zusätzliche Zeichen vervielfacht die Zahl der möglichen Kombinationen.\n' +
          '**großer Zeichenvorrat** (Groß- und Kleinbuchstaben, Ziffern, Sonderzeichen): mehr Möglichkeiten je Stelle.\n' +
          '**kein Wort und kein Muster** (Wörterbuchbegriffe, Tastaturfolgen, bekannte Schemata): schützt vor Wörterbuchangriffen.\n' +
          '**kein persönlicher Bezug** (Namen, Geburtsdaten, Firmenname): schützt vor gezieltem Raten mit persönlichem Wissen.\n' +
          'Zusatz (Nutzungsregel, keine Eigenschaft des Passworts selbst): **für jeden Dienst ein eigenes Passwort**, damit ein erbeutetes Passwort nicht alle Konten öffnet (Passwortmanager nutzen). Mit dieser Begründung wird es anerkannt; die eigentlichen Kriterien sind Länge, Zeichenvorrat, kein Wort bzw. Muster und kein persönlicher Bezug.\n' +
          '**Keylogger:** Er liest das Passwort bei der Eingabe mit – egal wie lang und komplex es ist. Dagegen helfen ein **zweiter Faktor** (2FA), die Bereinigung bzw. Neuinstallation des befallenen PCs und das Ändern der Passwörter **von einem sauberen Gerät** aus.\n' +
          'Begriffsfalle: Passwörter werden nicht „entschlüsselt“, sondern erraten, durchprobiert oder abgegriffen; gespeicherte Passwörter liegen als Hashwerte vor.',
        rubric: [
          'Schwächen erkannt: 8 Zeichen zu kurz, Hochzählen vorhersagbar (1 P)',
          'Zwangswechsel kritisch gesehen oder Wechsel bei Verdacht begründet (1 P)',
          'drei Kriterien mit Wirkung, z. B. Länge, Zeichenvorrat, kein Wort bzw. Muster, kein persönlicher Bezug; die Nutzungsregel „eigenes Passwort je Dienst“ wird mit Begründung anerkannt (1 P)',
          'Keylogger liest jedes Passwort mit; 2FA bzw. saubere Neuinstallation nötig (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'erläutern',
        points: 3,
        prompt: 'Erläutern Sie an diesem Vorfall, welchen Beitrag die Protokollierung (Logging) zur IT-Sicherheit leistet. Nennen Sie drei Aspekte.',
        modelAnswer:
          'Drei der folgenden Aspekte, jeweils mit Bezug zum Vorfall:\n' +
          '**Angriffe erkennen:** Das Firewall-Protokoll hat die nächtlichen Verbindungen zum unbekannten Server sichtbar gemacht; Auswertungen oder Alarme melden solche Auffälligkeiten früh, ebenso gehäufte Fehlanmeldungen.\n' +
          '**Vorfall nachvollziehen:** Wann kam die Mail, wann wurde der Anhang geöffnet, mit welchen Konten hat sich jemand seitdem angemeldet, auf welche Daten wurde zugegriffen? Daraus folgt, welche Passwörter und Systeme betroffen sind.\n' +
          '**Schaden einschätzen und Meldepflichten prüfen:** Nur mit Protokollen lässt sich sagen, ob Mieterdaten abgeflossen sind. Dann muss die Hausverwaltung die Meldung an die Datenschutz-Aufsichtsbehörde binnen 72 Stunden prüfen.\n' +
          '**Beweissicherung:** Protokolle dienen als Beleg für Strafanzeige, Versicherung oder Forensik.\n' +
          '**Nachweis und Verbesserung:** Die Firma kann zeigen, dass ihre Schutzmaßnahmen wirken, und Lücken gezielt schließen.',
        rubric: [
          'erster Aspekt mit Bezug zum Vorfall, z. B. Angriffe erkennen (1 P)',
          'zweiter Aspekt, z. B. Ablauf und betroffene Konten nachvollziehen (1 P)',
          'dritter Aspekt, z. B. Schadensumfang, Meldepflicht oder Beweissicherung (1 P)',
        ],
      },
      {
        label: 'f)',
        operator: 'beurteilen',
        points: 4,
        prompt: 'Der Geschäftsführer will künftig „zur Sicherheit“ alle Tastatureingaben und alle besuchten Webseiten jeder und jedes Beschäftigten dauerhaft speichern lassen. Beurteilen Sie den Vorschlag aus Sicht des Datenschutzes und nennen Sie drei Anforderungen, die eine zulässige Protokollierung erfüllen muss.',
        modelAnswer:
          '**Beurteilung:** Der Vorschlag ist **unzulässig**. Protokolle mit Benutzername, Zeit und Tätigkeit sind **personenbezogene Daten**. Alle Tastatureingaben dauerhaft zu speichern, ist eine lückenlose Überwachung der Beschäftigten: nicht erforderlich, unverhältnismäßig und ein schwerer Eingriff in ihr Persönlichkeitsrecht. Die Firma würde selbst einen Keylogger betreiben und dabei auch Passwörter und private Inhalte sammeln.\n' +
          '**Anforderungen (drei genügen):**\n' +
          '**Zweckbindung:** nur für IT-Sicherheit und Fehleranalyse, nicht zur Leistungs- oder Verhaltenskontrolle.\n' +
          '**Datenminimierung:** nur sicherheitsrelevante Ereignisse protokollieren (An- und Abmeldungen, Fehlversuche, Rechteänderungen, Verbindungen), keine Inhalte und keine Tastatureingaben.\n' +
          '**Speicherbegrenzung:** feste Löschfrist, danach automatisch löschen.\n' +
          '**Zugriffsschutz, Vertraulichkeit und Integrität:** nur wenige berechtigte Personen, möglichst im Vier-Augen-Prinzip; Protokolle gegen Veränderung schützen.\n' +
          '**Transparenz:** Die Beschäftigten werden informiert, was zu welchem Zweck wie lange protokolliert wird.\n' +
          '[RAND] Gibt es einen Betriebsrat, hat er bei technischen Einrichtungen, die Verhalten oder Leistung überwachen können, ein Mitbestimmungsrecht (§ 87 Abs. 1 Nr. 6 BetrVG); üblich ist eine Betriebsvereinbarung.',
        rubric: [
          'Vorschlag abgelehnt: personenbezogene Daten, lückenlose Überwachung unverhältnismäßig (1 P)',
          'erste Anforderung, z. B. Zweckbindung (1 P)',
          'zweite Anforderung, z. B. Datenminimierung oder Löschfrist (1 P)',
          'dritte Anforderung, z. B. Zugriffsschutz oder Transparenz (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-ipv6-adressplan',
    title: 'IPv6-Adressplan für die Stadtbücherei: Präfix, Subnetze, Gateway, Link-Local',
    topicId: 'netzwerke',
    scenario:
      'Die Stadtbücherei stellt ihr Netz auf IPv6 um. Der Provider hat ihr das Präfix `2001:db8:4a0::/48` zugewiesen (2001:db8::/32 ist der Adressbereich für Dokumentation und Beispiele; echte Präfixe vergibt der Provider). Die Bücherei teilt es in /64-Subnetze auf:\n\n' +
      '| Netz | Subnetz-ID |\n' +
      '|---|---|\n' +
      '| Verwaltung | `0010` |\n' +
      '| Selbstverbuchung und Rückgabe | `002c` |\n' +
      '| Recherche-PCs für Besucher | `0040` |\n' +
      '| Besucher-WLAN | `00a0` |\n\n' +
      'Der Router ist in jedem Subnetz Standardgateway und hat dort die Interface-ID `::1`. Die Geräte der Selbstverbuchung werden fest adressiert, die Recherche-PCs konfigurieren sich automatisch (SLAAC).\n\n' +
      '**Einordnung:** Kern (IPv4/IPv6-Konfiguration 04.01; Aufbau, Kürzen und Ausschreiben, Adresstypen). EUI-64, Zonen-ID und temporäre Adressen (Privacy Extensions) sind [RAND] und stehen nur als Zusatz in den Lösungen.',
    parts: [
      {
        label: 'a)',
        operator: 'angeben',
        points: 3,
        prompt: 'Recherche-PC 7 hat die Adresse `2001:db8:4a0:40::7`. Geben Sie an, wie viele Bit Standortpräfix, Subnetz-ID und Interface-ID lang sind, und bestimmen Sie diese drei Teile für die Adresse.',
        modelAnswer:
          '**Längen:** Standortpräfix **48 Bit** · Subnetz-ID **16 Bit** · Interface-ID **64 Bit** (zusammen 128 Bit).\n' +
          '**Standortpräfix:** `2001:0db8:04a0` (die ersten drei Blöcke)\n' +
          '**Subnetz-ID:** `0040` (vierter Block) – das Netz der Recherche-PCs\n' +
          '**Interface-ID:** `0000:0000:0000:0007` (die letzten vier Blöcke, gekürzt `::7`)\n' +
          'Jeder Block hat 4 Hexadezimalziffern = 16 Bit. Das /64-Netz des PCs ist also `2001:db8:4a0:40::/64`.',
        rubric: [
          'Längen 48, 16 und 64 Bit (1 P)',
          'Standortpräfix 2001:0db8:04a0 und Subnetz-ID 0040 (1 P)',
          'Interface-ID 0000:0000:0000:0007 bzw. die letzten 64 Bit (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'ermitteln',
        points: 3,
        prompt: 'Schreiben Sie die Adressen `2001:db8:4a0:40::7` und `2001:db8:4a0:2c::c1:1f` vollständig (ungekürzt) aus. In einer Dokumentation findet sich außerdem die Schreibweise `2001:db8:4a0::2c::1`. Begründen Sie, warum sie ungültig ist.',
        modelAnswer:
          '**Vorgehen:** In jedem Block führende Nullen auf 4 Ziffern ergänzen; `::` durch so viele `0000`-Blöcke ersetzen, dass es 8 Blöcke werden.\n' +
          '`2001:db8:4a0:40::7` → 5 Blöcke vorhanden, `::` steht für 3 Blöcke → `2001:0db8:04a0:0040:0000:0000:0000:0007`\n' +
          '`2001:db8:4a0:2c::c1:1f` → 6 Blöcke vorhanden, `::` steht für 2 Blöcke → `2001:0db8:04a0:002c:0000:0000:00c1:001f`\n' +
          '**Ungültig:** `::` darf nur **einmal** vorkommen. Bei zweimal `::` ist nicht eindeutig, wie viele Nullblöcke an welcher Stelle fehlen.\n' +
          'Falle: Nur **führende** Nullen dürfen wegfallen. `00c1` wird zu `c1`, aber `c100` darf nicht zu `c1` gekürzt werden.',
        rubric: [
          'erste Adresse richtig ausgeschrieben (1 P)',
          'zweite Adresse richtig ausgeschrieben, :: steht für zwei Blöcke (1 P)',
          'Begründung: :: nur einmal erlaubt, sonst mehrdeutig (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'berechnen',
        points: 3,
        prompt: 'Berechnen Sie, wie viele /64-Subnetze die Bücherei aus ihrem /48-Präfix bilden kann und wie viele Interface-IDs es in jedem Subnetz gibt. Begründen Sie, warum man Subnetze für Endgeräte bei IPv6 nicht kleiner als /64 macht.',
        modelAnswer:
          '**Subnetze:** 64 − 48 = 16 Bit Subnetz-ID → 2^16 = **65.536** Subnetze (Subnetz-IDs `0000` bis `ffff`).\n' +
          '**Interface-IDs je Subnetz:** 2^64 ≈ **1,8 · 10^19**. Anders als bei IPv4 muss man keine Hosts zählen: Es gibt keinen Broadcast, und kein Endgerätenetz wird je zu klein.\n' +
          '**Warum /64:** Die automatische Adresskonfiguration **SLAAC** bildet die Adresse aus dem 64-Bit-Präfix des Routers und einer 64 Bit langen Interface-ID. Bei einem längeren Präfix (z. B. /80) funktioniert SLAAC nicht mehr, und Geräte ohne feste Adresse bekommen keine Adresse.',
        rubric: [
          '2^16 = 65.536 Subnetze (1 P)',
          '2^64 Interface-IDs je Subnetz (1 P)',
          'Begründung /64: SLAAC braucht eine 64-Bit-Interface-ID (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'erstellen',
        points: 5,
        prompt: 'Erstellen Sie für das Subnetz der Selbstverbuchung einen Adressplan. Geben Sie für die Router-Schnittstelle, den Switch (Verwaltungszugang), zwei Verbuchungsterminals und den Rückgabeautomaten jeweils die IPv6-Adresse mit Präfixlänge und das Standardgateway an.',
        modelAnswer:
          'Präfix des Subnetzes: `2001:db8:4a0:2c::/64` (Standortpräfix + Subnetz-ID `002c`). Ein möglicher Plan:\n' +
          '`Router-Schnittstelle · 2001:db8:4a0:2c::1/64 · kein Gateway (er ist selbst das Gateway)`\n' +
          '`Switch · 2001:db8:4a0:2c::2/64 · Gateway 2001:db8:4a0:2c::1`\n' +
          '`Terminal 1 · 2001:db8:4a0:2c::11/64 · Gateway 2001:db8:4a0:2c::1`\n' +
          '`Terminal 2 · 2001:db8:4a0:2c::12/64 · Gateway 2001:db8:4a0:2c::1`\n' +
          '`Rückgabeautomat · 2001:db8:4a0:2c::21/64 · Gateway 2001:db8:4a0:2c::1`\n' +
          'Andere Interface-IDs sind richtig, solange jede nur einmal vorkommt und alle Adressen im Präfix `2001:db8:4a0:2c::/64` liegen. Der Switch arbeitet auf Schicht 2; er braucht die Adresse nur für seine Verwaltung.\n' +
          '**Gateway:** immer die Router-Adresse **im eigenen Subnetz**. Genauso richtig ist die Link-Local-Adresse des Routers (z. B. `fe80::1`), die er per Router Advertisement bekannt gibt.\n' +
          '[RAND] Die Interface-ID aus lauter Nullen (`2001:db8:4a0:2c::`) ist die Subnet-Router-Anycast-Adresse und wird keinem Gerät fest zugewiesen.',
        rubric: [
          'alle Adressen mit dem Präfix 2001:db8:4a0:2c (1 P)',
          'Präfixlänge /64 angegeben (1 P)',
          'Interface-IDs eindeutig, Router mit ::1 (1 P)',
          'Router ohne eigenes Gateway (1 P)',
          'Gateway aller Geräte = Router-Adresse im selben Subnetz bzw. seine Link-Local-Adresse (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'erläutern',
        points: 4,
        prompt:
          'An einem Recherche-PC zeigt `ipconfig` unter anderem:\n' +
          '`IPv6-Adresse. . . . . . . . . . . : 2001:db8:4a0:40:5a2f:40ff:fe0c:9a27`\n' +
          '`Temporäre IPv6-Adresse. . . . . . : 2001:db8:4a0:40:c41d:7e02:95ab:3f60`\n' +
          '`Verbindungslokale IPv6-Adresse  . : fe80::5a2f:40ff:fe0c:9a27%7`\n' +
          '`Standardgateway . . . . . . . . . : fe80::1%7`\n' +
          'Geben Sie an, welche Adresse die Link-Local-Adresse ist und woran man sie erkennt. Erläutern Sie ihren Gültigkeitsbereich, schreiben Sie sie ungekürzt aus und begründen Sie, warum als Standardgateway eine Link-Local-Adresse stehen darf.',
        modelAnswer:
          '**Link-Local-Adresse:** `fe80::5a2f:40ff:fe0c:9a27` („verbindungslokal“). Erkennbar am Beginn **fe80** – sie liegt im Bereich `fe80::/10`.\n' +
          '**Gültigkeit:** nur im eigenen Netzsegment (Link); Router leiten sie nicht weiter. Jede IPv6-Schnittstelle bildet sie automatisch, auch ohne Router und ohne DHCP. Sie dient z. B. der Nachbarerkennung und der Kommunikation mit dem Router.\n' +
          '**Ungekürzt:** `fe80:0000:0000:0000:5a2f:40ff:fe0c:9a27` – Präfix fe80:0:0:0 mit Präfixlänge **/64**, dahinter die Interface-ID. Falle: Der Adressbereich ist /10, die Präfixlänge der einzelnen Adresse aber /64.\n' +
          '**Gateway als Link-Local:** Der Router gibt sich per **Router Advertisement** mit seiner Link-Local-Adresse bekannt. Das Gateway muss nur **im selben Segment direkt erreichbar** sein – das ist bei einer Link-Local-Adresse der Fall.\n' +
          '[RAND] `%7` ist die **Zonen-ID** (Schnittstellenindex); sie legt fest, über welchen Adapter die Link-Local-Adresse gilt. `ff:fe` in der Mitte zeigt eine Interface-ID nach **EUI-64** aus der MAC-Adresse 58-2F-40-0C-9A-27 (Hälften trennen, `fffe` einfügen, 7. Bit kippen: 58 → 5a). Die **temporäre Adresse** (Privacy Extensions) wechselt regelmäßig und nutzt eine Zufalls-ID, damit der PC im Internet nicht über die MAC wiedererkannt wird.',
        rubric: [
          'Link-Local-Adresse benannt, erkannt an fe80 bzw. fe80::/10 (1 P)',
          'nur im eigenen Segment gültig, wird nicht geroutet, automatisch vorhanden (1 P)',
          'ungekürzt fe80:0000:0000:0000:5a2f:40ff:fe0c:9a27 (1 P)',
          'Gateway darf Link-Local sein: Router im selben Segment, per Router Advertisement bekannt (1 P)',
        ],
      },
      {
        label: 'f)',
        operator: 'nennen',
        points: 2,
        prompt: 'Nennen Sie zwei ping-Befehle, mit denen Sie an Terminal 1 der Selbstverbuchung die IPv6-Konfiguration von innen nach außen prüfen, und was eine Antwort jeweils aussagt.',
        modelAnswer:
          '`ping ::1` – Loopback-Adresse: Der IPv6-Stack des Terminals arbeitet.\n' +
          '`ping 2001:db8:4a0:2c::1` – Standardgateway: Kabel, Switch und Subnetz bis zum Router funktionieren.\n' +
          'Weitere Schritte: eine Adresse in einem anderen Subnetz bzw. im Internet (Routing), danach ein Name mit `ping -6` (Namensauflösung über AAAA-Einträge).',
        rubric: [
          'ping ::1 als Test des eigenen IPv6-Stacks (1 P)',
          'ping auf das Gateway als Test des lokalen Subnetzes (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-arbeitsplatz-hardware-aufruesten',
    title: 'Schnittplatz im Lokalradio aufrüsten: Anschlüsse, RAM, CPU-Werte, Netzteil, Steckdosenleiste',
    topicId: 'hardware',
    scenario:
      'Die Redaktion eines Lokalradios schneidet Beiträge an einem Desktop-PC, der zu langsam geworden ist. Sie sollen ihn aufrüsten und neu verkabeln. An den PC kommen: Monitor 1 (nur DisplayPort-Eingang), Monitor 2 (nur HDMI-Eingang), ein Audio-Interface mit USB-C-Kabel, Tastatur und Maus mit USB-A-Stecker sowie das Netzwerkkabel. Auf der Rückseite des PCs finden Sie diese Buchsen:\n\n' +
      '| Nr. | Beschreibung der Buchse |\n' +
      '|---|---|\n' +
      '| 1 | flach und breit, die Unterseite ist zu beiden Ecken hin abgeschrägt (Trapezform), 19 Kontakte |\n' +
      '| 2 | flach, nur **eine** Ecke abgeschrägt, 20 Kontakte |\n' +
      '| 3 | klein und länglich mit abgerundeten Enden, symmetrisch; der Stecker passt in beiden Richtungen |\n' +
      '| 4 | rechteckig mit einer Kunststoffzunge im Inneren; der Stecker passt nur in einer Richtung |\n' +
      '| 5 | fast quadratisch mit Aussparung für eine Rastnase, 8 Kontakte, daneben zwei kleine LEDs |\n' +
      '| 6 | breit, drei Reihen Kontaktlöcher, daneben ein flacher Schlitz mit vier Löchern, links und rechts je ein Schraubgewinde |\n' +
      '| 7 | am Netzteil: drei Metallstifte in einer Umrandung mit zwei abgeschrägten Ecken |\n\n' +
      '**Einordnung:** Kern (Anschlüsse erkennen, RAM DDR4/DDR5, Kerne und Threads, Netzteil dimensionieren; Strom und Leistung nach Mackes Themenliste zum Katalog Okt. 2024, siehe Lückencheck 2.2, Lesart B). [RAND] sind die Taktabsenkung bei vier Modulen und die Details zu Power Delivery und Alternate Mode.',
    parts: [
      {
        label: 'a)',
        operator: 'zuordnen',
        points: 5,
        prompt: 'Ordnen Sie den Buchsen 1 bis 7 die Anschlussbezeichnungen zu und geben Sie an, welches der oben genannten Geräte Sie jeweils anschließen. Nennen Sie außerdem zwei Vorteile von USB-C gegenüber USB-A.',
        modelAnswer:
          '`1 · HDMI · Monitor 2`\n' +
          '`2 · DisplayPort · Monitor 1`\n' +
          '`3 · USB-C · Audio-Interface`\n' +
          '`4 · USB-A · Tastatur und Maus`\n' +
          '`5 · RJ45 (Ethernet) · Netzwerkkabel; die LEDs zeigen Verbindung und Datenverkehr`\n' +
          '`6 · DVI (mit analogen Kontakten am Schlitz: DVI-I) · bleibt frei`\n' +
          '`7 · Kaltgeräteanschluss C14 · Netzkabel mit Kaltgerätekupplung C13`\n' +
          '**Vorteile USB-C (zwei genügen):** Der Stecker ist **verdrehsicher**, er passt in beiden Richtungen. Er ist **kleiner**, also auch für flache Geräte geeignet. Über USB-C können **höhere Ladeleistungen** fließen (USB Power Delivery). Mit dem **Alternate Mode** überträgt er auch Bildsignale (z. B. DisplayPort), sodass **ein Kabel** für Bild, Daten und Strom reicht. Nur über USB-C gibt es die schnellsten Standards (USB 3.2 Gen 2x2, USB4, Thunderbolt 3 bis 5).\n' +
          'Falle: Die Buchsenform sagt nichts über die Geschwindigkeit. Hinter einer USB-C-Buchse kann auch nur USB 2.0 stecken – das steht im Handbuch bzw. Datenblatt.',
        rubric: [
          'Buchsen 1 und 2 richtig (HDMI, DisplayPort) mit den passenden Monitoren (1 P)',
          'Buchsen 3 und 4 richtig (USB-C, USB-A) mit Audio-Interface bzw. Tastatur und Maus (1 P)',
          'Buchsen 5, 6 und 7 richtig (RJ45, DVI, Kaltgeräteanschluss) (1 P)',
          'erster Vorteil von USB-C (1 P)',
          'zweiter Vorteil von USB-C (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'beurteilen',
        points: 5,
        prompt:
          'Im PC stecken 2 × 8 GB DDR4-3200 (DIMM) in den Steckplätzen A2 und B2; A1 und B1 sind frei. Laut Handbuch unterstützen Mainboard und Prozessor DDR4 bis 3200 MT/s und höchstens 128 GB. Der Arbeitsspeicher soll auf 32 GB wachsen, die alten Module bleiben drin. Angebote:\n' +
          '`A · 2 × 8 GB DDR5-5600 DIMM · 52 €`\n' +
          '`B · 2 × 8 GB DDR4-3600 DIMM · 46 €`\n' +
          '`C · 2 × 8 GB DDR4-3200 SO-DIMM · 37 €`\n' +
          '`D · 2 × 8 GB DDR4-3200 DIMM · 42 €`\n' +
          'Beurteilen Sie jedes Angebot, empfehlen Sie eines und geben Sie an, in welche Steckplätze die neuen Module kommen.',
        modelAnswer:
          '**A – ungeeignet:** DDR5 ist mit DDR4 weder mechanisch (Kerbe an anderer Stelle) noch elektrisch (andere Spannung und Signale) kompatibel; das Board unterstützt nur DDR4.\n' +
          '**B – läuft, lohnt aber nicht:** Die Module sind kompatibel, arbeiten aber nur mit **3200 MT/s**: Der Speichercontroller der CPU unterstützt nicht mehr, und gemischte Module laufen mit dem Takt des langsamsten. Die 4 € Aufpreis bringen nichts.\n' +
          '**C – ungeeignet:** SO-DIMM ist die kurze Bauform für Notebooks und passt nicht in die DIMM-Steckplätze eines Desktop-PCs.\n' +
          '**D – Empfehlung:** gleicher Typ wie die vorhandenen Module (DDR4-3200, DIMM) und das günstigste passende Angebot. Ergebnis: 4 × 8 GB = **32 GB** (≤ 128 GB).\n' +
          '**Steckplätze:** die freien **A1 und B1**. So hat jeder der beiden Kanäle zwei gleiche Module, und der **Dual-Channel-Betrieb** bleibt erhalten. Die genaue Reihenfolge steht im Mainboard-Handbuch.\n' +
          '[RAND] Mit vier Modulen senken manche Boards den Takt automatisch ab. Am stabilsten laufen Module mit gleichen Timings, am besten aus einem Kit.',
        rubric: [
          'A abgelehnt: DDR5 inkompatibel zu DDR4 (1 P)',
          'C abgelehnt: SO-DIMM passt nicht in DIMM-Steckplätze (1 P)',
          'B: kompatibel, läuft aber nur mit 3200 MT/s, Aufpreis ohne Nutzen (1 P)',
          'D empfohlen: gleicher Typ und günstigstes passendes Angebot, 32 GB (1 P)',
          'Steckplätze A1 und B1, Dual-Channel bleibt erhalten (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'erklären',
        points: 3,
        prompt:
          'Der Task-Manager zeigt für den Prozessor unter anderem: `Kerne: 8 · Logische Prozessoren: 16 · Basisgeschwindigkeit: 3,80 GHz`. ' +
          'Erklären Sie, warum es doppelt so viele logische Prozessoren wie Kerne gibt, und beurteilen Sie, ob der Prozessor damit doppelt so schnell rechnet. Geben Sie die Basisgeschwindigkeit in Hertz an.',
        modelAnswer:
          '**Logische Prozessoren:** Der Prozessor beherrscht **Simultaneous Multithreading** (SMT, bei Intel „Hyper-Threading“): Jeder physische Kern kann **zwei Threads** gleichzeitig bearbeiten. Das Betriebssystem sieht deshalb 8 × 2 = 16 logische Prozessoren und verteilt Threads auf sie.\n' +
          '**Nicht doppelt so schnell:** Die beiden Threads eines Kerns teilen sich dessen Rechenwerke und Caches. SMT nutzt Wartezeiten eines Threads für den anderen und bringt deshalb spürbar weniger als die doppelte Leistung – und nur, wenn die Software viele Threads parallel nutzt.\n' +
          '**Basisgeschwindigkeit:** 3,80 GHz = 3,80 · 10^9 Hz = **3.800.000.000 Hz** (G = Giga = 10^9).',
        rubric: [
          'SMT bzw. Hyper-Threading: je Kern zwei Threads, BS sieht 16 logische Prozessoren (1 P)',
          'keine doppelte Leistung, weil sich die Threads die Rechenwerke eines Kerns teilen (1 P)',
          '3.800.000.000 Hz (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'berechnen',
        points: 4,
        prompt:
          'Nach dem Umbau hat der PC folgende maximale Leistungsaufnahmen je Komponente: Prozessor 105 W · Grafikkarte 165 W · Mainboard 45 W · 4 RAM-Module je 4 W · 2 NVMe-SSDs je 7 W · 1 Festplatte 9 W · 4 Gehäuselüfter je 3 W · USB-Geräte zusammen 15 W. ' +
          'Auf die Summe soll eine Reserve von 25 % aufgeschlagen werden. Netzteile gibt es mit 450 W, 550 W, 650 W und 750 W; eingebaut ist ein 450-W-Netzteil. Berechnen Sie die benötigte Leistung, wählen Sie das passende Netzteil und begründen Sie, ob das alte Netzteil ausreicht.',
        modelAnswer:
          '**Summe:** 105 W + 165 W + 45 W + 4 × 4 W + 2 × 7 W + 9 W + 4 × 3 W + 15 W = 105 + 165 + 45 + 16 + 14 + 9 + 12 + 15 = **381 W**\n' +
          '**Mit 25 % Reserve:** 381 W × 1,25 = **476,25 W**\n' +
          '**Wahl:** die nächstgrößere Stufe → **550-W-Netzteil**.\n' +
          '**Altes Netzteil:** 450 W < 476,25 W → **reicht nicht**. Ohne Reserve würde es zwar knapp genügen (381 W), bei Lastspitzen, Alterung und Dauerbetrieb nahe der Grenze drohen aber Abstürze; außerdem arbeiten Netzteile im mittleren Lastbereich am effizientesten.\n' +
          'Falle: Die Stückzahlen (4 RAM-Module, 2 SSDs, 4 Lüfter) nicht vergessen – wer jede Komponente nur einmal zählt, kommt auf 353 W.',
        rubric: [
          'Summe 381 W mit Stückzahlen (1 P)',
          'Reserve als Aufschlag: 476,25 W (1 P)',
          '550-W-Netzteil gewählt (1 P)',
          'altes 450-W-Netzteil reicht nicht, begründet (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'berechnen',
        points: 4,
        prompt:
          'Alle Geräte des Schnittplatzes hängen an einer Steckdosenleiste mit dem Aufdruck „max. 10 A / 230 V~“: PC höchstens 430 W, 2 Monitore je 35 W, 2 Aktivlautsprecher je 60 W und ein Laserdrucker, der beim Aufheizen bis zu 850 W aufnimmt. Ein Kollege möchte zusätzlich einen Wasserkocher mit 2.200 W einstecken. ' +
          'Berechnen Sie die höchste zulässige Leistung der Leiste sowie Gesamtleistung und Gesamtstrom mit und ohne Wasserkocher (vereinfacht P = U · I). Beurteilen Sie den Wunsch des Kollegen.',
        modelAnswer:
          '**Belastbarkeit der Leiste:** P = U · I = 230 V · 10 A = **2.300 W**\n' +
          '**Ohne Wasserkocher:** 430 W + 2 · 35 W + 2 · 60 W + 850 W = **1.470 W**; I = P / U = 1.470 W / 230 V ≈ **6,39 A** < 10 A → zulässig.\n' +
          '**Mit Wasserkocher:** 1.470 W + 2.200 W = **3.670 W** > 2.300 W; I = 3.670 W / 230 V ≈ **15,96 A** > 10 A → **überlastet**.\n' +
          '**Beurteilung:** Der Wasserkocher darf nicht an diese Leiste. Der Leitungsschutzschalter des Stromkreises (meist B16) löst bei knapp 16 A nicht aus. Die 10-A-Leiste wird also dauerhaft überlastet, ohne dass eine Sicherung eingreift: Leiste und Kabel werden heiß – **Brandgefahr**. Nur Leisten mit eigenem Überlastschalter schalten ab. Der Wasserkocher gehört an eine eigene Wandsteckdose, am besten in der Küche. Steckdosenleisten auch nicht hintereinanderstecken.\n' +
          'Hinweis: P = U · I gilt genau nur für die Wirkleistung ohmscher Verbraucher; für Geräte mit Schaltnetzteil wäre die Scheinleistung S = U · I zu prüfen (vgl. USV-Aufgabe). In der Prüfung reicht meist die vereinfachte Rechnung.',
        rubric: [
          'Belastbarkeit 230 V · 10 A = 2.300 W (1 P)',
          'ohne Wasserkocher 1.470 W bzw. etwa 6,39 A, zulässig (1 P)',
          'mit Wasserkocher 3.670 W bzw. etwa 15,96 A, überlastet (1 P)',
          'Beurteilung: Überlast mit Brandgefahr, die Sicherung des Stromkreises greift nicht ein; Wasserkocher an eine eigene Steckdose (1 P)',
        ],
      },
    ],
  },
]

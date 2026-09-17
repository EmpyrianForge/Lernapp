// Datensätze für die interaktiven Drills „Zuordnung" (Match) und „Reihenfolge" (Order).
// Fachlich aus der Wissensbasis (01-Themenkatalog / Karteikarten).

import extra from './interactive-extra.json'
// ERM und relationale Grundlagen (16.09.2026, Lückencheck AP1 Nr. 1), topicId 'datenbanken'.
import erm from './interactive-erm.json'

export interface MatchDeck {
  id: string
  title: string
  topicId: string
  instruction: string
  pairs: { left: string; right: string }[]
}

export interface OrderTask {
  id: string
  title: string
  topicId: string
  prompt: string
  correct: string[] // richtige Reihenfolge von oben nach unten
  beyond?: boolean // über den AP1-Katalog hinaus (Vertiefung/AP2)
}

const MATCH_BASE: MatchDeck[] = [
  {
    id: 'match-ports',
    title: 'Ports ↔ Dienste',
    topicId: 'netzwerke',
    instruction: 'Ordne jeden Dienst seinem Standard-Port zu.',
    pairs: [
      { left: 'HTTP', right: '80' },
      { left: 'HTTPS', right: '443' },
      { left: 'SSH', right: '22' },
      { left: 'DNS', right: '53' },
      { left: 'SMTP', right: '25' },
      { left: 'POP3', right: '110' },
    ],
  },
  {
    id: 'match-ipv6',
    title: 'IPv6-Präfixe',
    topicId: 'netzwerke',
    instruction: 'Ordne jeden IPv6-Adresstyp seinem Präfix zu.',
    pairs: [
      { left: 'Link-Local', right: 'fe80::/10' },
      { left: 'Unique Local (ULA)', right: 'fc00::/7' },
      { left: 'Global Unicast', right: '2000::/3' },
      { left: 'Loopback', right: '::1' },
    ],
  },
  {
    id: 'match-cloud',
    title: 'Cloud-Servicemodelle',
    topicId: 'netzwerke',
    instruction: 'Ordne jedes Modell seiner Beschreibung zu.',
    pairs: [
      { left: 'IaaS', right: 'Infrastruktur (Server/Speicher/Netz); Kunde verwaltet OS + Anwendung' },
      { left: 'PaaS', right: 'zusätzlich Laufzeit-/Entwicklungsplattform; Kunde verwaltet nur die Anwendung' },
      { left: 'SaaS', right: 'fertige Anwendung über das Netz; Anbieter verwaltet alles' },
    ],
  },
  {
    id: 'match-backup',
    title: 'Backup-Arten',
    topicId: 'it-sicherheit',
    instruction: 'Ordne jede Sicherungsart ihrer Definition zu.',
    pairs: [
      { left: 'Vollsicherung', right: 'sichert alle Daten' },
      { left: 'Differenziell', right: 'alle Änderungen seit der letzten Vollsicherung' },
      { left: 'Inkrementell', right: 'nur Änderungen seit der letzten Sicherung (egal welcher Art)' },
    ],
  },
  {
    id: 'match-krypto',
    title: 'Verschlüsselung & Hash',
    topicId: 'it-sicherheit',
    instruction: 'Ordne jedes Verfahren seiner Beschreibung zu.',
    pairs: [
      { left: 'Symmetrisch (AES)', right: 'ein gemeinsamer Schlüssel, schnell' },
      { left: 'Asymmetrisch (RSA)', right: 'Schlüsselpaar Public/Private, löst Schlüsselverteilung' },
      { left: 'Hybrid (TLS)', right: 'asymmetrischer Schlüsseltausch + symmetrische Nutzdaten' },
      { left: 'Hash (SHA-256)', right: 'Einwegfunktion, nicht umkehrbar, für Integrität' },
    ],
  },
  {
    id: 'match-osi-geraete',
    title: 'Netzwerkgeräte ↔ OSI-Schicht',
    topicId: 'netzwerke',
    instruction: 'Ordne jedes Gerät seiner OSI-Schicht zu.',
    pairs: [
      { left: 'Hub', right: 'Schicht 1 – Bitübertragung' },
      { left: 'Switch', right: 'Schicht 2 – Sicherung (MAC)' },
      { left: 'Router', right: 'Schicht 3 – Vermittlung (IP)' },
    ],
  },
  {
    id: 'match-vertraege',
    title: 'Vertragsarten',
    topicId: 'qs-vertraege',
    instruction: 'Ordne jede Vertragsart ihrer geschuldeten Leistung zu.',
    pairs: [
      { left: 'Kaufvertrag', right: 'Übereignung einer fertigen Sache' },
      { left: 'Werkvertrag', right: 'ein konkret geschuldeter Erfolg / Werk' },
      { left: 'Dienstvertrag', right: 'die Tätigkeit selbst, kein Erfolg' },
    ],
  },
  {
    id: 'match-usv',
    title: 'USV-Klassen (IEC 62040-3)',
    topicId: 'hardware',
    instruction: 'Ordne jede USV-Klasse ihrer Technik zu.',
    pairs: [
      { left: 'VFD (Offline)', right: 'Standby, schaltet erst bei Ausfall um' },
      { left: 'VI (Line-Interactive)', right: 'mit Spannungsregelung (AVR)' },
      { left: 'VFI (Online)', right: 'Doppelwandler, unterbrechungsfrei' },
    ],
  },
  {
    id: 'match-dateisysteme',
    title: 'Dateisysteme',
    topicId: 'betriebssysteme',
    instruction: 'Ordne jedes Dateisystem seinem Merkmal zu.',
    pairs: [
      { left: 'FAT32', right: 'universell, aber max. 4 GiB pro Datei' },
      { left: 'exFAT', right: 'für große USB-/SD-Wechseldatenträger' },
      { left: 'NTFS', right: 'Windows-Standard: Journaling + ACL-Rechte' },
      { left: 'ext4', right: 'Linux-Standard mit Journaling' },
    ],
  },
  // PV1 Tag 1 (UML): Anforderungssätze → Notation — genau diese Übersetzung verlangen die
  // IHK-Aufgaben (AP1 Herbst 2024 Use Case, Herbst 2025 Aktivitätsdiagramm).
  {
    id: 'match-usecase-signalwoerter',
    title: 'Use Case: Anforderungssatz → Notation',
    topicId: 'softwareentwicklung',
    instruction: 'Ordne jeden Anforderungssatz der passenden Modellierung im Anwendungsfalldiagramm zu.',
    pairs: [
      { left: '„Bei jeder Kartenzahlung wird zwingend die PIN geprüft."', right: '«include» – Pfeil zum eingebundenen Fall' },
      { left: '„Nur bei überschrittener Frist wird eine Gebühr berechnet."', right: '«extend» – Pfeil zum Basisfall, mit Erweiterungspunkt' },
      { left: '„Der Admin kann alles, was ein Mitarbeiter kann, und zusätzlich …"', right: 'Generalisierung: hohles Dreieck zeigt auf den Mitarbeiter' },
      { left: '„Bezahlt wird über den externen Zahlungsdienst."', right: 'Akteur außerhalb der Systemgrenze' },
      { left: '„Kunde und Sachbearbeiter wickeln die Reklamation gemeinsam ab."', right: 'beide Akteure mit demselben Anwendungsfall assoziiert' },
    ],
  },
  {
    id: 'match-aktivitaet-signalwoerter',
    title: 'Aktivitätsdiagramm: Formulierung → Element',
    topicId: 'neu-2025',
    instruction: 'Ordne jede Formulierung aus einer Aufgabenbeschreibung dem UML-Element zu, das du dafür zeichnest.',
    pairs: [
      { left: '„Beträgt die Reisekostenabrechnung mehr als 300 €, …, sonst …"', right: 'Verzweigung (Raute) mit Guards [ ]' },
      { left: '„Gleichzeitig werden der Dienstwagen gebucht und das Hotel reserviert."', right: 'Gabelung (Synchronisationsbalken)' },
      { left: '„Erst wenn beides erledigt ist, geht es weiter."', right: 'Vereinigung (Balken wartet auf alle Stränge)' },
      { left: '„Sind die Daten fehlerhaft, gibt der Kunde sie erneut ein."', right: 'Schleife: Verzweigung mit Rücksprung über eine Zusammenführungsraute' },
      { left: '„Beteiligt sind Kunde, Lager und Buchhaltung."', right: 'Partitionen (Swimlanes)' },
      { left: '„Danach ist der gesamte Prozess beendet."', right: 'Aktivitätsende (Kreis mit Ring)' },
    ],
  },
  // PV1 Tag 2 (Kommandozeile): Windows-Befehle zur Netzwerkdiagnose und Systemabfrage.
  // Eigene Formulierungen; Fallen (nslookup ohne Cache, Prozess-ID nur mit -o) laut Abgleich 16.09.2026.
  {
    id: 'match-windows-befehl-zweck',
    title: 'Windows-Befehl → Zweck',
    topicId: 'netzwerke',
    instruction: 'Ordne jeden Befehl der Windows-Eingabeaufforderung seinem Zweck zu. [RAND] = Randstoff.',
    pairs: [
      { left: 'ping', right: 'prüft per ICMP-Echo, ob ein Host antwortet und wie schnell' },
      { left: 'tracert', right: 'zeigt die Router (Hops) auf dem Weg zum Ziel' },
      { left: 'nslookup', right: 'fragt einen DNS-Server direkt nach der Adresse zu einem Namen' },
      { left: '[RAND] netstat -ano', right: 'listet Verbindungen und lauschende Ports mit Prozess-ID auf' },
      { left: 'whoami', right: 'zeigt das angemeldete Benutzerkonto (Domäne bzw. Rechner\\Benutzer)' },
      { left: 'systeminfo', right: 'zeigt Windows-Version, Arbeitsspeicher, Installationsdatum und Updates' },
    ],
  },
  {
    id: 'match-netzproblem-befehl',
    title: 'Netzwerkproblem → passender Befehl',
    topicId: 'netzwerke',
    instruction: 'Ordne jeder Situation den Windows-Befehl zu, mit dem du sie prüfst oder behebst. [RAND] = Randstoff.',
    pairs: [
      { left: 'Welche MAC-Adresse und welche DNS-Server hat der eigene Rechner?', right: 'ipconfig /all' },
      { left: 'Der PC hat 169.254.x.x, das Kabel steckt jetzt richtig – neue Adresse ohne Neustart holen', right: 'ipconfig /renew' },
      { left: 'Nach einer DNS-Umstellung löst der PC den Namen noch zur alten IP auf – lokalen Zwischenspeicher leeren', right: 'ipconfig /flushdns' },
      { left: 'Der Server antwortet auf seine IP-Adresse, nicht auf seinen Namen – was liefert der DNS-Server direkt?', right: 'nslookup' },
      { left: '[RAND] Welche MAC-Adresse hat das gerade angepingte Standardgateway?', right: 'arp -a' },
      { left: '[RAND] Welcher Prozess belegt Port 8080?', right: 'netstat -ano' },
    ],
  },
  // PV1 Tag 3 (Projektmanagement, 17.09.2026): eigene Formulierungen und Beispiele, nicht die WBS-Folien.
  // Scrum nach dem Scrum Guide 2020 (die Kursfolien nutzen ältere Begriffe und lassen den PO schätzen – falsch).
  // Netzplan-Regeln mit freiem Puffer, weil match-netzplan-zeitwerte-bedeutung (interactive-extra.json) kein FP hat.
  {
    id: 'match-lastenheft-pflichtenheft',
    title: 'Lastenheft oder Pflichtenheft?',
    topicId: 'projektmanagement',
    instruction:
      'Ordne jede Aussage dem passenden Dokument zu. Die beiden Beispielsätze stammen aus einem Projekt für die Online-Verlängerung einer Stadtbücherei.',
    pairs: [
      { left: 'wird vom Auftraggeber erstellt', right: 'Lastenheft' },
      { left: 'wird vom Auftragnehmer auf Grundlage des anderen Dokuments erstellt', right: 'Pflichtenheft' },
      { left: 'beschreibt lösungsneutral, WAS erreicht werden soll und WOFÜR', right: 'Lastenheft' },
      { left: 'beschreibt, WIE und WOMIT die Anforderungen umgesetzt werden', right: 'Pflichtenheft' },
      { left: 'dient als Grundlage für Ausschreibung und Angebote', right: 'Lastenheft' },
      { left: 'wird nach Freigabe durch den Auftraggeber Grundlage für Umsetzung und Abnahme', right: 'Pflichtenheft' },
      { left: '„Leserinnen und Leser sollen ausgeliehene Medien online verlängern können.“', right: 'Lastenheft' },
      { left: '„Die Verlängerung wird als PHP-Webanwendung mit einer MariaDB-Datenbank umgesetzt.“', right: 'Pflichtenheft' },
    ],
  },
  {
    id: 'match-smart-prueffrage',
    title: 'SMART: Kriterium → Prüffrage',
    topicId: 'projektmanagement',
    instruction:
      'Ordne jedem Kriterium die Frage zu, mit der du ein Projektziel prüfst. Für das A sind mehrere Wörter üblich (attraktiv, akzeptiert, angemessen). Die letzte Zeile ist keine SMART-Regel, sondern eine Zusatzregel für Projektziele.',
    pairs: [
      { left: 'S – spezifisch', right: 'Ist eindeutig beschrieben, was genau erreicht werden soll?' },
      { left: 'M – messbar', right: 'Lässt sich an einer Größe oder Kennzahl prüfen, ob das Ziel erreicht ist?' },
      { left: 'A – attraktiv bzw. akzeptiert', right: 'Tragen Auftraggeber und Beteiligte das Ziel mit?' },
      { left: 'R – realistisch', right: 'Ist das Ziel mit den verfügbaren Mitteln (Budget, Personal, Know-how) erreichbar?' },
      { left: 'T – terminiert', right: 'Steht fest, bis wann das Ziel erreicht sein muss?' },
      { left: 'lösungsneutral (Zusatzregel)', right: 'Beschreibt das Ziel nur das WAS und nimmt keinen Lösungsweg vorweg?' },
    ],
  },
  {
    id: 'match-projektdokument-phase',
    title: 'Projektdokument → Projektphase',
    topicId: 'projektmanagement',
    instruction:
      'Ordne jedes Dokument der Phase zu, in der es entsteht (Vier-Phasen-Lehrmodell; die Phasennamen schwanken je nach Quelle). [RAND] = Randstoff.',
    pairs: [
      { left: 'Projektauftrag', right: 'Initialisierung / Definition' },
      { left: 'Lastenheft', right: 'Initialisierung / Definition' },
      { left: 'Projektstrukturplan', right: 'Planung' },
      { left: 'Netzplan und Gantt-Diagramm', right: 'Planung' },
      { left: 'Kostenplan', right: 'Planung' },
      { left: 'Statusbericht mit Soll-Ist-Vergleich', right: 'Durchführung / Steuerung' },
      { left: '[RAND] Sonderbericht bei einer gravierenden Abweichung', right: 'Durchführung / Steuerung' },
      { left: 'Abnahmeprotokoll', right: 'Abschluss' },
      { left: 'Abschlussbericht mit Lessons Learned', right: 'Abschluss' },
    ],
  },
  {
    id: 'match-psp-gliederungsart',
    title: 'PSP: Element → Gliederungsart',
    topicId: 'projektmanagement',
    instruction:
      'Eine Fahrschule mit zwei Filialen führt eine Online-Terminbuchung ein. Ordne jedes PSP-Element seiner Gliederungsart zu. Leitfragen: Woran wird gearbeitet? (objektorientiert) · Was ist zu tun? (funktionsorientiert) · Wann? (phasenorientiert)',
    pairs: [
      { left: 'Filiale Nord', right: 'objektorientiert' },
      { left: 'Buchungsmodul der Website', right: 'objektorientiert' },
      { left: 'Kalenderschnittstelle programmieren', right: 'funktionsorientiert' },
      { left: 'Fahrlehrerinnen und Fahrlehrer schulen', right: 'funktionsorientiert' },
      { left: 'Konzeptphase', right: 'phasenorientiert' },
      { left: 'Testphase', right: 'phasenorientiert' },
    ],
  },
  {
    id: 'match-netzplan-rechenregel',
    title: 'Netzplan: Größe → Rechenregel',
    topicId: 'projektmanagement',
    instruction:
      'Ordne jeder Größe ihre Rechenregel zu (Vorgangsknoten-Netzplan ohne vorgegebenen Endtermin). Achtung: Wie die Felder im Knoten angeordnet sind, legt die Legende der Aufgabe fest.',
    pairs: [
      { left: 'FEZ', right: 'FAZ + Dauer' },
      { left: 'FAZ eines Vorgangs mit mehreren Vorgängern', right: 'größter FEZ aller direkten Vorgänger' },
      { left: 'SAZ', right: 'SEZ − Dauer' },
      { left: 'SEZ eines Vorgangs mit mehreren Nachfolgern', right: 'kleinster SAZ aller direkten Nachfolger' },
      { left: 'GP (Gesamtpuffer)', right: 'SAZ − FAZ (= SEZ − FEZ)' },
      { left: 'FP (freier Puffer)', right: 'kleinster FAZ der direkten Nachfolger − eigener FEZ' },
      { left: 'kritischer Pfad', right: 'durchgehende Kette der Vorgänge mit GP = 0' },
    ],
  },
  {
    id: 'match-scrum-verantwortlichkeit',
    title: 'Scrum: Aufgabe → Verantwortlichkeit',
    topicId: 'projektmanagement',
    instruction:
      'Ordne jede Aufgabe der Verantwortlichkeit zu, die sie nach dem Scrum Guide 2020 trägt. Ältere Quellen sagen statt Developers „Entwicklungsteam“.',
    pairs: [
      { left: 'schätzt den Umfang der Product-Backlog-Einträge', right: 'Developers' },
      { left: 'ordnet (priorisiert) das Product Backlog', right: 'Product Owner' },
      { left: 'erstellt das Sprint Backlog und passt es während des Sprints an', right: 'Developers' },
      { left: 'verantwortet, dass der Wert des Produkts maximiert wird', right: 'Product Owner' },
      { left: 'sorgt dafür, dass Hindernisse beseitigt werden', right: 'Scrum Master' },
      { left: 'sorgt dafür, dass die Events stattfinden und ihre Timebox einhalten', right: 'Scrum Master' },
      { left: 'halten den Daily Scrum ab', right: 'Developers' },
    ],
  },
  {
    id: 'match-scrum-event-zweck',
    title: 'Scrum: Event → Zweck und Timebox',
    topicId: 'projektmanagement',
    instruction: 'Ordne jedem Scrum-Event seinen Zweck zu (Scrum Guide 2020). [RAND] = Randstoff.',
    pairs: [
      { left: 'Sprint', right: 'Rahmen für alle anderen Events; feste Länge von höchstens einem Monat' },
      { left: 'Sprint Planning', right: 'legt Sprintziel, ausgewählte Einträge und den Umsetzungsplan fest (Warum, Was, Wie)' },
      { left: 'Daily Scrum', right: 'höchstens 15 Minuten: Die Developers prüfen den Fortschritt zum Sprintziel' },
      { left: 'Sprint Review', right: 'Scrum Team und Stakeholder prüfen das Ergebnis und passen das Product Backlog an' },
      { left: 'Sprint Retrospective', right: 'Das Scrum Team verbessert Zusammenarbeit, Prozesse und Werkzeuge' },
      { left: '[RAND] Product Backlog Refinement', right: 'laufende Tätigkeit, kein Event: Einträge zerlegen, präzisieren und schätzen' },
    ],
  },
]

const ORDER_BASE: OrderTask[] = [
  {
    id: 'order-osi',
    title: 'OSI-Schichten',
    topicId: 'netzwerke',
    prompt: 'Bringe die OSI-Schichten von unten (1) nach oben (7) in die richtige Reihenfolge.',
    correct: ['Bitübertragung', 'Sicherung', 'Vermittlung', 'Transport', 'Sitzung', 'Darstellung', 'Anwendung'],
  },
  {
    id: 'order-handshake',
    title: 'TCP-3-Wege-Handshake',
    topicId: 'netzwerke',
    prompt: 'Ordne die Schritte des Verbindungsaufbaus.',
    correct: ['SYN', 'SYN-ACK', 'ACK'],
  },
  {
    id: 'order-dora',
    title: 'DHCP (DORA)',
    topicId: 'netzwerke',
    prompt: 'Bringe die DHCP-Schritte in die richtige Reihenfolge.',
    correct: ['Discover', 'Offer', 'Request', 'Acknowledge'],
  },
  {
    id: 'order-boot',
    title: 'Boot-Ablauf',
    topicId: 'betriebssysteme',
    prompt: 'Ordne den Startvorgang eines PCs.',
    correct: ['POST (Selbsttest)', 'Bootloader laden', 'Kernel / Betriebssystem starten', 'Anmeldung / Oberfläche'],
  },
  {
    id: 'order-phasen',
    title: 'Projektphasen',
    topicId: 'projektmanagement',
    prompt: 'Bringe die klassischen Projektphasen in die richtige Reihenfolge.',
    correct: ['Initialisierung / Definition', 'Planung', 'Durchführung / Steuerung', 'Abschluss'],
  },
  {
    id: 'order-pdca',
    title: 'PDCA-Zyklus',
    topicId: 'qs-vertraege',
    prompt: 'Ordne die Phasen des Deming-Kreises.',
    correct: ['Plan', 'Do', 'Check', 'Act'],
  },
  {
    id: 'order-teststufen',
    title: 'Teststufen (V-Modell)',
    topicId: 'qs-vertraege',
    prompt: 'Bringe die Teststufen von klein nach groß in die richtige Reihenfolge.',
    correct: ['Komponenten-/Unit-Test', 'Integrationstest', 'Systemtest', 'Abnahmetest'],
  },
  {
    id: 'order-lifecycle',
    title: 'Produktlebenszyklus',
    topicId: 'kommunikation',
    prompt: 'Ordne die Phasen des Produktlebenszyklus.',
    correct: ['Einführung', 'Wachstum', 'Reife', 'Sättigung', 'Degeneration'],
    beyond: true,
  },
  {
    id: 'order-tuckman',
    title: 'Teamphasen (Tuckman)',
    topicId: 'projektmanagement',
    prompt: 'Bringe die Phasen der Teamentwicklung in die richtige Reihenfolge.',
    correct: ['Forming', 'Storming', 'Norming', 'Performing', 'Adjourning'],
  },
  {
    id: 'order-lewin',
    title: 'Change-Management (Lewin)',
    topicId: 'projektmanagement',
    prompt: 'Ordne die drei Phasen des Lewin-Modells.',
    correct: ['Unfreeze (Auftauen)', 'Change (Verändern)', 'Refreeze (Einfrieren)'],
    beyond: true,
  },
  {
    id: 'order-aida',
    title: 'AIDA-Modell',
    topicId: 'kommunikation',
    prompt: 'Ordne die Stufen der Werbewirkung.',
    correct: ['Attention', 'Interest', 'Desire', 'Action'],
    beyond: true,
  },
  {
    id: 'order-kalkulation',
    title: 'Handelskalkulation (Bezugspreis)',
    topicId: 'wirtschaftlichkeit',
    prompt: 'Bringe die Stationen der Bezugskalkulation in die richtige Reihenfolge.',
    correct: ['Listen-Einkaufspreis', 'Zieleinkaufspreis (− Rabatt)', 'Bareinkaufspreis (− Skonto)', 'Bezugspreis (+ Bezugskosten)'],
  },
  // PV1 Tag 2 (Kommandozeile): Die Reihenfolge ist durch die Vorgabe eindeutig — erst die eigene
  // Konfiguration ablesen (liefert die Ziele für die Pings), dann von innen nach außen, zuletzt DNS.
  {
    id: 'order-netzwerkstoerung-eingrenzen',
    title: 'Netzwerkstörung von innen nach außen eingrenzen',
    topicId: 'netzwerke',
    prompt:
      'Ein PC öffnet keine Webseiten. Bringe die Prüfschritte in die richtige Reihenfolge: erst die eigene Konfiguration ablesen, dann von innen nach außen testen, zum Schluss die Namensauflösung prüfen.',
    correct: [
      'ipconfig /all – eigene IP, Standardgateway und DNS-Server ablesen',
      'ping 127.0.0.1 – TCP/IP-Stack des eigenen PCs',
      'ping auf die eigene IP-Adresse – Adresse ist am Adapter eingerichtet',
      'ping auf das Standardgateway – lokales Netz bis zum Router',
      'ping auf eine externe IP-Adresse – Weg ins Internet',
      'nslookup mit dem Namen der Webseite – Antwort des DNS-Servers',
    ],
  },
  // PV1 Tag 3 (Projektmanagement): Rückwärtsrechnung als Gegenstück zu order-netzplan-vorwaertsrechnung
  // (interactive-extra.json), Scrum-Ablauf mit Begriffen nach dem Scrum Guide 2020.
  {
    id: 'order-netzplan-rueckwaertsrechnung',
    title: 'Netzplan: Rückwärtsrechnung und Puffer',
    topicId: 'projektmanagement',
    prompt:
      'Die Vorwärtsrechnung ist fertig, ein späterer Endtermin ist nicht vorgegeben. Bringe die folgenden Schritte in die richtige Reihenfolge.',
    correct: [
      'Endvorgang: SEZ = sein FEZ (Projektende)',
      'SAZ = SEZ − Dauer berechnen',
      'SEZ eines Vorgängers = kleinster SAZ aller direkten Nachfolger übernehmen',
      'Rechnung bis zum Startvorgang fortsetzen (Kontrolle: SAZ = 0)',
      'Gesamtpuffer GP = SAZ − FAZ und freien Puffer FP bestimmen',
      'Kritischen Pfad aus den Vorgängen mit GP = 0 bilden',
    ],
  },
  {
    id: 'order-scrum-sprint-ablauf',
    title: 'Scrum: Ablauf eines Sprints',
    topicId: 'projektmanagement',
    prompt: 'Bringe die Stationen rund um einen Sprint in die richtige Reihenfolge (Begriffe nach dem Scrum Guide 2020).',
    correct: [
      'Product Owner ordnet das Product Backlog',
      'Sprint Planning: Sprintziel und Auswahl der Einträge festlegen',
      'Developers erstellen das Sprint Backlog (Plan für den Sprint)',
      'Umsetzung mit täglichem Daily Scrum (höchstens 15 Minuten)',
      'Increment erfüllt die Definition of Done',
      'Sprint Review mit den Stakeholdern',
      'Sprint Retrospective des Scrum Teams',
    ],
  },
]

// Zusätzliche, per Workflow generierte & gegengeprüfte Zuordnungs-/Reihenfolge-Aufgaben.
export const MATCH_DECKS: MatchDeck[] = [...MATCH_BASE, ...(extra.match as MatchDeck[]), ...(erm.match as MatchDeck[])]
export const ORDER_TASKS: OrderTask[] = [...ORDER_BASE, ...(extra.order as OrderTask[]), ...(erm.order as OrderTask[])]

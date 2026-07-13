// Authentische, mehrteilige AP1-Prüfungsaufgaben (Handlungssituation → Teilaufgaben
// mit Operator, Punkten, Musterlösung und Rubric). Modelliert nach dem realen
// AP1-Blueprint Frühjahr 2025 (02-Aufgabentypen-Operatoren.md).

export interface ExamPart {
  label: string
  operator: string
  points: number
  prompt: string
  modelAnswer: string
  rubric: string[]
}

export interface ExamTask {
  id: string
  title: string
  topicId: string
  scenario: string
  parts: ExamPart[]
}

export const EXAM_TASKS: ExamTask[] = [
  {
    id: 'task-nutzwert-notebooks',
    title: 'Beschaffung: Notebooks auswählen',
    topicId: 'wirtschaftlichkeit',
    scenario:
      'Ein Kunde möchte 20 Notebooks beschaffen. Drei Angebote (A, B, C) stehen zur Wahl. Bewertet werden Preis (Gewicht 0,4), Akkulaufzeit (0,35) und Support (0,25) auf einer Skala 1–10. A: 6/9/7 · B: 8/6/8 · C: 7/7/6.',
    parts: [
      {
        label: 'a)',
        operator: 'berechnen',
        points: 6,
        prompt: 'Berechnen Sie den Nutzwert jeder Alternative.',
        modelAnswer:
          'A = 6·0,4 + 9·0,35 + 7·0,25 = 2,4 + 3,15 + 1,75 = 7,30\nB = 8·0,4 + 6·0,35 + 8·0,25 = 3,2 + 2,1 + 2,0 = 7,30\nC = 7·0,4 + 7·0,35 + 6·0,25 = 2,8 + 2,45 + 1,5 = 6,75',
        rubric: ['Nutzwert A = 7,30', 'Nutzwert B = 7,30', 'Nutzwert C = 6,75 / Rechenweg mit Teilprodukten'],
      },
      {
        label: 'b)',
        operator: 'beurteilen',
        points: 4,
        prompt: 'A und B sind gleichauf. Treffen Sie eine begründete Entscheidung und nennen Sie ein zusätzliches Kriterium.',
        modelAnswer:
          'Bei Gleichstand entscheidet ein weiteres Kriterium oder das wichtigste Kriterium: Da Preis am höchsten gewichtet ist und B dort besser abschneidet (8 vs. 6), ist B vorzuziehen. Zusätzliche Kriterien könnten TCO, Garantie/Lieferzeit oder Erweiterbarkeit sein.',
        rubric: ['Entscheidung ausdrücklich benannt', 'nachvollziehbare Begründung', 'sinnvolles Zusatzkriterium (TCO/Garantie/…)'],
      },
    ],
  },
  {
    id: 'task-schreibtischtest',
    title: 'Schreibtischtest: Rabattstaffel',
    topicId: 'softwareentwicklung',
    scenario:
      'Folgender Pseudocode berechnet einen Rabatt:\n\nWENN bestellwert >= 1000 DANN rabatt = 15\nSONST WENN bestellwert >= 500 DANN rabatt = 10\nSONST WENN bestellwert >= 100 DANN rabatt = 5\nSONST rabatt = 0',
    parts: [
      {
        label: 'a)',
        operator: 'ermitteln',
        points: 6,
        prompt: 'Führen Sie einen Schreibtischtest für die Bestellwerte 1200, 650 und 80 durch und geben Sie jeweils den Rabatt an.',
        modelAnswer:
          '1200 → erste Bedingung (>=1000) erfüllt → rabatt = 15\n650 → >=1000 nein, >=500 ja → rabatt = 10\n80 → alle nein → rabatt = 0',
        rubric: ['1200 → 15 %', '650 → 10 % (Abbruch nach erstem Treffer)', '80 → 0 %'],
      },
      {
        label: 'b)',
        operator: 'erläutern',
        points: 4,
        prompt: 'Erläutern Sie, warum bei 650 nicht auch der 5-%-Zweig geprüft wird.',
        modelAnswer:
          'Bei einer verschachtelten SONST-WENN-Kette wird nach dem ersten zutreffenden Zweig abgebrochen; die restlichen Bedingungen werden gar nicht mehr geprüft. Deshalb greift für 650 nur der 10-%-Zweig.',
        rubric: ['Abbruch nach erstem Treffer erklärt', 'SONST-WENN-Kette / Reihenfolge genannt'],
      },
    ],
  },
  {
    id: 'task-netzplan',
    title: 'Projektplanung: Netzplan',
    topicId: 'projektmanagement',
    scenario:
      'Ein Projekt besteht aus vier Vorgängen: A (Dauer 2, keine Vorgänger), B (Dauer 3, Vorgänger A), C (Dauer 1, Vorgänger A), D (Dauer 2, Vorgänger B und C).',
    parts: [
      {
        label: 'a)',
        operator: 'berechnen',
        points: 6,
        prompt: 'Führen Sie die Vorwärtsrechnung (FAZ/FEZ) für alle Vorgänge durch.',
        modelAnswer: 'A: FAZ 0, FEZ 2 · B: FAZ 2, FEZ 5 · C: FAZ 2, FEZ 3 · D: FAZ 5 (max aus B/C), FEZ 7',
        rubric: ['A/B/C FAZ+FEZ korrekt', 'D FAZ = max(FEZ B, FEZ C) = 5', 'FEZ = FAZ + Dauer angewandt'],
      },
      {
        label: 'b)',
        operator: 'ermitteln',
        points: 4,
        prompt: 'Nennen Sie die Projektdauer und den kritischen Pfad (Begründung über den Gesamtpuffer).',
        modelAnswer:
          'Projektdauer = 7 (FEZ von D). Kritischer Pfad A–B–D, da diese Vorgänge Gesamtpuffer 0 haben. C hat GP 2 (SAZ 4 − FAZ 2), liegt nicht auf dem kritischen Pfad.',
        rubric: ['Projektdauer 7', 'kritischer Pfad A–B–D', 'Begründung über GP = 0'],
      },
    ],
  },
  {
    id: 'task-ki-chatbot',
    title: 'KI-Chatbot im Kundenservice',
    topicId: 'neu-2025',
    scenario:
      'Ein Unternehmen möchte einen KI-gestützten Chatbot für den First-Level-Support einführen.',
    parts: [
      {
        label: 'a)',
        operator: 'nennen',
        points: 4,
        prompt: 'Nennen Sie je zwei Vor- und Nachteile des Chatbot-Einsatzes.',
        modelAnswer:
          'Vorteile: 24/7-Verfügbarkeit, schnelle Antworten, Entlastung von Routineanfragen, Kostenersparnis. Nachteile: Fehler/Halluzinationen, fehlende Empathie/Kontext, Datenschutzrisiko, Anschaffungs-/Wartungskosten.',
        rubric: ['zwei plausible Vorteile', 'zwei plausible Nachteile'],
      },
      {
        label: 'b)',
        operator: 'erläutern',
        points: 4,
        prompt: 'Erläutern Sie zwei rechtliche/ethische Aspekte, die zu beachten sind.',
        modelAnswer:
          'Datenschutz (DSGVO): keine unkontrollierte Verarbeitung personenbezogener Daten in Eingaben; Kennzeichnungs-/Transparenzpflicht (Nutzer muss wissen, dass er mit einer KI spricht). Weiter: Vermeidung von Bias/Diskriminierung, Verantwortung/Haftung für Ausgaben.',
        rubric: ['Datenschutz/DSGVO erläutert', 'Transparenz/Kennzeichnung oder Bias/Haftung erläutert'],
      },
      {
        label: 'c)',
        operator: 'begründen',
        points: 3,
        prompt: 'Begründen Sie, warum der Chatbot nur im First-Level-Support sinnvoll ist.',
        modelAnswer:
          'Der First Level bearbeitet Standard-/Routineanfragen, die sich gut automatisieren lassen. Komplexe Fälle erfordern Fachwissen und Urteilsvermögen und werden an den Second/Third Level eskaliert, weil der Chatbot dort an Grenzen stößt.',
        rubric: ['Routineanfragen automatisierbar', 'Eskalation komplexer Fälle an höhere Level (…, weil …)'],
      },
    ],
  },
  {
    id: 'task-security-pki',
    title: 'IT-Sicherheit: Signatur, Hash & Datenpanne',
    topicId: 'it-sicherheit',
    scenario:
      'Ein Dienstleister versendet vertrauliche Dokumente digital signiert und muss Sicherheits- und Datenschutzanforderungen erfüllen.',
    parts: [
      {
        label: 'a)',
        operator: 'beschreiben',
        points: 4,
        prompt: 'Beschreiben Sie, wie eine digitale Signatur erstellt und geprüft wird.',
        modelAnswer:
          'Erstellung: Vom Dokument wird ein Hash gebildet und mit dem privaten Schlüssel des Absenders verschlüsselt (= Signatur). Prüfung: Der Empfänger entschlüsselt die Signatur mit dem öffentlichen Schlüssel und vergleicht den Hash mit dem selbst berechneten Hash des Dokuments. Sichert Integrität, Authentizität und Nichtabstreitbarkeit.',
        rubric: ['Hash + privater Schlüssel (Erstellung)', 'öffentlicher Schlüssel + Hash-Vergleich (Prüfung)', 'erfüllte Schutzziele genannt'],
      },
      {
        label: 'b)',
        operator: 'nennen',
        points: 3,
        prompt: 'Nennen Sie drei Eigenschaften einer kryptografischen Hashfunktion.',
        modelAnswer: 'Einwegfunktion (nicht umkehrbar), kollisionsresistent, deterministisch (gleiche Eingabe → gleicher Hash); feste Ausgabelänge, Lawineneffekt.',
        rubric: ['Einwegfunktion', 'Kollisionsresistenz', 'deterministisch / feste Länge / Lawineneffekt'],
      },
      {
        label: 'c)',
        operator: 'nennen',
        points: 3,
        prompt: 'Innerhalb welcher Frist ist eine Datenpanne der Aufsichtsbehörde zu melden, und was ist bei hohem Risiko zusätzlich zu tun?',
        modelAnswer:
          'Meldung innerhalb von 72 Stunden nach Bekanntwerden an die Aufsichtsbehörde. Bei hohem Risiko für die Betroffenen sind zusätzlich die betroffenen Personen zu benachrichtigen.',
        rubric: ['72 Stunden', 'Meldung an Aufsichtsbehörde', 'bei hohem Risiko Betroffene benachrichtigen'],
      },
    ],
  },
  {
    id: 'task-netzwerk-arbeitsplatz',
    title: 'Arbeitsplatz vernetzen: Subnetting & Protokolle',
    topicId: 'netzwerke',
    scenario:
      'Für eine Abteilung soll das Netz 192.168.10.0/26 eingerichtet und die Mailkonfiguration festgelegt werden.',
    parts: [
      {
        label: 'a)',
        operator: 'berechnen',
        points: 5,
        prompt: 'Bestimmen Sie Subnetzmaske, Anzahl nutzbarer Hosts, Netz- und Broadcast-Adresse.',
        modelAnswer:
          'Maske 255.255.255.192; nutzbare Hosts = 2^6 − 2 = 62; Netzadresse 192.168.10.0; Broadcast 192.168.10.63 (Blockgröße 64).',
        rubric: ['Maske 255.255.255.192', '62 nutzbare Hosts', 'Netz .0 / Broadcast .63'],
      },
      {
        label: 'b)',
        operator: 'vergleichen',
        points: 4,
        prompt: 'Vergleichen Sie IMAP und POP3 für den Abruf von E-Mails.',
        modelAnswer:
          'POP3 (Port 110) lädt Mails herunter und löscht sie i. d. R. vom Server → nur ein Gerät sinnvoll. IMAP (Port 143) belässt die Mails auf dem Server und synchronisiert Ordner/Status → mehrere Geräte greifen auf denselben Stand zu. Für Mehrgeräte-Nutzung ist IMAP vorzuziehen.',
        rubric: ['POP3: Download/löschen, ein Gerät', 'IMAP: bleibt auf Server, Sync über Geräte', 'Ports oder Empfehlung genannt'],
      },
    ],
  },
  {
    id: 'task-arbeitsplatz-ergonomie',
    title: 'Bildschirmarbeitsplatz einrichten',
    topicId: 'hardware',
    scenario:
      'Für einen neuen Sachbearbeiter soll ein ergonomischer, ausfallsicherer Bildschirmarbeitsplatz eingerichtet werden. Der Rechner darf bei Stromausfall nicht sofort abstürzen.',
    parts: [
      {
        label: 'a)',
        operator: 'nennen',
        points: 4,
        prompt: 'Nennen Sie vier ergonomische Anforderungen an einen Bildschirmarbeitsplatz (ArbStättV).',
        modelAnswer:
          'Sehabstand zum Monitor 50–70 cm; Monitor-Oberkante in bzw. leicht unter Augenhöhe (Blick leicht nach unten); Beleuchtung mind. 500 lux, blendfrei (Monitor parallel zum Fenster); höhenverstellbarer Stuhl/Tisch; ausreichend große Arbeitsfläche; regelmäßige Pausen/Blickwechsel.',
        rubric: ['Sehabstand 50–70 cm', 'Monitor-Oberkante ~Augenhöhe', 'Beleuchtung/Blendfreiheit', 'weitere ergonomische Anforderung'],
      },
      {
        label: 'b)',
        operator: 'begründen',
        points: 4,
        prompt: 'Empfehlen Sie eine USV-Klasse (nach IEC 62040-3) für den Serverbetrieb und begründen Sie die Wahl.',
        modelAnswer:
          'Empfehlung VFI (Online-Doppelwandler): Die Spannung wird ständig neu erzeugt, dadurch unterbrechungsfreie Versorgung ohne Umschaltzeit und Schutz auch gegen Frequenz-/Spannungsschwankungen — wichtig für empfindliche Serverhardware. VI (Line-Interactive) genügt für Arbeitsplätze, VFD (Offline) nur für unkritische Geräte.',
        rubric: ['VFI/Online empfohlen', 'unterbrechungsfrei / keine Umschaltzeit (…, weil …)', 'Abgrenzung zu VI/VFD'],
      },
      {
        label: 'c)',
        operator: 'erläutern',
        points: 3,
        prompt: 'Erläutern Sie zwei Maßnahmen für einen energieeffizienten (Green-IT-) Arbeitsplatz.',
        modelAnswer:
          'Geräte mit Energieeffizienz-Label (Energy Star, Blauer Engel) beschaffen; Energiesparmodus/automatisches Abschalten aktivieren; Thin Clients statt vollwertiger PCs; unnötige Peripherie abschalten (Standby vermeiden).',
        rubric: ['effiziente Geräte / Label', 'Energiesparmaßnahme (Standby/Abschalten/Thin Client)'],
      },
    ],
  },
  {
    id: 'task-datenschutz-auskunft',
    title: 'DSGVO: Auskunftsersuchen & Datenpanne',
    topicId: 'datenschutz',
    scenario:
      'Ein Kunde verlangt Auskunft über seine gespeicherten Daten. Kurz darauf wird ein unverschlüsselter Laptop mit Kundendaten gestohlen.',
    parts: [
      {
        label: 'a)',
        operator: 'nennen',
        points: 4,
        prompt: 'Nennen Sie vier Betroffenenrechte nach der DSGVO.',
        modelAnswer:
          'Auskunft (Art. 15), Berichtigung (16), Löschung/„Vergessenwerden" (17), Einschränkung der Verarbeitung (18), Datenübertragbarkeit (20), Widerspruch (21).',
        rubric: ['vier korrekte Betroffenenrechte'],
      },
      {
        label: 'b)',
        operator: 'nennen',
        points: 3,
        prompt: 'Innerhalb welcher Frist muss auf das Auskunftsersuchen reagiert werden, und was passiert bei Komplexität?',
        modelAnswer:
          'Grundsätzlich innerhalb eines Monats nach Eingang. Bei komplexen/zahlreichen Anträgen kann die Frist um bis zu zwei weitere Monate verlängert werden — die betroffene Person ist darüber (mit Begründung) zu informieren.',
        rubric: ['1 Monat', 'Verlängerung um bis zu 2 Monate', 'Betroffenen informieren'],
      },
      {
        label: 'c)',
        operator: 'beurteilen',
        points: 4,
        prompt: 'Beurteilen Sie den Laptop-Diebstahl datenschutzrechtlich und nennen Sie eine vorbeugende TOM.',
        modelAnswer:
          'Es liegt eine meldepflichtige Datenpanne vor: Meldung an die Aufsichtsbehörde binnen 72 Stunden; bei hohem Risiko zusätzlich Benachrichtigung der Betroffenen. Vorbeugende TOM (Art. 32): Festplattenverschlüsselung — dann wären die Daten trotz Diebstahl nicht lesbar und das Risiko entfiele weitgehend.',
        rubric: ['meldepflichtige Datenpanne erkannt', '72 h / ggf. Betroffene', 'Verschlüsselung als TOM genannt'],
      },
    ],
  },
  {
    id: 'task-linux-rechte',
    title: 'Linux-Server absichern',
    topicId: 'betriebssysteme',
    scenario:
      'Auf einem Linux-Server sollen Zugriffsrechte gesetzt und das System gehärtet werden.',
    parts: [
      {
        label: 'a)',
        operator: 'berechnen',
        points: 4,
        prompt: 'Ein Konfigurationsskript soll für den Eigentümer lesbar/schreibbar/ausführbar, für die Gruppe lesbar/ausführbar und für andere gar nicht zugänglich sein. Geben Sie die oktale chmod-Zahl und die symbolische Darstellung an.',
        modelAnswer:
          'user rwx = 7, group r-x = 5, others --- = 0 → chmod 750, symbolisch rwxr-x---.',
        rubric: ['user = 7', 'group = 5', 'others = 0', 'symbolisch rwxr-x---'],
      },
      {
        label: 'b)',
        operator: 'erläutern',
        points: 3,
        prompt: 'Erläutern Sie den Unterschied zwischen NTFS und ext4 hinsichtlich Einsatz und Journaling.',
        modelAnswer:
          'ext4 ist das Standard-Dateisystem unter Linux, NTFS das unter Windows. Beide unterstützen Journaling (Änderungen werden vor Ausführung protokolliert), sodass das Dateisystem nach einem Absturz schnell in einen konsistenten Zustand zurückgeführt werden kann. NTFS bietet zusätzlich ACL-Rechte, Komprimierung und Verschlüsselung.',
        rubric: ['ext4 = Linux, NTFS = Windows', 'Journaling erklärt (Konsistenz nach Absturz)'],
      },
      {
        label: 'c)',
        operator: 'nennen',
        points: 3,
        prompt: 'Nennen Sie drei Maßnahmen zur Härtung (Hardening) des Servers.',
        modelAnswer:
          'Nicht benötigte Dienste/Software entfernen; offene Ports schließen (Firewall); Standardpasswörter ändern; Rechte minimieren (Least Privilege); regelmäßig patchen/updaten; Logging aktivieren.',
        rubric: ['drei sinnvolle Härtungsmaßnahmen (Dienste/Ports/Passwörter/Least Privilege/Updates/Logging)'],
      },
    ],
  },
]

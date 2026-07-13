// Datensätze für die interaktiven Drills „Zuordnung" (Match) und „Reihenfolge" (Order).
// Fachlich aus der Wissensbasis (01-Themenkatalog / Karteikarten).

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
}

export const MATCH_DECKS: MatchDeck[] = [
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
]

export const ORDER_TASKS: OrderTask[] = [
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
  },
  {
    id: 'order-aida',
    title: 'AIDA-Modell',
    topicId: 'kommunikation',
    prompt: 'Ordne die Stufen der Werbewirkung.',
    correct: ['Attention', 'Interest', 'Desire', 'Action'],
  },
  {
    id: 'order-kalkulation',
    title: 'Handelskalkulation (Bezugspreis)',
    topicId: 'wirtschaftlichkeit',
    prompt: 'Bringe die Stationen der Bezugskalkulation in die richtige Reihenfolge.',
    correct: ['Listen-Einkaufspreis', 'Zieleinkaufspreis (− Rabatt)', 'Bareinkaufspreis (− Skonto)', 'Bezugspreis (+ Bezugskosten)'],
  },
]

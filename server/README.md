# Backup-Server (VPS) für die AP1 Lernapp

Ein winziger Dienst, der deinen Lernstand als **ein JSON-Blob je geheimem Schlüssel**
speichert. Kein Konto-System, keine externen Dependencies. Die App sichert per HTTPS
dorthin und kann jederzeit wiederherstellen.

> **Warum HTTPS Pflicht ist:** Die App läuft über HTTPS (Vercel). Ein Browser darf von
> einer HTTPS-Seite keine unverschlüsselten Adressen aufrufen. Der Backup-Endpunkt braucht
> deshalb eine **Domain + TLS-Zertifikat**. Das Docker-Setup hier erledigt TLS via Caddy
> automatisch — du brauchst nur eine (Sub-)Domain, die auf den VPS zeigt.

---

## 0) Was du über deinen VPS wissen musst (Self-Check)

Per SSH einloggen und prüfen:

```bash
cat /etc/os-release          # welches Linux?
docker --version             # ist Docker da?
docker compose version       # Compose v2 da?
ss -tlnp | grep -E ':(80|443)'   # sind 80/443 frei? (nichts darf sie belegen)
```

- **Docker fehlt?** `curl -fsSL https://get.docker.com | sh` installiert es (Ubuntu/Debian).
- **Ports 80/443 belegt** (z. B. anderer nginx)? Dann diesen Dienst hinter deinen
  bestehenden Reverse Proxy hängen statt Caddy zu nutzen (siehe „Ohne Caddy" unten).

**Domain:** Du brauchst eine (Sub-)Domain mit einem **A-Record auf die VPS-IP**.
Keine Domain? Kostenlos z. B. über **DuckDNS** (`deinname.duckdns.org`) — auch damit
holt Caddy ein gültiges Zertifikat.

---

## 1) Deployen (Docker + automatisches HTTPS)

```bash
# Dateien auf den VPS bringen (dieser server/-Ordner) und dort:
cp .env.example .env
nano .env            # DOMAIN=... und ALLOW_ORIGIN=... eintragen
docker compose up -d
```

Fertig. Nach ~30 Sekunden ist `https://DEINE-DOMAIN/health` erreichbar und liefert
`{"ok":true}`.

**Testen:**
```bash
KEY="dein-langer-geheimer-schluessel"
curl https://DEINE-DOMAIN/health
curl -X PUT https://DEINE-DOMAIN/backup -H "Authorization: Bearer $KEY" \
     -H "Content-Type: application/json" -d '{"test":123}'
curl https://DEINE-DOMAIN/backup -H "Authorization: Bearer $KEY"
```

---

## 2) In der App einrichten

App → **Einstellungen → Cloud-Backup (VPS)**:

- **Server-URL**: `https://DEINE-DOMAIN`
- **Geheimer Schlüssel**: ein langer Zufallswert (min. 16 Zeichen). Erzeugen z. B. mit
  `openssl rand -hex 24`. **Denselben** Schlüssel überall verwenden, den du wiederherstellen willst.
- **Verbindung testen**, dann **Jetzt sichern** — und optional **Auto-Backup** aktivieren.

> Der Schlüssel ist dein Zugang. Wer ihn kennt, kann deinen Lernstand lesen/überschreiben —
> also geheim halten. Auf einem anderen Gerät denselben Schlüssel eintragen und
> **Wiederherstellen** wählen.

---

## Ohne Caddy (hinter bestehendem Reverse Proxy)

Wenn 80/443 schon von nginx o. Ä. belegt sind: nur den Backup-Dienst starten …

```bash
docker build -t lernapp-backup .
docker run -d --restart unless-stopped -p 127.0.0.1:8787:8787 \
  -e ALLOW_ORIGIN=https://lernapp-mauve.vercel.app \
  -v $PWD/data:/data --name lernapp-backup lernapp-backup
```

… und in deinem vorhandenen Reverse Proxy einen HTTPS-Host auf `http://127.0.0.1:8787`
weiterleiten.

## Betrieb

- Daten liegen als JSON-Dateien im `data/`-Ordner (bzw. Docker-Volume) — dieses Verzeichnis
  ins reguläre Server-Backup aufnehmen.
- Logs: `docker compose logs -f backup`
- Update: Dateien ersetzen, `docker compose up -d --build`.

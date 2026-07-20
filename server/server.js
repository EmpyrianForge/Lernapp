// Minimaler Backup-Server für die AP1 Lernapp — speichert je geheimem Schlüssel
// EINEN JSON-Lernstand-Blob. Kein Framework, keine externen Dependencies (nur Node).
//
// Auth: HTTP-Header  Authorization: Bearer <geheimer-schluessel>
// Der Schlüssel IST die Identität; die Datei liegt unter sha256(schluessel).json.
// Endpunkte:
//   GET  /health   -> { ok: true }
//   GET  /backup   -> { savedAt, payload }   (401 ohne gültigen Schlüssel, 404 wenn leer)
//   PUT  /backup   -> speichert den JSON-Body, gibt { ok, savedAt } zurück
//
// Konfiguration über Umgebungsvariablen:
//   PORT          (Default 8787)
//   DATA_DIR      (Default ./data)
//   ALLOW_ORIGIN  Erlaubter Browser-Origin für CORS, z. B. https://lernapp-mauve.vercel.app
//                 (Default "*"; für Produktion bitte konkret setzen.)

import { createServer } from 'node:http'
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const PORT = Number(process.env.PORT || 8787)
const DATA_DIR = process.env.DATA_DIR || './data'
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || '*'
const MAX_BYTES = 8 * 1024 * 1024 // 8 MB Sicherheitslimit

const fileFor = (token) => join(DATA_DIR, createHash('sha256').update(token).digest('hex') + '.json')

function send(res, status, obj) {
  const body = typeof obj === 'string' ? obj : JSON.stringify(obj)
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(body)
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN)
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  res.setHeader('Access-Control-Max-Age', '86400')
}

function tokenOf(req) {
  const m = (req.headers['authorization'] || '').match(/^Bearer\s+(.+)$/i)
  return m ? m[1].trim() : null
}

const server = createServer((req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return send(res, 204, '')
  const url = (req.url || '').split('?')[0]

  if (url === '/health') return send(res, 200, { ok: true })

  if (url !== '/backup') return send(res, 404, { error: 'not found' })

  const token = tokenOf(req)
  if (!token || token.length < 16) return send(res, 401, { error: 'unauthorized (Bearer-Schlüssel, min. 16 Zeichen)' })
  const file = fileFor(token)

  if (req.method === 'GET') {
    if (!existsSync(file)) return send(res, 404, { error: 'kein Backup vorhanden' })
    readFile(file, 'utf8').then((data) => send(res, 200, data)).catch(() => send(res, 500, { error: 'read failed' }))
    return
  }

  if (req.method === 'PUT') {
    let size = 0
    let aborted = false
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > MAX_BYTES) {
        aborted = true
        send(res, 413, { error: 'Backup zu groß' })
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', async () => {
      if (aborted) return
      try {
        const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'))
        const savedAt = new Date().toISOString()
        if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true })
        await writeFile(file, JSON.stringify({ savedAt, payload }))
        send(res, 200, { ok: true, savedAt })
      } catch {
        send(res, 400, { error: 'ungültiges JSON' })
      }
    })
    return
  }

  send(res, 405, { error: 'method not allowed' })
})

server.listen(PORT, () => {
  console.log(`[backup] läuft auf :${PORT} · Daten: ${DATA_DIR} · Origin: ${ALLOW_ORIGIN}`)
})

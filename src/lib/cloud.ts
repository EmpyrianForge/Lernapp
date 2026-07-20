// Client für den VPS-Backup-Dienst (siehe server/). Reine fetch-Helfer.

export interface CloudResult {
  ok: boolean
  savedAt?: string
  error?: string
}

const base = (url: string) => url.trim().replace(/\/+$/, '')

export async function cloudHealth(url: string): Promise<CloudResult> {
  try {
    const r = await fetch(`${base(url)}/health`, { method: 'GET' })
    return r.ok ? { ok: true } : { ok: false, error: `Server antwortete mit Status ${r.status}` }
  } catch (e) {
    return { ok: false, error: (e as Error)?.message || 'nicht erreichbar' }
  }
}

export async function cloudPut(url: string, key: string, blob: string): Promise<CloudResult> {
  try {
    const r = await fetch(`${base(url)}/backup`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: blob,
    })
    if (!r.ok) return { ok: false, error: `Status ${r.status}` }
    const j = (await r.json().catch(() => ({}))) as { savedAt?: string }
    return { ok: true, savedAt: j.savedAt }
  } catch (e) {
    return { ok: false, error: (e as Error)?.message || 'nicht erreichbar' }
  }
}

export async function cloudGet(
  url: string,
  key: string,
): Promise<CloudResult & { payload?: unknown }> {
  try {
    const r = await fetch(`${base(url)}/backup`, { headers: { Authorization: `Bearer ${key}` } })
    if (r.status === 404) return { ok: false, error: 'Auf dem Server liegt noch kein Backup.' }
    if (r.status === 401) return { ok: false, error: 'Schlüssel abgelehnt (401).' }
    if (!r.ok) return { ok: false, error: `Status ${r.status}` }
    const j = (await r.json()) as { savedAt?: string; payload?: unknown }
    return { ok: true, savedAt: j.savedAt, payload: j.payload }
  } catch (e) {
    return { ok: false, error: (e as Error)?.message || 'nicht erreichbar' }
  }
}

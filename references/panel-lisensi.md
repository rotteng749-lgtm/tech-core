# Panel lisensi + shortlink gate — versi bener

Contoh di berkas aslinya cuma potongan dan ada beberapa yang nggak jalan.
Ini versi utuh: satu berkas, jalan, `node server.js`.

## Yang diperbaiki dari versi lama

| Soal | Versi lama | Versi ini |
|---|---|---|
| HTML di dalam `res.send` | Ditulis mentah, kutipnya bentrok | Template literal dengan backtick |
| Endpoint `/generate` | Dipanggil form tapi nggak ada | Ada, lengkap |
| Validasi key | Nggak cek `appId` waktu unlock | Dicek |
| SQL update | Pakai `"expired"` (kutip dobel di SQL) | Pakai parameter binding |
| Sumber key | Dua tempat nulis key, beda-beda | Satu fungsi dipakai dua-duanya |
| Rate limit | Nggak ada | Ada, biar key nggak dispam |

## Kode

```js
// server.js — node 18+
import express from 'express';
import crypto from 'crypto';
import Database from 'better-sqlite3';

const app = express();
app.use(express.json());

const db = new Database('keys.db');
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS keys (
    id         INTEGER PRIMARY KEY,
    key        TEXT UNIQUE,
    app_id     TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    uses       INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_key_app ON keys(key, app_id);
`);

const now = () => Math.floor(Date.now() / 1000);

// ---- satu tempat bikin key, dipakai semua endpoint ----
function issueKey(appId, days) {
  for (let i = 0; i < 5; i++) {              // tabrakan key: coba 5x
    const key = crypto.randomBytes(16).toString('hex').toUpperCase();
    try {
      db.prepare(
        'INSERT INTO keys (key, app_id, status, created_at, expires_at) VALUES (?, ?, ?, ?, ?)'
      ).run(key, appId, 'active', now(), now() + days * 86400);
      return key;
    } catch (e) {
      if (!String(e.message).includes('UNIQUE')) throw e;
    }
  }
  throw new Error('gagal bikin key unik');
}

function checkKey(key, appId) {
  const row = db
    .prepare('SELECT * FROM keys WHERE key = ? AND app_id = ?')
    .get(key, appId);
  if (!row)                    return { valid: false, message: 'key nggak ketemu' };
  if (row.status !== 'active') return { valid: false, message: 'key nggak aktif' };
  if (row.expires_at < now()) {
    db.prepare('UPDATE keys SET status = ? WHERE key = ?').run('expired', key);
    return { valid: false, message: 'key udah lewat' };
  }
  return { valid: true, message: 'key valid', row };
}

// ---- rate limit sederhana, per IP ----
const hits = new Map();
function limit(max, windowMs) {
  return (req, res, next) => {
    const k = req.ip;
    const t = Date.now();
    const h = (hits.get(k) || []).filter(x => t - x < windowMs);
    if (h.length >= max) return res.status(429).json({ error: 'slow down' });
    h.push(t);
    hits.set(k, h);
    next();
  };
}

// ---- admin: bikin key ----
app.get('/getkey', limit(20, 60000), (req, res) => {
  const appId = String(req.query.appId || '');
  const days  = Math.max(1, Math.min(3650, Number(req.query.days) || 30));
  if (!appId) return res.status(400).json({ error: 'appId wajib' });

  const key = issueKey(appId, days);
  db.prepare('UPDATE keys SET uses = uses + 1 WHERE key = ?').run(key);
  res.json({ key, expires_at: now() + days * 86400 });
});

// ---- client: validasi key ----
app.post('/validate', limit(60, 60000), (req, res) => {
  const { key, appId } = req.body || {};
  if (!key || !appId) return res.status(400).json({ valid: false, message: 'kurang parameter' });
  const r = checkKey(String(key), String(appId));
  res.json({ valid: r.valid, message: r.message });
});

// ---- dashboard: terkunci / kebuka ----
app.get('/dashboard', (req, res) => {
  const key   = req.query.key;
  const appId = req.query.app || 'myapp';
  const r = key ? checkKey(String(key), appId) : { valid: false };

  if (r.valid) {
    return res.send(`<!doctype html>
<html><head><meta charset="utf-8"><title>Panel</title></head>
<body style="background:#0a0a0f;color:#eee;font-family:system-ui;text-align:center;padding:60px">
  <h1 style="color:#ff6b35">UNLOCKED</h1>
  <p>key <code>${r.row.key}</code> valid.</p>
  <form action="/getkey" method="get">
    <input name="appId" value="${appId}" placeholder="app id">
    <input name="days" value="30" size="4">
    <button>Bikin key</button>
  </form>
</body></html>`);
  }

  res.send(`<!doctype html>
<html><head><meta charset="utf-8"><title>Panel</title></head>
<body style="background:#0a0a0f;color:#eee;font-family:system-ui;text-align:center;padding:100px">
  <div style="background:#15151c;padding:40px;border-radius:16px;border:1px solid #2a2a35;max-width:420px;margin:auto">
    <h2 style="color:#ff6b35">ACCESS DENIED</h2>
    <p style="color:#888">${r.message || 'butuh key buat masuk.'}</p>
    <a href="/gate?app=${encodeURIComponent(appId)}"
       style="display:inline-block;padding:14px 38px;background:linear-gradient(45deg,#ff6b35,#ff4500);color:#fff;text-decoration:none;border-radius:40px;font-weight:600">
      Lewat shortlink
    </a>
  </div>
</body></html>`);
});

// ---- gate: bikin key, pendekin URL, redirect ----
app.get('/gate', limit(10, 60000), async (req, res) => {
  const appId = String(req.query.app || 'myapp');
  const key   = issueKey(appId, 30);

  const base = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
  const target = `${base}/dashboard?app=${encodeURIComponent(appId)}&key=${key}`;

  const token = process.env.SHRINKME_API;
  if (!token) return res.redirect(target);          // nggak ada token: langsung

  try {
    const u = new URL('https://shrinkme.io/api');
    u.searchParams.set('api', token);
    u.searchParams.set('url', target);
    const d = await fetch(u).then(r => r.json());
    res.redirect(d.shortenedUrl || target);
  } catch {
    res.redirect(target);                            // API down: jangan nyangkut
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`panel jalan di ${PORT}`));
```

`package.json`:

```json
{
  "name": "panel-lisensi",
  "type": "module",
  "dependencies": {
    "express": "^4.19.2",
    "better-sqlite3": "^11.3.0"
  }
}
```

## Jalanin

```bash
npm install
SHRINKME_API=token_lo PUBLIC_URL=https://domain_lo node server.js
```

Buka `http://localhost:3000/dashboard`.

## Yang perlu diperhatiin

**Token jangan di kode.** Pakai `process.env`, jangan ditulis di berkas. Kalau
kerespositori publik, token kepake orang lain.

**Buat produksi, tambahin:** HTTPS di depan (nginx/Caddy), rate limit yang
bener (Redis, bukan Map di memory), dan backup `keys.db` terjadwal.

**`/getkey` itu admin endpoint.** Sekarang kebuka siapa saja. Di produksi,
kasih proteksi — header rahasia atau basic auth. Kalau nggak, orang bisa bikin
key sendiri tanpa lewat gate.

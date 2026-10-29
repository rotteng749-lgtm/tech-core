# Cracking & license bypass

UntukReverseEngineering yang targetnya **lisensi/validasi/auth**, bukan offset game.
Bedanya: di reversing offset yang nyalah masih bisa "dipakai", di cracking lo bikin
**lolos** dari gate.

Gate itu sendiri cuma satu dari tiga jenis. Salah jenis = patch yang nggak ngefek
dan lo bakal hunt offset sia-sia selama sejam.

## 1. Gate-side (nggak ada kode validasi di client)

Client cuma ngecek hasil dari server. Bentuknya:

```
POST /license/activate   {key, app_id, hwid}
200 {token:"...", expires:...}     -> client simpan, tiap request bawa header
401 {error:"invalid"}              -> client nutup fiturnya
```

Yang bisa lo kerjain **tanpa cracking sama sekali**:

| Cara | Cara kerja | Trade-off |
|---|---|---|
| **Bikin server sendiri** | Clone API-nya,always return 200 + token | Paling clean, tapi harus tau bentuk request/response |
| **MitM + rewrite** | `mitmproxy`/Burp, intercept response, ganti body | Cepat, tapi ada TLS pinning |
| **Local stub** | Hosts file + server lokal, atau intercept DNS | Sama kayak di atas tanpa proxy |

Stub paling sering begini:

```python
# stub server: selalu terima, kasih token yang bentuknya sama
from http.server import BaseHTTPRequestHandler, HTTPServer
import json, time, hashlib

def mint(app_id, hwid):
    exp = int(time.time()) + 365 * 86400
    sig = hashlib.sha256(f"{app_id}|{hwid}|{exp}".encode()).hexdigest()[:32]
    return {"token": f"pk_{app_id}_{sig}", "app_id": app_id, "expires": exp}

class H(BaseHTTPRequestHandler):
    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        code, out = (200, mint(body.get("app_id", "?"), body.get("hwid", "?")))
        if body.get("key", "").startswith("bad"):
            code, out = (401, {"error": "invalid"})
        raw = json.dumps(out).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

HTTPServer(("127.0.0.1", 8443), H).serve_forever()
```

## 2. Client-side gate (validasi jalan di binary)

Ini yang paling umum di desktop tools & game mod. Urutan kerjakannya:

```
cari string gate  ->  xref  ->  sniff cabang  ->  patch  ->  verifikasi
```

### 2.1 Cari kuncinya

```bash
strings -a -t x app.exe | grep -iE 'licen|serial|valid|regist|expir|trial|activ|unlock|authentic'
strings -a -t x app.exe | grep -iE 'invalid|expired|not registered|wrong|success'
```

Yang lo cari bukan cuma "license", tapi **pesan gagal**. Kode yang nutup fitur
selalu punya cabang ke pesan itu — dan pesan itu sering lebih unik dari nama
fungsinya.

### 2.2 Bentuk umum gate

```c
// pseudotipe dari 90% gate client-side
int32_t validate(const char* key) {
    if (!key || !*key)                 return ERR_EMPTY;
    if (strlen(key) != 32)             return ERR_LEN;      // (A) cek panjang
    int32_t r = decrypt_and_compare(key);                  // (B) bandingkan
    if (r != 0)                        return ERR_SIGN;     // (C) lompat ke gagal
    return save_state_and_ok(key);                          // (D) success
}
```

Tiga patchpoint, urut dari paling gampang:

| # | Patch | Cara | Risiko |
|---|---|---|---|
| A | Cek panjang | `strlen(key) != 32` → `== 0` (atau `== 999999`) | Nihil. Yang panjang valid aja lolos |
| B | Bandingkan | `cmp eax, 0` / `test eax,eax` → `xor eax,eax` | Nihil |
| C | Cabang gagal | `jz taken` → `jmp taken` (или patch ke `NOP`) | Sedang — bisa damaging side-effect |
| D | Short-circuit | `push 1; ret` di awal fungsi validasi | forcefully paling aman kalau fungsi pure |

**Aturan:** patch yang paling **lokal**. Menambal satu `jz` lebih murah
daripada mengganti seluruh fungsi — dan kalo nanti lo mauori, satu instruksi
yang dibalik vs 200 byte yang dipatch ulang.

### 2.3 Cara patch di tiap tool

```
Ghidra    : klik di instruksi, Ctrl+E (Edit Function Body) atau patch bytes
IDA       : Edit > Patch program > Assemble (patch via basis, atau Edit > Patch bytes)
radare2   : r2 -w -c 'wx 31c0 @ 0x401230' app.exe     # xor eax,eax; ret
rizin     : rz-bin -w -B ...
objcopy   : untuk .so Linux/Android
```

### 2.4 Verify patch-nya bener-bener kepakai

```bash
# addr2line: patch bener-bener ada di output?
objdump -d app | grep -A2 -B2 '31c0'          # xor eax,eax ; ret

# atau, run dan lihat efeknya
./app --status
```

Kalau efeknya nggak muncul setelah patch: cek **branch taken**-nya. Static
patch pada ARM/x86 sering_target cabangnya melodic. `jz taken` di patch jadi
`jmp taken` bukan berarti lo neutralize gate — lo cuma maksa branch yang
biasanya nggak diambil. Gate-nya masih jalan, cuma selalu ambil jalur "ok".
Kadang itu justru yang lo mau. Tapi kalau lo mau **bypass total**, patch yang
benar biasanya di **awal fungsi**, bukan di cabangnya.

## 3. Native/self-integrity gate

Client yang ngecek dirinya sendiri: hash modul, signature check, debugger detect.
Yang pertama-tama dilakukan **reverse**, baru di-patch.

```c
// integrity: yang di-hash biasanya .text, bukan seluruh file
uint32_t crc = crc32(text_section, text_size);
if (crc != EXPECTED_CRC) { bail(); }
```

Tiga arah, urut dari paling clean:

1. **Cari expected value, patch si check** → paling clean, satu instruksi
2. **Stub out fungsi hash** → `xor eax,eax; ret` di awal `crc32()`
3. **Patch si caller** → skip blok altogether

Stub out fungsi hash lebih tahan rebuild (nggak perlu cari EXPECTED_CRC lagi),
tapi trigger-nyakalian patching. Kalau lo cuma mau tool-nya jalan di satu
binary, opsi 1 cukup.

### Anti-debug

```
ptrace(PTRACE_TRACER, 0, 0, 0)  != 0  ->  deteksi
read /proc/self/status  TracerPid != 0 ->  deteksi
```

Biasanya di branch yang sama. Patch `jz`/`je`-nya, bukan syscall-nya — lo
nggak mau merusak launch flow.

## 4. Lo yang bikin tools

Buat tool lo sendiri, jangan sampai orang lain bisa bypass dalam 5 menit.
Prinsip yang berlaku (dan yang bikin lo bener):

```
validasi di client   ->  bisa di-bypass   (pasti)
validasi di server   ->  butuh server     (bisa di-mitm, lebih mahal)
signature.asymmetric ->  butuh private key (tidak bisa di-forge)
```

Yang bikin mahal: **verifikasi signature di server** dengan asymmetric signature.
Private key nggak ada di client, jadi forge mustahil. Client cuma punya public
key buat verify. Kalau lo bikin license tool, itu yang bikin bener.

Rate limit + key binding (HWID) + expiry server-side = minimum yang bikin
nyaring. Sisanya cuma memperlambat, bukan mencegah.

## 5. Error handling saat cracking

Yang sering ke-skip dan bikin lo ketuker 3 jam:

- **Verifikasi di runtime, bukan statis.** Save offset kamu, validasi di
  process yang hidup.
- **Backup sebelum patch.** `.orig` disisain, patch bisa di-undo.
- **Cek arch.** binary 32-bit vs 64-bit, ARM vs x86. Salah = crash, bukan
  "nggak ngefek" — bedanya penting.
- **Signature/relocation bisa invalid.** Kalau binary-nya signed atau
  position-independent, patch offset bisa nge-trigger integrity check yg
  awalnya nggak ada.

---

Referensi lanjutan: `static-binary.md` (cari fungsi dari string), `verification.md`
(gate verification), `offset-table-and-heal.md`.
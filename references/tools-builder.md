# Tools builder

Buat tool dari nol: external memory reader, overlay ESP, bot, panel lisensi,
driver loader. Ini hasilnya, bukan theorinya — semua sudah pernah jalan.

Pilih arsitektur DULU, baru nulis. Salah arsitektur = rewrite.

## Matriks pilihan

| Tool | Memory | Input | Stack | Tempel |
|---|---|---|---|---|
| Desktop game hack | `pymem` / direct `ReadProcessMemory` | `pyautogui` | Python | `bot-template.md` |
| Android external overlay | `/proc/<pid>/mem` | uinput / touch | C++ NDK + ImGui | `mlbb-panxcz` skill |
| Android in-app (inject) | `ptrace` + `dlopen` | in-app API | C++ NDK + hook | — |
| Bot CV (game mobile) | — | `adb shell input` + OpenCV | Python | `bot-template.md` |
| Panel / auth server | — | HTTP | Node + SQLite | `panel-lisensi.md` |
| Loader / packer | — | — | ELF wrapper | bawah |

## 1. External memory reader (Android, no root-inject)

Tool hidup **di luar** game: ELF sendiri, baca memory orang lain.

```
/proc/<pid>/maps         ->  parse region (base, size, rwx)
libbase + offset         ->  alamat field
/proc/<pid>/mem          ->  read / write
```

### Parse maps

```c
// BUKAN buffer tetap. Maps bisa 300+ baris pada game besar.
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

typedef struct { unsigned long start, end; char perms[8]; char name[256]; } Region;

int LoadMaps(pid_t pid, Region** out) {
    char path[64];
    snprintf(path, sizeof path, "/proc/%d/maps", pid);
    FILE* f = fopen(path, "r");
    if (!f) return -1;

    int cap = 256, n = 0;
    Region* r = malloc(sizeof(Region) * cap);
    char line[512];
    while (fgets(line, sizeof line, f)) {
        if (n == cap) { cap *= 2; r = realloc(r, sizeof(Region) * cap); }
        unsigned long s, e; char perms[8] = {0}, name[256] = {0};
        int got = sscanf(line, "%lx-%lx %7s %*s %*s %*s %255[^\n]", &s, &e, perms, name);
        if (got < 3) continue;
        r[n].start = s; r[n].end = e;
        snprintf(r[n].perms, sizeof r[n].perms, "%s", perms);
        snprintf(r[n].name, sizeof r[n].name, "%s", got == 4 ? name : "[anon]");
        n++;
    }
    fclose(f);
    *out = r;
    return n;
}

// base modul = region pertama yang namanya persis. Bukan yang contain.
unsigned long ModuleBase(pid_t pid, const char* mod) {
    Region* r; int n = LoadMaps(pid, &r);
    if (n < 0) return 0;
    unsigned long base = 0;
    for (int i = 0; i < n; i++)
        if (strcmp(r[i].name, mod) == 0) { base = r[i].start; break; }
    free(r);
    return base;
}
```

### Read/write

```c
int Read(pid_t pid, unsigned long addr, void* dst, size_t len) {
    char p[64]; snprintf(p, sizeof p, "/proc/%d/mem", pid);
    int fd = open(p, O_RDONLY);
    if (fd < 0) return -1;
    ssize_t got = pread(fd, dst, len, (off_t)addr);
    close(fd);
    return got == (ssize_t)len ? 0 : -1;
}

// WAJIB: cek return. Read gagal = 0xFF semua. Kalau lo nggak cek,
// lo bakal "nemu" field selalu 0xFFFFFFFF danAAF salah bener.
static inline int32_t Rd32(pid_t pid, unsigned long a) {
    int32_t v = -1;               // default BUKAN 0. -1 = "gagal baca"
    if (Read(pid, a, &v, 4) != 0) return -1;
    return v;
}
```

### Proses benar?

```c
// /proc/<pid>/cmdline dipisah NUL. Cek PERSIS, bukan substring:
// "com.mobile.legends" CONTAINS "com.mobile.legends.usa".
int IsProcess(pid_t pid, const char* want) {
    char p[64]; snprintf(p, sizeof p, "/proc/%d/cmdline", pid);
    FILE* f = fopen(p, "r");
    if (!f) return 0;
    char buf[256] = {0};
    size_t n = fread(buf, 1, sizeof buf - 1, f);
    fclose(f);
    for (size_t i = 0; i < n; i++) if (buf[i] == 0) buf[i] = ' ';
    return strcmp(buf, want) == 0;
}
```

## 2. Offset + runtime healing

**Offset hardcode = tool mati tiap update game.** Wajib healing.

```c
// Pola: nama field -> cari di metadata runtime -> patch pointer global
typedef struct { const char* klass; const char* field; int32_t* slot; } Heal;

int HealAll(Heal* h, int n) {
    int ok = 0;
    for (int i = 0; i < n; i++) {
        void* k = ResolveClass(h[i].klass);
        if (!k) continue;                       // cache SEKALI, jangan retry tiap frame
        FieldInfo f;
        if (!FindField(k, h[i].field, &f)) continue;
        *h[i].slot = f.offset;
        ok++;
    }
    return ok;
}
```

Dua aturan yang paling mahal kalau dilanggar:

1. **Gagal cache, jangan retry.** Kalau lo retry tiap frame untuk class yang
   nggak ada, itu thousands of wasted lookups per second.
2. **Offset 0 = "belum di-heal", bukan "offset valid 0".** Skip eksplisit.

Detail lengkap: `offset-table-and-heal.md`.

## 3. Overlay (Android, ImGui, native surface)

```c
// Surface SENDIRI, bukan child dari window game. Game surface-nya
// secure/immune, jadi lo ga bisa draw di situ.
ANativeWindow* win = ANativeWindowCreator::Create("panxcz");
EGLDisplay dpy = eglGetDisplay(EGL_DEFAULT_DISPLAY);
eglInitialize(dpy, &major, &minor);
EGLSurface surf = eglCreateWindowSurface(dpy, EGL_NO_CONFIG, win, NULL);
eglMakeCurrent(dpy, surf, surf, EGL_NO_CONTEXT);
```

Loop:

```
  -> build ImGui frame (Start/End, invisible window full-screen)
  -> draw ESP (GLFW/glDrawArrays)
  -> eglSwapBuffers
  -> sleep(16ms)   -> 60fps. Jangan spin.
```

Masalah yang nearly everyone kena: **overlay nggak ke-capture `screencap`.**
Artinya lo nggak bisa verify tampilan via screenshot. Solusinya bukan screenshot
— itu log.

## 4. Touch injection

Cara yang bisa andalkan buat game mobile:

```
1. /dev/input/eventX  ->  ls, pilih yang ABS (multi-touch)
2. grab device (EVIOCGRAB), supaya game nggak ikut baca
3. emit ABS_MT_TRACKING_ID / ABS_MT_POSITION_X/Y / BTN_TOUCH
4. sleep 30-60ms di tengah down-up
5. release
```

Tidak bisa pakai `adb shell input` untuk ini — itu lewat InputManager, bukan
evdev, jadi overlay nggak pernah liat event-nya. Detail + kode lengkap:
skill `mlbb-panxcz`, `references/touch-injection.md`.

## 5. Build & verify (Android NDK)

```bash
clang++ --target=aarch64-linux-android21 -O2 -fPIE -pie \
  -I jni/include src/*.cpp -o out/tool -llog -lEGL -lGLESv2 -ldl

# VERIFY, jangan percaya "build success"
readelf -hW out/tool | grep Type          # DYN (PIE), bukan EXEC
readelf -dW out/tool | grep NEEDED        # libc? static = lebih portable
readelf -lW out/tool | grep LOAD          # align 16KB (Android 15+ wajib)
./out/tool --selftest                     # test internal, bukan manual
```

**16 KB alignment itu wajib sekarang.** Android 15+ refuse load segment yang
align < 16 KB. Build di laptop NDK lama bisa Jadi align 4 KB = app crash di HP
baru. Check setiap build.

## 6. Panel lisensi (Node)

Lihat `panel-lisensi.md` — server.js utuh: key generation, HWID binding, rate
limit, expiry, SQL parameterized.

Prinsip auth yang bikin bener (lihat `cracking.md` §4):
- client-side validation = bisa di-bypass
- server-side = mahal
- asymmetric signature = nggak bisa di-forge (private key nggak ada di client)

## 7. Error yang paling sering kejadian

| Gejala | Penyebab | Fix |
|---|---|---|
| Value 0xFFFFFFFF semua | Read gagal, nggak dicek | Return sentinel, cek errno |
| Field "cocok" tapi nggak ngefek | salah class, bukan salah offset | Probe multi-class |
| Jalan di satu HP, mati di lain | hardcode pixel/offset | Scale by screen size |
| Offset berubah tiap update | nggak ada healing | Healing dari metadata |
| Loop 100% CPU | nggak ada sleep | `usleep(16666)` |
| Random crash | buffer stack overflow | `snprintf` everywhere |
| Build OK, app crash | align 4 KB | `readelf -lW`, 16 KB |
| Nggak bisa verify tampilan | overlay nggak ke-capture | log, bukan screenshot |

---

Lanjut: `cracking.md` (gate bypass), `methodology.md` (loop RE),
`verification.md` (gate testing), `bot-template.md` (bot CV/memory).
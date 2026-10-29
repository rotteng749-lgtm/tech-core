# Template bot — versi bener

Tiga jalur, pilih sesuai game.

| Jalur | Cara kerja | Kapan dipakai |
|---|---|---|
| **Memory** | Baca/tulis nilai langsung di RAM proses | Game offline, atau anti-cheat lemah |
| **Input** | Simulasi tombol/tap lewat OS | Game mobile, anti-cheat kuat |
| **Vision** | Screenshot + deteksi gambar, lalu input | Kalau tombolnya posisinya berubah-ubah |

---

## 1. Memory — Python + pymem

```python
"""Bot memory generik. Ganti ALAMAT dan OFFSET sesuai game."""
import time, sys
import pymem
import pymem.process

PROCESS = "game.exe"
MODULE  = "game.exe"
ADDR_OFFSET = 0x123456        # dari Cheat Engine, relatif ke base module

def attach():
    pm = pymem.Pymem(PROCESS)
    mod = pymem.process.module_from_name(pm.process_handle, MODULE)
    if mod is None:
        sys.exit(f"module {MODULE} nggak ketemu")
    return pm, mod.lpBaseOfDll

def main():
    pm, base = attach()
    addr = base + ADDR_OFFSET
    print(f"base={hex(base)}  target={hex(addr)}")

    try:
        while True:
            val = pm.read_int(addr)
            if val < 1000:
                pm.write_int(addr, val + 100)
                print(f"nambah: {val} -> {val + 100}")
            time.sleep(60)
    except KeyboardInterrupt:
        print("matiin...")
    finally:
        pm.close_process()

if __name__ == "__main__":
    main()
```

**Yang penting:**

- `ADDR_OFFSET` hampir selalu berubah tiap update game. Kalau tiba-tiba nggak
  ngefek, alamatnya geser — scan ulang.
- Kalau alamatnya cuma stabil **selama satu sesi**, itu pointer, bukan alamat
  statis. Cari pointer chain-nya (`base + 0x10 -> +0x2C -> ...`).
- `KeyboardInterrupt` itu kill switch. Jangan dihapus.

---

## 2. Input — ADB buat Android

```python
"""Auto-tap Android lewat ADB. Butuh: adb, USB debugging aktif."""
import subprocess, time, sys

SERIAL = None            # None = satu device. Atau: "127.0.0.1:5555"

def adb(*args):
    cmd = ["adb"]
    if SERIAL:
        cmd += ["-s", SERIAL]
    return subprocess.run(cmd + list(args), capture_output=True, text=True)

def tap(x, y, delay=0.4):
    adb("shell", "input", "tap", str(x), str(y))
    time.sleep(delay)

def swipe(x1, y1, x2, y2, ms=300):
    adb("shell", "input", "swipe", str(x1), str(y1), str(x2), str(y2), str(ms))

def find_size():
    out = adb("shell", "wm", "size").stdout
    # "Physical size: 1080x2400"
    for line in out.splitlines():
        if "size:" in line:
            wh = line.split(":")[-1].strip()
            w, h = wh.split("x")
            return int(w), int(h)
    sys.exit("nggak bisa baca ukuran layar")

def main():
    w, h = find_size()
    print(f"layar {w}x{h}")

    # PENTING: hitung koordinat dari rasio, jangan hardcode piksel!
    CLAIM = (int(w * 0.46), int(h * 0.75))
    OK    = (int(w * 0.50), int(h * 0.62))

    try:
        while True:
            tap(*CLAIM)
            time.sleep(1.5)
            tap(*OK)
            print("claim")
            time.sleep(60)
    except KeyboardInterrupt:
        print("matiin...")

if __name__ == "__main__":
    main()
```

**Yang penting:**

- **Koordinat pakai rasio, bukan piksel.** Kalau hardcode `(500, 800)`, di HP
  lain tombolnya kelewat. `w * 0.46` jalan di resolusi apa pun.
- Cara ngecek koordinat: aktifkan "Pointer location" di Developer Options.
- Emulator biasanya bisa `adb connect 127.0.0.1:5555` — lebih gampang dari HP
  beneran untuk testing.

---

## 3. Vision — OpenCV, buat tombol yang posisinya berubah

```python
"""Deteksi template gambar di layar, terus tap di situ."""
import cv2, numpy as np, subprocess, time

SERIAL = None
THRESHOLD = 0.85

def adb(*args):
    cmd = ["adb"] + (["-s", SERIAL] if SERIAL else [])
    return subprocess.run(cmd + list(args), capture_output=True)

def shot(path="screen.png"):
    with open(path, "wb") as f:
        f.write(adb("exec-out", "screencap", "-p").stdout)
    return path

def find(template_path, threshold=THRESHOLD):
    img = cv2.imread(shot())
    tpl = cv2.imread(template_path)
    if img is None or tpl is None:
        return None
    th, tw = tpl.shape[:2]
    res = cv2.matchTemplate(img, tpl, cv2.TM_CCOEFF_NORMED)
    _, mx, _, loc = cv2.minMaxLoc(res)
    if mx < threshold:
        return None
    return (loc[0] + tw // 2, loc[1] + th // 2), mx

def main():
    while True:
        hit = find("claim_button.png")
        if hit:
            (x, y), score = hit
            print(f"ketemu ({score:.2f}) di {x},{y}")
            adb("shell", "input", "tap", str(x), str(y))
        time.sleep(5)

if __name__ == "__main__":
    main()
```

**Yang penting:**

- Ambil `claim_button.png` lewat screenshot manual, crop tombolnya. Template
  yang bagus: tombolnya aja, bukan seluruh layar.
- `THRESHOLD` 0.85 aman. Kalau sering salah deteksi, naikin ke 0.92.
- Ambil screenshot tiap kali, jangan cache — layout bisa berubah.

---

## Kill switch — wajib di ketiga jalur

Bot yang nggak bisa dimatiin itu bot yang bakal bikin masalah. Minimal satu
dari ini:

Potongan di bawah ini **bukan berkas utuh** — taruh di dalam loop, dicek tiap
iterasi.

```python
# 1. Ctrl+C -- udah default, tinggal tangkap
try:
    while True:
        ...
except KeyboardInterrupt:
    pass

# 2. File penanda -- cara paling gampang matiin dari luar
import os
while True:
    if os.path.exists("stop.bot"):
        print("ketemu stop.bot, matiin...")
        break
    ...

# 3. Batas iterasi -- buat bot yang emang harus berhenti
iterations = 0
while True:
    iterations += 1
    if iterations > 1000:
        break
    ...

# 4. Batas waktu -- jangan jalan tanpa ujung
import time
start = time.time()
while True:
    if time.time() - start > 3600:      # sejam
        break
    ...
```

Taruh kill switch **di dalam loop**, jangan di luar. Dan pilih minimal dua —
satu yang butuh lo di depan komputer, satu yang bisa jalan otomatis.

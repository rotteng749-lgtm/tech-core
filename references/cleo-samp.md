# CLEO + SA:MP — catatan teknis

## Alamat memory statis GTA SA (versi 1.0 US)

Ini yang dipakai contoh di V2.0. Gua tulis di sini biar jelas **batasannya**.

| Alamat | Isi |
|---|---|
| `0xB6F5F0` | Koordinat X pemain (float) |
| `0xB6F5F4` | Koordinat Y pemain (float) |
| `0xB6F5F8` | Koordinat Z pemain (float) |
| `0xB6F5FC` | Sudut hadap pemain (float) |
| `0xB6F988` | Armor (float) |
| `0xB7CD98` | Health (float) |
| `0x969165` | Infinite run (byte) |

**Batasan yang harus disebut tiap kali:**

1. **Ini cuma buat 1.0 US.** Versi lain (Steam, 3.0, downgrade lain) alamatnya
   geser. Salah alamat = crash, bukan cuma nggak ngefek.
2. **Buat SA:MP, seringnya nggak jalan.** SA:MP itu multiplayer — server punya
   state sendiri, dan koordinat lokal sering di-overwrite tiap sync. Teleport
   lokal biasa langsung ketarik balik sama server.
3. **Contoh V2.0 nulis tiga alamat terpisah** dengan `0A8C` satu-satu. Itu
   **race condition** — game bisa baca koordinat di tengah nulis. Urutan yang
   bener: tulis Z dulu, baru X dan Y, atau pakai satu struct write.

## Opcode CLEO yang sering dipakai

| Opcode | Fungsi |
|---|---|
| `0A8C` | Write memory: `0A8C: write_memory <addr> size <n> value <v> virtual_protect <0/1>` |
| `0A8D` | Read memory: `0A8D: <var> = read_memory <addr> size <n> virtual_protect <0/1>` |
| `0A8E` | Write memory, nilai dari variabel (bukan literal) |
| `0AB0` | Key pressed: `0AB0: key_pressed <vkey>` |
| `0AB1` | Call function |
| `0DD9` | Debug text |

`0A8C` vs `0A8D` sering ketuker. `C` = **C**hange/write, `D` = rea**D**.

Virtual key code: `0x09` Tab, `0x08` Backspace, `0x0D` Enter, `0x20` Spasi,
`0x31`-`0x39` angka 1-9, `0x41`-`0x5A` A-Z.

## Timer variabel CLEO

Ini yang bikin V2.0 salah di contoh bot armor.

CLEO punya timer otomatis yang naik sendiri tiap frame, dalam milidetik:

| Var | Fungsi |
|---|---|
| `32@` | Timer lokal (per script), naik tiap frame |
| `33@` | Timer global |

Jadi **jangan** `wait 600000` buat nunggu 10 menit. `wait` di CLEO itu blok
script — kalau value-nya gede, script nyangkut dan nggak responsif.

Yang bener, bandingin timer:

```{$CLEO .cs}
0000: NOP

0@ = 0                              // 0 = bot mati, 1 = hidup

while true
    wait 0                          // WAJIB. tanpa ini game freeze.

    if 0AB0: key_pressed 0x09       // Tab: nyalain
    then
        0@ = 1
    end

    if 0AB0: key_pressed 0x08       // Backspace: matiin
    then
        0@ = 0
    end

    if 0@ == 1
    then
        if 32@ > 600000             // 10 menit
        then
            32@ = 0
            // AKSI di sini
        end
    end
end
```

Perhatiin: `wait 0` per iterasi, bukan `wait 10000`. Timer `32@` naik sendiri.
Dan ada toggle buat matiin.

## Teleport — versi bener

Tulis dari yang paling jauh dulu, biar pemain nggak sempet ke-render di posisi
aneh:

```{$CLEO .cs}
0000: NOP

:X_COORD
```

Lebih rapi lagi — tulis Z dulu, baru X sama Y:

```{$CLEO .cs}
0000: NOP

while true
    wait 0
    if 0AB0: key_pressed 0x09
    then
        0A8C: write_memory 0xB6F5F8 size 4 value 10.0 virtual_protect 0
        0A8C: write_memory 0xB6F5F0 size 4 value 250.0 virtual_protect 0
        0A8C: write_memory 0xB6F5F4 size 4 value 1350.0 virtual_protect 0
    end
end
```

`value` di `0A8C` itu float, bukan integer. `250.0`, bukan `250`. Kalau salah
tipe, angkanya jadi sampah.

## Cara nyari alamat sendiri (kalau versi lu bukan 1.0 US)

1. Buka **Cheat Engine**, attach ke `gta_sa.exe`.
2. Cari nilai koordinat X lu (float, "Known value" — bukan "Exact Value").
3. Gerak dikit, cari yang berubah.
4. Kalau ketemu 1-2 alamat, cek: itu **alamat statis** atau nggak?
   - Restart game, cek lagi. Kalau alamatnya sama → statis.
   - Kalau beda → pointer. Cari base-nya pakai "Find out what accesses".
5. Alamat statis biasanya di area `0x400000`-`0xC00000`.

Kalau ketemu pointer, catat chain-nya: `[[base + 0x10] + 0x2C] + 0x4`. Di CLEO
itu ditulis tiga kali `0A8D` bertingkat.

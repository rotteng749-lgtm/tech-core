# Live process probing

Static analysis tells you what exists. Only the live process tells you what is
true *in this build, right now*.

## Choosing the right process

```bash
adb shell su -c 'cat /proc/<pid>/maps' | grep -F libfoo.so | head
```

If nothing matches, you have the wrong process. Engines frequently run in a
child (a suffixed process name, often a suffix like `:something`). Match on the
library mapping, never on the package name alone.

## Choosing the right Android user

Multi-profile / dual-app devices run the same package under several users, each
with its own data directory and its own processes:

```bash
adb shell pm list users
adb shell su -c 'ls /data/user/'
adb shell su -c 'ps -A -o USER,PID,NAME' | grep -F <pkg>
```

Reading from the wrong profile's file gives you a stale library and offsets that
are subtly wrong — the most annoying kind of wrong, because everything *looks*
plausible until you notice a version string that does not match.

## Reading another app's memory

Options, best first:

| Method | Notes |
|---|---|
| Kernel module / KPM | Needed when SELinux or the kernel restricts cross-uid reads; most reliable |
| `/proc/<pid>/mem` as root | Works on many devices for root; some kernels restrict it |
| `ptrace` injection | Invasive; changes the process you are measuring |

Whatever the backend, build **one read primitive** and use it everywhere. The
moment you have two, your offsets get validated against one backend while your
features read through the other, and mismatches become undebuggable.

Re-resolve the base address on every attach. It changes between launches due to
ASLR, and a tool that caches it across sessions fails "sometimes".

## Build a probe binary, not a feature

Write a small standalone tool for investigation:

```text
probe <libname> [extra args]
  -> prints library base, and whatever facts you are checking
```

Reasons it pays off:

- It starts in under a second and needs no UI, so you can iterate in a loop.
- Its output is unambiguous — no feature logic, no threads, no state.
- It survives being wrong. A feature's status string can be misread; a probe's
  raw dump cannot.

Put investigation modes **above** the attach/detach boundary, because stdout is
often redirected away after detach. Remember to set the library base yourself if
your main path assigns it during attach.

## Reading structure: dump raw

The single most useful command in this whole skill is printing raw entries of
whatever structure confuses you.

```text
scan=P1(c1,d0,h0,o0->ok0) M70(ok0) t[0/13/0/57] hid=1 z=1
0/113/113/0/1/0 ; 4/1010/7900/2/0/0 ; 4/1016/7300/2/0/0
     type/id/hp/camp/ally/dead
```

That output is what revealed enemy characters living in a *monster* list under a
type tag nobody would guess. Ten lines of output, versus an hour of reasoning.

Add per-field rejection counters to any scan you write, and log them on change
plus on a heartbeat:

```text
hb: phase=1 lib=0x7f... heal=42/98 t[0/13/0/57] near=11.9unit st='...'
```

Rules: never log per frame (the buffer rotates away the useful early lines),
always log the *inputs* not just the conclusion, and give every idle state a
human-readable reason.

## Sanity checks on every read

A read is only useful if you know the value is real. Cheap validators:

- **Range check.** Health is positive and below the max you just read. IDs are
  within a known set. A float is finite (not NaN/Inf).
- **Paired check.** Read a field and its max/capacity next to it; the ratio
  should sit in a sane band for a live entity.
- **Population check.** Scan hundreds of instances; if one field is always zero
  and another is always a small enum, you probably have the right neighbours.
- **Delta check.** Read two different entities; the delta between them should be
  small and meaningful, not random.

## Probing build variations

Offsets differ per build *and per edition/server*. When you find a shift, do not
just patch the constant — record which field moved and by how much, because the
pattern (which classes shift, by how much) is itself the finding that makes the
next update cheap.

## Permissions and failure modes

- Root may be enough, or insufficient. Establish the capability once and design
  for the weaker case.
- SELinux denials look like "no such file". Check `dmesg`/audit logs when a path
  you expect to exist does not.
- Some devices require the reader to run in the same user as the target.
- Device sleep, screen off and app backgrounding change what you can read.
  Probe in the state you will actually operate in.

## Checklist

- [ ] Library located in the **running** process's maps
- [ ] Correct Android user confirmed
- [ ] Base re-resolved per attach
- [ ] Probe binary exists and is the thing you trust
- [ ] Probe runs **above** the detach boundary (stdout still readable)
- [ ] Raw-entry dump available for any structure under investigation
- [ ] Rejection counters and heartbeat in the main tool
# Methodology

## The loop

```
hypothesise  ->  probe  ->  confirm  ->  codify  ->  self-test
     ^                                              |
     +---------------- wrong or ambiguous ----------+
```

Each step has a deliverable. "Hypothesise" produces a sentence you could be
wrong about; "probe" produces output; "confirm" produces a read you validated;
"codify" produces a table entry; "self-test" produces a regression guard.

Skipping straight from hypothesise to codify is how wrong offsets enter a
project permanently.

## Write down what you are assuming

Keep a running list of assumptions with a confidence marker. Almost every
multi-hour debugging session in this work has been caused by one unchecked
assumption on that list. Examples that were wrong in practice:

- "the second process is the renderer" — the engine library was not mapped there
- "the field name is the pretty property name" — metadata had a backing field
- "enemy characters are in the player list" — they were in a different list,
  under a type tag for heroes
- "projection of an off-screen point fails" — it returned a huge coordinate
- "0 means unlimited in the config" — the loader clamped it to 1
- "this feature is gated by the no-write safety switch" — it was, and the switch
  defaults to on, so the feature was dead by default

## Probe patterns

**Dump raw.** Ten sample entries beat any amount of reasoning. Always include
enough fields to identify the record (type/id/hp/camp/alive).

**Count rejections.** A scan that returns nothing must report how many
candidates it examined and how many were dropped per reason.

**Heartbeat the inputs.** Log the gate values every few seconds, not just the
outcome. "Is it gated off?" and "is the tick not running?" look identical from
the outside and have opposite fixes.

**Bisect the layer.** If a value is wrong, determine which layer broke it:
metadata parse → class lookup → field lookup → memory read → interpretation.
Probe each in isolation. Skipping layers is what turns a five-minute problem
into an afternoon.

**Change one thing.** When two changes are in flight, no result means anything.

## Traps, with the symptom each produces

| Trap | Symptom |
|---|---|
| Wrong process / wrong user | Everything plausible but wrong; version string mismatch is the tell |
| Stale library from the APK | Offsets "work" then break after a game update |
| Cached base across sessions | Works once, then garbage after relaunch |
| Unresolved offset in a gate | Feature never fires, no error anywhere |
| Raw offset literal in feature code | Breaks only on builds with a layout shift |
| Int read where a float lives | Value always looks like a small number |
| Float arg read as an integer register | Same, in reverse |
| Assuming a struct stride | Garbage within three array entries |
| Treating a returned coordinate as valid without a bounds check | Wild values, target logic pointing at nothing |
| Struct pointer cached across frames | Reads a freed/reused object |
| Assuming the type tag means what it says | A whole class of entities silently filtered out |
| Optional init not verified | Feature works on your device, dies on another |

## Working with a live user

The user has the screen; you have logs. Make the logs good enough that they do
not have to describe symptoms:

- one command they can run and paste, that shows the relevant state
- statuses that name the blocking condition
- counters that distinguish "not queued", "queued but device write failed",
  "written but ignored"

Ask for the specific line, not a description. "Auto aim doesn't work" costs
three rounds; the heartbeat line costs one.

## When you are wrong

Say so, and say what evidence changed your mind. Reversing work is iterative by
nature; a correction delivered without its evidence gets re-litigated later.
Record the refuted assumption in the project's notes so it stops being
re-derived.
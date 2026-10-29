# Ghidra MCP — driving Ghidra from the agent

Verified on **Ghidra 12.1.2 (snap rev 47) + GhidrAssistMCP 3.0.0**, opencode v2.1.0.
Every command and path below was executed and its output checked. Where something
did **not** work as documented upstream, it is called out explicitly.

---

## 1. The transport decision (do not skip this)

Most blog posts on this subject (including the popular "Ghidra MCP SSE Bridge"
write-up) exist to solve a problem that opencode does not have.

| Client | Needs | How it connects |
|---|---|---|
| opencode | nothing extra | `"type": "remote"` → streamable HTTP at `/mcp` |
| Claude Desktop / Gemini CLI | stdio only | needs the Python bridge (see §8) |

opencode v2.1.0 bundles the MCP SDK **Streamable HTTP** client
(`StreamableHTTPClientTransport` is present; `SSEClientTransport` is **not** in
the binary). So the correct wiring is a `remote` MCP server pointed straight at
Ghidra. No Python, no venv, no proxy, no `aiohttp-sse-client`.

Endpoints the plugin exposes:

```
Streamable HTTP: http://127.0.0.1:8080/mcp    <- use this (protocol 2025-11-25)
SSE:             http://127.0.0.1:8080/sse    <- legacy 2024-11-05
SSE messages:    http://127.0.0.1:8080/message
```

Negotiated handshake, confirmed:

```json
{"protocolVersion":"2025-11-25",
 "serverInfo":{"name":"ghidrassistmcp","version":"3.0.0"},
 "capabilities":{"tools":{"listChanged":true},"resources":{},"prompts":{}}}
```

---

## 2. Snap-specific paths (the part that wastes an hour)

Ghidra's snap sets `-Duser.home=$SNAP_USER_DATA`, so the Ghidra user settings
directory is **not** `~/.config/ghidra`:

```
/home/panxcz/snap/ghidra/current/.config/ghidra/ghidra_12.1.2_PUBLIC/Extensions
```

Derivation (from Ghidra's own source, `ApplicationUtilities.getDefaultUserSettingsDir`):

```
user.home  = $SNAP_USER_DATA      = ~/snap/ghidra/<REV>
settings   = <user.home>/.config/ghidra/<ghidra>_<version>_<release>
extensions = <settings>/Extensions
```

`current` is a symlink to the revision dir (`current -> 47`). The **revision**
survives refreshes but the **version segment** changes when Ghidra is upgraded.
Never hardcode it:

```bash
EXT_DIR=$(ls -d ~/snap/ghidra/current/.config/ghidra/ghidra_*_PUBLIC/Extensions 2>/dev/null | head -1)
```

Consequences that bite in headless mode:

- The snap has a **private `/tmp`**. Project dirs and target binaries must live
  under `$HOME`, not `/tmp` — otherwise `analyzeHeadless` cannot see them.
- `$SNAP_USER_DATA/tmp` must exist or every launch prints
  `WARNING: java.io.tmpdir directory does not exist`:
  ```bash
  mkdir -p ~/snap/ghidra/current/tmp
  ```
- The snap is confined; `snap connections ghidra` must show `network-bind`
  connected for the server to bind (it is by default).

---

## 3. Install the extension

```bash
EXT_DIR=$(ls -d ~/snap/ghidra/current/.config/ghidra/ghidra_*_PUBLIC/Extensions 2>/dev/null | head -1)
[ -n "$EXT_DIR" ] || EXT_DIR=~/snap/ghidra/current/.config/ghidra/ghidra_12.1.2_PUBLIC/Extensions
mkdir -p "$EXT_DIR"
unzip -q ghidra_12.1_PUBLIC_*_GhidrAssistMCP-*.zip -d "$EXT_DIR"
```

The zip's top-level directory is already `GhidrAssistMCP/`, so unzip straight
into `Extensions/`. Verify — all three must exist:

```bash
test -f "$EXT_DIR/GhidrAssistMCP/Module.manifest"
test -f "$EXT_DIR/GhidrAssistMCP/lib/GhidrAssistMCP-3.0.0.jar"
test -f "$EXT_DIR/GhidrAssistMCP/ghidra_scripts/GAMCPStartServerScript.java"
```

Then enable it: `File → Configure → Configure Plugins…` → check **GhidrAssistMCP**.
The plugin needs a Ghidra restart to load.

---

## 4. Start the server

### GUI (interactive)

```bash
snap run ghidra
```

In 3.0.0 the MCP server starts from the **project manager**, before any
CodeBrowser exists, and keeps running when all CodeBrowsers close. Open
`Window → GhidrAssistMCP` to see status, port and the shared request log.

### Headless (agent-drivable, preferred)

Use `-postScript`, **not** `-preScript`:

```bash
EXT_DIR=$(ls -d ~/snap/ghidra/current/.config/ghidra/ghidra_*_PUBLIC/Extensions | head -1)

snap run ghidra.analyzeHeadless ~/ghidra-projects McpHeadless \
  -import ~/ghidra-targets/target.bin \
  -scriptPath "$EXT_DIR/GhidrAssistMCP/ghidra_scripts" \
  -postScript GAMCPStartServerScript.java "host=127.0.0.1" "port=8080" "wait=true"
```

For an already-imported program, swap `-import <file>` for `-process <name>`.

### Persist the analysis first — headless cannot save over MCP

`save_project` fails in headless mode:

```
Error in save_project: Project controls require the Ghidra GUI project manager
```

So a `-import` run that ends by killing the server **loses the analysis**: the
program lived only in memory, and the project dir contains just `project.prp`
and index files with no program. The next `-process <name>` aborts with
`Requested project program file(s) not found`.

Use two phases instead:

```bash
EXT_DIR=$(ls -d ~/snap/ghidra/current/.config/ghidra/ghidra_*_PUBLIC/Extensions | head -1)

# PHASE 1 - import, analyze, SAVE, exit. No server, no wait=true.
snap run ghidra.analyzeHeadless ~/ghidra-projects McpHeadless \
  -import ~/ghidra-targets/target.bin \
  -scriptPath "$EXT_DIR/GhidrAssistMCP/ghidra_scripts"

# PHASE 2 - serve the saved, already-analyzed program
snap run ghidra.analyzeHeadless ~/ghidra-projects McpHeadless \
  -process target \
  -scriptPath "$EXT_DIR/GhidrAssistMCP/ghidra_scripts" \
  -postScript GAMCPStartServerScript.java "host=127.0.0.1" "port=8080" "wait=true"
```

Phase 1 must log `REPORT: Save succeeded for: /target (Project:/target)`. Phase 2
then starts with `Analyzed Flag: true` and `Should Ask To Analyze: false`, and
body-based tools return correct results on the **first** call with no re-analysis
(verified: identical `bytes_hashed` and SHA-256 values before and after a
restart). This is the recipe to use for anything you intend to come back to.

**Why `-postScript` matters.** With `-preScript ... wait=true` the script's wait
loop blocks `analyzeHeadless` *before* auto-analysis runs. The server comes up
fine, but every function body is still the loader's default one address. The
symptom is subtle and dangerous:

```
get_function_hash -> "bytes_hashed": 1, identical hash for every function
get_function_byte_pattern -> "signature": null
get_analysis_status -> "Analyzed Flag: false"
```

That is not a plugin bug — it is a pre-analysis database. `sha256(0xf3)` is what
you get, because every function begins with `ENDBR64` (`f3 0f 1e fa`). With
`-postScript`, the log shows `ANALYZING all memory and code` and
`Analysis succeeded`, then `Analyzed Flag: true` and correct 29-byte / 50-byte /
76-byte hashes.

If you must use `-preScript`, call `analyze_program {"mode":"full"}` afterwards
and wait for it (it took ~15 s on an 18 KB binary) before trusting any body-based
tool.

Kill cleanly: `pkill -f "analyzeHeadless.*<project>"`, then confirm with
`ss -ltn | grep 8080`. `pkill` alone can leave the JVM holding the port — kill by
PID from `ss -ltnp` if so.

---

## 5. Wire it into opencode

`~/.config/opencode/opencode.jsonc` (`opencode debug config` confirms jsonc is
loaded and wins over `opencode.json`):

```jsonc
"mcp": {
  "ghidra": {
    "type": "remote",
    "url": "http://127.0.0.1:8080/mcp",
    "enabled": true,
    "oauth": false,
    "timeout": 20000
  }
}
```

`oauth: false` is not optional — without it opencode may attempt OAuth discovery
against a server that has no auth. Verify:

```bash
opencode mcp list      # expect: ✓ ghidra  connected
```

If the server is not running, the entry simply shows disconnected; start Ghidra
and re-run. Do **not** also register the Python bridge — that duplicates all 93
tool schemas in context for no gain.

---

## 6. Talking to it without opencode (debugging)

The streamable endpoint answers plain HTTP. Responses come back **SSE-framed**
(`event: message` / `data: {...}`), not bare JSON — a naive `json.loads` on the
body fails:

```bash
SID=$(curl -s -D- -o /dev/null -X POST http://127.0.0.1:8080/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{
        "protocolVersion":"2025-11-25","capabilities":{},
        "clientInfo":{"name":"probe","version":"1"}}}' \
  | tr -d '\r' | awk 'tolower($1)=="mcp-session-id:"{print $2}')

curl -s -X POST http://127.0.0.1:8080/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -H "Mcp-Session-Id: $SID" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
```

The session id is mandatory on every call after `initialize`. Parse with:

```bash
... | python3 -c 'import json,sys;raw=sys.stdin.read();
d=json.loads([l[5:].strip() for l in raw.splitlines() if l.startswith("data:")][-1]);print(d)'
```

`skills/tech-core/scripts/ghidra-mcp.sh` wraps this (`status`, `install`,
`headless`, `probe`, `tools`, and `mcp.sh <tool> '{json}'`).

---

## 7. Tool catalog — 93 tools, and the traps

`tools/list` returns **93** tools (93 of 100 enabled by default; `import_file`,
`export_program` and the five script tools are off).

### Reading code

| Task | Tool | Args |
|---|---|---|
| Decompile | `get_pseudocode` | `function` |
| Disassemble | `get_disassembly` | `function` |
| P-code / IR | `get_pcode` | `function` |
| CFG | `get_control_flow_graph` | `function` |
| Call graph | `get_call_graph` | `function`, `depth`, `direction` |
| Locals + types | `list_function_variables` | `function` |
| Prototype | `get_function_prototype` | `function` |
| Metadata | `get_function_info` | `function` |

### Finding things

| Task | Tool | Note |
|---|---|---|
| List functions | `list_functions` | `pattern` is a **literal substring**, case-sensitive by default — `"license\|checksum"` matches nothing |
| Search by name | `search_functions` | arg is `search_term`, **not** `query` |
| Strings | `list_strings` | `filter`, `min_length` |
| Byte search | `search_bytes` | `"cd ab 34 12"`; returns *containing function* |
| Xrefs | `get_xrefs_to` / `get_xrefs_from` | `address` (hex string) |
| Imports / exports | `list_imports` / `list_exports` | |
| Hex dump | `get_hexdump` | `address`, `length` |
| Memory map | `list_memory_blocks` | gives load bases |

### Writing

`patch_bytes`, `patch_instructions`, `assemble_instructions`, `disassemble_bytes`,
`rename_function`, `rename_local_variable`, `set_local_variable_type`,
`set_function_prototype`, `set_data_type`, `create_structure`,
`set_structure_field`, `infer_structure_from_variable`, `set_comment`,
`create_function`, `create_enum`, `create_typedef`.

`infer_structure_from_variable` + `get_structure_field_xrefs` is the single most
useful pair for recovering a game struct: decompile, infer the struct from a
local, then find every site that touches a given field offset.

---

## 8. The four traps that produce confident nonsense

### 8.1 Ghidra addresses are image-relative

A PIE/ELF `.so` loaded by Ghidra gets rebased. Verified on the test binary:

```
nm license_test        -> compute_checksum @ 0x1180
get_program_info       -> Image Base: 00100000
list_functions         -> compute_checksum @ 00101180
```

**Delta = image base.** Before writing a Ghidra address into
`/proc/<pid>/mem`, into an overlay, or into an offset table, convert:

```
runtime_addr = ghidra_addr - image_base + module_load_base
```

`get_program_info` gives `Image Base`; `list_memory_blocks` and
`/proc/<pid>/maps` give the runtime base. Skipping this step is the classic
"the write succeeds and nothing happens".

### 8.2 Long tools return task handles, not results

`get_pseudocode`, `get_function_hash`, `analyze_program`, `get_pcode` and others
may answer:

```
Task submitted for async execution.
Task ID: 0b49790e-...
Status: PENDING
```

Poll `get_task_status {"task_id":"..."}`. When called through opencode the same
tool may return a **structured object** (`{"task_id":...,"status":"pending"}`)
instead of text — `JSON.stringify` it, extract `task_id`, poll. Do not treat
`[object Object]` as a decompilation result.

### 8.3 `patch_bytes` refuses to overwrite instructions by default

```
Patch failed: Memory change conflicts with instruction at 001011c4
```

That refusal is a feature. Passing `clear_code_units: true` succeeds — but it
**clears** the code units and does not re-disassemble, so the next
`get_disassembly` silently omits the patched bytes (instruction count dropped
8 → 7). Re-create the instructions explicitly:

```
patch_bytes        {address, bytes, clear_code_units:true}
disassemble_bytes  {address, length}
get_disassembly    {function}      # verify
```

Always `get_hexdump` after patching to prove the bytes on disk are what you
think, and keep a revert path (patch the original bytes back, then
`disassemble_bytes`). Verified end to end: `CMP EAX,0x1234abcd` → `39 c0 90 90 90`
made `validate_license` `return 1`, and the revert restored the exact original
bytes.

### 8.4 `bytes_hashed: 1` means "not analyzed yet"

See §4. A hash over one byte is `sha256(0xf3)` for every `ENDBR64` function.
Treat `bytes_hashed <= 4` as a failed anchor, not a valid fingerprint.

When the body *is* analyzed, `get_function_hash` is trustworthy — it was checked
against an independent `hashlib.sha256` of the raw bytes read at the file offset
derived from `readelf -SW`: exact match.

---

## 9. Using it as an offset anchor

`get_function_hash` + `get_function_byte_pattern` are how you re-find a function
after a game update, without a signature database:

1. Before the update: `get_function_hash` and `get_function_byte_pattern` for the
   function you care about; store both with the build id.
2. After the update: `search_bytes` with the masked pattern (wildcards preserved
   as `?`) — `search_bytes` reports the containing function.
3. Confirm with `get_function_hash`: a matching hash means identical body bytes;
   a mismatch with a matching pattern means the function survived but its
   constants or callees moved.
4. Only then convert the address (§8.1) and re-verify live.

The masked pattern for a real function looks like:

```
F3 0F 1E FA 48 ? ? ? E8 ? ? ? ? 3D ? ? ? ? 0F 94 C0 0F B6 C0 48 ? ? ? C3
```

`?` per wildcarded byte. Cross-check the pattern against `objdump` output before
committing it to the offset table — a pattern that matches in Ghidra but not in
the file means you captured the wrong range.

---

## 10. Python SSE bridge (only for stdio-only clients)

Needed only by Claude Desktop / Gemini CLI. opencode must **not** use it.

```bash
python3 -m venv ~/.local/share/ghidra-mcp-bridge/venv
~/.local/share/ghidra-mcp-bridge/venv/bin/pip install 'mcp==1.26.0' 'httpx==0.28.1'
```

`requirements.txt` pins exactly those two. **`aiohttp-sse-client` is not used by
the bridge** — that package implements the older, unrelated SSE client spec and
installing it changes nothing. Do not `sudo pip install --break-system-packages`;
a venv keeps the pinned versions from colliding with the distro.

Client config (Claude Desktop `claude_desktop_config.json`, Gemini CLI
`~/.gemini/settings.json`):

```json
{
  "mcpServers": {
    "ghidra": {
      "command": "/home/panxcz/.local/share/ghidra-mcp-bridge/venv/bin/python",
      "args": ["/home/panxcz/.local/share/ghidra-mcp-bridge/ghidra_mcp_sse_bridge.py"]
    }
  }
}
```

The bridge proxies tools one-for-one, so its tool names are the same 93 names.
Point it at `/sse`, not `/mcp`.

---

## 11. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `opencode mcp list` shows disconnected | server not running | start Ghidra / the headless recipe |
| `Connection refused` on 8080 | port not bound | `ss -ltnp \| grep 8080`; check `network-bind` snap connection |
| Port held after kill | JVM survived `pkill` | kill the PID from `ss -ltnp` |
| `json.decoder.JSONDecodeError` on curl | SSE-framed body | parse `data:` lines (§6) |
| Missing `Mcp-Session-Id` | no `initialize` first | do the handshake, reuse the id |
| `bytes_hashed: 1` for everything | pre-analysis (`-preScript`) | use `-postScript`, or `analyze_program` |
| `signature: null` | same | same |
| `list_functions` finds nothing | `pattern` is literal, case-sensitive | use `search_functions`, or `case_sensitive:false` |
| `search_functions` errors "search_term: Missing key" | wrong arg name | `{"search_term":"..."}` |
| `patch_bytes` "conflicts with instruction" | safety default | add `clear_code_units:true`, then `disassemble_bytes` |
| Plugin not in Configure Plugins | installed to the wrong profile dir | re-check the glob in §2 |
| Extension vanishes after Ghidra upgrade | version segment changed | re-glob `EXT_DIR`, reinstall |

---

## 12. Checklist

- [ ] `EXT_DIR` resolved by glob, not hardcoded
- [ ] `Module.manifest`, the jar and the headless script all present
- [ ] Server reachable: `curl` handshake returns `ghidrassistmcp 3.0.0`
- [ ] `opencode mcp list` → `✓ ghidra connected`
- [ ] `get_analysis_status` → `Analyzed Flag: true` **before** trusting any body tool
- [ ] `get_program_info` image base recorded
- [ ] Every address converted to a runtime address before use outside Ghidra
- [ ] Any patch verified with `get_hexdump` and has a written revert path

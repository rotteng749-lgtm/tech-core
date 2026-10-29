#!/usr/bin/env bash
# =============================================================================
#  ghidra-mcp.sh -- install, start and probe GhidrAssistMCP for Ghidra (snap)
# -----------------------------------------------------------------------------
#  Subcommands
#    status              where the extension lives, is the server up, tool count
#    install <zip>       install a GhidrAssistMCP release zip into the snap profile
#    headless <binary>   import + analyze + serve MCP, headless (analysis first!)
#    probe               MCP handshake against /mcp, print server identity
#    tools               dump the tool names the server advertises
#    call <tool> [json]  invoke one tool and print its text result
#
#  Design notes (each one is a bug that was actually hit):
#
#  * The Ghidra snap sets -Duser.home=$SNAP_USER_DATA, so extensions do NOT live
#    in ~/.config/ghidra. They live under ~/snap/ghidra/<rev>/.config/ghidra/
#    ghidra_<version>_PUBLIC/Extensions. Resolved by glob every time, because the
#    version segment changes on every Ghidra upgrade.
#
#  * The snap has a private /tmp. Project paths and target binaries must be under
#    $HOME or analyzeHeadless cannot see them.
#
#  * The server is started with -postScript, never -preScript. -preScript plus
#    wait=true blocks auto-analysis, and the failure is silent: every function
#    body stays 1 byte long, so get_function_hash returns sha256(0xf3) for every
#    function and get_function_byte_pattern returns null.
#
#  * MCP responses over the streamable endpoint are SSE-framed. A plain
#    json.loads on the body fails; the data: lines must be extracted.
# =============================================================================
set -uo pipefail

MCP_URL="${GHIDRA_MCP_URL:-http://127.0.0.1:8080/mcp}"
SID_FILE="${TMPDIR:-/tmp}/.ghidra_mcp_sid"
PROJECT_DIR="${GHIDRA_PROJECT_DIR:-$HOME/ghidra-projects}"

die() { printf '[x] %s\n' "$*" >&2; exit 1; }
info() { printf '[*] %s\n' "$*"; }
ok() { printf '[ok] %s\n' "$*"; }

snap_base() {
    # ~/snap/ghidra/current is a symlink to the revision dir; keep it stable.
    printf '%s' "$HOME/snap/ghidra/current"
}

ext_dir() {
    local base; base=$(snap_base)
    local d
    d=$(ls -d "$base"/.config/ghidra/ghidra_*_PUBLIC/Extensions 2>/dev/null | head -1)
    if [ -z "$d" ]; then
        # Profile not created yet (Ghidra never launched): derive it.
        local ver
        ver=$(grep -h '^application.version=' /snap/ghidra/current/ghidra/Ghidra/application.properties 2>/dev/null \
              | head -1 | cut -d= -f2 | tr -d '[:space:]')
        [ -n "$ver" ] || die "cannot determine Ghidra version; is the ghidra snap installed?"
        d="$base/.config/ghidra/ghidra_${ver}_PUBLIC/Extensions"
    fi
    printf '%s' "$d"
}

port_up() { ss -ltn 2>/dev/null | grep -q ':8080 '; }

# --- MCP plumbing ------------------------------------------------------------

mcp_session() {
    local sid
    sid=$(curl -s -D- -o /dev/null -X POST "$MCP_URL" \
        -H 'Content-Type: application/json' \
        -H 'Accept: application/json, text/event-stream' \
        -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"ghidra-mcp.sh","version":"1.0"}}}' \
        | tr -d '\r' | awk 'tolower($1)=="mcp-session-id:"{print $2}')
    [ -n "$sid" ] || return 1
    curl -s -o /dev/null -X POST "$MCP_URL" \
        -H 'Content-Type: application/json' \
        -H 'Accept: application/json, text/event-stream' \
        -H "Mcp-Session-Id: $sid" \
        -d '{"jsonrpc":"2.0","method":"notifications/initialized"}'
    printf '%s' "$sid" > "$SID_FILE"
    printf '%s' "$sid"
}

mcp_raw() { # mcp_raw <tool> <json-args>
    local tool="$1" args="${2:-{\}}" sid body out
    sid=$(cat "$SID_FILE" 2>/dev/null)
    [ -n "$sid" ] || sid=$(mcp_session) || die "no MCP session; is the server up? ($MCP_URL)"
    body=$(python3 -c 'import json,sys;print(json.dumps({"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":sys.argv[1],"arguments":json.loads(sys.argv[2])}}))' "$tool" "$args" 2>/dev/null) \
        || die "bad JSON arguments: $args"
    out=$(curl -s -X POST "$MCP_URL" \
        -H 'Content-Type: application/json' \
        -H 'Accept: application/json, text/event-stream' \
        -H "Mcp-Session-Id: $sid" -d "$body")
    if [ -z "$out" ] || ! printf '%s' "$out" | grep -q 'data:'; then
        sid=$(mcp_session) || die "session lost and cannot re-initialize"
        out=$(curl -s -X POST "$MCP_URL" \
            -H 'Content-Type: application/json' \
            -H 'Accept: application/json, text/event-stream' \
            -H "Mcp-Session-Id: $sid" -d "$body")
    fi
    printf '%s' "$out"
}

mcp_text() { # unwrap SSE framing -> text content
    python3 -c '
import json,sys
raw=sys.stdin.read()
lines=[l[5:].strip() for l in raw.splitlines() if l.startswith("data:")]
if not lines:
    sys.stdout.write(raw); sys.exit(0)
d=json.loads(lines[-1])
if "error" in d:
    print(json.dumps(d["error"],indent=2)); sys.exit(3)
r=d.get("result") or {}
for c in r.get("content",[]):
    if c.get("type")=="text": print(c.get("text",""))
    else: print(json.dumps(c))
if not r.get("content") and r.get("structuredContent"):
    print(json.dumps(r["structuredContent"]))
if r.get("isError"): sys.exit(3)
'
}

# --- subcommands -------------------------------------------------------------

cmd_status() {
    local ext; ext=$(ext_dir)
    echo "Ghidra snap     : $(readlink -f "$(snap_base)")"
    echo "Extensions dir  : $ext"
    local p="$ext/GhidrAssistMCP"
    if [ -d "$p" ]; then
        ok "extension installed"
        [ -f "$p/Module.manifest" ] || echo "   [!] Module.manifest missing"
        local jar; jar=$(ls "$p"/lib/GhidrAssistMCP-*.jar 2>/dev/null | head -1)
        [ -n "$jar" ] && echo "   jar: $(basename "$jar") ($(stat -c%s "$jar") bytes)" || echo "   [!] no jar in lib/"
        [ -f "$p/ghidra_scripts/GAMCPStartServerScript.java" ] || echo "   [!] headless script missing"
    else
        echo "[!] extension NOT installed at $p"
        echo "    install it: $0 install <GhidrAssistMCP-release.zip>"
    fi
    echo
    if port_up; then
        ok "server listening on 127.0.0.1:8080"
        cmd_probe | sed 's/^/   /'
    else
        echo "[!] nothing listening on 127.0.0.1:8080"
        echo "    start: snap run ghidra   (GUI), or: $0 headless <binary>"
    fi
}

cmd_install() {
    local zip="${1:-}"
    [ -n "$zip" ] || die "usage: $0 install <GhidrAssistMCP-*.zip>"
    [ -f "$zip" ] || die "no such file: $zip"
    local ext; ext=$(ext_dir)
    mkdir -p "$ext" || die "cannot create $ext"
    info "installing into $ext"
    unzip -q -o "$zip" -d "$ext" || die "unzip failed"
    local p="$ext/GhidrAssistMCP"
    [ -f "$p/Module.manifest" ] || die "install incomplete: no Module.manifest"
    local jar; jar=$(ls "$p"/lib/GhidrAssistMCP-*.jar 2>/dev/null | head -1)
    [ -n "$jar" ] || die "install incomplete: no jar in lib/"
    ok "installed $(basename "$jar")"
    echo "    Enable it once: File -> Configure -> Configure Plugins -> GhidrAssistMCP"
}

cmd_headless() {
    local bin="${1:-}"
    [ -n "$bin" ] || die "usage: $0 headless <binary> [project-name] [port]"
    [ -f "$bin" ] || die "no such file: $bin"
    # The snap's private /tmp cannot see host paths outside $HOME.
    case "$(readlink -f "$bin")" in
        "$HOME"/*) : ;;
        *) die "target must live under \$HOME (snap private /tmp): $bin" ;;
    esac
    local proj="${2:-McpHeadless}" port="${3:-8080}"
    local ext; ext=$(ext_dir)
    [ -d "$ext/GhidrAssistMCP" ] || die "extension not installed; run: $0 install <zip>"
    mkdir -p "$(snap_base)/tmp" 2>/dev/null
    mkdir -p "$PROJECT_DIR"
    local prog; prog=$(basename "$bin")

    # PHASE 1 -- import + analyze + SAVE, then exit. save_project over MCP fails
    # in headless mode ("Project controls require the Ghidra GUI project
    # manager"), so without this phase the analysis lives only in memory and is
    # lost the moment the server stops. A later -process run would then abort
    # with "Requested project program file(s) not found".
    info "phase 1/2: import + analyze + save $prog (this can take a while)"
    local log1; log1=$(mktemp "${TMPDIR:-/tmp}/ghidra-import.XXXXXX")
    snap run ghidra.analyzeHeadless "$PROJECT_DIR" "$proj" \
        -import "$bin" \
        -scriptPath "$ext/GhidrAssistMCP/ghidra_scripts" \
        > "$log1" 2>&1
    local rc=$?
    grep -E "ANALYZING|Analysis succeeded|Save succeeded|ERROR|Abort" "$log1" \
        | grep -vE "DWARF un-recoverable|DW_OP_|FileStore" | sed 's/^/    /'
    if [ $rc -ne 0 ] || ! grep -q "Save succeeded" "$log1"; then
        echo "    (full log: $log1)" >&2
        die "phase 1 failed: analysis was not saved"
    fi
    rm -f "$log1"
    ok "analysis saved into $PROJECT_DIR/$proj"

    # PHASE 2 -- serve the saved program. wait=true keeps the JVM alive.
    info "phase 2/2: serving MCP on 127.0.0.1:$port (blocks; Ctrl-C to stop)"
    info "wire it up once in ~/.config/opencode/opencode.jsonc:"
    info '  "ghidra": {"type":"remote","url":"http://127.0.0.1:'"$port"'/mcp","enabled":true,"oauth":false}'
    snap run ghidra.analyzeHeadless "$PROJECT_DIR" "$proj" \
        -process "$prog" \
        -scriptPath "$ext/GhidrAssistMCP/ghidra_scripts" \
        -postScript GAMCPStartServerScript.java "host=127.0.0.1" "port=$port" "wait=true" \
        2>&1 | while IFS= read -r line; do
            case "$line" in
                *"MCP server started"*|*"tools"*|*"MCP endpoint"*|*ERROR*|*Exception*)
                    printf '%s\n' "$line" ;;
            esac
        done
}

cmd_serve() { # serve an already-imported program without re-importing
    local prog="${1:-}" proj="${2:-McpHeadless}" port="${3:-8080}"
    [ -n "$prog" ] || die "usage: $0 serve <program-name> [project-name] [port]"
    local ext; ext=$(ext_dir)
    [ -d "$ext/GhidrAssistMCP" ] || die "extension not installed; run: $0 install <zip>"
    info "serving $prog from $PROJECT_DIR/$proj on 127.0.0.1:$port (blocks)"
    snap run ghidra.analyzeHeadless "$PROJECT_DIR" "$proj" \
        -process "$prog" \
        -scriptPath "$ext/GhidrAssistMCP/ghidra_scripts" \
        -postScript GAMCPStartServerScript.java "host=127.0.0.1" "port=$port" "wait=true"
}

cmd_stop() {
    local pid
    pid=$(ss -ltnp 2>/dev/null | grep ':8080' | grep -oE 'pid=[0-9]+' | cut -d= -f2 | head -1)
    if [ -z "$pid" ]; then info "nothing listening on 8080"; return 0; fi
    info "stopping java pid=$pid (pkill alone can leave the port held)"
    kill -9 "$pid" 2>/dev/null
    pkill -f "analyzeHeadless.*McpHeadless" 2>/dev/null
    sleep 2
    ss -ltn 2>/dev/null | grep -q ':8080' && echo "[!] port still held" || ok "port 8080 free"
}

cmd_probe() {
    local sid
    sid=$(mcp_session) || { echo "[x] handshake failed (is the server running?)"; return 1; }
    # tools/count via a raw tools/list
    local n
    n=$(curl -s -X POST "$MCP_URL" \
        -H 'Content-Type: application/json' \
        -H 'Accept: application/json, text/event-stream' \
        -H "Mcp-Session-Id: $sid" \
        -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
        | python3 -c '
import json,sys
raw=sys.stdin.read()
lines=[l[5:].strip() for l in raw.splitlines() if l.startswith("data:")]
d=json.loads(lines[-1])
print(len(d["result"]["tools"]))' 2>/dev/null)
    echo "MCP handshake   : ok (protocol 2025-11-25)"
    echo "tools advertised: ${n:-?}"
}

cmd_tools() {
    local sid
    sid=$(mcp_session) || die "handshake failed"
    curl -s -X POST "$MCP_URL" \
        -H 'Content-Type: application/json' \
        -H 'Accept: application/json, text/event-stream' \
        -H "Mcp-Session-Id: $sid" \
        -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
        | python3 -c '
import json,sys
raw=sys.stdin.read()
lines=[l[5:].strip() for l in raw.splitlines() if l.startswith("data:")]
for t in sorted(x["name"] for x in json.loads(lines[-1])["result"]["tools"]):
    print(t)'
}

cmd_call() {
    local tool="${1:-}" ; shift || true
    [ -n "$tool" ] || die "usage: $0 call <tool> ['<json args>']"
    mcp_raw "$tool" "${1:-{\}}" | mcp_text
}

case "${1:-status}" in
    status)   cmd_status ;;
    install)  shift; cmd_install "$@" ;;
    headless) shift; cmd_headless "$@" ;;
    serve)    shift; cmd_serve "$@" ;;
    stop)     cmd_stop ;;
    probe)    cmd_probe ;;
    tools)    cmd_tools ;;
    call)     shift; cmd_call "$@" ;;
    -h|--help|help)
        cat <<'USAGE'
ghidra-mcp.sh -- install, start and probe GhidrAssistMCP for Ghidra (snap)

  status              where the extension lives, is the server up, tool count
  install <zip>       install a GhidrAssistMCP release zip into the snap profile
  headless <binary>   import + analyze + SAVE + serve (two phases)
                      [project-name] [port]
  serve <program>     serve an already-imported program, no re-import
                      [project-name] [port]
  stop                kill the server by PID (frees port 8080 reliably)
  probe               MCP handshake against /mcp, print server identity
  tools               dump the tool names the server advertises
  call <tool> [json]  invoke one tool and print its text result

Environment
  GHIDRA_MCP_URL      default http://127.0.0.1:8080/mcp
  GHIDRA_PROJECT_DIR  default ~/ghidra-projects

Gotchas baked in: snap extension path is globbed (never hardcoded); analysis is
saved before serving because headless cannot save_project over MCP; the server
is started with -postScript so analysis completes first; targets must live under
$HOME because the snap has a private /tmp.
USAGE
        ;;
    *) die "unknown subcommand: $1 (try: $0 help)" ;;
esac

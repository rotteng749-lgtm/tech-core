#!/usr/bin/env bash
# REA_Skill + claude-red Unified Skill Installer
# Copies reverse-engineering, recovery, multi-agent & security assessment skills into a target skills directory.
#
# Usage:
#   ./install.sh                                # interactive (asks for target)
#   ./install.sh --target ~/.claude/skills      # explicit target
#   ./install.sh --category web                 # one category only (e.g. rea-core, web, mobile)
#   ./install.sh --target DIR --category web    # combined
#   ./install.sh --list                         # list available categories (25 categories, 100 skills)
#   ./install.sh --dry-run                      # show what would be copied
#
# Default target: ~/.claude/skills/rea-skills

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$SCRIPT_DIR/skills"
DEFAULT_TARGET="${HOME}/.claude/skills/rea-skills"

CATEGORIES=(
  rea-core agent-ecosystem web auth active-directory wireless cloud mobile
  iot infrastructure exploit-dev fuzzing recon api container cicd crypto
  privesc post-exploitation forensics supply-chain social-engineering
  network ai utility
)

TARGET=""
CATEGORY=""
DRY_RUN=0
LIST_ONLY=0

usage() {
  sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'
  exit "${1:-0}"
}

list_categories() {
  echo "Available categories (25 categories, 100 skills):"
  for name in "${CATEGORIES[@]}"; do
    d="$SKILLS_DIR/$name"
    [ -d "$d" ] || continue
    count=$(find "$d" -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')
    printf "  %-22s %s skill(s)\n" "$name" "$count"
  done
}

while [ $# -gt 0 ]; do
  case "$1" in
    --target)   TARGET="$2"; shift 2 ;;
    --category) CATEGORY="$2"; shift 2 ;;
    --dry-run)  DRY_RUN=1; shift ;;
    --list)     LIST_ONLY=1; shift ;;
    -h|--help)  usage 0 ;;
    *)          echo "Unknown option: $1" >&2; usage 1 ;;
  esac
done

if [ "$LIST_ONLY" -eq 1 ]; then
  list_categories
  exit 0
fi

if [ -z "$TARGET" ]; then
  read -r -p "Target directory [$DEFAULT_TARGET]: " input
  TARGET="${input:-$DEFAULT_TARGET}"
fi

if [ -n "$CATEGORY" ]; then
  SRC="$SKILLS_DIR/$CATEGORY"
  if [ ! -d "$SRC" ]; then
    echo "Error: unknown category '$CATEGORY'" >&2
    list_categories >&2
    exit 1
  fi
  DEST="$TARGET/$CATEGORY"
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "[dry-run] Would copy $SRC -> $DEST"
  else
    mkdir -p "$DEST"
    cp -R "$SRC"/. "$DEST"/
    echo "Installed category '$CATEGORY' to $DEST"
  fi
else
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "[dry-run] Would copy all 25 categories from $SKILLS_DIR -> $TARGET"
  else
    mkdir -p "$TARGET"
    for name in "${CATEGORIES[@]}"; do
      [ -d "$SKILLS_DIR/$name" ] && cp -R "$SKILLS_DIR/$name" "$TARGET/"
    done
    echo "Installed all 25 categories (100 skills) to $TARGET"
  fi
fi

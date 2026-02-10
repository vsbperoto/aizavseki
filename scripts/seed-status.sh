#!/bin/bash
# AiZaVseki Seed Status Monitor
# Reads JSONL progress files and shows aggregated status

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/tasks/seed/logs"

if [ ! -d "$LOG_DIR" ]; then
  echo "No logs directory found at $LOG_DIR"
  exit 1
fi

echo "=========================================="
echo "  AiZaVseki Seed Status"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""

TOTAL_SUCCESS=0
TOTAL_FAILED=0

for logfile in "$LOG_DIR"/agent-*.jsonl; do
  [ -f "$logfile" ] || continue

  AGENT_NAME=$(basename "$logfile" .jsonl)
  SUCCESS=$(grep -c '"status":"success"' "$logfile" 2>/dev/null || echo 0)
  FAILED=$(grep -c '"status":"failed"' "$logfile" 2>/dev/null || echo 0)
  TOTAL=$((SUCCESS + FAILED))

  TOTAL_SUCCESS=$((TOTAL_SUCCESS + SUCCESS))
  TOTAL_FAILED=$((TOTAL_FAILED + FAILED))

  echo "  $AGENT_NAME: $SUCCESS success / $FAILED failed / $TOTAL total"

  # Show last 3 entries
  if [ $TOTAL -gt 0 ]; then
    echo "    Last 3:"
    tail -3 "$logfile" | while read -r line; do
      SLUG=$(echo "$line" | jq -r '.slug // "unknown"' 2>/dev/null || echo "parse-error")
      STATUS=$(echo "$line" | jq -r '.status // "unknown"' 2>/dev/null || echo "parse-error")
      echo "      $STATUS: $SLUG"
    done
  fi
  echo ""
done

GRAND_TOTAL=$((TOTAL_SUCCESS + TOTAL_FAILED))

echo "=========================================="
echo "  TOTAL: $TOTAL_SUCCESS success / $TOTAL_FAILED failed / $GRAND_TOTAL processed"
echo "  Remaining: $((333 - GRAND_TOTAL)) / 333"
echo "=========================================="

# Check tmux sessions
echo ""
echo "Active tmux sessions:"
tmux ls 2>/dev/null | grep "aizavseki-agent" || echo "  (none running)"

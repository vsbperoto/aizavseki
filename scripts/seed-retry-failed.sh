#!/bin/bash
# AiZaVseki Seed Retry — Collects failed topics and relaunches a single agent

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SEED_DIR="$PROJECT_DIR/tasks/seed"
LOG_DIR="$SEED_DIR/logs"
TOPIC_MAP="$SEED_DIR/topic-map.json"
RETRY_BATCH="$SEED_DIR/batch-retry.json"

if [ -z "${WEBHOOK_SECRET:-}" ]; then
  echo "ERROR: WEBHOOK_SECRET env var not set"
  exit 1
fi

# Collect failed IDs from all agent logs
FAILED_IDS=""
for logfile in "$LOG_DIR"/agent-*.jsonl; do
  [ -f "$logfile" ] || continue
  IDS=$(grep '"status":"failed"' "$logfile" | jq -r '.id' 2>/dev/null || true)
  FAILED_IDS="$FAILED_IDS $IDS"
done

# Deduplicate and sort
FAILED_IDS=$(echo "$FAILED_IDS" | tr ' ' '\n' | sort -n | uniq | grep -v '^$')
FAILED_COUNT=$(echo "$FAILED_IDS" | wc -l | tr -d ' ')

if [ "$FAILED_COUNT" -eq 0 ] || [ -z "$FAILED_IDS" ]; then
  echo "No failed topics found. All good!"
  exit 0
fi

echo "Found $FAILED_COUNT failed topics. Creating retry batch..."

# Build jq filter for failed IDs
JQ_FILTER=$(echo "$FAILED_IDS" | awk '{printf ".id == %s or ", $1}' | sed 's/ or $//')
jq "[.[] | select($JQ_FILTER)]" "$TOPIC_MAP" > "$RETRY_BATCH"

RETRY_COUNT=$(jq length "$RETRY_BATCH")
echo "Retry batch: $RETRY_COUNT topics → $RETRY_BATCH"

# Launch retry agent
SESSION_NAME="aizavseki-agent-retry"
tmux kill-session -t "$SESSION_NAME" 2>/dev/null || true

tmux new-session -d -s "$SESSION_NAME" \
  "cd '$PROJECT_DIR' && \
  WEBHOOK_SECRET='$WEBHOOK_SECRET' \
  codex --approval-mode full-auto \
  'You are the retry agent for AiZaVseki resource seeding.

Read the agent instructions at tasks/seed/agent-prompt.md for full details.

Your batch file is at tasks/seed/batch-retry.json ($RETRY_COUNT topics that previously failed).
Log progress to tasks/seed/logs/agent-retry.jsonl

WEBHOOK_SECRET is available as env var: \$WEBHOOK_SECRET
Webhook URL: https://aizavseki.eu/api/webhook/resources

Process all $RETRY_COUNT topics. For each:
1. Read the topic from batch-retry.json
2. Generate a high-quality Bulgarian article
3. POST to the webhook
4. Log results
5. If a topic fails again, log it and continue

Start now.' \
  2>&1 | tee '$LOG_DIR/agent-retry.log'"

echo ""
echo "Retry agent launched in tmux session: $SESSION_NAME"
echo "  Attach: tmux attach -t $SESSION_NAME"
echo "  Status: ./scripts/seed-status.sh"

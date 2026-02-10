#!/bin/bash
# AiZaVseki Resource Seeding Orchestrator
# Splits topic-map.json into batches and launches parallel Codex agents
#
# Usage: ./scripts/seed-orchestrator.sh [START] [END] [AGENTS]
#   START  - First topic ID (default: 1)
#   END    - Last topic ID (default: 333)
#   AGENTS - Number of parallel agents (default: 4)
#
# Prerequisites:
#   - codex CLI installed and authenticated
#   - tmux installed
#   - WEBHOOK_SECRET env var set
#   - topic-map.json generated

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SEED_DIR="$PROJECT_DIR/tasks/seed"
LOG_DIR="$SEED_DIR/logs"
TOPIC_MAP="$SEED_DIR/topic-map.json"
AGENT_PROMPT="$SEED_DIR/agent-prompt.md"

START=${1:-1}
END=${2:-333}
NUM_AGENTS=${3:-4}

# Validate prerequisites
if [ ! -f "$TOPIC_MAP" ]; then
  echo "ERROR: topic-map.json not found at $TOPIC_MAP"
  exit 1
fi

if [ ! -f "$AGENT_PROMPT" ]; then
  echo "ERROR: agent-prompt.md not found at $AGENT_PROMPT"
  exit 1
fi

if [ -z "${WEBHOOK_SECRET:-}" ]; then
  echo "ERROR: WEBHOOK_SECRET env var not set"
  echo "  export WEBHOOK_SECRET='your-secret-here'"
  exit 1
fi

if ! command -v codex &>/dev/null; then
  echo "ERROR: codex CLI not found. Install it first."
  exit 1
fi

if ! command -v tmux &>/dev/null; then
  echo "ERROR: tmux not found. Install it: sudo apt install tmux"
  exit 1
fi

if ! command -v jq &>/dev/null; then
  echo "ERROR: jq not found. Install it: sudo apt install jq"
  exit 1
fi

# Create log directory
mkdir -p "$LOG_DIR"

# Calculate batch sizes
TOTAL=$((END - START + 1))
BATCH_SIZE=$(( (TOTAL + NUM_AGENTS - 1) / NUM_AGENTS ))

echo "=========================================="
echo "  AiZaVseki Resource Seeding Orchestrator"
echo "=========================================="
echo "Topics:  $START - $END ($TOTAL total)"
echo "Agents:  $NUM_AGENTS"
echo "Batch:   ~$BATCH_SIZE topics per agent"
echo "Webhook: https://aizavseki.eu/api/webhook/resources"
echo "=========================================="
echo ""

# Split topic map into batches
for i in $(seq 1 $NUM_AGENTS); do
  BATCH_START=$(( START + (i - 1) * BATCH_SIZE ))
  BATCH_END=$(( BATCH_START + BATCH_SIZE - 1 ))

  # Clamp to END
  if [ $BATCH_END -gt $END ]; then
    BATCH_END=$END
  fi

  # Skip if batch start exceeds end
  if [ $BATCH_START -gt $END ]; then
    continue
  fi

  BATCH_FILE="$SEED_DIR/batch-$i.json"

  # Extract topics for this batch
  jq "[.[] | select(.id >= $BATCH_START and .id <= $BATCH_END)]" "$TOPIC_MAP" > "$BATCH_FILE"
  BATCH_COUNT=$(jq length "$BATCH_FILE")

  echo "Agent $i: topics $BATCH_START-$BATCH_END ($BATCH_COUNT topics) → $BATCH_FILE"

  SESSION_NAME="aizavseki-agent-$i"

  # Kill existing session if any
  tmux kill-session -t "$SESSION_NAME" 2>/dev/null || true

  # Create tmux session and launch codex
  tmux new-session -d -s "$SESSION_NAME" \
    "cd '$PROJECT_DIR' && \
    WEBHOOK_SECRET='$WEBHOOK_SECRET' \
    codex --approval-mode full-auto \
    'You are Agent $i of $NUM_AGENTS for AiZaVseki resource seeding.

Read the agent instructions at tasks/seed/agent-prompt.md for full details.

Your batch file is at tasks/seed/batch-$i.json (topics $BATCH_START to $BATCH_END, $BATCH_COUNT topics).
Log progress to tasks/seed/logs/agent-$i.jsonl

WEBHOOK_SECRET is available as env var: \$WEBHOOK_SECRET
Webhook URL: https://aizavseki.eu/api/webhook/resources

For each topic in your batch:
1. Read the topic from batch-$i.json
2. Generate a high-quality Bulgarian article (1500-2200 words) following the content structure in agent-prompt.md
3. POST the JSON payload to the webhook with Authorization: Bearer \$WEBHOOK_SECRET
4. Log success/failure to tasks/seed/logs/agent-$i.jsonl
5. Continue to the next topic regardless of errors

Start now. Process all $BATCH_COUNT topics sequentially.' \
    2>&1 | tee '$LOG_DIR/agent-$i.log'"

  echo "  → tmux session: $SESSION_NAME"
done

echo ""
echo "=========================================="
echo "  All agents launched!"
echo "=========================================="
echo ""
echo "Monitor progress:"
echo "  ./scripts/seed-status.sh"
echo ""
echo "Attach to agent:"
echo "  tmux attach -t aizavseki-agent-1"
echo ""
echo "List sessions:"
echo "  tmux ls"
echo ""
echo "Kill all:"
echo "  for i in \$(seq 1 $NUM_AGENTS); do tmux kill-session -t aizavseki-agent-\$i 2>/dev/null; done"

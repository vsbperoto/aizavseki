# aizavseki monorepo

This repository is an npm workspaces monorepo with two Next.js apps:

- `apps/web` - main website (`aizavseki.eu`)
- `apps/agent` - standalone AI agent UI (`agent.aizavseki.eu`)

## Requirements

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev:web
npm run dev:agent
```

## Build and lint

```bash
npm run build:web
npm run build:agent
npm run lint:web
npm run lint:agent
```

## Vercel setup

Configure two projects from this same repository:

1. Main website project:
   - Root Directory: `apps/web`
2. Agent UI project:
   - Root Directory: `apps/agent`
   - Domain: `agent.aizavseki.eu`

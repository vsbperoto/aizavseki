# OpenClaw Agent Setup - Master Log & Memory

**Date Recorded:** February 25, 2026
**Project:** aizavseki.eu / AI Content Agent Workflow
**Current Status:** Phase 1 Complete (Infrastructure Setup & Basic Connectivity)

---

## UPDATE: 2026-02-25 (Agent Chat Live + Gemini Runtime Auth)

### What changed
- Implemented live chat transport in `apps/agent`:
  - Added server route `apps/agent/src/app/api/chat/route.ts` (POST).
  - Route forwards messages to OpenClaw OpenAI-compatible endpoint (`/v1/chat/completions`) using server-side env vars.
  - Updated `apps/agent/src/app/page.tsx` to a working multi-session chat UI (send/receive, local history, session switching).
- Fixed backend TLS for API subdomain:
  - Nginx/certificate corrected so `api.agent.aizavseki.eu` serves a valid cert for the API host.
- Configured OpenClaw model stack for content workflows:
  - Default model: `google/gemini-3-flash-preview`
  - Fallback: `google/gemini-3-pro-preview`
  - Image model: `google/gemini-3-pro-image-preview` (Nano Banana Pro path)
  - Image fallback: `google/gemini-2.5-flash-image-preview` (Nano Banana path)
- Added VM runtime auth via OpenClaw state `.env`:
  - `GEMINI_API_KEY` configured on the VM (masked; not logged in plaintext here).

### Live verification
- `openclaw models status` now resolves Google auth from env and shows configured model/image defaults.
- Live API smoke test succeeded:
  - `POST https://api.agent.aizavseki.eu/v1/chat/completions`
  - Response returned `READY_OK` from `openclaw:main`.

### Current status
- Chat backend is now live and responding through OpenClaw + Gemini.
- `apps/agent` frontend route is ready to consume this endpoint once Vercel env vars are set for the agent project.

### Remaining item for full "content creator" scope
- Dedicated Veo 3.1 generation flow is not yet wired as a first-class tool/skill in this repo.
- Next step is a custom skill/tool endpoint for video generation (Veo), then exposing it in agent prompts/UI actions.

## UPDATE: 2026-02-25 (Monorepo Split + Production Domain Finalization)

### What changed
- The `aizavseki` repository was converted into an npm workspaces monorepo.
- Frontend is now split into two deployable apps:
  - `apps/web` (main site)
  - `apps/agent` (standalone agent UI)
- Removed old subdomain rewrite logic in `web` middleware.
- Added permanent redirects from `https://aizavseki.eu/agent` to `https://agent.aizavseki.eu`.
- Build and lint checks passed after migration (`web` and `agent` builds pass; `web` lint has warnings only).
- Commit with monorepo split and fixes: `059ce9f` (pushed to `master`).

### Current production domain model
- `aizavseki.eu` -> Vercel web project (`apps/web`)
- `www.aizavseki.eu` -> Vercel web project (`apps/web`)
- `agent.aizavseki.eu` -> Vercel agent project (`apps/agent`)
- `api.agent.aizavseki.eu` -> GCP VM (`34.179.162.48`) for OpenClaw backend/WebSocket

### DNS (final expected records)
- `A @` -> `76.76.21.21`
- `CNAME www` -> `c9cb24517be55fd0.vercel-dns-017.com`
- `CNAME agent` -> `c9cb24517be55fd0.vercel-dns-017.com`
- `A api.agent` -> `34.179.162.48`

### Architecture decision for OpenClaw codebase
- Do not place the full OpenClaw repository under `apps/`.
- If consolidated into this monorepo, place it under `services/openclaw` (backend service), not `apps/*`.
- Preferred options:
  1. Keep OpenClaw as a separate repository (cleanest deployment boundary).
  2. Import OpenClaw into `services/openclaw` using `git subtree` (recommended over copying a nested `.git` repo).
  3. Use a git submodule only if the team is comfortable with submodule workflow overhead.

### Next recommended step
- Start custom-agent backend work in OpenClaw:
  - model defaults
  - tool/skill wiring
  - auth and tenant boundaries
  - API contract for `apps/agent`

## 🏗️ 1. Infrastructure Infrastructure
- **Cloud Provider:** Google Cloud Platform (GCP)
- **VM Instance Name:** `content-agent`
- **Zone:** `europe-west3-a` (Frankfurt)
- **External IP Address:** `34.179.162.48`
- **Operating System:** Ubuntu 22.04 LTS
- **Core Software Installed:** 
  - Docker v28.2.2 & `docker-compose`
  - Nginx (Reverse Proxy)
  - Certbot (Let's Encrypt SSL)

## 🌐 2. Networking & Domain Configuration
- **Domain:** `agent.aizavseki.eu`
- **DNS Host:** Namecheap (A Record `agent` -> `34.179.162.48`)
- **GCP Firewall Rules Created:**
  - `allow-openclaw` (TCP: 3000) - Initially used for direct testing.
  - `allow-http-https` (TCP: 80, 443) - For Nginx & SSL.

## 🤖 3. OpenClaw Deployment Details
- **Docker Image:** `alpine/openclaw:latest`
- **Data Volume:** `~/openclaw-data` mapped to `/home/node/.openclaw` (Contains `openclaw.json` & persists agent state).
- **Run Configuration:** 
  Deployed using `--network=host` to bypass Docker mapping limitations and bind directly to the machine's ports to resolve WebSocket blocking issues.
  
  ```bash
  docker run -d --name openclaw --network=host \
    -e OPENCLAW_GATEWAY_BIND=lan \
    -e OPENCLAW_DANGEROUSLY_DISABLE_DEVICE_AUTH=true \
    -e DANGEROUSLY_DISABLE_DEVICE_AUTH=true \
    -v ~/openclaw-data:/home/node/.openclaw \
    alpine/openclaw:latest
  ```

## 🔐 4. Authentication & Reverse Proxy
- **Web Server Interface:** The raw server runs internally on `ws://127.0.0.1:18789`.
- **Nginx Configuration:** Proxies traffic from `https://agent.aizavseki.eu` directly to `127.0.0.1:18789`. Handles standard HTTP/1.1 Upgrade requests so WebSockets work natively.
- **SSL:** Authorized and deployed automatically via Certbot for `agent.aizavseki.eu`.
- **Security Bypass (Device Pairing):** The OpenClaw interface natively enforces a strict "device pairing" sequence (Error code `1008: device identity required`). Because of strict origin validation over the Nginx proxy, we:
  1. Disabled strict pairing via environment variables.
  2. Initially connected by passing the gateway token natively inside the URL.
  
- **Admin Gateway Token:** `5bfa77f7a677b07fd180030301b1e463d5c1d9c7549cfe33`
- **Dashboard Access URL (Fallback for new devices):** 
  `https://agent.aizavseki.eu/?token=5bfa77f7a677b07fd180030301b1e463d5c1d9c7549cfe33`

---

## 🚀 5. Next Steps / Phase 2 (Development & Customization)

The current dashboard is the **OpenClaw Administrator Gateway**, designed for managing fleets of agents. The ultimate goal is a fully white-labeled, customer-facing system similar to `agent.minimax.io`.

## 🏗️ 5. CI/CD & Auto-Deploy Setup (Complete)
- **Local Repository:** OpenClaw was forked and cloned to `C:\Users\PC INTEL I7 13700F\Peroto Projects\openclaw`.
- **GitHub Actions:** Added `.github/workflows/deploy.yml` that builds a custom Docker image and pushes it to Github Container Registry whenever changes are pushed to `main`.
- **Watchtower (GCP VM):** Installed a Watchtower Docker container on the VM pulling from the container registry every 60 seconds to automatically restart the OpenClaw container if the `latest` image changes.
   ```bash
   docker run -d --name watchtower -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower openclaw --interval 60 --cleanup
   ```

## 🚀 6. Next Steps / Current Goals
1. **Frontend UI Complete (Vercel Integration):**
   - The user-facing conversational UI was built cleanly into the `aizavseki` web app (`src/app/agent/page.tsx`).
   - Rather than creating a monorepo, a multi-tenant DNS setup was deployed:
     - `agent.aizavseki.eu` (A Record) points to **Vercel** (`76.76.21.21`). Next.js `middleware.ts` intercepts requests to this subdomain and silently serves the `/agent` page.
     - `api.agent.aizavseki.eu` (A Record) points to the **GCP VM** (`34.179.162.48`), which acts as the secret backend engine for WebSocket connectivity (`wss://api.agent.aizavseki.eu/api/v1/ws`).

2. **Modify OpenClaw Local Codebase (NEXT STEP):**
   - Change the primary underlying model. OpenClaw defaults to Anthropic's `claude-opus-4-6`. Search the `openclaw` codebase (likely in `src/config/defaults.ts` and `src/agents/defaults.ts`) to inject the official **Google GenAI models** (Gemini, Veo, Imagen).
   - Write/Enable any custom native skills needed for content creation.
   - Commit and push to `main` so the deployment pipeline pushes the custom backend live via Watchtower.
   - NOTE: **You do not need to update SSH keys to the VM** since GitHub Actions and Watchtower completely automate deployment now! You just push code to Github!

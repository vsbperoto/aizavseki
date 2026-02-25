# OpenClaw Agent Setup - Master Log & Memory

**Date Recorded:** February 25, 2026
**Project:** aizavseki.eu / AI Content Agent Workflow
**Current Status:** Phase 1 Complete (Infrastructure Setup & Basic Connectivity)

---

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
1. **Modify OpenClaw Local Codebase:**
   - Change the primary underlying model. OpenClaw defaults to Anthropic's `claude-opus-4-6`. Search the codebase (likely in `src/config/defaults.ts` and `src/agents/defaults.ts`) to inject the official **Google GenAI models** (Gemini, Veo, Imagen).
   - Write/Enable any custom native skills needed for content creation.
   - Commit and push to `main` so the deployment pipeline pushes the custom backend live.
2. **Custom "Next.js" Frontend (Vercel):**
   - The user-facing conversational UI needs to be built inside the `aizavseki` web app.
   - Using standard WebSockets, connect the sleek frontend to `wss://agent.aizavseki.eu/api/v1/ws` behind the scenes to completely hide OpenClaw's metadata and complex session IDs from the user's browser toolbar.

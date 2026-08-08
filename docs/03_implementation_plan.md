# Implementation Plan — Human-Centered AI for Rural Communities (PS07)

Read `01_project_idea.md` and `02_architecture.md` first — this file assumes those scoping and tooling decisions and turns them into an hour-by-hour build order. Build order is **backend first → web frontend → app (PWA) frontend**, as requested, with a short parallel-work window explained in Section 6.

Assumed team size: **4 people**. If you're 2 or 3, drop the "stretch" rows in Section 6 first, not the MVP rows.

---

## 1. Repo & folder structure

Keep **backend** and **frontend** as the two primary top-level directories (this makes deployment trivial — each has its own build command and its own host). The app lives alongside frontend since it's also a Vite/React project, just a separate deployable.

- `hello/`
  - `backend/`
    - `src/`
      - `config/` — env loading, DB connection, API client setup (Gemini, Bhashini, data.gov.in)
      - `models/` — Mongo schemas (see Section 2)
      - `routes/` — Express route definitions, grouped by feature
      - `controllers/` — request handling logic per route
      - `services/` — the actual integration logic: `llmService`, `speechService`, `mandiPriceService`, `weatherService`, `privacyMaskService`, `promptEnhanceService`, `cacheRefreshJob`
      - `middleware/` — CORS, rate limiting, error handling
      - `utils/` — shared helpers
      - `server.js` — app entry point
    - `.env.example` — every required key, with a placeholder, so teammates know what to fill in
    - `package.json`
    - `README.md` — how to run locally
  - `frontend/` — the **web dashboard** (laptop/CSC users)
    - `src/`
      - `components/` — shared UI pieces (voice recorder, chat bubble, language selector, price card, etc.)
      - `pages/` — one file per page, see Section 4
      - `hooks/` — e.g. `useVoiceInput`, `useOfflineStatus`
      - `services/` — API client wrapper functions calling the backend
      - `locales/` — UI string translations per supported language
      - `App.jsx`, `main.jsx`
    - `public/`
    - `index.html`, `package.json`, `vite.config.js`
  - `app/` — the **PWA** (mic + camera minimal client)
    - `src/`
      - `components/` — `MicButton`, `CameraButton`, `ResponseBubble`, `OfflineBanner`
      - `services/` — API client wrapper + `localModelService` (WebLLM) + `offlineCacheService`
      - `App.jsx`, `main.jsx`
    - `public/`
      - `manifest.json` — PWA install manifest
      - `service-worker.js` — offline caching logic
    - `package.json`, `vite.config.js`
  - `docs/` — this file, the architecture doc, and the project idea doc, so they travel with the repo
  - `README.md` — top-level: what this is, how to run all three parts, links to `docs/`

---

## 2. Database setup (MongoDB Atlas, free M0 cluster)

**Setup steps:**
1. Create a free account at mongodb.com/atlas.
2. Create a new Project, then "Build a Database" → select the **Free (M0)** tier → pick the region closest to you → create.
3. Create a database user (username + auto-generated password — save it somewhere your whole team can access, e.g., a shared `.env` you don't commit).
4. Under Network Access, add `0.0.0.0/0` for the hackathon (allow from anywhere) — fine for a time-boxed prototype, **not** something to leave on a real production system.
5. Get the connection string from the "Connect" button → "Drivers" → copy it into `backend/.env` as `MONGODB_URI`.

**Collections to create** (Mongo creates them automatically on first write, but plan the fields up front so every teammate uses the same shape):

| Collection | Key fields | Purpose |
|---|---|---|
| `users` | `_id`, `displayName` (optional), `preferredLanguage`, `location: {state, district, village}`, `role` (farmer / parent / dairy / csc_operator), `createdAt` | Minimal identity — for a prototype, an anonymous device/session ID is enough; don't build real auth unless you have spare hours |
| `queries` | `_id`, `userId`, `domain` (agriculture / education / schemes / dairy), `inputType` (voice/text/image), `transcript`, `detectedLanguage`, `responseText`, `wasOffline` (bool), `createdAt` | Every question asked and answered — powers query history and gives you real demo data to show |
| `market_price_cache` | `commodity`, `marketName`, `state`, `district`, `minPrice`, `maxPrice`, `modalPrice`, `fetchedAt` | Populated by the scheduled refresh job from the Agmarknet API; this is the "last known good" data used in degraded/offline mode |
| `weather_cache` | `locationKey`, `tempC`, `condition`, `forecastSummary`, `fetchedAt` | Same pattern, from Open-Meteo |
| `schemes` | `_id`, `name`, `domain`, `eligibilityText`, `benefitText`, `applyLink`, `helplineNumber`, `translations: {hi, mr, ...}` | Your hand-curated 12–15 real government schemes |
| `directory` | `_id`, `type` (KCC / CSC / SHG), `name`, `phone`, `address`, `district`, `lat`, `lng` | Seeded with real entries — e.g. Kisan Call Centre, 1800-180-1551, all-India |
| `community_posts` | `_id`, `userId` (optional/anonymous), `domain`, `questionText`, `language`, `answers: [{text, authorId, upvotes}]`, `location: {district, village}`, `createdAt` | Powers the Community Board page |

**Indexes worth adding once the shape is stable:** an index on `market_price_cache.commodity` + `district`, and on `schemes.domain`, so lookups stay fast without any real optimization work.

**Seed data:** before frontend work starts, get at least: 10–15 real schemes, 8–10 real directory entries, and a handful of sample market-price rows (pulled once from the live Agmarknet API and stored) into the database — this unblocks frontend developers from needing the live external APIs working to build UI against real-shaped data.

---

## 3. Backend build plan

### 3.1 API endpoints to build (contract first — freeze this before frontend work starts)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/query` | Main advisory endpoint: takes `{text or audio, domain, language, userId}`, runs privacy-mask → prompt-enhance → context retrieval (mandi/weather/schemes as relevant) → Gemini call → (optional) Bhashini TTS, returns the answer |
| `POST` | `/api/query/image` | Crop-photo advisory: takes an image + optional text, returns Gemini vision analysis and follow-up questions |
| `GET` | `/api/mandi-prices` | Query params: commodity, district — returns live price if reachable, else the cached value with a `stale: true` flag and `fetchedAt` timestamp |
| `GET` | `/api/weather` | Query params: lat, lng — same live-or-cached pattern |
| `GET` | `/api/schemes` | Query params: domain — returns matching scheme entries |
| `GET` | `/api/directory` | Query params: type, district — returns KCC/CSC/SHG entries |
| `GET`/`POST` | `/api/community` | List and create community board posts/answers |
| `POST` | `/api/form-fill` | Slot-filling dialogue endpoint for the voice form-filling feature — takes the form definition + conversation-so-far, returns the next question or the completed field set |
| `GET` | `/api/health` | Simple health check — also useful for keeping the Render free instance "warm" before a demo, see Section 7 |

### 3.2 Build order (with Antigravity task prompts)

Antigravity works best when you give it a clear, task-level goal and let it plan, scaffold, and browser/curl-verify — rather than asking for one file at a time. Suggested sequence of prompts to give the agent (adapt wording to your stack choice):

1. *"Scaffold a Node.js + Express backend in `/backend` with the folder structure in `docs/03_implementation_plan.md` Section 1, a MongoDB connection using the URI from `.env`, and a `/api/health` endpoint that confirms the DB connection. Verify it runs and responds."*
2. *"Add Mongoose models for the collections described in Section 2 of the implementation plan doc, matching the fields listed there."*
3. *"Implement `/api/schemes` and `/api/directory` as simple read endpoints over the `schemes` and `directory` collections, with filtering by the query params described in Section 3.1. Verify with curl against seeded data."*
4. *"Implement a `weatherService` that calls Open-Meteo for a given lat/lng, and a `mandiPriceService` that calls the data.gov.in Agmarknet resource API for a given commodity/district, using the key in `.env`. Wire both into `/api/weather` and `/api/mandi-prices`, each falling back to the corresponding `_cache` collection with a `stale: true` flag if the live call fails or times out after 3 seconds."*
5. *"Add a scheduled job (every 15 minutes) that refreshes `market_price_cache` and `weather_cache` for a small fixed list of demo commodities/locations, so the cache is always warm."*
6. *"Implement `llmService` calling the Gemini API (Flash model) with a system prompt that does prompt-enhancement, then produces a grounded answer given the user's question, chosen domain, and any retrieved context (weather/price/scheme data passed in). Wire it into `POST /api/query`."*
7. *"Add a `privacyMaskService` that regex-masks phone-number-, Aadhaar-, and bank-account-shaped digit sequences from incoming text before it reaches `llmService`, and returns a flag so the frontend can show the 'we removed a number' note."*
8. *"Implement `POST /api/query/image` using Gemini's vision capability: accept an uploaded image plus optional text, return an analysis and 2-3 follow-up questions."*
9. *"Integrate Bhashini: add a `speechService` with functions for ASR (audio → text) and TTS (text → audio) for a given language, using the registered ULCA pipeline. Wire an optional audio path into `/api/query` so the client can send audio instead of text and get audio back."*
10. *"Implement `/api/community` (GET list, POST new post/answer) and `/api/form-fill` (slot-filling: given a form definition and conversation history, return the next missing field's question, or the completed field set once all are answered)."*

**Verification checkpoint before moving to frontend:** every endpoint above returns correct data via curl/Postman against the seeded database, and the Gemini + Bhashini keys are confirmed working with one real end-to-end call each.

---

## 4. Web frontend build plan

### 4.1 Pages (7 total — keep it to this list; resist adding more mid-build)

| # | Page | Purpose | MVP? |
|---|---|---|---|
| 1 | **Home / Language & Domain select** | First screen: pick language, pick a domain (Agriculture / Education), enter the advisory workspace | 🟢 |
| 2 | **Advisory Workspace** | The core chat-style UI: voice or typed input, prompt-enhance preview, response with sources (e.g. "price as of...") | 🟢 |
| 3 | **Domain Dashboard** | A per-domain view of relevant live data — e.g. for Agriculture, a small table/chart of nearby mandi prices and today's weather | 🟢 |
| 4 | **Community Board** | List of posted questions per domain/district, with answers and upvotes; a form to post a new question | 🟢 |
| 5 | **Nearby Services Directory** | Searchable list + map (Leaflet) of KCC/CSC/SHG contacts by district | 🟢 |
| 6 | **Settings / Accessibility** | Language preference, font size, and a visible "offline data last synced at..." status | 🟡 |
| 7 | **About / How it works** | One static page explaining the project — mainly for judges evaluating outside the live demo | 🟡 |

### 4.2 Build order (Antigravity prompts)

1. *"Scaffold a React + Vite app in `/frontend` with routing for the 7 pages listed in `docs/03_implementation_plan.md` Section 4.1, and a shared API client in `src/services` pointing at the backend's base URL from an env var."*
2. *"Build the Home page: language selector (list from `src/locales`), domain selector (Agriculture / Education), and a 'start' action that routes to the Advisory Workspace with the chosen language/domain in state."*
3. *"Build the Advisory Workspace page: a text input plus a voice-record button (Web Speech API for now), submitting to `POST /api/query`, showing the prompt-enhance preview line, and rendering the response text with a 'read aloud' button (browser speech synthesis for now)."*
4. *"Build the Domain Dashboard page: fetch and display nearby mandi prices from `GET /api/mandi-prices` and weather from `GET /api/weather` for the selected domain/location, clearly showing a 'stale data' badge when the API response has `stale: true`."*
5. *"Build the Community Board page: list posts from `GET /api/community` filtered by domain, a form to submit a new question via `POST /api/community`, and an upvote action on answers."*
6. *"Build the Nearby Services Directory page: fetch from `GET /api/directory`, render as a list and on a Leaflet map using each entry's lat/lng."*
7. *"Build the Settings page with a font-size control (applies a CSS variable app-wide) and a language switcher; build the About page as static content."*
8. *"Swap the Advisory Workspace's Web Speech API calls for the backend's Bhashini-powered audio endpoints, so voice input/output goes through the real Indian-language pipeline instead of the browser fallback."*

**Verification checkpoint:** a full flow — choose language/domain, ask a real voice question, see a grounded answer with prompt-enhance shown, see it appear in Community Board and query history — works end to end against the deployed (or local) backend.

---

## 5. App (PWA) build plan

### 5.1 Screens (deliberately few)

| Screen | Purpose | MVP? |
|---|---|---|
| **Home** | Mic button + camera button, nothing else visible by default | 🟢 |
| **Listening/Response overlay** | Shown after tapping mic: transcript, then the spoken-back answer, large text | 🟢 |
| **Photo advisory flow** | Camera capture → follow-up questions asked one at a time by voice → final recommendation | 🟢 |
| **Offline banner/state** | A small persistent indicator when offline, plus the "answered from local knowledge" note when a query is served by the fallback path | 🟢 |
| **Settings (minimal)** | Just language + font size, reachable via a small icon, not front-and-center | 🟡 |
| **"Help me" screenshot flow** | Voice command triggers a screenshot capture sent for one-shot AI analysis | 🟡 |

### 5.2 Build order (Antigravity prompts)

1. *"Scaffold a second React + Vite app in `/app` with a PWA manifest and service worker for offline asset caching, sharing the same API client pattern as `/frontend`."*
2. *"Build the Home screen: a large mic button and a large camera button only, per the minimal design described in `docs/01_project_idea.md` Section 6. Tapping mic starts recording and routes to the Listening/Response overlay."*
3. *"Wire the mic flow to `POST /api/query` with audio, showing the transcript once returned, then the spoken response, with a loading state in between."*
4. *"Implement the 'I can't see the text properly' voice command: detect this specific phrase in the transcript before sending to the backend, and if matched, increase the app-wide font size instead of making a query."*
5. *"Build the photo advisory flow: camera capture → send to `POST /api/query/image` → render the returned follow-up questions one at a time, capturing each spoken answer, then show the final recommendation."*
6. *"Implement `offlineCacheService`: on each successful online query, cache the relevant response data (mandi prices, weather, scheme facts touched) into IndexedDB via the service worker. Detect offline state (`navigator.onLine` plus a failed fetch as a backup check) and show the offline banner."*
7. *"Integrate WebLLM: load a small quantized model (e.g. Qwen2.5-0.5B-Instruct or Llama-3.2-1B-Instruct) client-side, and when offline, answer queries that match the pre-defined common-question set (see Architecture doc Section 3.3) directly from IndexedDB-cached facts, phrased naturally by the local model."*
8. *(Stretch)* *"Implement the 'Help me' command: on hearing this phrase, capture a screenshot of the current app state (or prompt the user to share their screen via `getDisplayMedia` if extending beyond the app itself), send it to `POST /api/query/image` for a one-shot analysis, and read back the guidance."*
9. *(Stretch)* *"Implement voice-driven form filling using `POST /api/form-fill`, reusing the same slot-filling pattern as the web version, scoped to one real sample form."*

**Verification checkpoint — the most important one in the whole build:** turn off Wi-Fi/data on the test device, open the app fresh (confirm it still opens — this is the entire USP), ask a question from the common-query set, and confirm a real spoken answer comes back with an honest "answered offline, may not be fully up to date" indicator.

---

## 6. Suggested 20-hour timeline (team of 4)

| Hours | Backend lead | Web frontend lead | App/PWA lead | Data + Deploy lead |
|---|---|---|---|---|
| 0–1 | Repo setup, `.env.example`, Antigravity workspace init | Same repo setup | Same repo setup | Register all API keys (Gemini, Bhashini, data.gov.in); create MongoDB Atlas cluster |
| 1–2 | Freeze the API contract (Section 3.1) with the whole team | Review contract, start page scaffolding | Review contract, start screen scaffolding | Curate scheme + directory seed data (12–15 schemes, 8–10 directory entries) |
| 2–6 | Build endpoints 1–5 from Section 3.2 against seeded data | Build pages 1–3 against a mocked/local API response | Build Home + mic flow against a mocked/local API response | Finish seeding DB; start writing the WebLLM common-question dataset |
| 6–9 | Build endpoints 6–8 (Gemini reasoning, vision, privacy mask) | Build pages 4–5, wire real backend calls | Build photo advisory flow, wire real backend calls | Help wire Bhashini registration/testing with backend lead |
| 9–12 | Build endpoint 9 (Bhashini integration) | Swap in Bhashini-powered voice on the Advisory Workspace | Build offline caching + WebLLM integration | Begin deployment setup (Render + Vercel projects created) |
| 12–14 | Build endpoint 10 (community/form-fill), bug-fix | Build pages 6–7, polish | Build "I can't see text" command, offline banner | Deploy backend to Render, set env vars |
| 14–16 | Support integration bugs across both frontends | Full end-to-end testing on web | Full offline test: airplane mode, fresh open | Deploy both frontends to Vercel; connect to live backend |
| 16–18 | Stretch: help refine prompts for answer quality | Stretch: polish UI, accessibility pass | Stretch: "Help me" screenshot flow, form-filling | End-to-end test on the actual deployed URLs, on a real phone |
| 18–19 | All hands: fix whatever the end-to-end test surfaced | | | |
| 19–20 | Demo script rehearsal (see Project Idea doc Section 9), README polish, buffer | | | |

---

## 7. Deployment — step by step

1. **Database:** already live from Section 2 (MongoDB Atlas) — nothing further needed here.
2. **Backend → Render:**
   - Push `/backend` to GitHub (either the whole monorepo, or Render can be pointed at a subdirectory).
   - On Render: New → Web Service → connect the GitHub repo → set root directory to `backend` → build command `npm install` → start command `npm start` (or your actual entry script).
   - Add every key from `backend/.env.example` as an environment variable in Render's dashboard (Gemini key, Bhashini key + user ID, data.gov.in key, `MONGODB_URI`).
   - Deploy, then hit `https://<your-service>.onrender.com/api/health` to confirm it's live.
   - **Cold-start caveat:** Render's free web services sleep after 15 minutes of inactivity and take 30–60 seconds to wake up. Right before your demo slot, send a request to `/api/health` (or just open the app) a minute or two ahead of time to "warm up" the service, so the judges don't watch a 45-second spinner on the first query.
3. **Web frontend → Vercel:**
   - New Project → import the repo → set root directory to `frontend` → framework preset "Vite" → set the environment variable pointing the API client at your Render backend URL → Deploy.
   - Confirm the deployed URL loads and can successfully call the backend (check the browser network tab for the first query).
4. **App (PWA) → Vercel (second project):**
   - Same steps as above with root directory `app`.
   - After deploying, open the URL on an actual Android phone's Chrome browser, use the "Add to Home Screen" / install prompt, and confirm it opens as a standalone app icon, not just a browser tab — this matters for the "app" framing in your pitch.
5. **End-to-end test on real devices, on real (not venue) Wi-Fi first**, then repeat the whole flow once on the venue's actual network before your slot, since hackathon Wi-Fi is notoriously unreliable — this is also a good rehearsal of the offline fallback path itself.
6. **Demo-day safety net:** record a short screen capture of the full flow working (including the offline moment) the night before, as a backup to play if live Wi-Fi genuinely fails on stage. This is standard hackathon practice, not a lack of confidence — venue networks are the single most common cause of avoidable demo failures.

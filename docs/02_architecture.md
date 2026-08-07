# Architecture — Human-Centered AI for Rural Communities (PS07)

This document lists every tool, API, and service used, confirms it is free for a hackathon prototype, and explains exactly how the pieces fit together — including the offline/low-connectivity design, which is the technically interesting part of this project.

All product/API-level facts here (free tier limits, current availability) were checked as of **August 2026**; free tiers do change over time, so re-verify limits on the provider's page if you're reading this later.

---

## 1. High-level picture

```
                     ┌───────────────────────────┐        ┌───────────────────────────┐
                     │   WEB DASHBOARD (React)    │        │      APP / PWA (React)     │
                     │  CSC operators, judges      │        │  mic + camera, minimal UI  │
                     └──────────────┬────────────┘        └──────────────┬────────────┘
                                    │  HTTPS / JSON                       │  HTTPS / JSON
                                    │  (falls back to local cache +       │
                                    │   on-device model when offline)     │
                                    ▼                                    ▼
                        ┌───────────────────────────────────────────────────┐
                        │            BACKEND API  (Node.js + Express)        │
                        │  — Auth (lightweight)   — Advisory orchestration   │
                        │  — Privacy-mask layer   — Prompt-enhance layer     │
                        │  — Community board       — Directory endpoints    │
                        └───────┬───────────────┬───────────────┬──────────┘
                                │               │               │
                     ┌──────────▼───┐  ┌────────▼────────┐  ┌───▼─────────────┐
                     │  MongoDB     │  │  External AI     │  │ External Data   │
                     │  Atlas (M0)  │  │  Services        │  │ Sources         │
                     │  users,      │  │  — Gemini API    │  │ — Agmarknet /   │
                     │  queries,    │  │    (LLM + vision)│  │   data.gov.in   │
                     │  schemes,    │  │  — Bhashini API  │  │ — Open-Meteo    │
                     │  cache,      │  │    (ASR/NMT/TTS) │  │ — OSM Nominatim │
                     │  community   │  │                  │  │ (mandi, weather,│
                     └──────────────┘  └──────────────────┘  │  location data) │
                                                               └─────────────────┘
```

A background job on the backend refreshes the **cache** (mandi prices, weather) every 15–30 minutes and writes "last known good" values into MongoDB. This is what both clients fall back to when they can't reach the backend, or the backend can't reach an external API — see Section 5.

---

## 2. Full tech stack

| Layer | Tool | Why this one | Free tier confirmed |
|---|---|---|---|
| Web frontend | **React + Vite**, plain CSS or Tailwind | Fast dev loop, huge ecosystem, works well with Antigravity's scaffolding | Open source, no cost |
| App frontend | **React + Vite as an installable PWA** (not a native app) | See Section 7 for the full reasoning — this is the single highest-leverage scoping decision in the whole build | Open source, no cost |
| Backend | **Node.js + Express** (or FastAPI in Python if your team is stronger there — pick one, don't mix) | Simple REST API, huge amount of Antigravity training data to scaffold from, easy to deploy | Open source, no cost |
| Database | **MongoDB Atlas, Free (M0) cluster** | Free forever, no time limit, no credit card, 512MB storage — plenty for a prototype's users/queries/cache/community data | Confirmed free-forever tier, no expiry |
| LLM reasoning + vision | **Google Gemini API** (Flash model family, via Google AI Studio) | One key covers text reasoning, multi-turn dialogue, and image understanding (crop photos) — free, no credit card | Free tier: Flash models, roughly 10–15 requests/minute, ~1,500 requests/day, large token budget — enough for a demo; note that on the free tier Google may use your prompts to improve their models, which is fine for a hackathon but worth knowing |
| Indian-language speech + translation | **Bhashini API** (Government of India, ULCA platform) | Purpose-built for Indian languages by IITs/CDAC under MeitY — genuinely the right tool for this exact problem statement, not a generic add-on | Free developer API; register at bhashini.gov.in / via the ULCA portal for an API key + user ID |
| Speech fallback (fast demo path) | **Browser Web Speech API** | Zero setup, built into Chrome, good for English/Hindi in a pinch if Bhashini integration isn't finished in time | Free, built into the browser, no key needed |
| Offline/on-device fallback model | **WebLLM** (browser-based inference via WebGPU) running a small quantized model (e.g., Llama-3.2-1B-Instruct or Qwen2.5-0.5B-Instruct) | Runs entirely client-side, no server, no API key — this is what actually makes "works with zero internet" true rather than a slide | Free, open-source, runs in Chrome/Edge with WebGPU |
| Mandi (market) prices | **Agmarknet dataset via data.gov.in Open Government Data API** | Official, government-maintained, real prices from 3,000+ mandis — exactly matches your "real time market info" requirement | Free with a self-service API key from data.gov.in (a small default key exists for light testing; register your own key for reliable access) |
| Weather | **Open-Meteo** | Genuinely free, no API key at all, no rate-limit headaches during a hackathon | Free, no key required |
| Maps / geocoding | **OpenStreetMap Nominatim** (geocoding) + **Leaflet.js** (map rendering) | No key required, good enough accuracy for village/district-level lookups | Free, open source |
| Hosting — web frontend | **Vercel** (or Netlify) | One-command deploy from a Git repo, instant HTTPS URL | Free hobby tier |
| Hosting — app/PWA | **Vercel** (separate project) or same host, different route | Same reasoning as above | Free hobby tier |
| Hosting — backend | **Render** (Free web service) | No credit card, deploys straight from GitHub | Free tier: 750 compute hours/month, but **spins down after 15 minutes idle and takes 30–60s to wake up** — see the deployment file for how to handle this on demo day |
| Source control / IDE | **GitHub** + **Google Antigravity** | Antigravity is Google's agentic IDE (VS Code-based) that plans, writes, and browser-verifies code from natural-language task descriptions — ideal for a time-boxed build | Free public preview |

---

## 3. AI services in detail

### 3.1 Gemini API — the reasoning core
Used for:
- Turning a user's raw question + retrieved context (mandi price, weather, scheme facts) into a grounded, specific answer.
- **Prompt-enhance layer**: a lightweight first call (or a system-prompt step in the same call) that rewrites the user's rough phrasing into a clearer instruction, shown back to the user as "Here's what I understood."
- **Vision**: analyzing an uploaded crop photo and generating clarifying questions.
- Slot-filling dialogue for form-filling (asking one missing field at a time).

Use the **Flash** model family — it's the model actually available on the free tier (Pro models were moved to paid-only earlier in 2026). Flash is fast enough for a live demo and handles both text and images.

### 3.2 Bhashini API — the language layer
Used for:
- Speech-to-text (ASR) in the user's chosen Indian language.
- Text-to-speech (TTS) for reading the answer back.
- Translation, if you want the backend's internal reasoning to happen in English/Hindi and only the user-facing layer to be translated (often more reliable than asking the LLM to reason directly in every language).

**How it actually works, briefly:** you register on the ULCA platform to get a user ID + API key, then call a **Pipeline Search** to find a model that supports your task (e.g., ASR+TTS for a given language), get a **Pipeline Config**, then send audio/text to the **Compute** endpoint. The Implementation doc has the concrete registration steps.

**Known real limitation, worth stating honestly in the pitch:** Bhashini covers roughly 22 scheduled Indian languages well; it does not have a named model for every regional dialect (Marwari is a good example — it's a dialect within the Hindi/Rajasthani continuum, not one of the 22 scheduled languages with its own dedicated model). For the demo, route dialect speech to the nearest well-supported language model (Hindi) rather than claiming dialect-perfect coverage you haven't built.

### 3.3 WebLLM — the "it still works offline" layer
This is the actual engineering answer to your brief's "a low-end model should run on the device." Rather than a native on-device pipeline (a multi-week problem on its own), **WebLLM** runs a small language model **inside the browser** using WebGPU, entirely client-side, no server round-trip. It's what powers:
- The offline home screen on the app when there's genuinely no signal.
- A small, defined set of high-frequency questions (crop calendar basics, common scheme names + helpline numbers, common animal husbandry facts) answered from a locally cached knowledge snippet, using the small model only to phrase the answer naturally and (via Bhashini/browser speech, when available, or cached pre-recorded audio when not) speak it back.

Be upfront in the pitch that this local model is **much smaller and weaker** than Gemini — that trade-off is exactly why it's scoped to a defined set of common queries rather than open-ended reasoning.

---

## 4. Data sources in detail

| Source | What it gives you | How to get it |
|---|---|---|
| **Agmarknet / data.gov.in** | Daily min/max/modal price per commodity per mandi, official government data | Register at data.gov.in for a free API key, then query the "Current Daily Price of Various Commodities from Various Markets (Mandi)" resource, filtering by state/commodity |
| **Open-Meteo** | Current + forecast weather by lat/long, used for farm advisory context | No key needed — just call the API with coordinates |
| **OSM Nominatim** | Turns "near me" or a village/district name into coordinates, and vice versa | No key needed; be a polite API citizen — cache results, don't hammer it |
| **Hand-curated scheme dataset** | Government scheme name, eligibility, benefit, apply link, helpline — for the Government Schemes domain | No official public API exists for myscheme.gov.in-style scheme data; for a 20-hour build, **manually research and type in 12–15 real, verified schemes** relevant to agriculture, education, and dairy into your own MongoDB collection, rather than scraping (fragile, ToS-risky, and unnecessary at this scale) |
| **Hand-curated KCC/CSC/SHG directory** | Real helpline numbers and centre info for the "integration with existing infrastructure" feature | Kisan Call Centre's toll-free number is publicly published as **1800-180-1551** (all-India, 22 languages) — a genuinely real, verifiable number worth having in your seed data. Pair it with a small hand-researched list of CSC/SHG contacts relevant to your demo region |

---

## 5. Offline & low-connectivity design (the part worth spending real design time on)

Three connectivity states, three designed behaviors — not one happy path and two error screens:

1. **Online (good signal).** Client → Backend → Gemini/Bhashini/live data APIs, normal path.
2. **Degraded / patchy signal.** Client can reach the backend, but the backend's calls to an external API (mandi price, weather) are slow or failing. The backend serves the **last cached value** from MongoDB (refreshed every 15–30 minutes by a scheduled job) with a visible "as of [timestamp]" label. This directly replaces the LSTM idea from your original brief — a real, honestly-labeled cached value is more trustworthy and vastly easier to build correctly in 20 hours than a trained predictive model, and it solves the actual user need (a farmer needs *a* recent price, not a statistically optimal forecast).
3. **Fully offline.** Client can't reach the backend at all. The **app** (not the web dashboard — a CSC laptop is assumed to have some connectivity) falls back entirely to:
   - Service-worker-cached static assets (so the app opens at all — this alone beats Google Assistant, which won't even launch offline).
   - IndexedDB-cached data (last-synced mandi prices, weather, scheme facts, the user's own recent query history).
   - The in-browser WebLLM model, answering from the defined common-query set described in Section 3.3.
   - Cached or on-device TTS for reading the answer back.

**Task-routing logic** (the "differentiate between tasks that need internet and tasks that don't" requirement): keep this simple and explicit rather than a black box — a small keyword/category check on the query (e.g., "market price," "weather," "call [someone]" → needs live data; "how do I grow X," "what documents do I need for Y" → answerable from cached/static knowledge) decides whether to attempt a live call or go straight to the offline path. This is honest, explainable, and fast to build — a "smarter" ML router is a good roadmap item, not a 20-hour one.

---

## 6. Privacy layer (realistic scope)

Full PII-detection systems (e.g., Microsoft Presidio) are heavier than a 20-hour build needs. A defensible, working prototype version:
- A small set of regex patterns to catch phone-number-shaped, Aadhaar-shaped, and bank-account-shaped digit sequences in the user's typed/transcribed text.
- Replace matches with a placeholder (e.g., `[phone number removed]`) **before** the text is sent to Gemini or logged anywhere.
- Show the user a small, honest note when this happens: "We removed a number from your message for your privacy."
- State clearly in the pitch that this is a first-pass pattern-based layer, not a certified data-protection system — full entity-recognition-based masking (e.g., with an open-source NLP model) is a natural next step.

---

## 7. Why a PWA, not a native app

Your brief calls for "an app," and a Progressive Web App is the right interpretation of that requirement for this timeframe, for concrete reasons:
- Same React codebase and skillset as the web dashboard — no separate Kotlin/Swift/Flutter learning curve mid-hackathon.
- Installable to a home screen, works offline via service workers, and can access microphone + camera through standard browser APIs — which covers every MVP feature in Section 6 of the Project Idea doc.
- Deploys the same way as the web dashboard (a static host), which simplifies the deployment story in the Implementation doc.
- The trade-off, worth naming honestly on stage: a PWA can't do everything a fully native app can (e.g., true OS-level screen recording/MediaProjection for a *continuous* "Help me" feature, deeper background sync). Say this plainly and frame native Android as the natural v2 — judges respect a correctly-reasoned trade-off far more than an over-claimed native app that's actually a half-working WebView wrapper.

---

## 8. Security & configuration notes

- All API keys (Gemini, Bhashini, data.gov.in) live in backend environment variables — **never** in frontend code, since frontend code is fully visible to anyone who opens dev tools.
- Enable CORS on the backend only for your deployed frontend/app origins.
- Because this is a public prototype, add basic per-IP rate limiting on the backend (a small middleware is enough) so a free-tier API key can't be exhausted by accident during the demo period.
- Don't log full user queries containing personal data beyond what's needed for the community board / query history features — and apply the privacy-mask layer (Section 6) before any storage.

---

## 9. Complete list of external services (quick reference)

| Service | URL | Needs a key? | Cost |
|---|---|---|---|
| Google AI Studio (Gemini API) | ai.google.dev | Yes, free signup | Free tier (Flash models) |
| Bhashini / ULCA | bhashini.gov.in | Yes, free registration | Free |
| data.gov.in (Agmarknet) | data.gov.in | Yes, free registration | Free |
| Open-Meteo | open-meteo.com | No | Free |
| OpenStreetMap Nominatim | nominatim.openstreetmap.org | No | Free |
| MongoDB Atlas | mongodb.com/atlas | Account only | Free (M0, forever) |
| Vercel | vercel.com | Account only | Free (hobby) |
| Render | render.com | Account only | Free (with cold-start caveat) |
| GitHub | github.com | Account only | Free |
| Google Antigravity | antigravity.google | Account only | Free public preview |

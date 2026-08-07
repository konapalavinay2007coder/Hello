# Project Idea — Human-Centered AI for Rural Communities (PS07)

**Working name:** *hello* (a greeting understood across every Indian language — simple, warm, and universal). Used here as the consistent reference for both surfaces.

**One-line pitch:** A voice-first, language-first AI advisor that keeps working when the internet doesn't — with a full web dashboard for CSC operators and intermediaries, and a one-tap mic+camera app for the farmer, student's parent, or dairy owner.

---

## 1. Read this first: scope reality check

Your brief describes a genuinely excellent full product — and also, honestly, several months of a real engineering team's roadmap (LSTM-based prediction, live continuous screen analysis, full offline LLM parity, four fully-built domains, native app). In 20 hours, a team cannot build all of it *and* have it working reliably on a demo stage. Judges at hackathons consistently reward **a small number of things that work flawlessly and demonstrate a real insight** over a long feature list that's held together with hope.

So this document splits every feature into:
- **🟢 BUILD (MVP)** — actually implemented and demoed live, in the 20 hours.
- **🟡 SIMULATE (Demo-scoped)** — a real, working, honest version of the idea, scoped down so it's buildable, but clearly explained as a simplified proof-of-concept during the pitch.
- **⚪ ROADMAP (Say it, don't build it)** — genuinely good ideas that belong on a "what's next" slide, not in the live demo.

This isn't lowering your ambition — it's what separates teams that get asked "wait, does this actually work?" (bad, on stage) from teams that get asked "how far could this scale?" (great, on stage). The architecture and implementation files that follow are built entirely around this scoping.

---

## 2. The core design philosophy (unchanged from your brief)

Every decision below serves four rules, because that's genuinely what makes this PS different from a generic chatbot hackathon project:

1. **Language-first, not language-added.** The user should never have to touch English or a Latin keyboard. Voice in a regional language goes in; voice in the same language comes out.
2. **No assumed digital fluency.** No menus of features to learn. One thing to tap. The system asks the follow-up questions, not the user.
3. **Connectivity is a spectrum, not a switch.** Good internet, patchy internet, and zero internet are three *designed-for* states, not one happy path and two error screens.
4. **Livelihood-relevant, not generically helpful.** Every answer is tied to what the person can act on today — sell this tomato at this mandi, call this number, fill this form.

---

## 3. Two surfaces, one brain

| | **Web Dashboard** | **App (PWA)** |
|---|---|---|
| Who | CSC operators, SHG facilitators, NGO field staff, literate intermediaries, judges/evaluators | The farmer, the parent, the dairy owner — direct, unmediated use |
| Device | Shared laptop/desktop at a Common Service Centre or kiosk | The user's own basic smartphone |
| Interaction | Richer UI: dashboards, community board, directories, settings, typed + voice input | Radically minimal: mic + camera, nothing else on first load |
| Job to be done | Serve many people, show data/trends, manage community knowledge, act as a bridge for those with no phone/data at all | Serve one person, right now, in their language, even with no signal |

Both surfaces call the **same backend and the same AI reasoning core** — the "advisory engine" — so a scheme fact, a mandi price, or a crop tip is identical whether it reaches the user through a CSC operator's screen or their own phone.

---

## 4. Personas (use these in the pitch — judges respond to names, not "the user")

- **Ramlal** — a 52-year-old farmer in rural Rajasthan, feature phone-literate but owns a basic Android smartphone, speaks Marwari at home and understands Hindi. Wants to know what to plant, when, and where to sell it.
- **Sunita ji** — runs the local Common Service Centre. Helps 15–20 villagers a day with forms and government portals. She is the "web dashboard" persona: comfortable with a browser, needs to serve many people fast.
- **Devendra** — a father whose son cleared MHT-CET. Wants to understand admission options and scholarships, doesn't know where to start, distrusts random Google results and paid "counselling" agents.
- **Meena** — owns 3 buffaloes, sells milk to a local dairy cooperative. Wants to know feed ratios, disease symptoms, and current milk procurement rates.

---

## 5. Web Dashboard — feature breakdown

### 🟢 BUILD (MVP)
- **Multilingual conversational advisory** — typed or voice query in a chosen Indian language, answered in the same language, powered by one LLM call with retrieved context (mandi prices / scheme data / weather) injected into the prompt.
- **Voice input/output** — record a query, transcribe, get a spoken-back answer (Web Speech API for the demo path; Bhashini for the "real" regional-language path — see Architecture doc for why both exist).
- **Advisory across 2 domains built deep** — Agriculture (flagship) and Education (second use case from your brief), each with real follow-up-question flows, not just single-shot Q&A.
- **Prompt-enhance layer** — the user's rough, casual phrasing is silently rewritten into a clearer instruction before being sent to the model (shown to the user as "Here's what I understood," building trust rather than hiding the rewrite).
- **Privacy layer (lightweight, honest version)** — phone numbers, Aadhaar-like number patterns, and bank-account-like number patterns typed by the user are detected and masked before being sent to any external API, with a visible "we removed a number for your safety" note.
- **Government infrastructure directory** — Kisan Call Centre, Common Service Centre, and SHG contacts, searchable by district, seeded with a small real, hand-curated dataset (see Implementation doc).
- **Community board (simplified Community AI)** — users post a question, others (or the AI) answer, upvoting surfaces the most useful answer for that village/district. This demonstrates the "collective decision-making, not individual assistant" idea without needing real-time multi-user infrastructure.

### 🟡 SIMULATE (Demo-scoped)
- **Offline-first fallback** — instead of a real LSTM forecaster, the system caches the last-known real data (mandi prices, weather) on a timer and serves that cached value with a clear "last updated X minutes ago" badge when live APIs are unreachable. This is honest, working, and — importantly — is *exactly the behavior a rural user actually needs* (a slightly-stale real number beats a spinner or a crash).
- **Auto-fill of forms from speech** — scoped to one real, useful example government form (e.g., a scheme application), where the AI asks the missing fields one at a time by voice and fills them in.

### ⚪ ROADMAP (pitch slide only)
- Full LSTM/time-series prediction engine trained on historical mandi and weather data.
- Deep advisory content for all four domains (Gov Schemes and Dairy shown as "the same engine, a new domain pack" rather than fully built out).
- Full multi-institution integration (live API links into Kisan Call Centre ticketing, CSC case management, SHG records).

---

## 6. App (PWA) — feature breakdown

The app's entire pitch rests on one sentence, and it's worth building the whole thing around it: **"Google Assistant needs internet to even open. Ours doesn't."** That is your genuine, defensible USP — protect it by keeping the app radically simple.

### 🟢 BUILD (MVP)
- **Minimal home screen** — literally a mic button and a camera button, nothing else, per your spec. Large, high-contrast, works for someone who "can't see the words properly."
- **Voice query → contextual answer** — tap mic, ask in your language, get a spoken answer that's grounded in real data (location-aware mandi prices, real weather, real scheme facts) rather than a generic LLM guess.
- **"I can't see the text properly" command** — a specific recognized voice phrase that increases font size app-wide. This is small to build and a genuinely great, concrete demonstration of designing for the stated user, not an abstract one.
- **Photo-based crop advisory with follow-up questions** — farmer photographs their field, the AI asks 2–3 clarifying questions (land size, what's currently planted) by voice, then gives a specific recommendation. This is Test Case 1 from your brief, built for real.
- **Nearby-market lookup** — "where can I sell my tomatoes" resolves the user's location and returns real mandi price data for nearby markets (via the government's own Agmarknet data — see Architecture doc), read aloud.
- **Works with zero internet for a defined set of common queries** — a small, real, on-device model answers a pre-defined set of high-frequency questions (crop calendar basics, common scheme names and helpline numbers, common animal husbandry tips) from data cached while the phone last had signal. This is the technical heart of your USP — see the Architecture doc for exactly how this is kept realistic.

### 🟡 SIMULATE (Demo-scoped)
- **"Help me" screen share** — rather than continuous live screen analysis (a genuinely hard real-time engineering problem), the MVP takes a screenshot on the "Help me" command and sends it to the AI's vision model for one-shot analysis and spoken guidance. This still solves the real user problem ("something's wrong on my screen, what do I do") and is honestly explainable on stage as "V1 of screen help; live continuous analysis is the next step."
- **Voice-driven form filling** — same approach as the web version: one real form, slot-filling by voice.
- **Dialect-level speech (e.g., Marwari specifically)** — Bhashini and other current Indian-language speech systems reliably cover ~22 scheduled languages (Hindi, Marathi, and so on) but not every regional dialect by name. For the demo, route dialect input to the nearest supported language (e.g., Marwari → Hindi models) and say so plainly in the pitch: *"true dialect models are a roadmap item; today we degrade gracefully to the nearest well-supported language rather than failing."* This kind of honesty about a real, known limitation of the Indian-language AI ecosystem plays *well* with technically literate judges — it shows you understand the space rather than overselling it.

### ⚪ ROADMAP (pitch slide only)
- Continuous live screen-share analysis.
- A production-grade on-device LLM matching cloud-model quality (today's on-device models are real but meaningfully weaker — be upfront about this trade-off).
- Full native Android/iOS app with OS-level integrations (see Architecture doc for why a PWA is the right call for 20 hours, and what you'd change for a real production build).

---

## 7. The four domains

| Domain | Status for hackathon | Flagship use case |
|---|---|---|
| **Agriculture** | 🟢 Built deep — this is your primary demo | Ramlal photographs his field, gets asked follow-ups, gets a crop plan; asks where to sell tomatoes, gets real nearby mandi prices |
| **Education** | 🟢 Built, second demo | Devendra asks about admission options after his son's MHT-CET result; AI asks marks/location/domain preference, returns a short list of colleges with fees and applicable scholarship schemes |
| **Government Schemes** | 🟡 Built as shared infrastructure, not a separate flow | A small hand-curated dataset of real schemes (with eligibility, benefit, and helpline info) that both the Agriculture and Education advisors *reference* when relevant (e.g., PM-Kisan comes up inside an agriculture answer; a scholarship scheme comes up inside an education answer) |
| **Dairy** | ⚪ Roadmap, described not built | Pitched as: "the same advisory engine, agriculture and education prove it generalizes — dairy and any future domain is a new prompt template and a new small dataset, not new engineering" |

This is a deliberate and defensible choice: two domains built *properly*, with the other two shown as trivially extensible rather than half-built everywhere. "We chose depth over breadth, and here's exactly how the third and fourth domain would plug into the same architecture" is a strong sentence to say on stage.

---

## 8. What makes this different (your actual USP, stated precisely)

1. **It starts and answers something useful with zero internet.** Every other AI assistant a judge has used (Google Assistant, Gemini, ChatGPT apps) requires connectivity even to open. Yours answers a real, useful question from cache + a small local model when there is no signal at all.
2. **It knows the difference between an internet-needing task and a not-needing one**, and doesn't block the second kind just because the first kind exists in the same app.
3. **It is designed around the actual constraints of the stated user** — can't read small text, speaks a dialect, works outdoors, has never used a "settings menu" — rather than a scaled-down urban app.

---

## 9. Suggested demo script (5–7 minutes)

1. **(30s)** Frame the problem in one sentence: most AI assumes English, good internet, and comfort with apps — none of which describe most of rural India.
2. **(90s) Web dashboard, as Sunita the CSC operator:** ask an agriculture question in Hindi by voice, show the prompt-enhance rewrite, show the mandi price answer with real data, show the scheme reference inside the answer.
3. **(90s) App, as Ramlal:** open the app (mic + camera only), photograph a field, answer two spoken follow-up questions, get a crop recommendation read aloud in a regional language.
4. **(60s) Turn off Wi-Fi / airplane mode, live, on stage.** Ask the same app a cached-scope question. It still answers, from local cache + on-device model, and visibly says "you're offline, here's what I know as of [time]." *This is your single most important 30 seconds — rehearse it more than anything else.*
5. **(60s) Second domain:** as Devendra, ask about college admission options after an exam result; show the shortlist-not-flood-of-options design choice, and the scholarship scheme it surfaces.
6. **(30s)** Close on the roadmap slide: dairy, government schemes as a full domain, true dialect coverage, live screen-share help — "same architecture, next sprint."

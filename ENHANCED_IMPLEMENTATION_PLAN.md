# POC Implementation Plan — hello v2.1
## 20-Hour Build: 3 Features LIVE, Everything Else Hardcoded
### Strategy: Demo the magic. Mock the rest.

---

## The Strategy

You have ~10 hours left. You cannot build 20 API endpoints, 10 web pages, and a full app. 
**So don't.** Build 3 things that work *flawlessly*, and hardcode everything else to *look* real.

Judges at hackathons reward **"holy shit, that actually works"** over **"here's a long list of features that sort of work."**

| Feature | Status | Why |
|---|---|---|
| **Offline / Low-Connectivity Mode** | 🟢 LIVE | This is your USP. This must work for real. |
| **Follow-Up Questions Flow** | 🟢 LIVE | This proves the AI isn't a chatbot — it's an advisor. |
| **PII Masking** | 🟢 LIVE | This proves you care about privacy. |
| **Voice Input / Output** | 🟢 LIVE | Basic Web Speech API + Browser TTS. 30 min to wire. |
| Student Hub, Entrepreneurship Hub, Skill Academy | 🟡 HARDCODED | Static JSON responses, pre-built UI cards. Looks real. Isn't. |
| Marketplace, Mentorship, Job Board | 🟡 HARDCODED | Static data. Clickable. Non-functional backend. |
| Community Board | 🟡 HARDCODED | 3 pre-written posts. Voting is client-side only. |
| Form Auto-Fill | 🟡 HARDCODED | Simulated flow. No actual form submission. |
| Scheme Finder | 🟡 HARDCODED | Static scheme cards. No real eligibility logic. |
| College Finder | 🟡 HARDCODED | 5 hardcoded colleges. No real filtering. |
| Photo Advisory | 🟡 HARDCODED | Upload works. Response is hardcoded based on image hash. |

---

## The Golden Rule

> **If a feature is hardcoded, the UI must be indistinguishable from a real feature.**
> The user clicks, sees a loading spinner for 800ms, and gets a beautiful, contextual response.
> Only you know it came from a JSON file, not a database.

---

## Phase 1: Backend — LIVE Features Only (Hour 0–4)

### What You Actually Build (4 endpoints + 2 services)

#### 1. `POST /api/chat/message` — LIVE
**What it does:** Main conversational endpoint with follow-up questions + PII masking.

**Flow:**
```
User sends: "What should I grow?"
  → Privacy middleware: regex-mask Aadhaar/phone/bank patterns
  → Prompt enhance: "User asked about crop recommendation. Location: Nagaur. Season: Kharif."
  → Gemini API call (Flash model)
  → If response is vague (no land size, no irrigation info):
     → Return: { type: "follow_up", questions: ["What is your land size?", "Do you have irrigation?"] }
  → If all context is present:
     → Return: { type: "answer", text: "Grow moong dal...", actions: [...] }
```

**Code structure:**
```javascript
// routes/chat.routes.js
router.post('/message', auth, privacyMask, promptEnhance, async (req, res) => {
  const { text, domain, context } = req.body;

  // Check if we have enough context for a real answer
  const missingFields = getMissingContext(domain, context);

  if (missingFields.length > 0) {
    // Return follow-up questions
    const questions = await generateFollowUpQuestions(domain, missingFields);
    return res.json({ 
      type: 'follow_up', 
      questions,
      masked: req.maskedData || null // Show user what was masked
    });
  }

  // Full context → get real answer from Gemini
  const answer = await geminiService.generateResponse(text, domain, context);
  res.json({ type: 'answer', text: answer, actions: extractActions(answer) });
});
```

**Follow-up question logic:**
```javascript
const followUpMap = {
  agriculture: {
    landSize: "What is your land size in acres or bigha?",
    irrigation: "Do you have irrigation facilities, or do you depend only on rain?",
    pastCrop: "What crop did you grow last season?",
    soilType: "Can you describe your soil — sandy, clay, or loamy?"
  },
  education: {
    examScore: "What was your percentile or percentage in the exam?",
    preferredDistrict: "Which district do you prefer for college?",
    branch: "Which branch are you interested in — Computer Science, Mechanical, Civil?",
    category: "Which category do you belong to — Open, OBC, SC, ST, EBC?"
  }
};
```

#### 2. `POST /api/chat/voice` — LIVE
**What it does:** Receives audio blob, transcribes via Whisper (or Web Speech API fallback), forwards to `/api/chat/message`.

**Implementation:**
```javascript
router.post('/voice', auth, upload.single('audio'), async (req, res) => {
  // Option A: Whisper (if you have it working)
  // const transcript = await whisperService.transcribe(req.file.buffer);

  // Option B: Client-side STT (faster for hackathon)
  // Client sends transcript + audio for playback
  const { transcript } = req.body;

  // Forward to chat endpoint logic
  const response = await processChatMessage(transcript, req.body.domain, req.body.context);
  res.json(response);
});
```

**Hackathon shortcut:** Do STT client-side using Web Speech API. Send transcript to backend. Backend returns text. Client does TTS via `speechSynthesis`. Zero backend complexity.

#### 3. Privacy Mask Middleware — LIVE
```javascript
// middleware/privacy.middleware.js
const PII_PATTERNS = {
  aadhaar: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  phone: /\b(?:\+91[-\s]?)?[6-9]\d{9}\b/g,
  pan: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g,
  bankAccount: /\b\d{9,18}\b/g
};

function privacyMask(req, res, next) {
  let text = req.body.text || '';
  const masked = [];

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    text = text.replace(pattern, (match) => {
      masked.push({ type, original: match, token: `[${type.toUpperCase()}_REMOVED]` });
      return `[${type.toUpperCase()}_REMOVED]`;
    });
  }

  req.body.text = text;
  req.maskedData = masked;
  next();
}
```

**Frontend shows:** "🔒 We removed 1 phone number from your message for your safety."

#### 4. `GET /api/market/prices` — LIVE (with fallback)
```javascript
router.get('/prices', async (req, res) => {
  const { commodity, district } = req.query;

  try {
    // Try live API first (3 second timeout)
    const liveData = await fetchAgmarknetData(commodity, district, { timeout: 3000 });
    res.json({ ...liveData, stale: false });
  } catch (err) {
    // Fallback to cached data
    const cached = await MarketCache.findOne({ commodity, district }).sort({ fetchedAt: -1 });
    if (cached) {
      res.json({ ...cached.toObject(), stale: true, fetchedAt: cached.fetchedAt });
    } else {
      res.json({ error: "No data available. Please try again when online." });
    }
  }
});
```

#### 5. Offline Cache Service — LIVE
```javascript
// services/cachePredictor.service.js
async function findCachedResponse(queryHash, domain, district) {
  // 1. Exact match in advisory_cache
  const exact = await AdvisoryCache.findOne({ queryHash, domain });
  if (exact) return { ...exact, matchType: 'exact' };

  // 2. Fuzzy match on recent conversations
  const fuzzy = await Conversation.findOne({ 
    domain, 
    'messages.content': { $regex: queryHash.slice(0, 20), $options: 'i' }
  }).sort({ createdAt: -1 });
  if (fuzzy) return { response: fuzzy.messages[fuzzy.messages.length - 1].content, matchType: 'fuzzy' };

  // 3. No match → return generic fallback
  return null;
}
```

#### 6. Cron Job — LIVE (but lightweight)
```javascript
// cron/dataRefresh.job.js
const cron = require('node-cron');

cron.schedule('*/15 * * * *', async () => {
  // Only refresh for demo commodities/districts
  const commodities = ['Tomato', 'Onion', 'Wheat', 'Cotton'];
  const districts = ['Nagaur', 'Pune'];

  for (const district of districts) {
    for (const commodity of commodities) {
      try {
        const data = await fetchAgmarknetData(commodity, district);
        await MarketCache.findOneAndUpdate(
          { commodity, district },
          { ...data, fetchedAt: new Date() },
          { upsert: true }
        );
      } catch (e) { /* Silently fail — cache remains */ }
    }
  }
});
```

### What You DON'T Build (Hardcoded Instead)

| Endpoint | Why Skip | What You Do Instead |
|---|---|---|
| `/api/student/career-discover` | Complex AI logic, needs training data | Static JSON file with 3 career paths. Frontend reads it. |
| `/api/student/scholarships` | Needs real-time filtering | Pre-built array of 10 scholarships. Client-side filter. |
| `/api/student/colleges` | Needs live CAP data | Hardcoded 5 colleges with realistic fees. |
| `/api/entrepreneur/business-ideas` | Needs AI generation | Static JSON: 5 business ideas per skill/budget combo. |
| `/api/entrepreneur/listings` | Needs image upload + storage | Client-side only. "Publish" shows success toast. No backend. |
| `/api/skill-academy/courses` | Simple CRUD | Static JSON file. 5 courses. |
| `/api/mentorship/mentors` | Needs booking system | Static JSON. 3 mentor profiles. "Book" opens a modal. |
| `/api/jobs` | Needs job aggregation | Static JSON. 3 job postings. |
| `/api/community` | Needs real-time updates | Static JSON. 3 posts. Voting is client-side state only. |
| `/api/forms/fill` | Needs form templates + slot filling | Simulated wizard. Hardcoded questions per form. No submission. |

---

## Phase 2: Web Frontend — LIVE vs HARDCODED (Hour 4–10)

### The Rule
> Every page exists. Every page looks real. Only 3 pages have real backend calls. The rest read from `src/data/hardcoded.js`.

### Page 1: Home / Launchpad — HARDCODED (30 min)
```javascript
// src/data/roles.js
export const roles = [
  { id: 'student', icon: '🎓', title: { en: "I'm a Student", hi: "मैं छात्र हूँ", mr: "मी विद्यार्थी आहे" }, desc: "..." },
  { id: 'entrepreneur', icon: '💼', title: { en: "I'm an Entrepreneur", hi: "मैं उद्यमी हूँ", mr: "मी उद्योजक आहे" }, desc: "..." },
  { id: 'farmer', icon: '🌾', title: { en: "I'm a Farmer", hi: "मैं किसान हूँ", mr: "मी शेतकरी आहे" }, desc: "..." },
  { id: 'parent', icon: '👨‍👩‍👧', title: { en: "I'm a Parent", hi: "मैं अभिभावक हूँ", mr: "मी पालक आहे" }, desc: "..." },
  { id: 'csc', icon: '🏛️', title: { en: "I work at a CSC", hi: "मैं CSC में काम करता हूँ", mr: "मी CSC मध्ये काम करतो" }, desc: "..." },
];
```
- Role cards are clickable.
- Clicking stores role in Zustand and navigates to role-specific page.
- **No API call.** Purely client-side.

### Page 2: AI Advisory Workspace — 🟢 LIVE (2 hours)
**This is your hero page. This must work flawlessly.**

**Features to build for real:**
1. **Voice input** → Web Speech API → transcript displayed
2. **Send to backend** → `/api/chat/message` → get response
3. **Display response** with:
   - Prompt enhance preview: *"I understood: 'What is the tomato price in Nagaur?' Is this correct?"*
   - If `type: "follow_up"`: Show questions as clickable buttons or voice prompts
   - If `type: "answer"`: Show text + action cards
4. **PII mask indicator**: If `req.maskedData` exists, show "🔒 We removed a phone number for your safety."
5. **TTS playback**: `speechSynthesis.speak()` the response

**UI Structure:**
```jsx
<div className="advisory-workspace">
  <div className="chat-history">
    {messages.map(msg => <ChatBubble key={msg.id} {...msg} />)}
  </div>

  {currentResponse?.type === 'follow_up' && (
    <div className="follow-up-panel">
      <p>Please answer these questions so I can help you better:</p>
      {currentResponse.questions.map((q, i) => (
        <button key={i} onClick={() => speakQuestion(q)}>
          🎤 {q}
        </button>
      ))}
    </div>
  )}

  {maskedData.length > 0 && (
    <div className="privacy-badge">🔒 We removed {maskedData.length} piece(s) of sensitive info.</div>
  )}

  <VoiceInput onSubmit={sendMessage} />
</div>
```

### Page 3: Student Hub — 🟡 HARDCODED (45 min)
**Looks real. Reads from static JSON.**

```javascript
// src/data/studentHub.js
export const careerPaths = [
  { id: 'software', title: 'Software Engineering', avgSalary: '₹6 LPA', story: 'Ramesh from Nagaur...', courses: ['Python', 'Web Dev'] },
  { id: 'iti', title: 'ITI Electrician', avgSalary: '₹3 LPA', story: 'Suresh from Pune...', courses: ['Basic Electrical', 'Wiring'] },
  { id: 'bsc_agri', title: 'B.Sc Agriculture', avgSalary: '₹4 LPA', story: 'Geeta from Jaipur...', courses: ['Soil Science', 'Crop Management'] },
];

export const scholarships = [
  { name: 'National Scholarship', amount: '₹50,000', deadline: '2026-09-15', eligibility: 'SC/ST, income < ₹8L', category: 'sc_st' },
  { name: 'EBC Concession', amount: '₹40,000', deadline: '2026-08-30', eligibility: 'EBC, income < ₹8L', category: 'ebc' },
  // ... 8 more
];

export const colleges = [
  { name: 'COEP Pune', fees: '₹85,000', concession: '₹50,000', placement: '95%', distance: '0 km', cutoff: 99.5 },
  { name: 'PICT Pune', fees: '₹1,20,000', concession: '₹30,000', placement: '92%', distance: '12 km', cutoff: 98.5 },
  // ... 3 more
];
```

**UI:**
- Career cards with "Explore" button → shows static detail view
- Scholarship table with client-side filter (income slider, category chips)
- College comparison table (5 hardcoded rows)
- "Apply" buttons → open a modal with "Coming soon in full version" or simulate success

### Page 4: Entrepreneurship Hub — 🟡 HARDCODED (30 min)
```javascript
// src/data/entrepreneurHub.js
export const businessIdeas = {
  'tailoring_0_5000': [
    { name: 'Custom Blouse Stitching', investment: '₹2,000', monthlyIncome: '₹8,000', steps: ['Buy machine', 'Get fabric samples', 'List on WhatsApp'] },
    { name: 'School Uniform Making', investment: '₹5,000', monthlyIncome: '₹12,000', steps: ['Contact 3 schools', 'Get measurements', 'Start with 20 sets'] },
  ],
  'cooking_0_5000': [
    { name: 'Homemade Pickles', investment: '₹3,000', monthlyIncome: '₹10,000', steps: ['Source raw mangoes', 'Get FSSAI license', 'List on Meesho'] },
  ],
};
```
- Business idea generator: 2 dropdowns (skill, budget) → lookup in JSON → display cards
- Marketplace listing: Form with photo upload → "Publish" → success toast. No backend.
- Loan finder: Static cards with bank names and interest rates.

### Page 5: Skill Academy — 🟡 HARDCODED (30 min)
```javascript
// src/data/courses.js
export const courses = [
  { id: 'python', title: 'Python Basics', duration: '4 weeks', modules: 8, enrolled: 1240, thumbnail: '/python.jpg' },
  { id: 'whatsapp', title: 'WhatsApp Business Marketing', duration: '2 weeks', modules: 5, enrolled: 890, thumbnail: '/whatsapp.jpg' },
  // ... 3 more
];
```
- Course cards with "Enroll" button → stores in localStorage → shows "Enrolled" badge
- Progress tracker reads from localStorage
- "Start Learning" → opens YouTube embed (real, free videos)

### Page 6: Scheme & Form Center — 🟡 HARDCODED (30 min)
```javascript
// src/data/schemes.js (reuse from seed data)
// src/data/formTemplates.js
export const formTemplates = [
  { id: 'pmkisan', name: 'PM-KISAN Registration', fields: ['Name', 'Aadhaar', 'Bank Account', 'Land Size'] },
  { id: 'fasal_bima', name: 'Fasal Bima Yojana', fields: ['Name', 'Aadhaar', 'Crop Type', 'Land Size'] },
];
```
- Scheme cards: Static data from `schemes.js`
- Form wizard: Hardcoded questions per form → simulated fill → "Submitted successfully" toast
- No actual form submission. No backend storage.

### Page 7: Market & Opportunity Center — 🟡 HARDCODED (30 min)
```javascript
// src/data/marketPrices.js
export const marketPrices = [
  { commodity: 'Tomato', market: 'Nagaur APMC', min: 2200, max: 2800, modal: 2500, trend: 'up' },
  { commodity: 'Onion', market: 'Nagaur APMC', min: 1800, max: 2200, modal: 2000, trend: 'stable' },
  // ... 10 more
];
```
- Price table: Static data, client-side sort/filter
- Crop planner: Hardcoded calendar based on selected crop
- Weather widget: Hardcoded for Nagaur/Pune (update manually if needed)

### Page 8: Community Hub — 🟡 HARDCODED (20 min)
```javascript
// src/data/communityPosts.js
export const communityPosts = [
  { id: 1, author: 'Ramlal', question: 'Which crop for Kharif?', votes: { cotton: 8, moong: 12, bajra: 5 }, aiSummary: '65% voted moong...' },
  { id: 2, author: 'Devendra', question: 'Best CS college under 95 percentile?', votes: { coep: 15, pict: 6 }, aiSummary: 'COEP is the top choice...' },
  { id: 3, author: 'Meena', question: 'PM-KISAN installment released?', votes: { yes: 20 }, aiSummary: 'Yes, 17th installment released July 15.' },
];
```
- Posts are static. Voting updates client-side state only (useState). No backend.
- "Post a question" → adds to local state. Disappears on refresh. Fine for demo.

### Page 9: Help & Support — 🟡 HARDCODED (15 min)
- Static FAQ accordion
- 3 video tutorial placeholders (use YouTube embeds of real tutorials)
- "Call Kisan Call Centre" → `tel:18001801551` link

### Page 10: Profile — 🟡 HARDCODED (15 min)
- Static user data (read from localStorage)
- Document vault: Upload button → stores in localStorage as base64 → displays filename
- Achievement badges: Static array, some "locked" for visual effect
- Settings: Font size slider (works via CSS variable), language toggle (works via i18n)

---

## Phase 3: App / PWA — LIVE Core (Hour 10–14)

### What You Build for Real (Same as v1.0)

| Screen | Status | Notes |
|---|---|---|
| SplashScreen | 🟡 HARDCODED | Static logo + animation |
| LanguageSelectScreen | 🟡 HARDCODED | 3 buttons: Hindi / Marathi / English |
| MainScreen | 🟢 LIVE | Mic + Camera buttons. Mic triggers voice flow. |
| ChatScreen | 🟢 LIVE | Calls `/api/chat/message`. Shows follow-ups. Plays TTS. |
| ResponseScreen | 🟢 LIVE | Displays AI response with large text + replay button. |
| Offline Mode | 🟢 LIVE | Detects `navigator.onLine`. Shows cached responses. |
| ProfileScreen | 🟡 HARDCODED | Static settings, font size slider works. |

### Offline Implementation (The USP)

```javascript
// services/offlineCache.js
const CACHE_KEY = 'hello_offline_cache';

export async function getCachedResponse(query) {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
  const match = cache.find(item => 
    item.query.toLowerCase().includes(query.toLowerCase().slice(0, 10))
  );
  return match || null;
}

export function saveToCache(query, response) {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
  cache.unshift({ query, response, timestamp: Date.now() });
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache.slice(0, 50)));
}
```

**Offline flow:**
1. User asks question online → response saved to `localStorage`
2. User goes offline → asks same/similar question
3. App checks `navigator.onLine`
4. If offline → searches `localStorage` cache → returns match with "📶 Offline mode — data from [time]"
5. If no match → returns generic fallback: *"I need internet for this specific question. But based on last week's data..."*

### Pre-Seed the Cache for Demo

Before your demo, manually seed the cache:
```javascript
// Run this once in browser console
const seedData = [
  { query: 'tomato price nagaur', response: 'Nagaur APMC में आज टमाटर का भाव ₹2,500 प्रति क्विंटल है।' },
  { query: 'what to grow', response: 'This season, consider moong dal for your 2-acre land in Nagaur.' },
  { query: 'pm kisan helpline', response: 'PM-KISAN helpline: 155261. Website: pmkisan.gov.in' },
];
localStorage.setItem('hello_offline_cache', JSON.stringify(seedData));
```

---

## Phase 4: Deployment & Demo Prep (Hour 14–16)

### Hour 14–15: Deploy

1. **Backend → Render:**
   - Push `backend/` (only 4 real endpoints + middleware + cron)
   - Add env vars: `GEMINI_API_KEY`, `MONGODB_URI`, `JWT_SECRET`
   - Deploy. Test `/api/health`. Warm up before demo.

2. **Web Frontend → Vercel:**
   - Push `frontend/` (10 pages, mostly static)
   - Deploy. Test Home → Student Hub → Advisory flow.

3. **App → Expo:**
   - `npx expo start --tunnel`
   - QR code for judges
   - Sideload APK backup

### Hour 15–16: Demo Rehearsal

**Demo Script (5 minutes):**

1. **(30s) Hook:**
   > "Sir, if someone unplugged this router, how would you Google anything? Now imagine you're a farmer in Nagaur with 2G signal. Every AI assistant dies. Ours doesn't."

2. **(90s) Web — Student Flow (HARDCODED but impressive):**
   - Open web app → "I'm a Student"
   - Career Discovery: "I like computers, 85% in SSC" → Shows 3 paths with salary
   - Scholarship Matcher: "Income ₹3 lakh, SC" → Filters 5 scholarships
   - College Finder: "MHT-CET 94.5, Pune, CS" → 5 colleges with fees
   - *"All of this is powered by our AI — and for the hackathon, we've hardcoded the secondary data to focus on what matters."*

3. **(90s) Web — Advisory Workspace (LIVE — this is the magic):**
   - Tap mic → Ask in Hindi: *"टमाटर का भाव क्या है"*
   - Show prompt enhance: *"I understood: 'What is today's tomato price in Nagaur?'"*
   - Show response with real data + action cards
   - Ask vague question: *"What should I study?"*
   - Show **follow-up questions**: "What did you score in Class 10?" "What subjects interest you?"
   - Answer follow-ups → get personalized career recommendation
   - **This proves the AI isn't a chatbot — it's an advisor.**

4. **(60s) PII Masking Demo (LIVE):**
   - Type: *"My Aadhaar is 1234-5678-9012 and phone is 9876543210"*
   - Show: *"🔒 We removed 2 pieces of sensitive info for your safety."*
   - Show the masked message sent to AI: *"My [AADHAAR_REMOVED] and phone is [PHONE_REMOVED]"*

5. **(60s) App — Offline Demo (LIVE — the USP):**
   - Open app → Ask by voice: *"What is tomato price?"*
   - Get spoken answer
   - **Turn on Airplane Mode (live on stage)**
   - Ask same question → App shows "📶 Offline Mode"
   - Returns cached answer: *"Nagaur APMC में आज टमाटर का भाव ₹2,500 प्रति क्विंटल है। (Data from 6 AM today)"*
   - **This is the 30 seconds that wins.**

6. **(30s) Close:**
   > "We didn't build 50 half-working features. We built 3 that work flawlessly — and hardcoded the rest to show the vision. Given 3 more months, every hardcoded card becomes a live API."

---

## Antigravity Agent Split (POC Strategy)

| Agent | Task | Status | Hours |
|-------|------|--------|-------|
| **Agent 1: Backend LIVE** | Build 4 real endpoints + middleware + cron | 🟢 LIVE | 0–4 |
| **Agent 2: Web LIVE Page** | Build Advisory Workspace with follow-ups + PII + voice | 🟢 LIVE | 4–6 |
| **Agent 3: Web Static Pages** | Build 9 hardcoded pages with static JSON data | 🟡 HARDCODED | 4–8 |
| **Agent 4: App LIVE** | Build PWA with offline cache + voice + camera | 🟢 LIVE | 8–12 |
| **Agent 5: Integration & Deploy** | Connect frontend to backend, deploy all 3 surfaces | 🟢 LIVE | 12–14 |
| **Agent 6: Polish & Demo** | UI polish, demo rehearsal, backup recording | 🟢 LIVE | 14–16 |

---

## Hardcoded Data Files to Create

Create these files in `frontend/src/data/`:

1. `roles.js` — 5 role cards
2. `studentHub.js` — 3 career paths, 10 scholarships, 5 colleges
3. `entrepreneurHub.js` — 5 business ideas, 3 loan options
4. `courses.js` — 5 courses
5. `marketPrices.js` — 12 commodity rows
6. `communityPosts.js` — 3 posts
7. `formTemplates.js` — 2 form structures
8. `mentors.js` — 3 mentor profiles
9. `jobs.js` — 3 job postings

**Total: ~500 lines of static JSON. 1 hour to write. Saves 10 hours of backend work.**

---

## Final Checklist

### LIVE Features (Must Work Flawlessly)
- [ ] `/api/chat/message` returns follow-up questions when context is missing
- [ ] `/api/chat/message` returns real answers when context is complete
- [ ] Privacy middleware masks Aadhaar, phone, PAN, bank account
- [ ] Frontend shows privacy badge when masking occurs
- [ ] Market prices API returns live data with `stale` fallback
- [ ] App detects offline and serves cached responses
- [ ] App voice input → STT → backend → TTS playback works end-to-end
- [ ] Prompt enhance preview is visible to user

### HARDCODED Features (Must Look Real)
- [ ] All 10 web pages render without errors
- [ ] Static data is realistic and contextual (Nagaur/Pune prices, real college names)
- [ ] UI is indistinguishable from live features (loading spinners, transitions, toasts)
- [ ] "Apply" / "Enroll" / "Book" buttons show appropriate feedback (modal, toast, or "Coming soon")

---

*POC Implementation Plan — hello v2.1*
*"Demo the magic. Mock the rest."*

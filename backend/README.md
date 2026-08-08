# hello — Backend API

Node.js + Express API server powering **hello** for rural community advisory.

---

## 🛠️ Folder Structure

```
backend/
├── src/
│   ├── config/      # Env config, DB connection, API clients (Gemini, Bhashini, Agmarknet)
│   ├── models/      # Mongoose models (User, Query, MarketPriceCache, WeatherCache, Scheme, Directory, CommunityPost)
│   ├── routes/      # Express routes (/api/query, /api/mandi-prices, /api/weather, /api/schemes, /api/directory, /api/community, /api/form-fill)
│   ├── controllers/ # Request controllers
│   ├── services/    # Integration logic (llmService, speechService, mandiPriceService, weatherService, privacyMaskService, promptEnhanceService, cacheRefreshJob)
│   ├── middleware/  # CORS, rate limiting, error handling
│   └── utils/       # Helpers
├── .env.example     # Environment variable template
├── package.json     # Node.js dependencies & scripts
├── README.md        # This file
└── server.js        # Entry point
```

---

## ⚡ Setup & Local Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Copy `.env.example` to `.env` and populate your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Verify Health Check:**
   Open `http://localhost:5000/api/health` in your browser.

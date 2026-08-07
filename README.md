# hello — Human-Centered AI for Rural Communities (PS07)

> **hello** is a voice-first, language-first AI advisor that keeps working when the internet doesn't. It features a full web dashboard for CSC operators & intermediaries, and a one-tap mic+camera PWA for farmers and rural users.

---

## 📁 Repository Overview

- **`backend/`**: Node.js + Express API server, MongoDB Atlas integration, Gemini AI (reasoning & vision), Bhashini (ASR/TTS), and external data integration (Agmarknet & Open-Meteo).
- **`frontend/`**: React + Vite Web Dashboard for CSC operators and intermediaries (Agriculture & Education advisory, Mandi/Weather dashboards, Community Board, Directory).
- **`app/`**: Minimalist React + Vite PWA for direct users with a high-contrast Mic + Camera interface, photo-based crop advisory, and WebLLM client-side zero-internet offline fallback.
- **`docs/`**: Comprehensive project documentation including project idea, system architecture, and step-by-step implementation plan.

---

## 📚 Documentation

- 📄 [01_project_idea.md](file:///d:/Projects/Hello/docs/01_project_idea.md) — Product vision, scope (BUILD / SIMULATE / ROADMAP), personas, and feature specs.
- 📄 [02_architecture.md](file:///d:/Projects/Hello/docs/02_architecture.md) — Technical stack, offline/low-connectivity design, AI services, and privacy layer details.
- 📄 [03_implementation_plan.md](file:///d:/Projects/Hello/docs/03_implementation_plan.md) — Folder structure, database schema, API contracts, task breakdown, and deployment guide.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **MongoDB**: MongoDB Atlas M0 Free Cluster URI (or local MongoDB instance)

---

### 1. Running the Backend

```bash
cd backend
npm install
cp .env.example .env   # Fill in your MONGODB_URI and API keys
npm run dev            # Starts server on http://localhost:5000
```

### 2. Running the Web Dashboard (Frontend)

```bash
cd frontend
npm install
npm run dev            # Starts dashboard on http://localhost:5173
```

### 3. Running the App (PWA)

```bash
cd app
npm install
npm run dev            # Starts PWA on http://localhost:5174
```

---

## 🛠️ Tech Stack

- **Frontend / PWA**: React, Vite, Tailwind CSS / Vanilla CSS, WebLLM, Service Worker / IndexedDB
- **Backend**: Node.js, Express, Mongoose, Axios, dotenv, CORS
- **AI & Speech**: Google Gemini API (Flash Model), Bhashini ULCA API (ASR / TTS / NMT), WebLLM (Client-side WebGPU)
- **External Data**: Agmarknet (data.gov.in), Open-Meteo, OpenStreetMap Nominatim

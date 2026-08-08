# 🚀 Full-Stack Deployment Guide: hello (Rural Voice AI)

This guide provides step-by-step instructions to deploy the **hello** platform:
- **Backend (Node.js + Express + MongoDB)** ➔ Deployed on **Railway**
- **Frontend (Vite + React)** ➔ Deployed on **Vercel**

---

## 📋 Architecture & Prerequisites

### Architecture Overview
```
[ User Browser / Mobile ]
        │
        ├── (Frontend on Vercel) ➔ https://hello-app.vercel.app
        │
        └── (API Queries via CORS) ➔ https://hello-backend.up.railway.app
                                              │
                                    ┌─────────┴─────────┐
                                    ▼                   ▼
                           MongoDB Atlas         Groq / Gemini AI APIs
```

### Prerequisites
1. **GitHub Account** with project repository pushed.
2. **Railway Account** ([railway.app](https://railway.app)).
3. **Vercel Account** ([vercel.com](https://vercel.com)).
4. **MongoDB Atlas Account** ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)) with an active cluster connection string.
5. **Groq API Key** & **Gemini API Key**.

---

## 🛠️ Step 1: Deploy Backend on Railway

### 1.1 Connect Repository & Fix Root Directory on Railway
1. Log in to [Railway.app](https://railway.app).
2. Click **"+ New Project"** ➔ Select **"Deploy from GitHub repo"**.
3. Choose your repository `Hello`.
4. **CRITICAL FIX FOR "railpack process exited with an error"**:
   - By default, Railway builds from root (`/`). Because our project is a monorepo containing both `frontend` and `backend`, you MUST set the **Root Directory**:
   - Go to Railway Service ➔ **Settings** tab.
   - Under **Build** ➔ **Root Directory**, enter:
     ```txt
     backend
     ```
   - Click **Save**.
5. Click **"Redeploy"**.

---

### 1.2 Configure Environment Variables on Railway
Navigate to your Railway service ➔ **Variables** tab and add the following keys:

| Environment Variable | Recommended Value / Example | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Railway automatically assigns port, but keep fallback |
| `NODE_ENV` | `production` | Enables production optimizations |
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/hello_db?retryWrites=true&w=majority` | MongoDB Atlas Database URI |
| `GROQ_API_KEY` | `gsk_...` | Your Groq Llama-3.3 70B API key |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API key |
| `CORS_ORIGIN` | `https://hello-app.vercel.app` (or `*` during initial test) | Allowed frontend domain for CORS |

---

### 1.3 Expose Public Railway URL & Verify
1. Go to **Settings** ➔ **Networking** ➔ **Generate Domain**.
2. Railway will create a live HTTPS domain (e.g. `https://hello-backend-production.up.railway.app`).
3. Test backend health check via terminal or browser:
   ```bash
   curl https://hello-backend-production.up.railway.app/api/health
   ```
   **Expected Response:**
   ```json
   { "status": "OK", "timestamp": "2026-08-08T06:54:00.000Z", "service": "hello-backend" }
   ```

---

## 🌐 Step 2: Deploy Frontend on Vercel

### 2.1 Import Project on Vercel
1. Log in to [Vercel.com](https://vercel.com).
2. Click **"Add New..."** ➔ **"Project"**.
3. Import your GitHub repository `Hello`.
4. In the Project Configuration screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit ➔ Select `frontend`

---

### 2.2 Configure Build Settings & Environment Variables
In the Vercel setup panel:

#### Build and Output Settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables:
Add the following environment variable pointing to your Railway backend:

| Environment Variable | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://hello-backend-production.up.railway.app` | Production Railway Backend Base URL |

---

### 2.3 Single-Page App (SPA) Routing Configuration (`vercel.json`)
Ensure `frontend/vercel.json` exists in your repository to prevent 404 errors on direct route navigations (`/advisory`, `/student`, `/entrepreneur`, `/dashboard`, `/more`):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### 2.4 Deploy & Verify
1. Click **"Deploy"**.
2. Vercel will build Vite assets and provide a live URL (e.g. `https://hello-app.vercel.app`).
3. Open your live Vercel URL and test:
   - Voice AI queries on the Advisory page (`/advisory`)
   - Student scholarship predictor (`/student`)
   - Business & capital tools (`/entrepreneur`)
   - Live Mandi prices (`/dashboard`)
   - Helplines & settings (`/more`)

---

## 🔒 Step 3: Production Security & CORS Finalization

Once both deployments are live:
1. Update Railway `CORS_ORIGIN` variable to your exact production Vercel domain:
   ```txt
   CORS_ORIGIN=https://hello-app.vercel.app
   ```
2. Verify that local PII masking (Aadhaar, phone numbers, bank accounts) continues to operate prior to LLM forwarding.

---

## 🛠️ Quick Troubleshooting Guide

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **CORS Error in Browser** | Backend `CORS_ORIGIN` does not match Vercel URL | Set `CORS_ORIGIN` on Railway to match Vercel URL or set `*` |
| **404 Page Not Found on Refresh** | Missing SPA rewrite rule on Vercel | Verify `frontend/vercel.json` contains `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}` |
| **API Queries Fail / Timeout** | Missing `VITE_API_URL` or Railway DB error | Ensure `VITE_API_URL` has no trailing slash and MongoDB Atlas IP whitelist allows `0.0.0.0/0` |
| **Voice Advisory Silent** | Browser TTS permission or audio playback | Ensure browser supports SpeechSynthesis API & HTTPS is active |

---

### 🎉 Congratulations! Your platform is fully deployed on Railway & Vercel!

# 🚀 Deployment Guide — OmniBot AI

This project is optimized for a hybrid deployment using **Render** for the backend and **Vercel** for the web dashboard.

---

## 1. Backend Deployment (Render)
The backend is a FastAPI application with a `Dockerfile`.

### Steps:
1. Log in to [Render](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository: `https://github.com/cbrethick/OmniIntel-AI.git`.
4. Set the **Root Directory** to `backend`.
5. Render should automatically detect the `Dockerfile`.
6. **Environment Variables**: Add the following in the Render dashboard:
   - `OPENAI_API_KEY`: Your OpenAI key.
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: A random secret key.
   - `PYTHONUNBUFFERED`: `1`
7. Click **Deploy**. Render will give you a URL like `https://omnibot-backend.onrender.com`.

---

## 2. Web Dashboard Deployment (Vercel)
The dashboard is a Next.js application located in the `web/` directory.

### Steps:
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. **Project Settings**:
   - **Root Directory**: `web`
   - **Framework Preset**: Next.js
5. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Use your **Render URL** (e.g., `https://omnibot-backend.onrender.com`).
6. Click **Deploy**.

---

## 3. Updating the Mobile App
Once your backend is live on Render:
1. Open `mobile/.env`.
2. Change `EXPO_PUBLIC_API_URL` to your Render URL.
3. Re-build your APK or run it in Expo Go to connect to the live production server.

---

## 🏗️ Architecture Summary
- **Mobile**: Expo (SDK 54)
- **Web**: Next.js 14
- **Backend**: FastAPI + LangGraph AI Orchestrator
- **Database**: PostgreSQL

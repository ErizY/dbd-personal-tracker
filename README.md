# DBD Private Local-First Guide + Match Tracker

A local-first web app for tracking Dead by Daylight survivor matches, tech guides, perks, builds, and stats.

## Stack
- Frontend: React + Vite + TypeScript + Tailwind + Recharts
- Backend: FastAPI + SQLite

## Features
- Dashboard with key performance summaries
- Match Logger with complete match details
- Match History table
- Survivor and Killer tech guide pages
- Perk catalog
- Build storage
- Stats charts for outcomes and killers faced

## Quick Start

### 1) Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173

## Privacy + Assets
This project stores data locally in SQLite and uses text-only placeholders/icons (no copyrighted DBD art).

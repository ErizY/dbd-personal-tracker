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
- Placeholder non-copyrighted guide images/icons

## Quick Start

### 1) Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173

## Troubleshooting
- If you see `ENOENT ... package.json`, you are likely at repo root. Run frontend commands inside `frontend/`.
- If `cd backend` fails, you are on the wrong branch/commit. Ensure the scaffold commit is checked out.
- If `No module named uvicorn`, activate your backend virtual environment and reinstall requirements.

## Privacy + Assets
This project stores data locally in SQLite and uses placeholder text/icons and custom SVG placeholders (no copyrighted DBD art).

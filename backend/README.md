# Backend (FastAPI + SQLite)

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

SQLite database file (`dbd_tracker.sqlite3`) is created automatically on startup with seed data.

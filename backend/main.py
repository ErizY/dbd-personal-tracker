import json
import sqlite3
from collections import Counter
from contextlib import closing
from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / 'dbd_tracker.sqlite3'
SCHEMA_PATH = ROOT / 'schema.sql'

app = FastAPI(title='DBD Local-First Tracker API', version='0.1.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://127.0.0.1:5173', 'http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class Teammate(BaseModel):
    playerName: str = ''
    character: str = ''
    perks: list[str] = Field(default_factory=list)


class MatchCreate(BaseModel):
    date: str
    map: str
    killer: str
    killerPerks: list[str] = Field(default_factory=list)
    survivor: str
    survivorPerks: list[str] = Field(default_factory=list)
    teammates: list[Teammate] = Field(default_factory=list)
    result: Literal['escaped', 'died', 'hatch', 'gate']
    notes: str = ''


class BuildCreate(BaseModel):
    name: str
    role: Literal['survivor', 'killer']
    perks: list[str] = Field(default_factory=list)
    notes: str = ''


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def parse_row(row: sqlite3.Row) -> dict:
    output = dict(row)
    for key in ['killer_perks', 'survivor_perks', 'teammates', 'tags', 'perks']:
        if key in output:
            output[key] = json.loads(output[key])
    return output


def seed_if_empty() -> None:
    with closing(get_db()) as conn:
        cursor = conn.execute('SELECT COUNT(*) AS count FROM guides')
        if cursor.fetchone()['count'] > 0:
            return

        guides = [
            ('survivor', 'Fast Vault Discipline', 'Practice lineups to hit reliable fast vaults under pressure.', 'medium', json.dumps(['vault', 'mindgame'])),
            ('survivor', 'Pallet Patience', 'Force extra hit cooldown by delaying drops and baiting swings.', 'hard', json.dumps(['looping', 'timing'])),
            ('killer', 'Moonwalk Approach', 'Hide red stain at key loops to manipulate survivor pathing.', 'medium', json.dumps(['mindgame', 'loops'])),
            ('killer', 'Hook Rotation Pressure', 'Cycle hooks to zone high-value objectives efficiently.', 'easy', json.dumps(['macro', 'pressure']))
        ]
        conn.executemany('INSERT INTO guides(role,title,summary,difficulty,tags) VALUES(?,?,?,?,?)', guides)

        perks = [
            ('survivor', 'Sprint Burst', 'Burst movement speed for short repositioning.'),
            ('survivor', 'Adrenaline', 'Late-game heal and speed spike when powered.'),
            ('survivor', 'Kindred', 'Team information around hooks.'),
            ('killer', 'Corrupt Intervention', 'Blocks generators at trial start.'),
            ('killer', 'Lethal Pursuer', 'Initial aura reveal for opening pathing.'),
            ('killer', 'Pain Resonance', 'Regression pressure through scourge hooks.')
        ]
        conn.executemany('INSERT INTO perks(role,name,effect) VALUES(?,?,?)', perks)

        conn.execute(
            'INSERT INTO builds(role,name,perks,notes) VALUES(?,?,?,?)',
            ('survivor', 'Solo Queue Info', json.dumps(['Kindred', 'Windows of Opportunity', 'Bond', 'Sprint Burst']), 'Safer in random teams.')
        )

        sample_teammates = [
            {'playerName': 'Mate A', 'character': 'Meg', 'perks': ['Sprint Burst']},
            {'playerName': 'Mate B', 'character': 'Feng', 'perks': ['Lithe']},
            {'playerName': 'Mate C', 'character': 'Dwight', 'perks': ['Bond']}
        ]

        conn.execute(
            '''
            INSERT INTO matches(date,map,killer,killer_perks,survivor,survivor_perks,teammates,result,notes)
            VALUES(?,?,?,?,?,?,?,?,?)
            ''',
            (
                '2026-04-20',
                'Coldwind Farm',
                'The Nurse',
                json.dumps(['Lethal Pursuer', 'Corrupt Intervention']),
                'Zarina',
                json.dumps(['Off the Record', 'Windows of Opportunity', 'Kindred', 'Adrenaline']),
                json.dumps(sample_teammates),
                'escaped',
                'Strong opening split. Saved teammate at 3 hooks then reset at shack.',
            ),
        )
        conn.commit()


@app.on_event('startup')
def setup_db() -> None:
    with closing(get_db()) as conn:
        conn.executescript(SCHEMA_PATH.read_text())
        conn.commit()
    seed_if_empty()


@app.get('/api/health')
def health() -> dict:
    return {'status': 'ok'}


@app.get('/api/matches')
def list_matches() -> list[dict]:
    with closing(get_db()) as conn:
        rows = conn.execute('SELECT * FROM matches ORDER BY date DESC, id DESC').fetchall()
    output = []
    for row in rows:
        parsed = parse_row(row)
        output.append(
            {
                'id': parsed['id'],
                'date': parsed['date'],
                'map': parsed['map'],
                'killer': parsed['killer'],
                'killerPerks': parsed['killer_perks'],
                'survivor': parsed['survivor'],
                'survivorPerks': parsed['survivor_perks'],
                'teammates': parsed['teammates'],
                'result': parsed['result'],
                'notes': parsed['notes'],
                'createdAt': parsed['created_at'],
            }
        )
    return output


@app.post('/api/matches')
def create_match(payload: MatchCreate) -> dict:
    with closing(get_db()) as conn:
        cursor = conn.execute(
            '''
            INSERT INTO matches(date,map,killer,killer_perks,survivor,survivor_perks,teammates,result,notes)
            VALUES(?,?,?,?,?,?,?,?,?)
            ''',
            (
                payload.date,
                payload.map,
                payload.killer,
                json.dumps(payload.killerPerks),
                payload.survivor,
                json.dumps(payload.survivorPerks),
                json.dumps([teammate.model_dump() for teammate in payload.teammates]),
                payload.result,
                payload.notes,
            ),
        )
        match_id = cursor.lastrowid
        conn.commit()
        row = conn.execute('SELECT * FROM matches WHERE id=?', (match_id,)).fetchone()
    parsed = parse_row(row)
    return {
        'id': parsed['id'],
        'date': parsed['date'],
        'map': parsed['map'],
        'killer': parsed['killer'],
        'killerPerks': parsed['killer_perks'],
        'survivor': parsed['survivor'],
        'survivorPerks': parsed['survivor_perks'],
        'teammates': parsed['teammates'],
        'result': parsed['result'],
        'notes': parsed['notes'],
        'createdAt': parsed['created_at'],
    }


@app.get('/api/guides/{role}')
def list_guides(role: Literal['survivor', 'killer']) -> list[dict]:
    with closing(get_db()) as conn:
        rows = conn.execute('SELECT * FROM guides WHERE role=? ORDER BY id ASC', (role,)).fetchall()
    return [
        {
            'id': row['id'],
            'title': row['title'],
            'summary': row['summary'],
            'difficulty': row['difficulty'],
            'tags': json.loads(row['tags']),
        }
        for row in rows
    ]


@app.get('/api/perks')
def list_perks() -> list[dict]:
    with closing(get_db()) as conn:
        rows = conn.execute('SELECT * FROM perks ORDER BY role, name').fetchall()
    return [dict(row) for row in rows]


@app.get('/api/builds')
def list_builds() -> list[dict]:
    with closing(get_db()) as conn:
        rows = conn.execute('SELECT * FROM builds ORDER BY id DESC').fetchall()
    return [
        {
            'id': row['id'],
            'name': row['name'],
            'role': row['role'],
            'perks': json.loads(row['perks']),
            'notes': row['notes'],
        }
        for row in rows
    ]


@app.post('/api/builds')
def create_build(payload: BuildCreate) -> dict:
    with closing(get_db()) as conn:
        cursor = conn.execute(
            'INSERT INTO builds(name,role,perks,notes) VALUES(?,?,?,?)',
            (payload.name, payload.role, json.dumps(payload.perks), payload.notes),
        )
        build_id = cursor.lastrowid
        conn.commit()
        row = conn.execute('SELECT * FROM builds WHERE id=?', (build_id,)).fetchone()
    return {
        'id': row['id'],
        'name': row['name'],
        'role': row['role'],
        'perks': json.loads(row['perks']),
        'notes': row['notes'],
    }


@app.get('/api/dashboard')
def dashboard() -> dict:
    matches = list_matches()
    total = len(matches)
    escapes = len([match for match in matches if match['result'] in {'escaped', 'hatch', 'gate'}])
    escape_rate = round((escapes / total) * 100, 1) if total else 0
    survivor_counter = Counter(match['survivor'] for match in matches)
    killer_counter = Counter(match['killer'] for match in matches)
    return {
        'totalMatches': total,
        'escapeRate': escape_rate,
        'mostPlayedSurvivor': survivor_counter.most_common(1)[0][0] if total else 'None',
        'commonKiller': killer_counter.most_common(1)[0][0] if total else 'None',
        'latestNote': matches[0]['notes'] if total else 'No notes logged yet.',
    }


@app.get('/api/stats')
def stats() -> dict:
    matches = list_matches()
    result_counter = Counter(match['result'] for match in matches)
    killer_counter = Counter(match['killer'] for match in matches)

    return {
        'resultBreakdown': [{'name': key, 'value': value} for key, value in result_counter.items()],
        'killerFrequency': [{'name': key, 'count': value} for key, value in killer_counter.most_common(8)],
    }

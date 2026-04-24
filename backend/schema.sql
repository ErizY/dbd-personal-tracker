CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  map TEXT NOT NULL,
  killer TEXT NOT NULL,
  killer_perks TEXT NOT NULL,
  survivor TEXT NOT NULL,
  survivor_perks TEXT NOT NULL,
  teammates TEXT NOT NULL,
  result TEXT NOT NULL CHECK(result IN ('escaped', 'died', 'hatch', 'gate')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL CHECK(role IN ('survivor', 'killer')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  tags TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS perks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL CHECK(role IN ('survivor', 'killer')),
  name TEXT NOT NULL,
  effect TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS builds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL CHECK(role IN ('survivor', 'killer')),
  name TEXT NOT NULL,
  perks TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT ''
);

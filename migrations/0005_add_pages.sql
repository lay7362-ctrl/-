CREATE TABLE IF NOT EXISTS pages (
  slug       TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO pages (slug, title, content) VALUES
  ('about',     '협회소개', ''),
  ('events',    '행사일정', ''),
  ('resources', '자료실',   '');

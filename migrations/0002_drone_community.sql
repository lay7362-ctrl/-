-- 기존 posts 테이블 교체 (드론 커뮤니티 스키마)
DROP TABLE IF EXISTS posts;

CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  category     TEXT    NOT NULL DEFAULT '자유게시판',
  pinned       INTEGER NOT NULL DEFAULT 0,
  title        TEXT    NOT NULL,
  excerpt      TEXT    NOT NULL DEFAULT '',
  author       TEXT    NOT NULL,
  author_initial TEXT  NOT NULL DEFAULT '',
  date         TEXT    NOT NULL,
  comments     INTEGER NOT NULL DEFAULT 0,
  likes        INTEGER NOT NULL DEFAULT 0,
  views        INTEGER NOT NULL DEFAULT 0,
  body         TEXT    NOT NULL DEFAULT '',
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS comments (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id  INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  initial  TEXT    NOT NULL,
  author   TEXT    NOT NULL,
  body     TEXT    NOT NULL,
  date     TEXT    NOT NULL DEFAULT (date('now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_category    ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_pinned      ON posts(pinned);
CREATE INDEX IF NOT EXISTS idx_comments_post_id  ON comments(post_id);

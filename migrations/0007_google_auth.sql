-- Google OAuth 지원을 위한 컬럼 추가
ALTER TABLE users ADD COLUMN google_id TEXT;
ALTER TABLE users ADD COLUMN picture_url TEXT;

CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

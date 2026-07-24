-- 네이버 OAuth 지원을 위한 컬럼 추가
ALTER TABLE users ADD COLUMN naver_id TEXT;

CREATE INDEX IF NOT EXISTS idx_users_naver_id ON users(naver_id);

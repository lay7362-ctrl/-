-- 카카오 OAuth 지원을 위한 컬럼 추가
ALTER TABLE users ADD COLUMN kakao_id TEXT;

CREATE INDEX IF NOT EXISTS idx_users_kakao_id ON users(kakao_id);

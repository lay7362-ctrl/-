-- 개발용 사용자 시드 (posts는 0003_drone_seed.sql에서 처리)
INSERT OR IGNORE INTO users (email, name) VALUES
  ('alice@example.com', 'Alice'),
  ('bob@example.com',   'Bob');

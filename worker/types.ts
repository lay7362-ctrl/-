export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  NAVER_CLIENT_ID: string;
  NAVER_CLIENT_SECRET: string;
  KAKAO_CLIENT_ID: string;
  KAKAO_CLIENT_SECRET: string;
  FRONTEND_URL: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  image_key: string | null;
  created_at: string;
  updated_at: string;
}

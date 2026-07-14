export interface Post {
  id: number;
  category: string;
  pinned: boolean;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  comments: number;
  likes: number;
  views: number;
  authorInitial: string;
  body: string;
}

export interface Comment {
  initial: string;
  author: string;
  date: string;
  body: string;
}

export interface DroneEvent {
  month: string;
  day: string;
  title: string;
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

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { INITIAL_POSTS } from "@/data/initial";
import { api } from "@/lib/api";
import type { Post } from "@/types";

export interface CurrentUser {
  id: number;
  email: string;
  name: string;
  picture?: string;
}

interface AppContextType {
  loggedIn: boolean;
  currentUser: CurrentUser | null;
  posts: Post[];
  activeCategory: string;
  loading: boolean;
  setLoggedIn: (v: boolean) => void;
  loginWithToken: (token: string) => void;
  setActiveCategory: (cat: string) => void;
  addPost: (post: Post) => void;
  removePost: (id: number) => void;
  logout: () => void;
  refetchPosts: () => void;
}

const TOKEN_KEY = "auth_token";

function decodeToken(token: string): CurrentUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.sub || !payload.email || !payload.name) return null;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.sub as number, email: payload.email as string, name: payload.name as string, picture: payload.picture as string | undefined };
  } catch {
    return null;
  }
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const user = decodeToken(token);
    if (!user) { localStorage.removeItem(TOKEN_KEY); return null; }
    return user;
  });
  const [loggedIn, setLoggedIn] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    return decodeToken(token) !== null;
  });
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await api.posts.list();
      if (res.success && res.data && res.data.length > 0) {
        setPosts(res.data);
      }
    } catch {
      // D1 연결 실패 시 더미 데이터 유지
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  function loginWithToken(token: string) {
    const user = decodeToken(token);
    if (user) {
      localStorage.setItem(TOKEN_KEY, token);
      setCurrentUser(user);
      setLoggedIn(true);
    }
  }

  async function addPost(post: Post) {
    try {
      const res = await api.posts.create({
        category: post.category,
        title: post.title,
        excerpt: post.excerpt,
        author: post.author,
        authorInitial: post.authorInitial,
        date: post.date,
        body: post.body,
        imageKey: post.imageKey,
      });
      if (res.success && res.data) {
        setPosts((prev) => [res.data!, ...prev]);
        return;
      }
    } catch {
      // API 실패 시 로컬 state만 업데이트
    }
    setPosts((prev) => [post, ...prev]);
  }

  function removePost(id: number) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
    setLoggedIn(false);
  }

  return (
    <AppContext.Provider value={{ loggedIn, currentUser, posts, activeCategory, loading, setLoggedIn, loginWithToken, setActiveCategory, addPost, removePost, logout, refetchPosts: fetchPosts }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

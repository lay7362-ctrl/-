import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { INITIAL_POSTS } from "@/data/initial";
import { api } from "@/lib/api";
import type { Post } from "@/types";

interface AppContextType {
  loggedIn: boolean;
  posts: Post[];
  activeCategory: string;
  loading: boolean;
  setLoggedIn: (v: boolean) => void;
  setActiveCategory: (cat: string) => void;
  addPost: (post: Post) => void;
  logout: () => void;
  refetchPosts: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
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

  async function addPost(post: Post) {
    // D1에 저장 후 목록 갱신
    try {
      const res = await api.posts.create({
        category: post.category,
        title: post.title,
        excerpt: post.excerpt,
        author: post.author,
        authorInitial: post.authorInitial,
        date: post.date,
        body: post.body,
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

  function logout() {
    setLoggedIn(false);
  }

  return (
    <AppContext.Provider value={{ loggedIn, posts, activeCategory, loading, setLoggedIn, setActiveCategory, addPost, logout, refetchPosts: fetchPosts }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

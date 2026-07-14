import type { ApiResponse, Post, User } from "@/types";

const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api";

export function getFileUrl(key: string) {
  return `${BASE}/files/${key}`;
}

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res.json() as Promise<ApiResponse<T>>;
}

export const api = {
  posts: {
    list: (category?: string) => {
      const qs = category && category !== "전체" ? `?category=${encodeURIComponent(category)}` : "";
      return request<Post[]>(`/posts${qs}`);
    },
    get: (id: number) => request<Post>(`/posts/${id}`),
    create: (data: Omit<Post, "id" | "comments" | "likes" | "views" | "pinned">) =>
      request<Post>("/posts", { method: "POST", body: JSON.stringify(data) }),

    comments: (id: number) =>
      request<{ id: number; initial: string; author: string; body: string; date: string }[]>(`/posts/${id}/comments`),
    addComment: (id: number, data: { author: string; initial: string; body: string }) =>
      request<{ id: number; initial: string; author: string; body: string; date: string }[]>(`/posts/${id}/comments`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  users: {
    list: () => request<User[]>("/users"),
    get: (id: number) => request<User>(`/users/${id}`),
    create: (data: { email: string; name: string }) =>
      request<User>("/users", { method: "POST", body: JSON.stringify(data) }),
  },

  files: {
    upload: async (file: File): Promise<ApiResponse<{ key: string; url: string }>> => {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${BASE}/files/upload`, { method: "POST", body: form });
      return res.json();
    },
    delete: (key: string) => request(`/files/${key}`, { method: "DELETE" }),
  },

  pages: {
    get: (slug: string) => request<{ slug: string; title: string; content: string; updated_at: string }>(`/pages/${slug}`),
    update: (slug: string, content: string) =>
      request<{ slug: string; title: string; content: string; updated_at: string }>(`/pages/${slug}`, {
        method: "PUT",
        body: JSON.stringify({ content }),
      }),
  },

  health: () => request<{ status: string; env: string }>("/health"),
};

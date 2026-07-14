import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import type { User } from "@/types";

export function Home() {
  const { data: users, loading, error, refetch } = useApi<User[]>(() => api.users.list());

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>사용자 목록</h1>

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {users && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                padding: "1rem",
                marginBottom: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <strong>{user.name}</strong>
              <span style={{ color: "#666", marginLeft: "1rem" }}>{user.email}</span>
            </li>
          ))}
        </ul>
      )}

      <button onClick={refetch} disabled={loading} style={{ marginTop: "1rem" }}>
        새로고침
      </button>
    </main>
  );
}

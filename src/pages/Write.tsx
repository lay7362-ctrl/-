import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { WRITE_CATEGORIES } from "@/data/initial";
import type { Post } from "@/types";

export function Write() {
  const navigate = useNavigate();
  const { loggedIn, addPost } = useApp();
  const [formCategory, setFormCategory] = useState(WRITE_CATEGORIES[0]);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loggedIn) return <Navigate to="/login" replace />;

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    const title = formTitle.trim() || "제목 없음";
    const body = formBody.trim() || "내용이 없습니다.";
    const today = new Date();
    const date = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

    const newPost: Post = {
      id: Date.now(),
      category: formCategory,
      pinned: false,
      title,
      excerpt: body.slice(0, 40),
      author: "홍길동",
      date,
      comments: 0,
      likes: 0,
      views: 0,
      authorInitial: "홍",
      body,
    };

    await addPost(newPost);
    navigate("/");
  }

  return (
    <main style={{ flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: 32 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#0f2136", marginBottom: 20 }}>새 글 작성</div>
      <div style={{ background: "#fff", border: "1px solid #e2e6eb", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* 카테고리 */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#4a5a6a", marginBottom: 6 }}>카테고리</div>
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} style={{ width: "100%", border: "1px solid #e2e6eb", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, color: "#182430" }}>
            {WRITE_CATEGORIES.map((wc) => <option key={wc} value={wc}>{wc}</option>)}
          </select>
        </div>

        {/* 제목 */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#4a5a6a", marginBottom: 6 }}>제목</div>
          <input placeholder="제목을 입력하세요" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} style={{ width: "100%", border: "1px solid #e2e6eb", borderRadius: 8, padding: "11px 12px", fontSize: 14 }} />
        </div>

        {/* 사진 첨부 */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#4a5a6a", marginBottom: 6 }}>사진 첨부</div>
          <div style={{ border: "1.5px dashed #cfd6de", borderRadius: 10, height: 120, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#9aa4b1" }}>이미지를 드래그하거나 클릭하여 업로드</span>
          </div>
        </div>

        {/* 내용 */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#4a5a6a", marginBottom: 6 }}>내용</div>
          <textarea placeholder="내용을 입력하세요" value={formBody} onChange={(e) => setFormBody(e.target.value)} style={{ width: "100%", height: 220, border: "1px solid #e2e6eb", borderRadius: 8, padding: 12, fontSize: 14, lineHeight: 1.6, resize: "vertical" }} />
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <button onClick={() => navigate("/")} style={{ background: "#f5f7f9", color: "#6b7684", border: "1px solid #e2e6eb", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
            취소
          </button>
          <button onClick={handleSubmit} disabled={submitting} style={{ background: submitting ? "#7fa8cc" : "#3d7ab5", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}>
            {submitting ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </div>
    </main>
  );
}

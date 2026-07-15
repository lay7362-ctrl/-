import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, getFileUrl } from "@/lib/api";
import type { Post } from "@/types";

interface Comment {
  id: number;
  initial: string;
  author: string;
  body: string;
  date: string;
}

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setPostLoading(true);
    api.posts.get(Number(id)).then((res) => {
      if (res.success && res.data) setPost(res.data);
    }).finally(() => setPostLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    api.posts.comments(Number(id)).then((res) => {
      if (res.success && res.data) setComments(res.data);
    });
  }, [id]);

  async function handleCommentSubmit() {
    if (!commentText.trim() || submitting || !id) return;
    setSubmitting(true);
    const res = await api.posts.addComment(Number(id), {
      author: "홍길동",
      initial: "홍",
      body: commentText.trim(),
    });
    if (res.success && res.data) {
      setComments(res.data);
      setCommentText("");
    }
    setSubmitting(false);
  }

  if (postLoading) {
    return <div style={{ padding: 32, color: "#a3adba" }}>불러오는 중...</div>;
  }

  if (!post) {
    return <div style={{ padding: 32 }}>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <main style={{ flex: 1, maxWidth: 860, margin: "0 auto", width: "100%", padding: 32 }}>
      <div style={{ fontSize: 13, color: "#3d7ab5", fontWeight: 700, cursor: "pointer", marginBottom: 16 }} onClick={() => navigate("/")}>
        ← 목록으로
      </div>

      {/* 본문 카드 */}
      <div style={{ background: "#fff", border: "1px solid #e2e6eb", borderRadius: 12, padding: 32 }}>
        <span style={{ background: "#eaf2fa", color: "#245a8a", fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>
          {post.category}
        </span>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#0f2136", margin: "14px 0 10px" }}>{post.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12.5, color: "#8a94a3", paddingBottom: 18, borderBottom: "1px solid #eef1f4" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#dbe4ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#4a5a6a" }}>
            {post.authorInitial}
          </div>
          <span>{post.author}</span><span>·</span><span>{post.date}</span><span>·</span><span>조회 {post.views}</span>
        </div>

        {post.imageKey && (
          <img
            src={getFileUrl(post.imageKey)}
            alt={post.title}
            style={{ width: "100%", maxHeight: 480, objectFit: "cover", borderRadius: 10, margin: "20px 0", display: "block" }}
          />
        )}

        <div style={{ fontSize: 14.5, color: "#3a4452", lineHeight: 1.9, whiteSpace: "pre-line" }}>{post.body}</div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 28 }}>
          <button style={{ background: "#eaf2fa", color: "#245a8a", border: "1px solid #cfe3f5", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            추천 {post.likes}
          </button>
          <button style={{ background: "#f5f7f9", color: "#6b7684", border: "1px solid #e2e6eb", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            스크랩
          </button>
        </div>
      </div>

      {/* 댓글 */}
      <div style={{ background: "#fff", border: "1px solid #e2e6eb", borderRadius: 12, padding: "24px 32px", marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f2136", marginBottom: 14 }}>댓글 {comments.length}</div>

        {comments.length === 0 && (
          <div style={{ fontSize: 13, color: "#a3adba", padding: "12px 0", borderTop: "1px solid #f0f2f5" }}>
            첫 댓글을 남겨보세요.
          </div>
        )}

        {comments.map((c) => (
          <div key={c.id} style={{ display: "flex", gap: 10, padding: "12px 0", borderTop: "1px solid #f0f2f5" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#dbe4ec", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#4a5a6a" }}>
              {c.initial}
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#182430" }}>
                {c.author} <span style={{ fontWeight: 400, color: "#a3adba", marginLeft: 6 }}>{c.date}</span>
              </div>
              <div style={{ fontSize: 13, color: "#3a4452", marginTop: 3 }}>{c.body}</div>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <input
            placeholder="댓글을 남겨보세요"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCommentSubmit(); } }}
            style={{ flex: 1, border: "1px solid #e2e6eb", borderRadius: 8, padding: "10px 12px", fontSize: 13 }}
          />
          <button
            onClick={handleCommentSubmit}
            disabled={submitting || !commentText.trim()}
            style={{ background: submitting || !commentText.trim() ? "#a3adba" : "#3d7ab5", color: "#fff", border: "none", borderRadius: 8, padding: "0 18px", fontSize: 13, fontWeight: 700, cursor: submitting || !commentText.trim() ? "not-allowed" : "pointer" }}
          >
            {submitting ? "등록 중" : "등록"}
          </button>
        </div>
      </div>
    </main>
  );
}

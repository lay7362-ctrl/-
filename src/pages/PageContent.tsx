import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";

const PAGE_META: Record<string, { title: string; placeholder: string }> = {
  about: {
    title: "협회소개",
    placeholder: "협회 소개 내용을 입력하세요.\n\n설립 목적, 주요 활동, 조직 구성 등을 자유롭게 작성해 주세요.",
  },
  events: {
    title: "행사일정",
    placeholder: "행사 일정을 입력하세요.\n\n예시)\n2026.08.02 - 한강 정기모임\n2026.08.22 - 산업용 드론 박람회 참관",
  },
  resources: {
    title: "자료실",
    placeholder: "자료실 내용을 입력하세요.\n\n공지사항, 규정집, 양식 등 유용한 자료를 등록해 주세요.",
  },
};

export function PageContent() {
  const { slug } = useParams<{ slug: string }>();
  const { loggedIn } = useApp();

  const [content, setContent] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const meta = slug ? PAGE_META[slug] : null;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.pages.get(slug).then((res) => {
      if (res.success && res.data) {
        setContent(res.data.content);
        setUpdatedAt(res.data.updated_at);
      }
      setLoading(false);
    });
  }, [slug]);

  function startEdit() {
    setEditText(content);
    setSaveError(null);
    setEditing(true);
  }

  async function handleSave() {
    if (!slug || saving) return;
    setSaving(true);
    setSaveError(null);
    const res = await api.pages.update(slug, editText);
    setSaving(false);
    if (res.success && res.data) {
      setContent(res.data.content);
      setUpdatedAt(res.data.updated_at);
      setEditing(false);
    } else {
      setSaveError(res.error ?? "저장 실패");
    }
  }

  if (!meta) return <div style={{ padding: 32 }}>존재하지 않는 페이지입니다.</div>;

  return (
    <main style={{ flex: 1, maxWidth: 860, margin: "0 auto", width: "100%", padding: 32 }}>
      {/* 페이지 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0f2136" }}>{meta.title}</div>
        {loggedIn && !editing && (
          <button
            onClick={startEdit}
            style={{ background: "#3d7ab5", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            편집
          </button>
        )}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e6eb", borderRadius: 12, padding: 32 }}>
        {loading ? (
          <div style={{ color: "#a3adba", fontSize: 14, padding: "20px 0" }}>불러오는 중...</div>
        ) : editing ? (
          /* 편집 모드 */
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder={meta.placeholder}
              autoFocus
              style={{
                width: "100%",
                minHeight: 400,
                border: "1px solid #cfd6de",
                borderRadius: 8,
                padding: 14,
                fontSize: 14,
                lineHeight: 1.8,
                resize: "vertical",
                fontFamily: "inherit",
                color: "#1a2330",
              }}
            />
            {saveError && <div style={{ fontSize: 12.5, color: "#c0392b" }}>{saveError}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setEditing(false)}
                style={{ background: "#f5f7f9", color: "#6b7684", border: "1px solid #e2e6eb", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ background: saving ? "#7fa8cc" : "#3d7ab5", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        ) : content ? (
          /* 보기 모드 — 내용 있음 */
          <div>
            <div style={{ fontSize: 14.5, color: "#3a4452", lineHeight: 1.9, whiteSpace: "pre-line" }}>
              {content}
            </div>
            {updatedAt && (
              <div style={{ fontSize: 11.5, color: "#b8c0ca", marginTop: 24, textAlign: "right" }}>
                최종 수정: {updatedAt.slice(0, 10).replace(/-/g, ".")}
              </div>
            )}
          </div>
        ) : (
          /* 보기 모드 — 내용 없음 */
          <div style={{ textAlign: "center", padding: "48px 0", color: "#a3adba" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>아직 내용이 없습니다.</div>
            {loggedIn && (
              <div style={{ fontSize: 13, color: "#b8c0ca" }}>
                위의 <strong>편집</strong> 버튼을 눌러 내용을 작성해 주세요.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

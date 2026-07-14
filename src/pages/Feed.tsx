import { useApp } from "@/context/AppContext";
import { PostCard } from "@/components/PostCard";
import { CATEGORY_LIST, EVENTS } from "@/data/initial";

export function Feed() {
  const { posts, activeCategory, setActiveCategory, loading } = useApp();

  const filteredPosts = (activeCategory === "전체" ? posts : posts.filter((p) => p.category === activeCategory))
    .slice()
    .sort((a, b) => (b.pinned === a.pinned ? b.id - a.id : b.pinned ? 1 : -1));

  return (
    <main style={{ flex: 1, width: "100%" }}>
      {/* 히어로 배너 */}
      <div style={{
        background: "linear-gradient(120deg, #07EADF, #173657)",
        padding: "36px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 24, flexWrap: "wrap",
      }}>
        <div>
          <div style={{ color: "#7fa8cc", fontSize: 12, fontWeight: 700, letterSpacing: "1px", marginBottom: 8 }}>공식 회원 커뮤니티</div>
          <div style={{ color: "#fff", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>대한민국 드론 산업을 함께 만듭니다</div>
          <div style={{ color: "#DAE3EC", fontSize: 14 }}>비행 정보 공유, 기체 리뷰, 행사 소식까지 — 회원 여러분의 이야기</div>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {[{ num: "12,480", label: "회원수" }, { num: "3,207", label: "게시글" }, { num: "18", label: "예정 행사" }].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{s.num}</div>
              <div style={{ color: "#7fa8cc", fontSize: 11, fontWeight: 600, letterSpacing: "0.4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3단 그리드 */}
      <div style={{
        maxWidth: 1180, margin: "0 auto", padding: "28px 32px 64px",
        display: "grid", gridTemplateColumns: "220px 1fr 260px",
        gap: 24, alignItems: "start",
      }}>

        {/* 좌측: 카테고리 */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 6, position: "sticky", top: 88 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#8a94a3", letterSpacing: "0.5px", padding: "0 4px 8px" }}>카테고리</div>
          {CATEGORY_LIST.map((cat) => (
            <div
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 10px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: cat === activeCategory ? "#eaf2fa" : "transparent",
                color: cat === activeCategory ? "#245a8a" : "#4a5a6a",
              }}
            >
              {cat}
            </div>
          ))}
          <div style={{ marginTop: 18, background: "#fff", border: "1px solid #e2e6eb", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f2136", marginBottom: 8 }}>협회 소개</div>
            <div style={{ fontSize: 12, color: "#6b7684", lineHeight: 1.6 }}>KDA는 안전하고 건전한 드론 문화 확산을 위해 2016년 설립된 비영리 회원 단체입니다.</div>
          </div>
        </aside>

        {/* 중앙: 게시글 목록 */}
        <section style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f2136", whiteSpace: "nowrap" }}>{activeCategory}</div>
            <div style={{ fontSize: 12, color: "#8a94a3", whiteSpace: "nowrap", flexShrink: 0 }}>전체 {filteredPosts.length}건</div>
          </div>
          {loading && <div style={{ color: "#8a94a3", fontSize: 13, padding: "16px 0" }}>불러오는 중...</div>}
          {!loading && filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>

        {/* 우측: 행사 + 등급 안내 */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e6eb", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f2136", marginBottom: 12 }}>다가오는 행사</div>
            {EVENTS.map((ev, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: "1px solid #f0f2f5" }}>
                <div style={{ width: 38, flexShrink: 0, textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#3d7ab5" }}>{ev.month}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f2136" }}>{ev.day}</div>
                </div>
                <div style={{ fontSize: 12.5, color: "#3a4452", lineHeight: 1.4 }}>{ev.title}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#0f2136", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 6 }}>회원 등급 안내</div>
            <div style={{ fontSize: 12, color: "#a9c2d9", lineHeight: 1.6 }}>정회원 자격으로 드론 자격시험 할인, 세미나 우선 참가 혜택을 받아보세요.</div>
          </div>
        </aside>
      </div>
    </main>
  );
}

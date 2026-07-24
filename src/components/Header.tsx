import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/useIsMobile";

const navItems = [
  { label: "게시판", path: "/" },
  { label: "협회소개", path: "/page/about" },
  { label: "행사일정", path: "/page/events" },
  { label: "자료실", path: "/page/resources" },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn, logout, currentUser } = useApp();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  function goTo(path: string) {
    setMenuOpen(false);
    navigate(path);
  }

  const isActive = (p: string) => location.pathname === p;

  /* ── 데스크탑 ── */
  if (!isMobile) {
    return (
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid #0a1926",
        backgroundColor: "#07C7B9",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 68 }}>
          {/* 로고 + 네비 */}
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => goTo("/")}>
              <img src="/logo.png" alt="협회 로고" style={{ width: 44, height: 44, objectFit: "contain" }} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "0.2px" }}>KDDA<br />한국드론앤데이터협회</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#d4f5f2", letterSpacing: "0.6px" }}>KOREA DRONE AND DATA ASSOCIATION</span>
              </div>
            </div>
            <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {navItems.map((item) => (
                <span
                  key={item.path}
                  onClick={() => goTo(item.path)}
                  style={{ fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: isActive(item.path) ? "#fff" : "#c8d8e8", whiteSpace: "nowrap" }}
                >
                  {item.label}
                </span>
              ))}
            </nav>
          </div>

          {/* 검색 + 버튼 */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#16324f", border: "1px solid #244a6e", borderRadius: 8, padding: "8px 12px", width: 170 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #7fa8cc", flexShrink: 0 }} />
              <input placeholder="검색어를 입력하세요" style={{ background: "transparent", border: "none", color: "#eaf2fa", fontSize: 13, width: "100%" }} />
            </div>
            {loggedIn && (
              <>
                <button onClick={() => navigate("/write")} style={{ background: "#3d7ab5", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>글쓰기</button>
                <div onClick={() => logout()} title={`${currentUser?.name ?? "사용자"} (로그아웃)`} style={{ width: 34, height: 34, borderRadius: "50%", background: "#244a6e", display: "flex", alignItems: "center", justifyContent: "center", color: "#eaf2fa", fontSize: 13, fontWeight: 700, cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
                  {currentUser?.picture
                    ? <img src={currentUser.picture} alt="프로필" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
                    : (currentUser?.name?.[0] ?? "??")}
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  /* ── 모바일 ── */
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "#07C7B9", borderBottom: "1px solid #0a1926" }}>
      {/* 상단 바 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 56 }}>
        {/* 로고 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => goTo("/")}>
          <img src="/logo.png" alt="협회 로고" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>KDDA</span>
        </div>

        {/* 햄버거 */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="메뉴"
          style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5, width: 40, height: 40, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, cursor: "pointer", flexShrink: 0 }}
        >
          <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2 }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2 }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2 }} />
        </button>
      </div>

      {/* 드롭다운 메뉴 */}
      {menuOpen && (
        <div style={{ background: "#0f2136", borderTop: "1px solid #1a3a5c" }}>
          {navItems.map((item) => (
            <div
              key={item.path}
              onClick={() => goTo(item.path)}
              style={{ padding: "15px 20px", fontSize: 15, fontWeight: 600, color: isActive(item.path) ? "#07C7B9" : "#c8d8e8", borderBottom: "1px solid #1a3a5c", cursor: "pointer" }}
            >
              {item.label}
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, padding: "14px 20px" }}>
            {loggedIn && (
              <>
                <button onClick={() => goTo("/write")} style={{ flex: 1, background: "#3d7ab5", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>글쓰기</button>
                <button onClick={() => { logout(); setMenuOpen(false); }} style={{ flex: 1, background: "#244a6e", color: "#c8d8e8", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>로그아웃</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { DroneIcon } from "./DroneIcon";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn, logout } = useApp();

  const navLink = (active: boolean): React.CSSProperties => ({
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    color: active ? "#ffffff" : "#c8d8e8",
    whiteSpace: "nowrap",
  });

  function handleWrite() {
    navigate(loggedIn ? "/write" : "/login");
  }

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      borderBottom: "1px solid #0a1926",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", height: 68,
      backgroundColor: "#07C7B9",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {/* 로고 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => navigate("/")}>
          <DroneIcon size={34} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#ffffff", letterSpacing: "0.2px" }}>
              KDDA<br />한국드론앤데이터협회
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, color: "#7fa8cc", letterSpacing: "0.6px" }}>
              KOREA DRONE ASSOCIATION
            </span>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav style={{ display: "flex", alignItems: "center", gap: 28, flexShrink: 0 }}>
          <span style={navLink(location.pathname === "/")} onClick={() => navigate("/")}>게시판</span>
          <span style={navLink(location.pathname === "/page/about")} onClick={() => navigate("/page/about")}>협회소개</span>
          <span style={navLink(location.pathname === "/page/events")} onClick={() => navigate("/page/events")}>행사일정</span>
          <span style={navLink(location.pathname === "/page/resources")} onClick={() => navigate("/page/resources")}>자료실</span>
        </nav>
      </div>

      {/* 검색 + 인증 */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#16324f", border: "1px solid #244a6e",
          borderRadius: 8, padding: "8px 12px", width: 170, flexShrink: 0,
        }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #7fa8cc", flexShrink: 0 }} />
          <input
            placeholder="검색어를 입력하세요"
            style={{ background: "transparent", border: "none", color: "#eaf2fa", fontSize: 13, width: "100%", minWidth: 0 }}
          />
        </div>

        {loggedIn ? (
          <>
            <button onClick={handleWrite} style={{ background: "#3d7ab5", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              글쓰기
            </button>
            <div
              onClick={() => logout()}
              title="로그아웃"
              style={{ width: 34, height: 34, borderRadius: "50%", background: "#244a6e", display: "flex", alignItems: "center", justifyContent: "center", color: "#eaf2fa", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              홍
            </div>
          </>
        ) : (
          <>
            <span onClick={() => navigate("/login")} style={{ color: "#c8d8e8", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              로그인
            </span>
            <button onClick={() => navigate("/login")} style={{ background: "#3d7ab5", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
}

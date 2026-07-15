import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleWrite() {
    setMenuOpen(false);
    navigate(loggedIn ? "/write" : "/login");
  }

  function goTo(path: string) {
    setMenuOpen(false);
    navigate(path);
  }

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "게시판", path: "/" },
    { label: "협회소개", path: "/page/about" },
    { label: "행사일정", path: "/page/events" },
    { label: "자료실", path: "/page/resources" },
  ];

  return (
    <>
      <style>{`
        .header-root {
          position: sticky; top: 0; z-index: 50;
          border-bottom: 1px solid #0a1926;
          background-color: #07C7B9;
        }
        .header-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 68px;
        }
        .header-left { display: flex; align-items: center; gap: 36px; }
        .header-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .header-logo-text { display: flex; flex-direction: column; line-height: 1.1; }
        .header-logo-main { font-size: 15px; font-weight: 800; color: #fff; letter-spacing: 0.2px; }
        .header-logo-sub { font-size: 10px; font-weight: 600; color: #d4f5f2; letter-spacing: 0.6px; }
        .header-nav { display: flex; align-items: center; gap: 28px; flex-shrink: 0; }
        .nav-link { font-size: 13.5px; font-weight: 600; cursor: pointer; color: #c8d8e8; white-space: nowrap; }
        .nav-link.active { color: #fff; }
        .header-right { display: flex; align-items: center; gap: 14px; }
        .search-box {
          display: flex; align-items: center; gap: 8px;
          background: #16324f; border: 1px solid #244a6e;
          border-radius: 8px; padding: 8px 12px; width: 170px; flex-shrink: 0;
        }
        .search-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid #7fa8cc; flex-shrink: 0; }
        .search-input { background: transparent; border: none; color: #eaf2fa; font-size: 13px; width: 100%; min-width: 0; }
        .btn-write { background: #3d7ab5; color: #fff; border: none; border-radius: 8px; padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .avatar { width: 34px; height: 34px; border-radius: 50%; background: #244a6e; display: flex; align-items: center; justify-content: center; color: #eaf2fa; font-size: 13px; font-weight: 700; cursor: pointer; }
        .btn-login { color: #c8d8e8; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; flex-shrink: 0; }

        /* 햄버거 버튼 - 모바일에서만 표시 */
        .hamburger {
          display: none; flex-direction: column; justify-content: center; align-items: center;
          gap: 5px; width: 38px; height: 38px; cursor: pointer;
          background: rgba(255,255,255,0.15); border: none; border-radius: 8px;
          flex-shrink: 0;
        }
        .hamburger span { display: block; width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: all 0.2s; }

        /* 모바일 드롭다운 메뉴 */
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: #0f2136;
          border-top: 1px solid #1a3a5c;
          padding: 12px 0;
        }
        .mobile-menu.open { display: flex; }
        .mobile-nav-item {
          padding: 14px 24px;
          font-size: 15px; font-weight: 600;
          color: #c8d8e8; cursor: pointer;
          border-bottom: 1px solid #1a3a5c;
        }
        .mobile-nav-item:last-child { border-bottom: none; }
        .mobile-nav-item.active { color: #07C7B9; }
        .mobile-nav-actions {
          display: flex; gap: 12px; padding: 14px 24px;
        }

        @media (max-width: 768px) {
          .header-inner { padding: 0 16px; height: 60px; }
          .header-nav { display: none; }
          .search-box { display: none; }
          .header-right .btn-login { display: none; }
          .header-right .btn-write { display: none; }
          .header-right .avatar { display: none; }
          .hamburger { display: flex; }
          .mobile-menu { display: none; }
          .mobile-menu.open { display: flex; }
          .header-logo-main { font-size: 13px; }
          .header-logo-sub { display: none; }
        }
      `}</style>

      <header className="header-root">
        <div className="header-inner">
          {/* 로고 */}
          <div className="header-left">
            <div className="header-logo" onClick={() => goTo("/")}>
              <img src="/logo.png" alt="협회 로고" style={{ width: 40, height: 40, objectFit: "contain" }} />
              <div className="header-logo-text">
                <span className="header-logo-main">KDDA<br />한국드론앤데이터협회</span>
                <span className="header-logo-sub">KOREA DRONE AND DATA ASSOCIATION</span>
              </div>
            </div>

            {/* 데스크탑 네비게이션 */}
            <nav className="header-nav">
              {navItems.map((item) => (
                <span
                  key={item.path}
                  className={`nav-link${isActive(item.path) ? " active" : ""}`}
                  onClick={() => goTo(item.path)}
                >
                  {item.label}
                </span>
              ))}
            </nav>
          </div>

          {/* 데스크탑 우측 */}
          <div className="header-right">
            <div className="search-box">
              <div className="search-dot" />
              <input className="search-input" placeholder="검색어를 입력하세요" />
            </div>

            {loggedIn ? (
              <>
                <button className="btn-write" onClick={handleWrite}>글쓰기</button>
                <div className="avatar" title="로그아웃" onClick={() => logout()}>홍</div>
              </>
            ) : (
              <>
                <span className="btn-login" onClick={() => goTo("/login")}>로그인</span>
                <button className="btn-write" onClick={() => goTo("/login")}>회원가입</button>
              </>
            )}

            {/* 햄버거 (모바일) */}
            <button className="hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="메뉴">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 */}
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`mobile-nav-item${isActive(item.path) ? " active" : ""}`}
              onClick={() => goTo(item.path)}
            >
              {item.label}
            </div>
          ))}
          <div className="mobile-nav-actions">
            {loggedIn ? (
              <>
                <button className="btn-write" onClick={handleWrite} style={{ flex: 1 }}>글쓰기</button>
                <button className="btn-write" style={{ background: "#244a6e", flex: 1 }} onClick={() => { logout(); setMenuOpen(false); }}>로그아웃</button>
              </>
            ) : (
              <>
                <button className="btn-write" style={{ background: "#244a6e", flex: 1 }} onClick={() => goTo("/login")}>로그인</button>
                <button className="btn-write" style={{ flex: 1 }} onClick={() => goTo("/login")}>회원가입</button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

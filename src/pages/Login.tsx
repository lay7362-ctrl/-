import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { DroneIcon } from "@/components/DroneIcon";

export function Login() {
  const navigate = useNavigate();
  const { setLoggedIn } = useApp();
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  function handleSubmit() {
    setLoggedIn(true);
    navigate("/");
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, textAlign: "center", paddingBottom: 10,
    fontSize: 13.5, fontWeight: 700, cursor: "pointer",
    color: active ? "#0f2136" : "#9aa4b1",
    borderBottom: active ? "2px solid #3d7ab5" : "none",
  });

  const fieldStyle: React.CSSProperties = {
    width: "100%", border: "1px solid #e2e6eb", borderRadius: 8,
    padding: "10px 12px", fontSize: 13.5,
  };

  return (
    <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "#f5f7f9" }}>
      <div style={{ width: 380, background: "#fff", border: "1px solid #e2e6eb", borderRadius: 14, padding: 32 }}>
        {/* 로고 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 22 }}>
          <DroneIcon size={30} />
          <span style={{ fontSize: 16, fontWeight: 800, color: "#0f2136" }}>KDA 드론협회</span>
        </div>

        {/* 탭 */}
        <div style={{ display: "flex", borderBottom: "1px solid #eef1f4", marginBottom: 20 }}>
          <div style={tabStyle(authTab === "login")} onClick={() => setAuthTab("login")}>로그인</div>
          <div style={tabStyle(authTab === "signup")} onClick={() => setAuthTab("signup")}>회원가입</div>
        </div>

        {authTab === "signup" && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4a5a6a", marginBottom: 6 }}>이름</div>
            <input placeholder="홍길동" value={authName} onChange={(e) => setAuthName(e.target.value)} style={fieldStyle} />
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#4a5a6a", marginBottom: 6 }}>이메일</div>
          <input placeholder="you@example.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} style={fieldStyle} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#4a5a6a", marginBottom: 6 }}>비밀번호</div>
          <input type="password" placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} style={fieldStyle} />
        </div>

        <button onClick={handleSubmit} style={{ width: "100%", background: "#3d7ab5", color: "#fff", border: "none", borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          {authTab === "login" ? "로그인" : "가입하기"}
        </button>

        <div style={{ textAlign: "center", fontSize: 12.5, color: "#9aa4b1", marginTop: 16, cursor: "pointer" }} onClick={() => navigate("/")}>
          ← 게시판으로 돌아가기
        </div>
      </div>
    </main>
  );
}

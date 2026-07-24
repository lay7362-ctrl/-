import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api";

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useApp();
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    if (token) {
      loginWithToken(token);
      navigate("/", { replace: true });
    } else if (error) {
      const messages: Record<string, string> = {
        cancelled: "로그인이 취소되었습니다.",
        token_failed: "인증에 실패했습니다. 다시 시도해 주세요.",
        userinfo_failed: "사용자 정보를 가져올 수 없습니다.",
        user_creation_failed: "계정 생성에 실패했습니다.",
      };
      setOauthError(messages[error] ?? "오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "#f5f7f9" }}>
      <div style={{ width: 380, background: "#fff", border: "1px solid #e2e6eb", borderRadius: 14, padding: 36 }}>

        {/* 로고 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <img src="/logo.png" alt="협회 로고" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <span style={{ fontSize: 16, fontWeight: 800, color: "#0f2136" }}>KDDA 드론협회</span>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#6b7a8d", marginBottom: 28 }}>
          소셜 계정으로 로그인
        </p>

        {oauthError && (
          <div style={{ background: "#fff3f3", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 12px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
            {oauthError}
          </div>
        )}

        {/* Google */}
        <a
          href={`${API_BASE}/auth/google`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", border: "1px solid #dadce0", borderRadius: 8,
            padding: "13px 0", fontSize: 14, fontWeight: 600, color: "#3c4043",
            textDecoration: "none", background: "#fff", cursor: "pointer",
            marginBottom: 10, boxSizing: "border-box",
          }}
        >
          <GoogleIcon />
          Google 계정으로 계속하기
        </a>

        {/* Naver */}
        <a
          href={`${API_BASE}/auth/naver`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", border: "none", borderRadius: 8,
            padding: "13px 0", fontSize: 14, fontWeight: 600, color: "#fff",
            textDecoration: "none", background: "#03C75A", cursor: "pointer",
            marginBottom: 10, boxSizing: "border-box",
          }}
        >
          <NaverIcon />
          네이버 계정으로 계속하기
        </a>

        {/* Kakao */}
        <a
          href={`${API_BASE}/auth/kakao`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", border: "none", borderRadius: 8,
            padding: "13px 0", fontSize: 14, fontWeight: 600, color: "#191600",
            textDecoration: "none", background: "#FEE500", cursor: "pointer",
            marginBottom: 0, boxSizing: "border-box",
          }}
        >
          <KakaoIcon />
          카카오 계정으로 계속하기
        </a>

        <div
          style={{ textAlign: "center", fontSize: 12.5, color: "#9aa4b1", marginTop: 24, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          ← 게시판으로 돌아가기
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#fff">
      <path d="M13.64 12.47L10.17 7H7v10h3.36V11.53L13.83 17H17V7h-3.36z"/>
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#191600">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.696 5.08 4.27 6.47l-1.09 4.01 4.67-3.08A11.3 11.3 0 0012 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
    </svg>
  );
}

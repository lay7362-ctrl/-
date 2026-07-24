import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import { Header } from "@/components/Header";
import { Feed } from "@/pages/Feed";
import { PostDetail } from "@/pages/PostDetail";
import { Write } from "@/pages/Write";
import { Login } from "@/pages/Login";
import { PageContent } from "@/pages/PageContent";

function AppRoutes() {
  const { loggedIn } = useApp();
  return (
    <Routes>
      <Route path="/" element={loggedIn ? <Feed /> : <Navigate to="/login" replace />} />
      <Route path="/post/:id" element={loggedIn ? <PostDetail /> : <Navigate to="/login" replace />} />
      <Route path="/write" element={loggedIn ? <Write /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/page/:slug" element={<PageContent />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: "#1a2330" }}>
          <Header />
          <AppRoutes />
          <footer style={{ background: "#0f2136", padding: "20px 32px", textAlign: "center", marginTop: "auto" }}>
            <span style={{ color: "#5f7997", fontSize: 11.5 }}>© 2026 KDA 대한드론협회. 본 사이트는 프로토타입 데모입니다.</span>
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

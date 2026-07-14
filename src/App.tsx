import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/Header";
import { Feed } from "@/pages/Feed";
import { PostDetail } from "@/pages/PostDetail";
import { Write } from "@/pages/Write";
import { Login } from "@/pages/Login";
import { PageContent } from "@/pages/PageContent";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: "#1a2330" }}>
          <Header />
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/write" element={<Write />} />
            <Route path="/login" element={<Login />} />
            <Route path="/page/:slug" element={<PageContent />} />
          </Routes>
          <footer style={{ background: "#0f2136", padding: "20px 32px", textAlign: "center", marginTop: "auto" }}>
            <span style={{ color: "#5f7997", fontSize: 11.5 }}>© 2026 KDA 대한드론협회. 본 사이트는 프로토타입 데모입니다.</span>
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

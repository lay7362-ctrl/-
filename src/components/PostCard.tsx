import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFileUrl } from "@/lib/api";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();

  const imgSize = isMobile ? { width: 80, height: 60 } : { width: 112, height: 80 };

  return (
    <div
      onClick={() => navigate(`/post/${post.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1px solid ${hovered ? "#3d7ab5" : "#e2e6eb"}`,
        borderRadius: 12,
        padding: isMobile ? 12 : 16,
        display: "flex", gap: isMobile ? 10 : 16,
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
    >
      {/* 썸네일 */}
      {post.imageKey ? (
        <img
          src={getFileUrl(post.imageKey)}
          alt={post.title}
          style={{ ...imgSize, borderRadius: 8, flexShrink: 0, objectFit: "cover", display: "block" }}
        />
      ) : (
        <div style={{
          ...imgSize, borderRadius: 8, flexShrink: 0,
          background: "repeating-linear-gradient(45deg,#e7edf3,#e7edf3 6px,#dbe4ec 6px,#dbe4ec 12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.5, color: "#8a9bb0", textAlign: "center", lineHeight: 1.4 }}>
            DRONE<br />PHOTO
          </span>
        </div>
      )}

      {/* 내용 */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: isMobile ? 4 : 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {post.pinned && (
            <span style={{ background: "#fdf1de", color: "#a8681c", fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 5, whiteSpace: "nowrap", flexShrink: 0 }}>공지</span>
          )}
          <span style={{ background: "#eaf2fa", color: "#245a8a", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5, whiteSpace: "nowrap", flexShrink: 0 }}>
            {post.category}
          </span>
        </div>
        <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: "#182430", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {post.title}
        </div>
        {!isMobile && (
          <div style={{ fontSize: 13, color: "#8a94a3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {post.excerpt}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 8, fontSize: 12, color: "#9aa4b1", marginTop: 2, flexWrap: "wrap" }}>
          <span>{post.author}</span><span>·</span>
          <span>{post.date}</span><span>·</span>
          <span>댓글 {post.comments}</span>
          {!isMobile && <><span>·</span><span>추천 {post.likes}</span></>}
        </div>
      </div>
    </div>
  );
}

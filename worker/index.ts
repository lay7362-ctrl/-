import type { Env } from "./types";
import { handleCors, corsHeaders } from "./middleware/cors";
import { handleUsers } from "./routes/users";
import { handleFiles } from "./routes/files";
import { handlePosts } from "./routes/posts";
import { handlePages } from "./routes/pages";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS preflight 처리
    const corsResponse = handleCors(request, env);
    if (corsResponse) return corsResponse;

    // /api 경로만 Worker에서 처리
    if (!pathname.startsWith("/api/")) {
      return new Response("Not found", { status: 404 });
    }

    try {
      if (pathname.startsWith("/api/users")) {
        return await handleUsers(request, env, pathname);
      }

      if (pathname.startsWith("/api/files")) {
        return await handleFiles(request, env, pathname);
      }

      if (pathname.startsWith("/api/posts")) {
        return await handlePosts(request, env, pathname);
      }

      if (pathname.startsWith("/api/pages")) {
        return await handlePages(request, env, pathname);
      }

      // 헬스체크
      if (pathname === "/api/health") {
        return new Response(
          JSON.stringify({ success: true, data: { status: "ok", env: env.ENVIRONMENT } }),
          {
            headers: {
              ...corsHeaders(env),
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(JSON.stringify({ success: false, error: "Route not found" }), {
        status: 404,
        headers: { ...corsHeaders(env), "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
        status: 500,
        headers: { ...corsHeaders(env), "Content-Type": "application/json" },
      });
    }
  },
} satisfies ExportedHandler<Env>;

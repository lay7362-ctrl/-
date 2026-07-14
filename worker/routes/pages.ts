import type { Env, ApiResponse } from "../types";
import { corsHeaders } from "../middleware/cors";

interface PageRow {
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

export async function handlePages(
  request: Request,
  env: Env,
  pathname: string
): Promise<Response> {
  const headers = { ...corsHeaders(env), "Content-Type": "application/json" };

  const match = pathname.match(/^\/api\/pages\/([^/]+)$/);
  if (!match) {
    return new Response(JSON.stringify({ success: false, error: "Not found" } satisfies ApiResponse), { status: 404, headers });
  }
  const slug = match[1];

  // GET /api/pages/:slug
  if (request.method === "GET") {
    const row = await env.DB.prepare("SELECT * FROM pages WHERE slug = ?").bind(slug).first<PageRow>();
    if (!row) {
      return new Response(JSON.stringify({ success: false, error: "Page not found" } satisfies ApiResponse), { status: 404, headers });
    }
    return new Response(JSON.stringify({ success: true, data: row } satisfies ApiResponse), { headers });
  }

  // PUT /api/pages/:slug
  if (request.method === "PUT") {
    const body = (await request.json()) as { content: string };
    if (typeof body.content !== "string") {
      return new Response(JSON.stringify({ success: false, error: "content required" } satisfies ApiResponse), { status: 400, headers });
    }
    await env.DB.prepare(
      "UPDATE pages SET content = ?, updated_at = datetime('now') WHERE slug = ?"
    ).bind(body.content, slug).run();

    const row = await env.DB.prepare("SELECT * FROM pages WHERE slug = ?").bind(slug).first<PageRow>();
    return new Response(JSON.stringify({ success: true, data: row } satisfies ApiResponse), { headers });
  }

  return new Response(JSON.stringify({ success: false, error: "Method not allowed" } satisfies ApiResponse), { status: 405, headers });
}

import type { Env, ApiResponse } from "../types";
import { corsHeaders } from "../middleware/cors";

interface PostRow {
  id: number;
  category: string;
  pinned: number;
  title: string;
  excerpt: string;
  author: string;
  author_initial: string;
  date: string;
  comments: number;
  likes: number;
  views: number;
  body: string;
  image_key: string | null;
}

interface CommentRow {
  id: number;
  initial: string;
  author: string;
  body: string;
  date: string;
}

function toPost(row: PostRow) {
  return {
    id: row.id,
    category: row.category,
    pinned: row.pinned === 1,
    title: row.title,
    excerpt: row.excerpt,
    author: row.author,
    authorInitial: row.author_initial,
    date: row.date,
    comments: row.comments,
    likes: row.likes,
    views: row.views,
    body: row.body,
    ...(row.image_key ? { imageKey: row.image_key } : {}),
  };
}

export async function handlePosts(request: Request, env: Env, pathname: string): Promise<Response> {
  const headers = { ...corsHeaders(env), "Content-Type": "application/json" };

  // GET /api/posts?category=전체
  if (request.method === "GET" && pathname === "/api/posts") {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const { results } = category && category !== "전체"
      ? await env.DB.prepare("SELECT * FROM posts WHERE category = ? ORDER BY pinned DESC, id DESC").bind(category).all<PostRow>()
      : await env.DB.prepare("SELECT * FROM posts ORDER BY pinned DESC, id DESC").all<PostRow>();

    return new Response(JSON.stringify({ success: true, data: results.map(toPost) } satisfies ApiResponse), { headers });
  }

  // GET /api/posts/:id
  const matchId = pathname.match(/^\/api\/posts\/(\d+)$/);
  if (request.method === "GET" && matchId) {
    const post = await env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(matchId[1]).first<PostRow>();
    if (!post) {
      return new Response(JSON.stringify({ success: false, error: "Not found" } satisfies ApiResponse), { status: 404, headers });
    }
    return new Response(JSON.stringify({ success: true, data: toPost(post) } satisfies ApiResponse), { headers });
  }

  // GET /api/posts/:id/comments
  const matchComments = pathname.match(/^\/api\/posts\/(\d+)\/comments$/);
  if (request.method === "GET" && matchComments) {
    const { results } = await env.DB.prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY id ASC").bind(matchComments[1]).all<CommentRow>();
    return new Response(JSON.stringify({ success: true, data: results } satisfies ApiResponse), { headers });
  }

  // POST /api/posts/:id/comments
  if (request.method === "POST" && matchComments) {
    const postId = matchComments[1];
    const body = (await request.json()) as { author: string; initial: string; body: string };

    if (!body.body?.trim()) {
      return new Response(JSON.stringify({ success: false, error: "내용을 입력해주세요." } satisfies ApiResponse), { status: 400, headers });
    }

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, ".");
    await env.DB.prepare(
      "INSERT INTO comments (post_id, initial, author, body, date) VALUES (?,?,?,?,?)"
    ).bind(postId, body.initial || "익", body.author || "익명", body.body.trim(), today).run();

    // posts.comments 카운트 +1
    await env.DB.prepare("UPDATE posts SET comments = comments + 1 WHERE id = ?").bind(postId).run();

    const { results } = await env.DB.prepare(
      "SELECT * FROM comments WHERE post_id = ? ORDER BY id ASC"
    ).bind(postId).all<CommentRow>();

    return new Response(JSON.stringify({ success: true, data: results } satisfies ApiResponse), { status: 201, headers });
  }

  // DELETE /api/posts/:id
  if (request.method === "DELETE" && matchId) {
    await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(matchId[1]).run();
    return new Response(JSON.stringify({ success: true } satisfies ApiResponse), { headers });
  }

  // POST /api/posts
  if (request.method === "POST" && pathname === "/api/posts") {
    const body = (await request.json()) as {
      category: string;
      title: string;
      excerpt: string;
      author: string;
      authorInitial: string;
      date: string;
      body: string;
      imageKey?: string;
    };

    const result = await env.DB.prepare(
      "INSERT INTO posts (category, pinned, title, excerpt, author, author_initial, date, comments, likes, views, body, image_key) VALUES (?,0,?,?,?,?,?,0,0,0,?,?) RETURNING *"
    ).bind(body.category, body.title, body.excerpt, body.author, body.authorInitial, body.date, body.body, body.imageKey ?? null).first<PostRow>();

    return new Response(JSON.stringify({ success: true, data: result ? toPost(result) : null } satisfies ApiResponse), { status: 201, headers });
  }

  return new Response(JSON.stringify({ success: false, error: "Not found" } satisfies ApiResponse), { status: 404, headers });
}

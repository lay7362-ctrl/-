import type { Env, ApiResponse, User } from "../types";
import { corsHeaders } from "../middleware/cors";

export async function handleUsers(
  request: Request,
  env: Env,
  pathname: string
): Promise<Response> {
  const headers = { ...corsHeaders(env), "Content-Type": "application/json" };

  // GET /api/users
  if (request.method === "GET" && pathname === "/api/users") {
    const { results } = await env.DB.prepare(
      "SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 50"
    ).all<User>();

    const body: ApiResponse<User[]> = { success: true, data: results };
    return new Response(JSON.stringify(body), { headers });
  }

  // GET /api/users/:id
  const matchId = pathname.match(/^\/api\/users\/(\d+)$/);
  if (request.method === "GET" && matchId) {
    const user = await env.DB.prepare(
      "SELECT id, email, name, created_at FROM users WHERE id = ?"
    )
      .bind(matchId[1])
      .first<User>();

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" } satisfies ApiResponse),
        { status: 404, headers }
      );
    }

    return new Response(JSON.stringify({ success: true, data: user } satisfies ApiResponse<User>), {
      headers,
    });
  }

  // POST /api/users
  if (request.method === "POST" && pathname === "/api/users") {
    const body = (await request.json()) as { email: string; name: string };

    if (!body.email || !body.name) {
      return new Response(
        JSON.stringify({ success: false, error: "email and name are required" } satisfies ApiResponse),
        { status: 400, headers }
      );
    }

    const result = await env.DB.prepare(
      "INSERT INTO users (email, name) VALUES (?, ?) RETURNING *"
    )
      .bind(body.email, body.name)
      .first<User>();

    return new Response(JSON.stringify({ success: true, data: result ?? undefined } satisfies ApiResponse<User>), {
      status: 201,
      headers,
    });
  }

  return new Response(JSON.stringify({ success: false, error: "Not found" } satisfies ApiResponse), {
    status: 404,
    headers,
  });
}

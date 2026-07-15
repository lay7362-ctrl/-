import type { Env, ApiResponse } from "../types";
import { corsHeaders } from "../middleware/cors";

export async function handleFiles(
  request: Request,
  env: Env,
  pathname: string
): Promise<Response> {
  const headers = corsHeaders(env);

  // POST /api/files/upload — R2에 파일 업로드
  if (request.method === "POST" && pathname === "/api/files/upload") {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: "No file provided" } satisfies ApiResponse),
        { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    const key = `uploads/${Date.now()}-${file.name}`;
    await env.BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: { key, url: `/api/files/${key}` },
      } satisfies ApiResponse),
      { status: 201, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  // GET /api/files/* — R2에서 파일 제공
  if (request.method === "GET" && pathname.startsWith("/api/files/")) {
    const key = decodeURIComponent(pathname.replace("/api/files/", ""));
    const object = await env.BUCKET.get(key);

    if (!object) {
      return new Response("Not found", { status: 404, headers });
    }

    return new Response(object.body, {
      headers: {
        ...headers,
        "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000",
        ETag: object.etag,
      },
    });
  }

  // DELETE /api/files/:key — R2에서 파일 삭제
  if (request.method === "DELETE" && pathname.startsWith("/api/files/")) {
    const key = pathname.replace("/api/files/", "");
    await env.BUCKET.delete(key);

    return new Response(
      JSON.stringify({ success: true, message: "File deleted" } satisfies ApiResponse),
      { headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ success: false, error: "Not found" } satisfies ApiResponse), {
    status: 404,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

import type { Env, ApiResponse } from "../types";
import { corsHeaders } from "../middleware/cors";
import { signJwt } from "../lib/jwt";

interface GoogleTokenResponse {
  access_token: string;
  error?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface NaverTokenResponse {
  access_token: string;
  error?: string;
  error_description?: string;
}

interface NaverUserInfo {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email: string;
    name: string;
    profile_image: string;
  };
}

interface DBUser {
  id: number;
  email: string;
  name: string;
  picture_url: string | null;
}

export async function handleAuth(
  request: Request,
  env: Env,
  pathname: string
): Promise<Response> {
  const headers = { ...corsHeaders(env), "Content-Type": "application/json" };
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;
  const callbackUrl = `${origin}/api/auth/google/callback`;

  // GET /api/auth/google → Google OAuth 로 리다이렉트
  if (request.method === "GET" && pathname === "/api/auth/google") {
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: callbackUrl,
      response_type: "code",
      scope: "openid email profile",
      access_type: "online",
      prompt: "select_account",
    });
    return Response.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      302
    );
  }

  // GET /api/auth/google/callback → 코드 교환 후 JWT 발급
  if (request.method === "GET" && pathname === "/api/auth/google/callback") {
    const code = url.searchParams.get("code");
    const oauthError = url.searchParams.get("error");

    if (oauthError || !code) {
      return Response.redirect(
        `${env.FRONTEND_URL}/login?error=${encodeURIComponent(oauthError ?? "cancelled")}`,
        302
      );
    }

    // 코드 → 액세스 토큰
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: callbackUrl,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return Response.redirect(`${env.FRONTEND_URL}/login?error=token_failed`, 302);
    }

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenData.access_token) {
      return Response.redirect(`${env.FRONTEND_URL}/login?error=token_failed`, 302);
    }

    // 구글 사용자 정보 조회
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      return Response.redirect(`${env.FRONTEND_URL}/login?error=userinfo_failed`, 302);
    }

    const gUser = (await userRes.json()) as GoogleUserInfo;

    // DB에서 google_id로 찾기
    let user = await env.DB.prepare(
      "SELECT id, email, name, picture_url FROM users WHERE google_id = ?"
    )
      .bind(gUser.id)
      .first<DBUser>();

    if (!user) {
      // 이메일로 기존 계정 연결
      user = await env.DB.prepare(
        "SELECT id, email, name, picture_url FROM users WHERE email = ?"
      )
        .bind(gUser.email)
        .first<DBUser>();

      if (user) {
        await env.DB.prepare(
          "UPDATE users SET google_id = ?, picture_url = ? WHERE id = ?"
        )
          .bind(gUser.id, gUser.picture, user.id)
          .run();
        user.picture_url = gUser.picture;
      } else {
        // 신규 사용자 생성
        user = await env.DB.prepare(
          "INSERT INTO users (email, name, google_id, picture_url) VALUES (?, ?, ?, ?) RETURNING id, email, name, picture_url"
        )
          .bind(gUser.email, gUser.name, gUser.id, gUser.picture)
          .first<DBUser>();
      }
    }

    if (!user) {
      return Response.redirect(`${env.FRONTEND_URL}/login?error=user_creation_failed`, 302);
    }

    const token = await signJwt(
      { sub: user.id, email: user.email, name: user.name, picture: user.picture_url ?? undefined },
      env.JWT_SECRET
    );

    return Response.redirect(
      `${env.FRONTEND_URL}/login?token=${encodeURIComponent(token)}`,
      302
    );
  }

  // ── 네이버 OAuth ──────────────────────────────────────────────
  if (request.method === "GET" && pathname === "/api/auth/naver") {
    const state = crypto.randomUUID();
    const params = new URLSearchParams({
      response_type: "code",
      client_id: env.NAVER_CLIENT_ID,
      redirect_uri: `${origin}/api/auth/naver/callback`,
      state,
    });
    return Response.redirect(
      `https://nid.naver.com/oauth2.0/authorize?${params}`,
      302
    );
  }

  if (request.method === "GET" && pathname === "/api/auth/naver/callback") {
    const code = url.searchParams.get("code");
    const oauthError = url.searchParams.get("error");

    if (oauthError || !code) {
      return Response.redirect(
        `${env.FRONTEND_URL}/login?error=${encodeURIComponent(oauthError ?? "cancelled")}`,
        302
      );
    }

    try {
      const tokenRes = await fetch("https://nid.naver.com/oauth2.0/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: env.NAVER_CLIENT_ID,
          client_secret: env.NAVER_CLIENT_SECRET,
          code,
          state: url.searchParams.get("state") ?? "",
        }),
      });

      if (!tokenRes.ok) {
        const errBody = await tokenRes.text();
        console.error("[naver] token failed", tokenRes.status, errBody);
        return Response.redirect(`${env.FRONTEND_URL}/login?error=token_failed`, 302);
      }

      const tokenData = (await tokenRes.json()) as NaverTokenResponse;
      if (!tokenData.access_token) {
        return Response.redirect(`${env.FRONTEND_URL}/login?error=token_failed`, 302);
      }

      const userRes = await fetch("https://openapi.naver.com/v1/nid/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userRes.ok) {
        return Response.redirect(`${env.FRONTEND_URL}/login?error=userinfo_failed`, 302);
      }

      const naverData = (await userRes.json()) as NaverUserInfo;
      const nUser = naverData.response;
      const naverEmail = nUser.email ?? `naver_${nUser.id}@naver.local`;
      const naverName = nUser.name ?? "네이버사용자";

      let user = await env.DB.prepare(
        "SELECT id, email, name, picture_url FROM users WHERE naver_id = ?"
      )
        .bind(nUser.id)
        .first<DBUser>();

      if (!user) {
        user = await env.DB.prepare(
          "SELECT id, email, name, picture_url FROM users WHERE email = ?"
        )
          .bind(naverEmail)
          .first<DBUser>();

        if (user) {
          await env.DB.prepare(
            "UPDATE users SET naver_id = ?, picture_url = COALESCE(picture_url, ?) WHERE id = ?"
          )
            .bind(nUser.id, nUser.profile_image ?? null, user.id)
            .run();
        } else {
          user = await env.DB.prepare(
            "INSERT INTO users (email, name, naver_id, picture_url) VALUES (?, ?, ?, ?) RETURNING id, email, name, picture_url"
          )
            .bind(naverEmail, naverName, nUser.id, nUser.profile_image ?? null)
            .first<DBUser>();
        }
      }

      if (!user) {
        return Response.redirect(`${env.FRONTEND_URL}/login?error=user_creation_failed`, 302);
      }

      const token = await signJwt(
        { sub: user.id, email: user.email, name: user.name, picture: user.picture_url ?? undefined },
        env.JWT_SECRET
      );

      return Response.redirect(
        `${env.FRONTEND_URL}/login?token=${encodeURIComponent(token)}`,
        302
      );
    } catch (err) {
      console.error("[naver] callback error", err);
      return Response.redirect(`${env.FRONTEND_URL}/login?error=token_failed`, 302);
    }
  }

  // ── 카카오 OAuth ──────────────────────────────────────────────
  if (request.method === "GET" && pathname === "/api/auth/kakao") {
    const params = new URLSearchParams({
      client_id: env.KAKAO_CLIENT_ID,
      redirect_uri: `${origin}/api/auth/kakao/callback`,
      response_type: "code",
    });
    return Response.redirect(
      `https://kauth.kakao.com/oauth/authorize?${params}`,
      302
    );
  }

  if (request.method === "GET" && pathname === "/api/auth/kakao/callback") {
    const code = url.searchParams.get("code");
    const oauthError = url.searchParams.get("error");

    if (oauthError || !code) {
      return Response.redirect(
        `${env.FRONTEND_URL}/login?error=${encodeURIComponent(oauthError ?? "cancelled")}`,
        302
      );
    }

    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: env.KAKAO_CLIENT_ID,
        client_secret: env.KAKAO_CLIENT_SECRET,
        redirect_uri: `${origin}/api/auth/kakao/callback`,
        code,
      }),
    });

    if (!tokenRes.ok) {
      return Response.redirect(`${env.FRONTEND_URL}/login?error=token_failed`, 302);
    }

    const tokenData = (await tokenRes.json()) as { access_token: string };
    if (!tokenData.access_token) {
      return Response.redirect(`${env.FRONTEND_URL}/login?error=token_failed`, 302);
    }

    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      return Response.redirect(`${env.FRONTEND_URL}/login?error=userinfo_failed`, 302);
    }

    const kData = (await userRes.json()) as {
      id: number;
      kakao_account?: {
        email?: string;
        profile?: { nickname?: string; profile_image_url?: string };
      };
    };

    const kakaoId = String(kData.id);
    const kakaoEmail = kData.kakao_account?.email ?? `kakao_${kakaoId}@kakao.local`;
    const kakaoName = kData.kakao_account?.profile?.nickname ?? "카카오사용자";
    const kakaoPicture = kData.kakao_account?.profile?.profile_image_url ?? null;

    let user = await env.DB.prepare(
      "SELECT id, email, name, picture_url FROM users WHERE kakao_id = ?"
    )
      .bind(kakaoId)
      .first<DBUser>();

    if (!user) {
      user = await env.DB.prepare(
        "SELECT id, email, name, picture_url FROM users WHERE email = ?"
      )
        .bind(kakaoEmail)
        .first<DBUser>();

      if (user) {
        await env.DB.prepare(
          "UPDATE users SET kakao_id = ?, picture_url = COALESCE(picture_url, ?) WHERE id = ?"
        )
          .bind(kakaoId, kakaoPicture, user.id)
          .run();
      } else {
        user = await env.DB.prepare(
          "INSERT INTO users (email, name, kakao_id, picture_url) VALUES (?, ?, ?, ?) RETURNING id, email, name, picture_url"
        )
          .bind(kakaoEmail, kakaoName, kakaoId, kakaoPicture)
          .first<DBUser>();
      }
    }

    if (!user) {
      return Response.redirect(`${env.FRONTEND_URL}/login?error=user_creation_failed`, 302);
    }

    const token = await signJwt(
      { sub: user.id, email: user.email, name: user.name, picture: user.picture_url ?? undefined },
      env.JWT_SECRET
    );

    return Response.redirect(
      `${env.FRONTEND_URL}/login?token=${encodeURIComponent(token)}`,
      302
    );
  }

  return new Response(
    JSON.stringify({ success: false, error: "Not found" } satisfies ApiResponse),
    { status: 404, headers }
  );
}

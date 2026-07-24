export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  picture?: string;
  exp: number;
}

export async function signJwt(
  payload: Omit<JwtPayload, "exp">,
  secret: string
): Promise<string> {
  const full: JwtPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 };
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(full));
  const data = `${header}.${body}`;
  const key = await importKey(secret, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc(data));
  return `${data}.${b64urlBuf(sig)}`;
}

export async function verifyJwt(token: string, secret: string): Promise<JwtPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const key = await importKey(secret, ["verify"]);
  const valid = await crypto.subtle.verify("HMAC", key, b64urlDecode(sig), enc(`${header}.${body}`));
  if (!valid) return null;
  try {
    const payload = JSON.parse(dec(b64urlDecode(body))) as JwtPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function importKey(secret: string, usages: ("sign" | "verify")[]) {
  return crypto.subtle.importKey("raw", enc(secret), { name: "HMAC", hash: "SHA-256" }, false, usages);
}

function enc(str: string) {
  return new TextEncoder().encode(str);
}

function dec(buf: Uint8Array) {
  return new TextDecoder().decode(buf);
}

function b64url(str: string): string {
  return btoa(unescape(encodeURIComponent(str))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64urlBuf(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

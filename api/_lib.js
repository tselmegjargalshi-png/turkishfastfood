import { createHash, timingSafeEqual } from "node:crypto";

export const MENU_PATH = "data/menu.json";

const env = (k) => (typeof process.env[k] === "string" && process.env[k].trim()) || "";

/** Store id from BLOB_STORE_ID or from the read/write token (vercel_blob_rw_<storeId>_<secret>). */
export function storeId() {
  const sid = env("BLOB_STORE_ID");
  if (sid) return sid.replace(/^store_/, "");
  const tok = env("BLOB_READ_WRITE_TOKEN");
  return tok ? tok.split("_")[3] || "" : "";
}

export const blobReady = () => Boolean(env("BLOB_READ_WRITE_TOKEN") || (env("BLOB_STORE_ID") && env("VERCEL_OIDC_TOKEN")));
export const publicUrl = (pathname) => `https://${storeId()}.public.blob.vercel-storage.com/${pathname}`;

const digest = (s) => createHash("sha256").update(String(s)).digest();

/** Returns null when authorized, otherwise a Response to send back. */
export function requireAdmin(request) {
  const expected = env("ADMIN_PASSWORD");
  if (!expected) return json({ error: "ADMIN_PASSWORD ayarlanmamış." }, 503);
  const given = request.headers.get("x-admin-password") || "";
  if (!given || !timingSafeEqual(digest(given), digest(expected))) return json({ error: "Şifre yanlış." }, 401);
  return null;
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers }
  });
}

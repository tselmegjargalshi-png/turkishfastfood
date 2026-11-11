import { put, del } from "@vercel/blob";
import { blobReady, requireAdmin, json } from "./_lib.js";

const MAX_BYTES = 4_000_000;
const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif", "image/svg+xml": "svg" };

/** Admin: upload one image as the raw request body. Query: ?name=original_file_name */
export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  if (!blobReady()) return json({ error: "Vercel Blob bağlı değil." }, 503);

  const type = (request.headers.get("content-type") || "").split(";")[0].trim();
  if (!TYPES[type]) return json({ error: "Yalnızca JPG, PNG, WEBP, GIF, AVIF, SVG yüklenebilir." }, 415);
  const buf = Buffer.from(await request.arrayBuffer());
  if (!buf.length) return json({ error: "Dosya boş." }, 400);
  if (buf.length > MAX_BYTES) return json({ error: "Fotoğraf 4 MB'tan küçük olmalı." }, 413);

  const raw = new URL(request.url).searchParams.get("name") || "image";
  const base = raw.replace(/\.[^.]+$/, "").normalize("NFKD").replace(/[^\w]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40) || "image";
  const blob = await put(`media/${base}.${TYPES[type]}`, buf, { access: "public", addRandomSuffix: true, contentType: type });
  return json({ ok: true, url: blob.url, pathname: blob.pathname, size: buf.length, type });
}

/** Admin: delete an uploaded image. Body: { "url": "https://...blob.vercel-storage.com/media/..." } */
export async function DELETE(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  if (!blobReady()) return json({ error: "Vercel Blob bağlı değil." }, 503);
  let url = "";
  try { ({ url } = await request.json()); } catch { /* ignore */ }
  if (!/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/media\//i.test(url || "")) return json({ error: "Geçersiz adres." }, 400);
  await del(url);
  return json({ ok: true });
}

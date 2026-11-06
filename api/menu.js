import { put } from "@vercel/blob";
import { MENU_PATH, blobReady, publicUrl, requireAdmin, json } from "./_lib.js";

const MAX_BYTES = 1_000_000;

/** Public: the latest saved menu from Blob storage. 404 means "use the bundled /data/menu.json". */
export async function GET() {
  if (!blobReady()) return json({ error: "storage_not_configured" }, 404);
  try {
    const r = await fetch(`${publicUrl(MENU_PATH)}?v=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) return json({ error: "not_saved_yet" }, 404);
    const body = await r.text();
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=10, stale-while-revalidate=60"
      }
    });
  } catch {
    return json({ error: "storage_unreachable" }, 404);
  }
}

/** Admin: replace the whole menu document. */
export async function PUT(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  if (!blobReady()) return json({ error: "Vercel Blob холбогдоогүй байна. README заавраар Blob store холбоно уу." }, 503);

  const text = await request.text();
  if (text.length > MAX_BYTES) return json({ error: "Өгөгдөл хэт том байна." }, 413);
  let data;
  try { data = JSON.parse(text); } catch { return json({ error: "JSON буруу байна." }, 400); }
  if (!data || !Array.isArray(data.categories) || typeof data.brand !== "object") {
    return json({ error: "Цэсний бүтэц буруу байна." }, 400);
  }
  data.updatedAt = new Date().toISOString();
  const body = JSON.stringify(data);

  const opts = { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60 };
  const saved = await put(MENU_PATH, body, opts);
  // Keep a dated backup copy as well.
  const stamp = data.updatedAt.replace(/[:.]/g, "");
  await put(`data/backups/menu_${stamp}.json`, body, opts).catch(() => {});

  return json({ ok: true, url: saved.url, updatedAt: data.updatedAt });
}

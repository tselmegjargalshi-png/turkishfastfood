import { blobReady, requireAdmin, json } from "./_lib.js";

/** Admin: verify the password and report whether storage is connected. */
export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  return json({ ok: true, storage: blobReady() });
}

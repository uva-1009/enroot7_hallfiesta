// GET /api/queue  ->  { queue: { nerf: { level, updatedAt }, ... } }  (public: no codes)
import { getQueue, dbConfigured } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!dbConfigured()) return Response.json({ queue: {} });
  try {
    return Response.json({ queue: await getQueue() }, { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20" } });
  } catch (e) {
    console.error("queue read failed", e);
    return Response.json({ queue: {} }, { status: 500 });
  }
}

import { db } from "@/db/drizzle";
import { muxData } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json();
  const { type, data } = body;
  if (type === "video.asset.ready") {
    await db
      .update(muxData)
      .set({
        status: "ready",
        updatedAt: new Date(),
      })
      .where(eq(muxData.assetId, data.id));

    return Response.json({ message: "ok" });
  } else {
    /* handle other event types */
    return Response.json({ message: "ok" });
  }
}

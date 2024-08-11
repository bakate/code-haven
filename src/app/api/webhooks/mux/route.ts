import Mux from "@mux/mux-node";

import { db } from "@/db/drizzle";
import { muxData } from "@/db/schema";
import { ENV } from "@/env";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const mux = new Mux();

export async function POST(request: Request) {
  const { MUX_WEBHOOK_SECRET = "" } = ENV;

  if (!MUX_WEBHOOK_SECRET) {
    throw new Response("Missing MUX_WEBHOOK_SECRET", { status: 400 });
  }
  const headerPayload = headers();
  const payload = await request.json();
  const body = JSON.stringify(payload);

  try {
    mux.webhooks.verifySignature(body, headerPayload, MUX_WEBHOOK_SECRET);
  } catch (error) {
    return new Response("Invalid signature", { status: 400 });
  }
  const { type, data } = payload;

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

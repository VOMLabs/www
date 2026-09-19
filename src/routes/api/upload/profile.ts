import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getSession } from "@/lib/auth-utils";
import { db } from "@/lib/db/index.server";
import { users } from "@/lib/db/schema";
import { getPresignedUploadUrl } from "@/lib/s3";

const requestUpload = createServerFn({ method: "POST" })
  .validator(
    z.object({
      contentType: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { url, key } = await getPresignedUploadUrl(
      session.user.id,
      data.contentType,
    );

    return { presignedUrl: url, publicUrl: key };
  });

const confirmUpload = createServerFn({ method: "POST" })
  .validator(
    z.object({
      imageUrl: z.string().url(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    await db
      .update(users)
      .set({ image: data.imageUrl, updatedAt: new Date() })
      .where(eq(users.id, session.user.id));

    return { success: true };
  });

export const Route = createFileRoute("/api/upload/profile")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = await request.json();
        const action = body.action as string;

        if (action === "request") {
          const result = await requestUpload({
            data: { contentType: body.contentType },
          });
          return Response.json(result);
        }

        if (action === "confirm") {
          const result = await confirmUpload({
            data: { imageUrl: body.imageUrl },
          });
          return Response.json(result);
        }

        return Response.json({ error: "Unknown action" }, { status: 400 });
      },
    },
  },
});

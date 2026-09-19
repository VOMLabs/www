import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "./env";

/**
 * Garage S3 client — configured for the self-hosted Garage instance.
 * Returns null if S3 env vars are not configured (graceful degradation).
 */
export function getS3Client(): S3Client | null {
  if (!env.S3_ENDPOINT || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) {
    return null;
  }

  return new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: "garage",
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });
}

/** Content types for accepted image uploads. */
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export interface UploadResult {
  url: string;
  key: string;
}

/**
 * Generate a presigned PUT URL for a profile picture upload.
 * Returns the public URL that will be accessible after upload.
 */
export async function getPresignedUploadUrl(
  userId: string,
  contentType: string,
): Promise<UploadResult> {
  const s3 = getS3Client();
  if (!s3) {
    throw new Error("S3 is not configured");
  }

  const bucket = env.S3_BUCKET;
  if (!bucket) {
    throw new Error("S3_BUCKET is not configured");
  }

  const ext = ALLOWED_TYPES[contentType];
  if (!ext) {
    throw new Error(
      `Unsupported file type: ${contentType}. Allowed: ${Object.keys(ALLOWED_TYPES).join(", ")}`,
    );
  }

  const key = `profiles/${userId}/${Date.now()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    // Profile images are publicly readable
    ACL: "public-read",
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  const publicUrl = env.S3_PUBLIC_URL
    ? `${env.S3_PUBLIC_URL}/${key}`
    : `${env.S3_ENDPOINT}/${bucket}/${key}`;

  return { url: presignedUrl, key: publicUrl };
}

/**
 * Delete a profile picture from S3 given its public URL.
 */
export async function deleteProfileImage(publicUrl: string): Promise<void> {
  const s3 = getS3Client();
  if (!s3) return;

  const bucket = env.S3_BUCKET;
  if (!bucket) return;

  // Extract the key from the public URL
  const bucketIndex = publicUrl.indexOf(`/${bucket}/`);
  if (bucketIndex === -1) return;

  const key = publicUrl.slice(bucketIndex + bucket.length + 2);

  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

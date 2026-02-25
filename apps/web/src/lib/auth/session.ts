import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const SESSION_DURATION_MS = 60 * 24 * 60 * 60 * 1000; // 60 days

interface SessionPayload {
  userId: string;
  exp: number;
}

function getKey(): Buffer {
  const secret = process.env.ADMIN_SECRET!;
  // Derive a 32-byte key from the secret by padding/hashing
  const key = Buffer.alloc(32);
  Buffer.from(secret, "utf-8").copy(key);
  return key;
}

export function createAdminSession(userId: string): string {
  const payload: SessionPayload = {
    userId,
    exp: Date.now() + SESSION_DURATION_MS,
  };

  const iv = randomBytes(12);
  const key = getKey();
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const plaintext = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf-8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:ciphertext (all hex)
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function validateAdminSession(cookie: string): { userId: string } | null {
  try {
    const parts = cookie.split(":");
    if (parts.length !== 3) return null;

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = Buffer.from(parts[2], "hex");
    const key = getKey();

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    const payload: SessionPayload = JSON.parse(decrypted.toString("utf-8"));

    if (payload.exp < Date.now()) return null;

    return { userId: payload.userId };
  } catch {
    return null;
  }
}

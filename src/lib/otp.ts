import crypto from "crypto";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { sendOtpEmail } from "@/lib/email";

type Purpose = "SIGNUP" | "RESET";

const TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

const hash = (email: string, purpose: Purpose, code: string) =>
  crypto.createHmac("sha256", process.env.SESSION_SECRET ?? "").update(`${email}|${purpose}|${code}`).digest("hex");

/** Creates (or replaces) a code for this email and emails it. `payload` is kept until the code is verified. */
export async function issueOtp(email: string, purpose: Purpose, payload?: Prisma.InputJsonValue) {
  const existing = await db.emailOtp.findUnique({ where: { email_purpose: { email, purpose } } });
  if (existing && Date.now() - existing.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    return { ok: false as const, error: "Please wait a few seconds before requesting another code." };
  }

  const code = crypto.randomInt(100000, 1000000).toString();
  const data = {
    codeHash: hash(email, purpose, code),
    payload: payload ?? existing?.payload ?? Prisma.JsonNull,
    attempts: 0,
    expiresAt: new Date(Date.now() + TTL_MS),
    createdAt: new Date(),
  };
  await db.emailOtp.upsert({
    where: { email_purpose: { email, purpose } },
    update: data,
    create: { email, purpose, ...data },
  });

  const sent = await sendOtpEmail(email, code, purpose);
  // Without SMTP credentials the code is printed to the server log, which is fine for local testing only.
  if (!sent.success && process.env.NODE_ENV === "production") {
    return { ok: false as const, error: "We could not send the email. Please try again later." };
  }
  return { ok: true as const };
}

export async function checkOtp(email: string, purpose: Purpose, code: string) {
  const row = await db.emailOtp.findUnique({ where: { email_purpose: { email, purpose } } });
  if (!row || row.expiresAt.getTime() < Date.now()) {
    return { ok: false as const, error: "This code has expired. Please request a new one." };
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    await db.emailOtp.delete({ where: { id: row.id } });
    return { ok: false as const, error: "Too many wrong attempts. Please request a new code." };
  }

  const expected = Buffer.from(row.codeHash);
  const given = Buffer.from(hash(email, purpose, code.trim()));
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) {
    await db.emailOtp.update({ where: { id: row.id }, data: { attempts: { increment: 1 } } });
    return { ok: false as const, error: "Incorrect code. Please try again." };
  }

  await db.emailOtp.delete({ where: { id: row.id } });
  return { ok: true as const, payload: row.payload };
}

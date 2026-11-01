import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "admin_session";
export const CUSTOMER_COOKIE = "customer_session";
const key = () => new TextEncoder().encode(process.env.SESSION_SECRET);

async function sign(claims: Record<string, string>) {
  return new SignJWT(claims).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key());
}

async function verify(token?: string) {
  if (!token) return null;
  try {
    return (await jwtVerify(token, key(), { algorithms: ["HS256"] })).payload;
  } catch {
    return null;
  }
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
} as const;

/* ---------- admin ---------- */

export async function verifySession(token?: string) {
  const payload = await verify(token);
  return typeof payload?.adminId === "string" ? payload.adminId : null;
}

export async function createSession(adminId: string) {
  (await cookies()).set(SESSION_COOKIE, await sign({ adminId }), cookieOptions);
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  const store = await cookies();
  const adminId = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!adminId) redirect("/admin/login");
  return adminId;
}

/* ---------- customers ---------- */

export async function createCustomerSession(customerId: string) {
  (await cookies()).set(CUSTOMER_COOKIE, await sign({ customerId }), cookieOptions);
}

export async function destroyCustomerSession() {
  (await cookies()).delete(CUSTOMER_COOKIE);
}

/** The logged-in customer's id, or null for guests. */
export async function getCustomerId() {
  const payload = await verify((await cookies()).get(CUSTOMER_COOKIE)?.value);
  return typeof payload?.customerId === "string" ? payload.customerId : null;
}

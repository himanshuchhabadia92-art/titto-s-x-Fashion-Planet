"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createCustomerSession, destroyCustomerSession } from "@/lib/session";
import { checkOtp, issueOtp } from "@/lib/otp";

export type FormState = { error?: string; notice?: string; step?: "verify"; email?: string } | undefined;

const text = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- sign up: details -> emailed code -> account ---------- */

export async function startRegister(_: FormState, form: FormData): Promise<FormState> {
  const name = text(form, "name");
  const email = text(form, "email").toLowerCase();
  const phone = text(form, "phone").replace(/\D/g, "").slice(-10);
  const password = String(form.get("password") ?? "");

  if (name.length < 2) return { error: "Please enter your name" };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email" };
  if (!/^\d{10}$/.test(phone)) return { error: "Please enter a valid 10-digit phone number" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };

  const existing = await db.customer.findUnique({ where: { email } });
  if (existing?.passwordHash) return { error: "An account with this email already exists. Please log in." };

  const sent = await issueOtp(email, "SIGNUP", { name, phone, passwordHash: await bcrypt.hash(password, 10) });
  if (!sent.ok) return { error: sent.error };
  return { step: "verify", email };
}

export async function verifyRegister(_: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email").toLowerCase();
  const result = await checkOtp(email, "SIGNUP", text(form, "code"));
  if (!result.ok) return { step: "verify", email, error: result.error };

  if (!result.payload) return { error: "Something went wrong. Please sign up again." };
  const { name, phone, passwordHash } = result.payload as { name: string; phone: string; passwordHash: string };
  const data = { name, phone, passwordHash, registeredAt: new Date() };
  const existing = await db.customer.findUnique({ where: { email } });
  const customer = existing
    ? await db.customer.update({ where: { id: existing.id }, data })
    : await db.customer.create({ data: { ...data, email } });

  await createCustomerSession(customer.id);
  redirect("/account");
}

/* ---------- forgot password: email -> emailed code -> new password ---------- */

export async function startReset(_: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email").toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email" };

  // Same answer whether or not the account exists, so emails can't be probed.
  const customer = await db.customer.findUnique({ where: { email } });
  if (customer?.passwordHash) {
    const sent = await issueOtp(email, "RESET");
    if (!sent.ok) return { error: sent.error };
  }
  return { step: "verify", email };
}

export async function completeReset(_: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { step: "verify", email, error: "Password must be at least 8 characters" };

  const result = await checkOtp(email, "RESET", text(form, "code"));
  if (!result.ok) return { step: "verify", email, error: result.error };

  const customer = await db.customer.findUnique({ where: { email } });
  if (!customer) return { step: "verify", email, error: "Account not found" };
  await db.customer.update({ where: { id: customer.id }, data: { passwordHash: await bcrypt.hash(password, 10) } });

  await createCustomerSession(customer.id);
  redirect("/account");
}

/** Sends a fresh code for a flow that is already waiting on one. */
export async function resendOtp(purpose: "SIGNUP" | "RESET", _: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email").toLowerCase();
  // Only re-send for flows that are really in progress, so this can't be used to email arbitrary addresses.
  const pending =
    purpose === "SIGNUP"
      ? await db.emailOtp.findUnique({ where: { email_purpose: { email, purpose } } })
      : (await db.customer.findUnique({ where: { email } }))?.passwordHash;
  if (!pending) return { step: "verify", email, notice: "A new code has been sent." };
  const sent = await issueOtp(email, purpose);
  if (!sent.ok) return { step: "verify", email, error: sent.error };
  return { step: "verify", email, notice: "A new code has been sent." };
}

/* ---------- log in / out ---------- */

export async function loginCustomer(_: FormState, form: FormData): Promise<FormState> {
  const customer = await db.customer.findUnique({ where: { email: text(form, "email").toLowerCase() } });
  if (!customer?.passwordHash || !(await bcrypt.compare(String(form.get("password") ?? ""), customer.passwordHash))) {
    return { error: "Invalid email or password" };
  }
  await createCustomerSession(customer.id);
  redirect("/account");
}

export async function logoutCustomer() {
  await destroyCustomerSession();
  redirect("/");
}

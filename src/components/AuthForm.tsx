"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  completeReset,
  loginCustomer,
  resendOtp,
  startRegister,
  startReset,
  verifyRegister,
} from "@/app/account/actions";

const input = "w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-white text-black";
const submit =
  "w-full bg-black text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50";

type Mode = "login" | "register" | "forgot";

const TITLES: Record<Mode, string> = { login: "Log in", register: "Create account", forgot: "Reset password" };

export default function AuthForm({ mode }: { mode: Mode }) {
  const [first, firstAction, firstPending] = useActionState(
    mode === "login" ? loginCustomer : mode === "register" ? startRegister : startReset,
    undefined,
  );
  const [second, secondAction, secondPending] = useActionState(mode === "register" ? verifyRegister : completeReset, undefined);
  const [resent, resendAction, resendPending] = useActionState(resendOtp.bind(null, mode === "register" ? "SIGNUP" : "RESET"), undefined);

  const verifying = first?.step === "verify";
  const email = second?.email ?? first?.email ?? "";
  const error = verifying ? (second?.error ?? resent?.error) : first?.error;

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-3xl font-display font-black uppercase tracking-tight mb-8">{TITLES[mode]}</h1>

      {verifying ? (
        <>
          <p className="text-sm text-gray-600 mb-6">
            We sent a 6-digit code to <b>{email}</b>. Enter it below{mode === "forgot" ? " with your new password" : ""}.
          </p>
          <form action={secondAction} className="space-y-4">
            <input type="hidden" name="email" value={email} />
            <input
              name="code"
              required
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="6-digit code"
              className={`${input} tracking-[0.4em] text-center text-lg`}
            />
            {mode === "forgot" && (
              <input name="password" type="password" required minLength={8} placeholder="New password (min 8 characters)" autoComplete="new-password" className={input} />
            )}
            {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
            {resent?.notice && !error && <p className="text-green-700 text-sm font-bold">{resent.notice}</p>}
            <button disabled={secondPending} className={submit}>
              {secondPending ? "Please wait…" : mode === "register" ? "Verify & create account" : "Reset password"}
            </button>
          </form>
          <form action={resendAction} className="mt-4">
            <input type="hidden" name="email" value={email} />
            <button disabled={resendPending} className="text-sm underline font-bold disabled:opacity-50">
              Resend code
            </button>
          </form>
        </>
      ) : (
        <form action={firstAction} className="space-y-4">
          {mode === "register" && (
            <>
              <input name="name" required placeholder="Full name" autoComplete="name" className={input} />
              <input name="phone" type="tel" required placeholder="Phone (10 digits)" autoComplete="tel" className={input} />
            </>
          )}
          <input name="email" type="email" required placeholder="Email" autoComplete="email" className={input} />
          {mode !== "forgot" && (
            <input
              name="password"
              type="password"
              required
              minLength={mode === "register" ? 8 : undefined}
              placeholder={mode === "login" ? "Password" : "Password (min 8 characters)"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className={input}
            />
          )}
          {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
          <button disabled={firstPending} className={submit}>
            {firstPending ? "Please wait…" : mode === "login" ? "Log in" : mode === "register" ? "Send verification code" : "Send reset code"}
          </button>
        </form>
      )}

      <div className="mt-6 text-sm text-gray-600 space-y-2">
        {mode === "login" && (
          <p>
            <Link href="/account/forgot" className="font-bold underline">
              Forgot password?
            </Link>
          </p>
        )}
        <p>
          {mode === "login" ? "New here? " : "Back to "}
          <Link href={mode === "login" ? "/account/register" : "/account/login"} className="font-bold underline">
            {mode === "login" ? "Create an account" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
}

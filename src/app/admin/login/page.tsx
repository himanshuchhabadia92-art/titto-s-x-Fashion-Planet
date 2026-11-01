"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { btnCls, inputCls } from "@/app/admin/ui";

export default function AdminLogin() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form action={action} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-8 space-y-4 text-black">
        <h1 className="text-xl font-bold">Admin login</h1>
        <input name="email" type="email" required placeholder="Email" autoComplete="username" className={inputCls} />
        <input name="password" type="password" required placeholder="Password" autoComplete="current-password" className={inputCls} />
        {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
        <button disabled={pending} className={`${btnCls} w-full`}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

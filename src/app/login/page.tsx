"use client";

import { useActionState } from "react";
import { signIn } from "./actions";

const field =
  "w-full border-b border-hair bg-transparent py-2 text-sm outline-none focus:border-accent";
const label = "text-[11px] font-medium uppercase tracking-[0.2em] text-faint";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">VolunTable</p>
      <h1 className="mt-3 text-3xl font-light">Entrar</h1>
      <div className="mt-4 flex h-0.5 w-7"><span className="w-2/3 bg-accent" /><span className="w-1/3 bg-orange" /></div>
      <form action={action} className="mt-10 space-y-6">
        <label className="block space-y-1">
          <span className={label}>E-mail</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="block space-y-1">
          <span className={label}>Senha</span>
          <input name="password" type="password" required autoComplete="current-password" className={field} />
        </label>
        {state?.error && (
          <p role="alert" className="border-l-2 border-accent bg-wash px-3 py-2 text-sm text-ink">{state.error}</p>
        )}
        <button
          disabled={pending}
          className="w-full bg-ink py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}

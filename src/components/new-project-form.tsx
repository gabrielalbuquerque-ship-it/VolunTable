"use client";

import { useActionState, useEffect, useRef } from "react";
import { createProject } from "@/app/projetos/actions";
import { STATUS } from "@/lib/projects";

const field = "w-full border-b border-hair bg-transparent py-2 text-sm outline-none focus:border-accent";
const label = "text-[11px] font-medium uppercase tracking-[0.2em] text-faint";

export function NewProjectForm() {
  const [state, action, pending] = useActionState(createProject, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="grid gap-6 border border-hair border-t-2 border-t-accent p-6 md:grid-cols-2">
      <label className="space-y-1 md:col-span-2">
        <span className={label}>Nome</span>
        <input name="name" required maxLength={120} className={field} />
      </label>
      <label className="space-y-1 md:col-span-2">
        <span className={label}>Descrição</span>
        <textarea name="description" rows={2} maxLength={2000} className={field} />
      </label>
      <label className="space-y-1">
        <span className={label}>Status</span>
        <select name="status" defaultValue="planejado" className={field}>
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </label>
      <label className="space-y-1">
        <span className={label}>Prazo</span>
        <input name="due_date" type="date" className={field} />
      </label>
      {state?.error && (
        <p role="alert" className="border-l-2 border-accent bg-wash px-3 py-2 text-sm md:col-span-2">{state.error}</p>
      )}
      <div className="md:col-span-2">
        <button disabled={pending} className="bg-ink px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {pending ? "Criando..." : "Criar projeto"}
        </button>
      </div>
    </form>
  );
}

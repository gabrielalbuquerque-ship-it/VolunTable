"use client";

import { useEffect, useRef, useState } from "react";
import { STATUS, STATUS_KEYS, type Project, type ProjectInput, type ProjectPatch, type ProjectStatus } from "@/lib/projects";
import { formatTimestamp } from "@/lib/format";
import { IconCalendar, IconClose, IconLongText, IconSelect, IconText, IconTrash } from "./icons";

const label = "flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-faint";
const input =
  "mt-2 w-full rounded-md border border-hair bg-white px-3 py-2 text-sm text-ink outline-none transition-colors hover:border-faint focus:border-accent";

type Props =
  | { mode: "edit"; project: Project; onUpdate: (patch: ProjectPatch) => void; onDelete: () => void; onClose: () => void }
  | { mode: "create"; onCreate: (input: ProjectInput) => void; onClose: () => void };

export function RecordPanel(props: Props) {
  const { onClose } = props;
  const panel = useRef<HTMLDivElement>(null);
  const [confirming, setConfirming] = useState(false);
  const project = props.mode === "edit" ? props.project : null;

  useEffect(() => {
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function commit(patch: ProjectPatch) {
    if (props.mode !== "edit") return;
    const changed = (Object.keys(patch) as (keyof ProjectPatch)[]).some((k) => patch[k] !== props.project[k]);
    if (changed) props.onUpdate(patch);
  }

  function submitCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (props.mode !== "create") return;
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    if (!name) return;
    props.onCreate({
      name,
      status: String(f.get("status")) as ProjectStatus,
      due_date: String(f.get("due_date") ?? "") || null,
      description: String(f.get("description") ?? "").trim() || null,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Fechar painel" onClick={onClose} className="absolute inset-0 bg-ink/15" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-title"
        tabIndex={-1}
        className="relative flex h-full w-full max-w-lg flex-col border-l border-hair bg-white shadow-[-12px_0_40px_rgba(39,28,24,0.08)] outline-none"
      >
        <header className="flex items-start justify-between gap-4 border-b border-ink px-8 pt-7 pb-5">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-accent">
              {project ? "Registro · Projetos" : "Novo registro"}
            </p>
            <h2 id="record-title" className="mt-2 truncate text-2xl font-light">
              {project ? project.name : "Novo projeto"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="mt-1 rounded p-1 text-slate transition-colors hover:bg-wash hover:text-ink"
          >
            <IconClose />
          </button>
        </header>

        <form
          key={project?.id ?? "new"}
          onSubmit={submitCreate}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-7 overflow-y-auto px-8 py-7">
            <label className="block">
              <span className={label}><IconText className="size-3.5" />Nome</span>
              <input
                name="name"
                required
                maxLength={120}
                autoFocus={!project}
                defaultValue={project?.name}
                onBlur={(e) => e.target.value.trim() && commit({ name: e.target.value.trim() })}
                className={input}
              />
            </label>

            <div className="grid grid-cols-2 gap-5">
              <label className="block">
                <span className={label}><IconSelect className="size-3.5" />Status</span>
                <select
                  name="status"
                  defaultValue={project?.status ?? "planejado"}
                  onChange={(e) => commit({ status: e.target.value as ProjectStatus })}
                  className={input}
                >
                  {STATUS_KEYS.map((k) => (
                    <option key={k} value={k}>{STATUS[k].label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={label}><IconCalendar className="size-3.5" />Prazo</span>
                <input
                  name="due_date"
                  type="date"
                  defaultValue={project?.due_date ?? ""}
                  onChange={(e) => commit({ due_date: e.target.value || null })}
                  className={input}
                />
              </label>
            </div>

            <label className="block">
              <span className={label}><IconLongText className="size-3.5" />Descrição</span>
              <textarea
                name="description"
                rows={7}
                maxLength={2000}
                defaultValue={project?.description ?? ""}
                onBlur={(e) => commit({ description: e.target.value.trim() || null })}
                className={`${input} resize-y leading-relaxed`}
              />
            </label>

            {project && (
              <dl className="grid grid-cols-2 border-t border-hair pt-4">
                <div>
                  <dt className={label}>Criado em</dt>
                  <dd className="mt-1 text-sm font-medium">{formatTimestamp(project.created_at)}</dd>
                </div>
                <div>
                  <dt className={label}>Status atual</dt>
                  <dd className="mt-1 text-sm font-medium">{STATUS[project.status].label}</dd>
                </div>
              </dl>
            )}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-hair px-8 py-4">
            {props.mode === "create" ? (
              <>
                <button type="button" onClick={onClose} className="text-sm text-slate hover:text-ink">
                  Cancelar
                </button>
                <button className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
                  Criar registro
                </button>
              </>
            ) : confirming ? (
              <div className="flex w-full items-center justify-between gap-3 border-l-2 border-accent bg-wash px-3 py-2">
                <span className="text-sm">Excluir este registro? Não dá para desfazer.</span>
                <span className="flex shrink-0 gap-3">
                  <button type="button" onClick={() => setConfirming(false)} className="text-sm text-slate hover:text-ink">
                    Cancelar
                  </button>
                  <button type="button" onClick={props.onDelete} className="text-sm font-medium text-accent">
                    Excluir
                  </button>
                </span>
              </div>
            ) : (
              <>
                <span className="text-xs text-faint">Alterações salvas automaticamente</span>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="flex items-center gap-1.5 text-sm text-slate transition-colors hover:text-accent"
                >
                  <IconTrash />
                  Excluir
                </button>
              </>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useOptimistic, useState, useTransition } from "react";
import { createProject, deleteProject, updateProject, type ActionResult } from "@/app/projetos/actions";
import { STATUS, STATUS_KEYS, type Project, type ProjectInput, type ProjectPatch, type ProjectStatus } from "@/lib/projects";
import { todayIso } from "@/lib/format";
import { GridView } from "./grid-view";
import { KanbanView } from "./kanban-view";
import { RecordPanel } from "./record-panel";
import { IconFilter, IconGrid, IconKanban, IconPlus, IconSearch, IconSort } from "./icons";
import type { ViewId } from "./views";

type Mutation =
  | { type: "add"; project: Project }
  | { type: "update"; id: string; patch: ProjectPatch }
  | { type: "delete"; id: string };

function reduce(state: Project[], m: Mutation): Project[] {
  switch (m.type) {
    case "add":
      return [m.project, ...state];
    case "update":
      return state.map((p) => (p.id === m.id ? { ...p, ...m.patch } : p));
    case "delete":
      return state.filter((p) => p.id !== m.id);
  }
}

type Sort = "recentes" | "nome" | "prazo";
const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
const SORTERS: Record<Sort, (a: Project, b: Project) => number> = {
  recentes: (a, b) => b.created_at.localeCompare(a.created_at),
  nome: (a, b) => collator.compare(a.name, b.name),
  prazo: (a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"),
};

const control =
  "h-8 rounded-md border border-hair bg-white text-xs text-ink outline-none transition-colors hover:border-faint focus:border-accent";

type Panel = { mode: "create" } | { mode: "edit"; id: string } | null;

export function Workspace({ projects, view }: { projects: Project[]; view: ViewId }) {
  const [items, apply] = useOptimistic(projects, reduce);
  const [, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "todos">("todos");
  const [sort, setSort] = useState<Sort>("recentes");
  const today = todayIso();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  function run(m: Mutation, action: () => Promise<ActionResult>) {
    startTransition(async () => {
      apply(m);
      const res = await action();
      if (res.error) setToast(res.error);
    });
  }

  const onUpdate = (id: string, patch: ProjectPatch) =>
    run({ type: "update", id, patch }, () => updateProject(id, patch));

  const onCreate = (input: ProjectInput) =>
    run(
      {
        type: "add",
        project: { ...input, id: `tmp-${crypto.randomUUID()}`, created_at: new Date().toISOString() },
      },
      () => createProject(input),
    );

  const onDelete = (id: string) => {
    setPanel(null);
    run({ type: "delete", id }, () => deleteProject(id));
  };

  const closePanel = useCallback(() => setPanel(null), []);

  const q = query.trim().toLocaleLowerCase("pt-BR");
  const visible = items
    .filter((p) => status === "todos" || p.status === status)
    .filter(
      (p) =>
        !q ||
        p.name.toLocaleLowerCase("pt-BR").includes(q) ||
        (p.description ?? "").toLocaleLowerCase("pt-BR").includes(q),
    )
    .sort(SORTERS[sort]);
  const isFiltered = !!q || status !== "todos";
  const editing = panel?.mode === "edit" ? items.find((p) => p.id === panel.id) : undefined;

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-ink px-5 py-3.5">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-faint">
            Volund · <span className="text-accent">Tabela</span>
          </p>
          <h1 className="mt-0.5 text-xl font-medium">
            Projetos
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setPanel({ mode: "create" })}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-accent px-3 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <IconPlus className="size-3.5" />
          Novo registro
        </button>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-hair px-5 py-2">
        <nav aria-label="Visualizações" className="-mb-2 flex gap-1">
          {(
            [
              { id: "grade", label: "Grade", Icon: IconGrid },
              { id: "kanban", label: "Kanban", Icon: IconKanban },
            ] as const
          ).map(({ id, label, Icon }) => (
            <Link
              key={id}
              href={`/projetos?view=${id}`}
              aria-current={view === id ? "page" : undefined}
              className={`flex items-center gap-1.5 border-b-2 px-2.5 pt-1 pb-2.5 text-xs font-medium transition-colors ${
                view === id ? "border-accent text-ink" : "border-transparent text-slate hover:text-ink"
              }`}
            >
              <Icon className={`size-3.5 ${view === id ? "text-accent" : "text-faint"}`} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Buscar</span>
            <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar registros"
              className={`${control} w-48 pr-2 pl-8 placeholder:text-faint`}
            />
          </label>
          <label className="relative">
            <span className="sr-only">Filtrar por status</span>
            <IconFilter className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus | "todos")}
              className={`${control} pr-2 pl-8 ${status !== "todos" ? "border-acc-lt text-accent" : ""}`}
            >
              <option value="todos">Todos os status</option>
              {STATUS_KEYS.map((k) => (
                <option key={k} value={k}>{STATUS[k].label}</option>
              ))}
            </select>
          </label>
          <label className="relative">
            <span className="sr-only">Ordenar</span>
            <IconSort className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className={`${control} pr-2 pl-8`}
            >
              <option value="recentes">Mais recentes</option>
              <option value="nome">Nome (A–Z)</option>
              <option value="prazo">Prazo mais próximo</option>
            </select>
          </label>
        </div>
      </div>

      {view === "kanban" ? (
        <KanbanView
          projects={visible}
          today={today}
          onUpdate={onUpdate}
          onCreate={onCreate}
          onOpen={(id) => setPanel({ mode: "edit", id })}
        />
      ) : (
        <GridView
          projects={visible}
          today={today}
          isFiltered={isFiltered}
          onUpdate={onUpdate}
          onCreate={onCreate}
          onOpen={(id) => setPanel({ mode: "edit", id })}
        />
      )}

      <footer className="flex items-center justify-between border-t border-hair bg-white px-5 py-2 text-[11px] text-slate">
        <span className="tabular-nums">
          {visible.length} {visible.length === 1 ? "registro" : "registros"}
          {isFiltered && ` de ${items.length}`}
        </span>
        <span className="hidden text-faint sm:inline">Documento interno · Volund — Extreme Group</span>
      </footer>

      {panel?.mode === "create" && <RecordPanel mode="create" onCreate={onCreate} onClose={closePanel} />}
      {editing && (
        <RecordPanel
          mode="edit"
          project={editing}
          onUpdate={(patch) => onUpdate(editing.id, patch)}
          onDelete={() => onDelete(editing.id)}
          onClose={closePanel}
        />
      )}

      <div aria-live="polite" className="pointer-events-none fixed bottom-14 left-1/2 z-[60] -translate-x-1/2">
        {toast && (
          <p className="pointer-events-auto border-l-2 border-accent bg-wash px-4 py-2.5 text-sm text-ink shadow-[0_8px_24px_rgba(39,28,24,0.12)]">
            {toast}
          </p>
        )}
      </div>
    </>
  );
}

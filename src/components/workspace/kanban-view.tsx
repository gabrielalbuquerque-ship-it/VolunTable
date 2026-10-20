"use client";

import { useState } from "react";
import { STATUS, STATUS_KEYS, type Project, type ProjectInput, type ProjectPatch, type ProjectStatus } from "@/lib/projects";
import { formatDate } from "@/lib/format";
import { StatusPill } from "./status-pill";
import { IconCalendar, IconPlus } from "./icons";

export function KanbanView({
  projects,
  today,
  onUpdate,
  onCreate,
  onOpen,
}: {
  projects: Project[];
  today: string;
  onUpdate: (id: string, patch: ProjectPatch) => void;
  onCreate: (input: ProjectInput) => void;
  onOpen: (id: string) => void;
}) {
  const [over, setOver] = useState<ProjectStatus | null>(null);
  const [adding, setAdding] = useState<ProjectStatus | null>(null);

  function drop(e: React.DragEvent, status: ProjectStatus) {
    e.preventDefault();
    setOver(null);
    const id = e.dataTransfer.getData("text/plain");
    const p = projects.find((x) => x.id === id);
    if (p && p.status !== status) onUpdate(id, { status });
  }

  function add(e: React.FormEvent<HTMLFormElement>, status: ProjectStatus) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "").trim();
    if (name) onCreate({ name, status, description: null, due_date: null });
    setAdding(null);
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-white">
      <div className="flex min-h-full gap-4 p-5">
        {STATUS_KEYS.map((status) => {
          const cards = projects.filter((p) => p.status === status);
          return (
            <section
              key={status}
              aria-label={STATUS[status].label}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(status);
              }}
              onDragLeave={() => setOver((s) => (s === status ? null : s))}
              onDrop={(e) => drop(e, status)}
              className={`flex w-72 shrink-0 flex-col rounded-lg border p-2 transition-colors ${
                over === status ? "border-acc-lt bg-wash" : "border-transparent bg-wash/70"
              }`}
            >
              <header className="flex items-center justify-between px-1.5 pt-1 pb-3">
                <StatusPill status={status} />
                <span className="text-xs text-slate tabular-nums">{cards.length}</span>
              </header>

              <ul className="flex flex-col gap-2">
                {cards.map((p) => {
                  const pending = p.id.startsWith("tmp-");
                  const overdue = !!p.due_date && p.due_date < today && status !== "concluido";
                  return (
                    <li
                      key={p.id}
                      draggable={!pending}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", p.id);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      className={`rounded-md border border-t-2 border-hair bg-white shadow-[0_1px_2px_rgba(39,28,24,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(39,28,24,0.08)] ${STATUS[status].bar} ${
                        pending ? "opacity-50" : "cursor-grab active:cursor-grabbing"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => onOpen(p.id)}
                        className="block w-full p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <span className="block text-sm font-medium text-ink">{p.name}</span>
                        {p.description && (
                          <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate">
                            {p.description}
                          </span>
                        )}
                        {p.due_date && (
                          <span
                            className={`mt-3 flex items-center gap-1.5 border-t border-hair pt-2 text-[11px] ${
                              overdue ? "text-accent" : "text-slate"
                            }`}
                          >
                            <IconCalendar className="size-3.5" />
                            {formatDate(p.due_date)}
                            {overdue && <span className="uppercase tracking-[0.12em]">· Atrasado</span>}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {adding === status ? (
                <form onSubmit={(e) => add(e, status)} className="mt-2">
                  <input
                    name="name"
                    autoFocus
                    maxLength={120}
                    placeholder="Nome do projeto"
                    aria-label="Nome do novo registro"
                    onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                    onKeyDown={(e) => e.key === "Escape" && setAdding(null)}
                    className="h-9 w-full rounded-md border border-accent bg-white px-3 text-sm outline-none"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(status)}
                  className="mt-2 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-slate transition-colors hover:bg-white hover:text-ink"
                >
                  <IconPlus className="size-3.5" />
                  Novo registro
                </button>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

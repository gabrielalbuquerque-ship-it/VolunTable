"use client";

import { useState } from "react";
import type { Project, ProjectInput, ProjectPatch } from "@/lib/projects";
import { formatTimestamp } from "@/lib/format";
import { DateCell, StatusCell, TextCell } from "./cells";
import {
  IconCalendar,
  IconClock,
  IconExpand,
  IconLongText,
  IconPlus,
  IconSelect,
  IconText,
} from "./icons";

const th =
  "sticky top-0 z-20 h-9 border-r border-b border-hair bg-wash px-3 text-left text-xs font-medium text-slate";
const td = "relative h-9 border-r border-b border-hair bg-white p-0 group-hover:bg-row-hover";

function Header({ icon: Icon, children, className = "" }: {
  icon: (p: { className?: string }) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th scope="col" className={`${th} ${className}`}>
      <span className="flex items-center gap-1.5">
        <Icon className="size-3.5 text-faint" />
        {children}
      </span>
    </th>
  );
}

export function GridView({
  projects,
  today,
  isFiltered,
  onUpdate,
  onCreate,
  onOpen,
}: {
  projects: Project[];
  today: string;
  isFiltered: boolean;
  onUpdate: (id: string, patch: ProjectPatch) => void;
  onCreate: (input: ProjectInput) => void;
  onOpen: (id: string) => void;
}) {
  const [draft, setDraft] = useState("");

  function quickAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = draft.trim();
    if (!name) return;
    onCreate({ name, description: null, status: "planejado", due_date: null });
    setDraft("");
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="w-max min-w-full table-fixed border-separate border-spacing-0">
        <colgroup>
          <col className="w-14" />
          <col className="w-72" />
          <col className="w-44" />
          <col className="w-40" />
          <col className="w-[26rem]" />
          <col className="w-36" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={`${th} left-0 z-30 text-center`}>
              <span className="sr-only">Linha</span>
            </th>
            <Header icon={IconText} className="left-14 z-30">Nome</Header>
            <Header icon={IconSelect}>Status</Header>
            <Header icon={IconCalendar}>Prazo</Header>
            <Header icon={IconLongText}>Descrição</Header>
            <Header icon={IconClock}>Criado em</Header>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => {
            const pending = p.id.startsWith("tmp-");
            const overdue = !!p.due_date && p.due_date < today && p.status !== "concluido";
            return (
              <tr key={p.id} className={`group ${pending ? "pointer-events-none opacity-50" : ""}`}>
                <td className={`${td} sticky left-0 z-10`}>
                  <div className="flex h-9 items-center justify-between pr-1.5 pl-3 text-[11px] text-faint">
                    <span className="tabular-nums">{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => onOpen(p.id)}
                      aria-label={`Abrir ${p.name}`}
                      className="rounded p-0.5 text-slate opacity-0 transition-opacity group-hover:opacity-100 hover:text-accent focus-visible:opacity-100"
                    >
                      <IconExpand className="size-3.5" />
                    </button>
                  </div>
                </td>
                <td className={`${td} sticky left-14 z-10 font-medium`}>
                  <TextCell
                    label="nome"
                    required
                    value={p.name}
                    onCommit={(name) => onUpdate(p.id, { name })}
                    className="font-medium"
                  />
                </td>
                <td className={td}>
                  <StatusCell value={p.status} onCommit={(status) => onUpdate(p.id, { status })} />
                </td>
                <td className={td}>
                  <DateCell
                    value={p.due_date}
                    overdue={overdue}
                    onCommit={(due_date) => onUpdate(p.id, { due_date })}
                  />
                </td>
                <td className={td}>
                  <TextCell
                    label="descrição"
                    multiline
                    value={p.description ?? ""}
                    onCommit={(d) => onUpdate(p.id, { description: d || null })}
                    className="text-slate"
                  />
                </td>
                <td className={`${td} px-3 text-[13px] text-slate tabular-nums`}>
                  {pending ? "Salvando..." : formatTimestamp(p.created_at)}
                </td>
              </tr>
            );
          })}

          {projects.length === 0 && (
            <tr>
              <td colSpan={6} className="border-b border-hair px-6 py-12 text-center text-sm text-slate">
                {isFiltered
                  ? "Nenhum registro corresponde à busca ou ao filtro."
                  : "Nenhum projeto ainda. Digite um nome abaixo para criar o primeiro."}
              </td>
            </tr>
          )}

          <tr>
            <td className="sticky left-0 h-9 border-r border-b border-hair bg-white">
              <span className="flex justify-center text-faint">
                <IconPlus className="size-3.5" />
              </span>
            </td>
            <td colSpan={5} className="h-9 border-b border-hair bg-white p-0">
              <form onSubmit={quickAdd} className="sticky left-14 w-[28rem]">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={120}
                  placeholder="Novo registro: digite o nome e pressione Enter"
                  aria-label="Nome do novo registro"
                  className="h-9 w-full bg-transparent px-3 text-[13px] outline-none placeholder:text-faint focus:ring-2 focus:ring-inset focus:ring-accent"
                />
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

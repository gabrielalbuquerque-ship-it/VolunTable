"use client";

import { useRef, useState } from "react";
import { STATUS, STATUS_KEYS, type ProjectStatus } from "@/lib/projects";
import { formatDate } from "@/lib/format";
import { StatusPill } from "./status-pill";
import { IconClose } from "./icons";

const cellBtn =
  "flex h-full w-full items-center px-3 text-left text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent";

export function TextCell({
  value,
  onCommit,
  label,
  required = false,
  multiline = false,
  placeholder = "",
  className = "",
}: {
  value: string;
  onCommit: (value: string) => void;
  label: string;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function start() {
    setDraft(value);
    setEditing(true);
  }
  function commit() {
    setEditing(false);
    const next = draft.trim();
    if (next === value.trim() || (required && !next)) return;
    onCommit(next);
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setEditing(false);
    if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      commit();
    }
  }

  if (editing) {
    const shared = {
      autoFocus: true,
      value: draft,
      "aria-label": label,
      onBlur: commit,
      onKeyDown,
      className:
        "w-full bg-white px-3 text-[13px] text-ink outline-none ring-2 ring-inset ring-accent",
    };
    return multiline ? (
      <textarea
        {...shared}
        maxLength={2000}
        onChange={(e) => setDraft(e.target.value)}
        className={`${shared.className} absolute top-0 left-0 z-30 min-h-32 py-2 shadow-lg`}
      />
    ) : (
      <input
        {...shared}
        maxLength={120}
        onChange={(e) => setDraft(e.target.value)}
        className={`${shared.className} h-full`}
      />
    );
  }

  return (
    <button type="button" onClick={start} aria-label={`Editar ${label}`} className={`${cellBtn} ${className}`}>
      <span className={`truncate ${value ? "" : "text-faint"}`}>{value || placeholder}</span>
    </button>
  );
}

export function StatusCell({
  value,
  onCommit,
}: {
  value: ProjectStatus;
  onCommit: (value: ProjectStatus) => void;
}) {
  return (
    <div className="relative flex h-full items-center px-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-accent">
      <StatusPill status={value} />
      <select
        aria-label="Status"
        value={value}
        onChange={(e) => onCommit(e.target.value as ProjectStatus)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {STATUS_KEYS.map((k) => (
          <option key={k} value={k}>
            {STATUS[k].label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DateCell({
  value,
  overdue,
  onCommit,
}: {
  value: string | null;
  overdue: boolean;
  onCommit: (value: string | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  function open() {
    try {
      ref.current?.showPicker();
    } catch {
      ref.current?.focus();
    }
  }

  return (
    <div className="group/date relative h-full">
      <button type="button" onClick={open} aria-label="Editar prazo" className={cellBtn}>
        {value ? (
          <span className={overdue ? "text-accent" : ""}>
            {formatDate(value)}
            {overdue && <span className="ml-2 text-[10px] uppercase tracking-[0.12em]">Atrasado</span>}
          </span>
        ) : (
          <span className="text-faint">—</span>
        )}
      </button>
      {value && (
        <button
          type="button"
          onClick={() => onCommit(null)}
          aria-label="Limpar prazo"
          className="absolute top-1/2 right-2 -translate-y-1/2 text-faint opacity-0 transition-opacity group-hover/date:opacity-100 hover:text-accent focus-visible:opacity-100"
        >
          <IconClose className="size-3.5" />
        </button>
      )}
      <input
        ref={ref}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={value ?? ""}
        onChange={(e) => onCommit(e.target.value || null)}
        className="pointer-events-none absolute bottom-0 left-3 h-0 w-0 opacity-0"
      />
    </div>
  );
}

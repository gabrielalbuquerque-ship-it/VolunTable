import { STATUS, type ProjectStatus } from "@/lib/projects";

export function StatusPill({ status }: { status: ProjectStatus }) {
  const s = STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${s.pill}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

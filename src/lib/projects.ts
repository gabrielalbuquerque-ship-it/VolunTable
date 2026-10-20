export const STATUS_KEYS = ["planejado", "em_andamento", "concluido", "pausado"] as const;

export type ProjectStatus = (typeof STATUS_KEYS)[number];

export const STATUS: Record<
  ProjectStatus,
  { label: string; pill: string; dot: string; bar: string }
> = {
  planejado: {
    label: "Planejado",
    pill: "border-hair text-slate",
    dot: "bg-faint",
    bar: "border-t-faint",
  },
  em_andamento: {
    label: "Em andamento",
    pill: "border-gold-lt text-gold",
    dot: "bg-gold",
    bar: "border-t-gold",
  },
  concluido: {
    label: "Concluído",
    pill: "border-acc-lt text-accent",
    dot: "bg-accent",
    bar: "border-t-accent",
  },
  pausado: {
    label: "Pausado",
    pill: "border-dashed border-faint text-slate",
    dot: "bg-ghost",
    bar: "border-t-hair",
  },
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  due_date: string | null;
  created_at: string;
};

export type ProjectInput = Pick<Project, "name" | "description" | "status" | "due_date">;

export type ProjectPatch = Partial<ProjectInput>;

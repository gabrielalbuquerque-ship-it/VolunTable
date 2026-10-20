export const STATUS = {
  planejado: { label: "Planejado", cls: "text-slate border-hair", bar: "border-t-faint" },
  em_andamento: { label: "Em andamento", cls: "text-gold border-gold-lt", bar: "border-t-gold" },
  concluido: { label: "Concluído", cls: "text-accent border-acc-lt", bar: "border-t-accent" },
  pausado: { label: "Pausado", cls: "text-faint border-hair", bar: "border-t-hair" },
} as const;

export type ProjectStatus = keyof typeof STATUS;

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  due_date: string | null;
  created_at: string;
};

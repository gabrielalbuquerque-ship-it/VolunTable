export const VIEW_IDS = ["grade", "kanban"] as const;

export type ViewId = (typeof VIEW_IDS)[number];

export function parseView(value: string | string[] | undefined): ViewId {
  return VIEW_IDS.find((v) => v === value) ?? "grade";
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { STATUS } from "@/lib/projects";

const schema = z.object({
  name: z.string().trim().min(1, "Informe o nome").max(120),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(Object.keys(STATUS) as [keyof typeof STATUS]),
  due_date: z.string().optional(),
});

export type CreateState = { error?: string; ok?: boolean } | undefined;

export async function createProject(_: CreateState, formData: FormData): Promise<CreateState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { description, due_date, ...rest } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .insert({ ...rest, description: description || null, due_date: due_date || null });
  if (error) return { error: "Não foi possível criar o projeto" };
  revalidatePath("/projetos");
  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { STATUS_KEYS, type ProjectInput, type ProjectPatch } from "@/lib/projects";

export type ActionResult = { error?: string };

const fields = {
  name: z.string().trim().min(1, "O nome não pode ficar vazio").max(120, "Use até 120 caracteres no nome"),
  description: z
    .string()
    .trim()
    .max(2000, "Use até 2000 caracteres na descrição")
    .nullable()
    .transform((v) => v || null),
  status: z.enum(STATUS_KEYS),
  due_date: z.iso.date("Data inválida").nullable(),
};

const createSchema = z.object(fields);
const patchSchema = z
  .object(fields)
  .partial()
  .refine((p) => Object.keys(p).length > 0, "Nada para atualizar");
const idSchema = z.uuid("Registro inválido");

async function authedClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ? supabase : null;
}

const SESSION_EXPIRED: ActionResult = { error: "Sua sessão expirou. Entre novamente." };

export async function createProject(input: ProjectInput): Promise<ActionResult> {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await authedClient();
  if (!supabase) return SESSION_EXPIRED;

  const { error } = await supabase.from("projects").insert(parsed.data);
  if (error) return { error: "Não foi possível criar o registro." };
  revalidatePath("/projetos");
  return {};
}

export async function updateProject(id: string, patch: ProjectPatch): Promise<ActionResult> {
  const parsedId = idSchema.safeParse(id);
  const parsed = patchSchema.safeParse(patch);
  if (!parsedId.success) return { error: parsedId.error.issues[0].message };
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await authedClient();
  if (!supabase) return SESSION_EXPIRED;

  const { data, error } = await supabase
    .from("projects")
    .update(parsed.data)
    .eq("id", parsedId.data)
    .select("id");
  if (error) return { error: "Não foi possível salvar a alteração." };
  if (!data?.length) return { error: "Registro não encontrado." };
  revalidatePath("/projetos");
  return {};
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { error: parsedId.error.issues[0].message };
  const supabase = await authedClient();
  if (!supabase) return SESSION_EXPIRED;

  const { error } = await supabase.from("projects").delete().eq("id", parsedId.data);
  if (error) return { error: "Não foi possível excluir o registro." };
  revalidatePath("/projetos");
  return {};
}

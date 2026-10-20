import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { Workspace } from "@/components/workspace/workspace";
import { parseView } from "@/components/workspace/views";
import type { Project } from "@/lib/projects";

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const supabase = await createClient();
  const [{ view: rawView }, claims, result] = await Promise.all([
    searchParams,
    supabase.auth.getClaims(),
    supabase
      .from("projects")
      .select("id,name,description,status,due_date,created_at")
      .order("created_at", { ascending: false })
      .overrideTypes<Project[], { merge: false }>(),
  ]);
  const view = parseView(rawView);
  const email = String(claims.data?.claims.email ?? "");

  return (
    <AppShell email={email} view={view}>
      {result.error ? (
        <div className="p-8">
          <p role="alert" className="border-l-2 border-gold bg-wash px-4 py-3 text-sm">
            Não foi possível carregar os projetos. Recarregue a página em instantes.
          </p>
        </div>
      ) : (
        <Workspace projects={result.data ?? []} view={view} />
      )}
    </AppShell>
  );
}

import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import { NewProjectForm } from "@/components/new-project-form";
import { STATUS, type Project } from "@/lib/projects";

export default async function ProjetosPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id,name,description,status,due_date,created_at")
    .order("created_at", { ascending: false })
    .overrideTypes<Project[], { merge: false }>();
  const projects = data ?? [];
  const fmt = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      <header className="flex items-center justify-between border-b border-ink py-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.25em]">VolunTable · Projetos</span>
        <form action={signOut}>
          <button className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate hover:text-accent">Sair</button>
        </form>
      </header>

      <section className="pt-16">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">Portfólio</p>
        <h1 className="mt-3 text-4xl font-light">Seus <span className="font-medium">projetos</span></h1>
        <div className="mt-4 flex h-0.5 w-7"><span className="w-2/3 bg-accent" /><span className="w-1/3 bg-orange" /></div>
        <p className="mt-4 text-sm text-slate">{projects.length} {projects.length === 1 ? "projeto" : "projetos"} cadastrados.</p>
      </section>

      <section className="mt-10">
        <NewProjectForm />
      </section>

      <section className="mt-12">
        {error && (
          <p role="alert" className="border-l-2 border-gold bg-wash px-3 py-2 text-sm">Não foi possível carregar os projetos.</p>
        )}
        {!error && projects.length === 0 && (
          <p className="border-t border-hair py-10 text-sm text-slate">Nenhum projeto ainda. Crie o primeiro acima.</p>
        )}
        <ul>
          {projects.map((p, i) => (
            <li key={p.id} className="grid grid-cols-[2rem_1fr_auto] items-start gap-4 border-t border-hair py-5">
              <span className="text-xs font-medium text-accent">{i + 1}</span>
              <div>
                <h2 className="font-medium">{p.name}</h2>
                {p.description && <p className="mt-1 text-sm text-slate">{p.description}</p>}
                {p.due_date && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-faint">Prazo {fmt.format(new Date(p.due_date))}</p>
                )}
              </div>
              <span className={`rounded-full border px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] ${STATUS[p.status].cls}`}>
                {STATUS[p.status].label}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

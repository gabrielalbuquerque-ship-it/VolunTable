import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { IconGrid, IconKanban, IconTable } from "@/components/workspace/icons";
import type { ViewId } from "@/components/workspace/views";

const VIEWS = [
  { id: "grade", label: "Grade", Icon: IconGrid },
  { id: "kanban", label: "Kanban", Icon: IconKanban },
] as const;

const caps = "text-[10px] font-medium uppercase tracking-[0.22em]";

export function AppShell({
  email,
  view,
  children,
}: {
  email: string;
  view: ViewId;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-hair md:flex">
        <div className="px-5 pt-6 pb-6">
          <p className={`${caps} text-accent`}>Volund</p>
          <p className="mt-1 text-xl font-light tracking-tight">
            Volun<span className="font-medium">Table</span>
          </p>
          <div className="mt-3 flex h-0.5 w-7">
            <span className="w-2/3 bg-accent" />
            <span className="w-1/3 bg-orange" />
          </div>
        </div>

        <nav aria-label="Navegação da base" className="flex-1 overflow-y-auto px-3">
          <p className={`${caps} px-2 pb-2 text-faint`}>Tabelas</p>
          <Link
            href="/projetos"
            className="flex items-center gap-2 rounded-md bg-wash px-2 py-1.5 text-sm font-medium"
          >
            <IconTable className="size-4 text-accent" />
            Projetos
          </Link>

          <p className={`${caps} px-2 pt-7 pb-2 text-faint`}>Visualizações</p>
          <ul className="space-y-0.5">
            {VIEWS.map(({ id, label, Icon }) => {
              const active = id === view;
              return (
                <li key={id}>
                  <Link
                    href={`/projetos?view=${id}`}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                      active ? "text-ink" : "text-slate hover:bg-row-hover hover:text-ink"
                    }`}
                  >
                    <Icon className={`size-4 ${active ? "text-accent" : "text-faint"}`} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-hair px-5 py-4">
          <p className={`${caps} text-faint`}>Conta</p>
          <p className="mt-1 truncate text-xs text-ink" title={email}>
            {email}
          </p>
          <form action={signOut}>
            <button className={`${caps} mt-2 text-slate transition-colors hover:text-accent`}>Sair</button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

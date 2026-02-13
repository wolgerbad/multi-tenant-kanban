import { getSession } from "@/helpers/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { get_organizations_of_member } from "@/helpers/organization";
import { Board, Organization } from "@/types";
import { get_boards_of_organization } from "@/helpers/board";

export default async function Page({ params }: {params: Promise<{organization_id: number}>}) {
  const organization_id = Number((await params).organization_id)
  const session = await getSession();
  if (!session.ok) redirect("/landing");

  const organizations = await get_organizations_of_member(session.data.id)
  const boards = await get_boards_of_organization(organization_id) 

  console.log("boards", boards)

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 gap-8">
        {/* Top navbar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/40">
              <span className="text-sm font-semibold text-emerald-300">KB</span>
            </div>
            <span className="text-sm font-medium tracking-tight text-slate-100">
              Flowboard
            </span>
            <select className="px-2 py-1 rounded-md border border-slate-400">
              {organizations?.map((org: Organization) => <option key={org.id} value={org.title}>{org.title}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300/80">
            <span className="text-slate-400">
              {/* You can show user email from session here later */}
              Boards
            </span>
            <button className="rounded-full border border-slate-700 px-3 py-1 hover:border-slate-500 hover:text-slate-100 transition">
              New board
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-xl font-semibold tracking-tight">Welcome to FlowBoard.</h1>
          <p className="text-lg text-center text-slate-400">Select an organization on top to continue</p>
        </div>
            </div>
    </main>
  );
}
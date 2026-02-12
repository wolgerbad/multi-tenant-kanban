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
  const isUserAllowed = organizations.find((organization: Organization) => organization.id === organization_id)

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
        {!isUserAllowed ? <div className="flex flex-col gap-2 items-center">
          <h1 className="text-xl font-semibold tracking-tight">Organization not found.</h1>
          <p className="text-lg text-center text-slate-400">This organization may be private. If someone gave you this link, they may need to share the organization with you or invite you to their Workspace.</p>
           </div> : <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Your boards
              </h1>
              <p className="text-xs text-slate-400">
                Pick a workspace to jump back into your work.
              </p>
            </div>
          </div>

          {boards?.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-400">
              You&apos;re not part of any boards yet. Create a new one to get
              started.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {boards?.map((board: Board) => (
                <Link
                  key={board.id}
                  href={`/${organization_id}/${board.id}`}
                  className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm hover:border-emerald-400/70 hover:bg-slate-900 transition"
                >
                  {/* <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-slate-500 group-hover:text-emerald-300/90">
                    {board.orgName}
                  </div> */}
                  <div className="text-sm font-medium text-slate-50 group-hover:text-emerald-50">
                    {board.title}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Open board →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>}
      </div>
    </main>
  );
}
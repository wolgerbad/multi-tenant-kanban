import type { Board, Organization } from '@/types'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { get_boards_of_organization } from '@/helpers/board'
import { get_organizations_of_member } from '@/helpers/organization'
import { getSession } from '@/helpers/session'
import { ProfileDropdown } from './[board_id]/dynamic'
import { OrganizationsDropdown } from './organization_dropdown'
import { CreateNewBoard } from './dynamic'
import { CreateNewOrganization } from '../dynamic'

export default async function Page({ params }: { params: Promise<{ organization_id: number }> }) {
  const organization_id = Number((await params).organization_id)
  const session = await getSession()
  if (!session.ok) redirect('/')

  const organizations = await get_organizations_of_member(session.data.id)
  const isUserAllowed = organizations.find((organization: Organization) => organization.id === organization_id)

  const boards = await get_boards_of_organization(organization_id)

  console.log('boards', boards)

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 gap-8">
        {/* Top navbar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link className='flex gap-2 items-center' href='/organizations'>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/40">
                <span className="text-sm font-semibold text-emerald-300">KB</span>
              </div>
              <span className="text-sm font-medium tracking-tight text-slate-100">
                Flowboard
              </span>
            </Link>
            <OrganizationsDropdown organizations={organizations} organization_id={organization_id} />
            <CreateNewOrganization user_id={session.data.id} />
          </div>
          <ProfileDropdown user={session.data} />
        </header>

        {/* Content */}
        {!isUserAllowed ? (
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-xl font-semibold tracking-tight">Organization not found.</h1>
            <p className="text-lg text-center text-slate-400">This organization may be private. If someone gave you this link, they may need to share the organization with you or invite you to their Workspace.</p>
          </div>
        ) : (
          <section className="space-y-4">
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
            {!boards?.length  ? (
              <div className='mt-8 flex gap-4'>
                <div className="h-full rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-400 max-w-64">
                  You&apos;re not part of any boards yet. Create a new one to get
                  started.
                </div>
                
                <CreateNewBoard organization_id={organization_id} />
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {boards?.map((board: Board) => (
                  <Link
                    key={board.id}
                    href={`/organizations/${organization_id}/${board.id}`}
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
                <CreateNewBoard organization_id={organization_id} />
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}

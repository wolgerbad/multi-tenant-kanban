import Link from 'next/link'
import { redirect } from 'next/navigation'
import { get_board_by_id } from '@/helpers/board'
import { get_columns_by_board_id } from '@/helpers/column'
import { get_members_of_organization } from '@/helpers/organization_member'
import { getSession } from '@/helpers/session'
import { Columns, MembersDropdown, ProfileDropdown } from './dynamic'

export default async function BoardPage({
  params,
}: {
  params: Promise<{ organization_id: number, board_id: number }>
}) {
  const { organization_id, board_id } = await params
  const session = await getSession()
  if (!session.ok)
    redirect('/landing')
  console.log('session', session)

  const columns = await get_columns_by_board_id(board_id)
  const board = await get_board_by_id(board_id)

  const isUserAllowed = board.org_id === +organization_id

  const organization_members = await get_members_of_organization(+organization_id)

  console.log('org members', organization_members)
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="flex min-h-screen flex-col">
        {/* Top navbar */}
        <header className="border-b border-slate-800 bg-slate-900/60 px-6 py-3">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/${organization_id}`}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
              >
                ← Back to boards
              </Link>
              <div className="h-4 w-px bg-slate-700" />
              <h1 className="text-sm font-semibold text-slate-100">
                {/* TODO: Replace with board.title from API */}
                {board.title}
              </h1>
              <div className="ml-4 flex items-center gap-1">
                <span className="text-slate-400">members:</span>
                {organization_members.slice(0, 3)?.map(member => <div key={member.id}>{member.user.image ? <img src={member.user.image} className="w-6 h-6 rounded-full" /> : <div className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-400 text-black text-xl font-semibold">{member.user.name.slice(0, 1)}</div>}</div>)}
                <div className="text-2xl cursor-pointer text-slate-400 hover:text-slate-500">
                  <MembersDropdown organization_members={organization_members} organization_id={organization_id} sender_id={session.data?.id} />
                </div>
              </div>
            </div>
            <div>
              <ProfileDropdown user={session?.data} />
            </div>
          </div>
        </header>

        {/* Board content - horizontal scroll */}
        {isUserAllowed && (
          <div className="flex-1 overflow-x-auto">
            <Columns columns={columns} organization_id={organization_id} board_id={board_id} user_id={session.data.id} />
          </div>
        )}
        {
          !isUserAllowed && (
            <div className=" mt-8 flex flex-col gap-2 items-center">
              <h1 className="text-xl font-semibold tracking-tight">Board not found.</h1>
              <p className="text-lg text-center text-slate-400">This board may be private. If someone gave you this link, they may need to share the board with you or invite you to their Workspace.</p>
            </div>
          )
        }
      </div>
    </main>
  )
}

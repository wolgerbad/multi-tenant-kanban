import type { Organization } from '@/types';
import { redirect } from 'next/navigation';
import { get_boards_of_organization } from '@/helpers/board';
import { get_organizations_of_member } from '@/helpers/organization';
import { getSession } from '@/helpers/session';
import { OrganizationsDropdown } from './[organization_id]/organization_dropdown';
import { ProfileDropdown } from './[organization_id]/[board_id]/dynamic';
import { CreateNewOrganization } from './dynamic';
import Link from 'next/link';

export default async function Page({
  params,
}: {
  params: Promise<{ organization_id: number }>;
}) {
  const organization_id = Number((await params).organization_id);
  const session = await getSession();
  if (!session.ok) redirect('/');

  const organizations = await get_organizations_of_member(session.data.id);
  const boards = await get_boards_of_organization(organization_id);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 gap-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/organizations" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/40">
                <span className="text-sm font-semibold text-emerald-300">
                  KB
                </span>
              </div>
              <span className="text-sm font-medium tracking-tight text-slate-100 mr-2">
                Flowboard
              </span>
            </Link>
            <OrganizationsDropdown
              organizations={organizations}
              organization_id={organization_id}
            />
            <CreateNewOrganization user_id={session.data.id} />
          </div>
          <ProfileDropdown user={session.data} />
        </header>
        
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Welcome to FlowBoard.
          </h1>
          <p className="text-lg text-center text-slate-400">
            Select an organization on top to continue
          </p>
        </div>
      </div>
    </main>
  );
}

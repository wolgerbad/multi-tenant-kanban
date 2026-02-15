import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import { BackButton } from '../back-button';
import { get_organization_invites_of_member } from '@/helpers/organization_invite';
import { getSession } from '@/helpers/session';
import { AcceptForm, DeclineForm } from './dynamic';
import { Invite, Organization, User } from '@/types';

export default async function Page() {
  //   const invites = MOCK_INVITES; // later: replace with data from backend
  const session = await getSession();
  if (!session.ok) redirect('/login');

  const invites = await get_organization_invites_of_member(session.data.id);
  const hasInvites = invites?.length > 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Invites
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              See the workspaces you&apos;ve been invited to and choose where
              you want to join.
            </p>
          </div>
        </header>

        {/* Content */}
        {!hasInvites ? (
          <div className="mt-10 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-12 text-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/70 text-slate-300">
              ✉️
            </div>
            <h2 className="text-base font-medium text-slate-100">
              No invites yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              When someone invites you to their organization, it will show up
              here. You can accept or decline with a single click.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            {invites.map((invite: Invite) => (
              <article
                key={invite.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.8)] md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-1 items-start gap-3">
                  {/* Org avatar */}
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-300">
                    {invite.organization.title.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-slate-50">
                        {invite.organization.title}
                      </p>
                      <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-[2px] text-[11px] font-medium text-emerald-300">
                        Invited as {invite.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Invited by{' '}
                      <span className="font-medium text-slate-200">
                        {invite.sender.name}
                      </span>{' '}
                      · {invite.sender.email}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Sent on {format(invite.created_at, 'MMM dd yyyy')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:justify-end">
                  {invite.status === 'pending' && (
                    <>
                      <AcceptForm inviteId={invite.id} />
                      <DeclineForm inviteId={invite.id} />
                    </>
                  )}
                  {invite.status === 'accepted' && (
                    <span className="inline-flex items-center rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                      Accepted
                    </span>
                  )}
                  {invite.status === 'declined' && (
                    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-400">
                      Declined
                    </span>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

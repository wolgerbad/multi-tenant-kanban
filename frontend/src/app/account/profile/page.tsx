import { redirect } from 'next/navigation';
import { getSession } from '@/helpers/session';
import { BackButton } from '../back-button';
import { ProfileForm } from './dynamic';
import { User } from '@/types';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session.ok) redirect('/login');

  const user: User = session.data;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-10">
        {/* Header */}
        <header className="mb-8">
          <BackButton />
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 mt-4">
            Profile
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your account settings and personal information.
          </p>
        </header>

        {/* Profile Content */}
        <section className="space-y-6">
          {/* Profile Info Card */}
          <article className="rounded-sm border border-slate-800 bg-slate-900/60 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.8)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-2xl font-semibold text-emerald-300 ring-2 ring-slate-700">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{user.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">Profile picture</p>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    {user.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                </div>

                {/* Edit Form */}
                <ProfileForm user={user} />
              </div>
            </div>
          </article>

          {/* Account Info Card */}
          <article className="rounded-sm border border-slate-800 bg-slate-900/60 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.8)]">
            <h3 className="mb-4 text-base font-semibold text-slate-50">
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col gap-1 border-b border-slate-800 pb-3">
                <span className="text-xs font-medium text-slate-400">
                  User ID
                </span>
                <span className="text-sm text-slate-200">{user.id}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-800 pb-3">
                <span className="text-xs font-medium text-slate-400">
                  Email Address
                </span>
                <span className="text-sm text-slate-200">{user.email}</span>
                <span className="text-[11px] text-slate-500">
                  Email cannot be changed
                </span>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

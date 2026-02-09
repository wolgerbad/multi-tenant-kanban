import Link from "next/link";
import { SignupForm } from "./dynamic";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <Link href='/' className="mb-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/40">
            <span className="text-sm font-semibold text-emerald-300">KB</span>
          </div>
          <span className="text-sm font-medium tracking-tight text-slate-100">
            Flowboard
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">
            Create your board
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Set up a minimal workspace for your next product push.
          </p>

        <SignupForm />

          <p className="mt-4 text-[11px] text-slate-400">
            Already using Flowboard?{" "}
            <Link
              href="/login"
              className="text-emerald-300 hover:text-emerald-200"
            >
              Sign in instead
            </Link>
          </p>
        </div>

        <p className="mt-6 text-[11px] text-slate-500">
          No spam. We only use your email for account-related updates.
        </p>
      </div>
    </main>
  );
}
import Link from "next/link";
import { LoginForm } from "./dynamic";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        {/* Top logo */}
        <Link href='/' className="mb-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/40">
            <span className="text-sm font-semibold text-emerald-300">KB</span>
          </div>
          <span className="text-sm font-medium tracking-tight text-slate-100">
            Flowboard
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">
            Welcome back
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Log in to your board and pick up right where you left off.
          </p>

            <LoginForm />

          <p className="mt-4 text-[11px] text-slate-400">
            New to Flowboard?{" "}
            <Link
              href="/signup"
              className="text-emerald-300 hover:text-emerald-200"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-[11px] text-slate-500">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </div>
    </main>
  );
}
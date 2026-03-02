import Link from 'next/link'

export default function Navbar({ session }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/40">
          <span className="text-sm font-semibold text-emerald-300">FB</span>
        </div>
        <span className="text-sm font-medium tracking-tight text-slate-100">
          Flowboard
        </span>
      </div>
      <nav className="flex items-center gap-4 text-xs text-slate-300/80">
        <button className="rounded-full border border-slate-700/80 px-3 py-1 hover:border-slate-500 hover:text-slate-100 transition">
          Product
        </button>
        {!session?.ok && (
          <Link href="/login" className="rounded-full bg-slate-100 px-3 py-1 text-slate-900 text-xs font-semibold hover:bg-white transition">
            Sign in
          </Link>
        )}
        {session?.ok && (
          <Link href="/organizations" className="rounded-full bg-slate-100 px-3 py-1 text-slate-900 text-xs font-semibold hover:bg-white transition">
            Go to boards
          </Link>
        )}
      </nav>
    </header>
  )
}

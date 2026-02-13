import Link from 'next/link'
import Navbar from '@/components/navbar'
import { getSession } from '@/helpers/session'

export default async function Home() {
  const session = await getSession()
  console.log('session', session)
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        {/* Top nav / logo */}
        <Navbar />

        {/* Hero */}
        <section className="mt-20 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
              Kanban for focused teams
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-slate-50">
              Ship faster with a board
              <br />
              that stays out of your way.
            </h1>
            <p className="text-sm md:text-base text-slate-300/80 max-w-lg">
              Flowboard is a minimal Kanban workspace for teams who care about
              clarity. One clean board, powerful keyboard shortcuts, no noisy
              dashboards.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signup" className="rounded-full bg-emerald-400 px-5 py-2 text-xs md:text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-500/40 hover:bg-emerald-300 transition">
                Get started – it’s free
              </Link>
              <button className="rounded-full border border-slate-600 px-4 py-2 text-xs md:text-sm text-slate-100 hover:border-slate-400 hover:text-white transition">
                View live board demo
              </button>
              <span className="text-[11px] text-slate-400">
                No cards? No problem. Create your first board in under 30
                seconds.
              </span>
            </div>
          </div>

          {/* Simple board preview */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
            <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Sprint Board
              </span>
              <span>3 active columns</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-[11px]">
              <div className="space-y-2">
                <p className="text-slate-300/90 font-medium">Todo</p>
                <div className="rounded-xl border border-slate-700/80 bg-slate-900/60 p-2 space-y-1">
                  <p className="font-medium text-slate-100 text-[11px]">
                    Design onboarding flow
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Update empty board state + checklist
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 space-y-1">
                  <p className="font-medium text-slate-100 text-[11px]">
                    Set up kanban backend
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Columns, cards, and activity log
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-slate-300/90 font-medium">In progress</p>
                <div className="rounded-xl border border-emerald-500/50 bg-slate-900/70 p-2 space-y-1">
                  <p className="font-medium text-slate-100 text-[11px]">
                    Keyboard shortcuts
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Move cards, switch columns without your mouse
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-slate-300/90 font-medium">Done</p>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 space-y-1">
                  <p className="font-medium text-slate-100 text-[11px]">
                    Dark UI pass
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Subtle shadows, accessible contrast, no clutter
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-[10px] text-slate-400">
                  +2 more completed this week
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Small footer / social proof */}
        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4 text-[11px] text-slate-500">
          <span>
            ©
            {new Date().getFullYear()}
            {' '}
            Flowboard, Inc.
          </span>
          <span className="text-slate-400/90">
            Trusted by small product teams who care about what ships, not how
            busy their board looks.
          </span>
        </footer>
      </div>
    </main>
  )
}

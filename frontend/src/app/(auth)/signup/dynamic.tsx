export async function SignupForm() {
    return           <form className="mt-6 space-y-4">
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">
        Name
      </label>
      <input
        type="text"
        placeholder="Alex from Product"
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
      />
    </div>
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">
        Work email
      </label>
      <input
        type="email"
        placeholder="you@productteam.com"
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
      />
    </div>
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">
        Password
      </label>
      <input
        type="password"
        placeholder="••••••••"
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
      />
    </div>

    <button
      type="submit"
      className="mt-2 w-full rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition"
    >
      Create account
    </button>
  </form>
}
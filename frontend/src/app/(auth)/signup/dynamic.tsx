"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
  const [error, setError] = useState<null | string>(null)
  const router = useRouter()

  async function signupAction(formData: FormData) {
    setError(null);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    const res = await fetch(`http://localhost:8000/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({name, email, password}),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    const result = await res.json();
    if(result.error) return setError(result.error)
    router.refresh()
  }

  return <form action={signupAction} className="mt-6 space-y-4">
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">
        Name
      </label>
      <input
        name="name"
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
        name="email"
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
        name="password"
        placeholder="••••••••"
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
      />
    </div>

    {error && <p className="text-red-600 text-sm">{error}</p>}

    <button
      type="submit"
      className="mt-2 w-full rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition"
    >
      Create account
    </button>
  </form>
}
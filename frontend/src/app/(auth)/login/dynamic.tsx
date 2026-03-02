'use client';

import { clientEnv } from '@/utils/envSchema';
import { useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';
import { login } from '../actions';

export function LoginForm() {
 const [state, action, isPending] = useActionState(login, { error: null })

  // const [error, setError] = useState<null | string>(null);
  // const router = useRouter();

  // async function loginAction(formData: FormData) {
  //   setError(null);
  //   const email = formData.get('email');
  //   const password = formData.get('password');

  //   const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
  //     method: 'POST',
  //     body: JSON.stringify({ email, password }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //   });
  //   const result = await res.json();
  //   console.log("result of login", result)
  //   if (result.error) return setError(result.error);
  //   router.refresh();
  // }

  return (
    <form action={action} className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-300">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@productteam.com"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-slate-300">Password</label>
        </div>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        />
      </div>

      {state.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className={`${isPending ? 'cursor-not-allowed bg-emerald-600' : 'bg-emerald-400 hover:bg-emerald-300 cursor-pointer' } mt-2 w-full rounded-lg px-4 py-2 text-sm font-semibold text-slate-950 transition`}
      >
        {isPending ? 'Signing in..' : 'Sign in'}
      </button>
    </form>
  );
}

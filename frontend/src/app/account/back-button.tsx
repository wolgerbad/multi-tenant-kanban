'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="cursor-pointer inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-slate-200"
    >
      ← Go back
    </button>
  );
}

'use client'

import { useRouter } from 'next/navigation'
import { answer_organization_invite } from '@/helpers/organization_invite'

export function AcceptForm({ inviteId }: {inviteId: number}) {
  const router = useRouter()

  async function handle_accept_invite() {
   const result = await answer_organization_invite('accept', inviteId)
   console.log("result", result)
    router.refresh()
  }

  return (
    <form action={handle_accept_invite}>
      <button 
        type='submit'
        className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-emerald-500/40 hover:bg-emerald-300 transition"
      >
        Accept
      </button>
    </form>
  )
}

export function DeclineForm({ inviteId }: { inviteId: number }) {
  const router = useRouter()

  async function handle_decline_invite() {
    await answer_organization_invite('decline', inviteId)
    router.refresh()
  }

  return (
    <form action={handle_decline_invite}>
      <button
        type='submit'
        className="inline-flex items-center justify-center rounded-full border border-slate-600 px-4 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-400 hover:text-slate-50 transition"
      >
        Decline
      </button>
    </form>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User } from '@/types'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { socket } from '@/helpers/socket'

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)



  async function handle_update_profile(formData: FormData) {
    setIsLoading(true)
    const name = formData.get('name') as string
    const image = formData.get('image') as string

    // TODO: Connect to your backend update endpoint
    // Example:
    // const result = await update_user_profile({ id: user.id, name, image })
    // if (!result.ok) {
    //   toast.error(result.error || 'Failed to update profile')
    //   setIsLoading(false)
    //   return
    // }

    // For now, just simulate success
    try {
      // Replace this with actual API call:
      // await fetch(`http://localhost:8000/user/${user.id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ name, image }),
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      // })

      toast.success('Profile updated successfully')
      setIsEditing(false)
      router.refresh()
    }
    catch (error) {
      toast.error('Failed to update profile')
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(function() {
    socket.emit('column_created', 'haiiiiiiiiiiiiiiii')
  }, [])

  if (!isEditing) {
    return (
      <div className="space-y-2">
        <Button
          onClick={() => setIsEditing(true)}
          className="cursor-pointer rounded-full border border-slate-600 bg-transparent px-4 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-400 hover:bg-slate-800 transition"
        >
          Edit Profile
        </Button>
      </div>
    )
  }

  return (
    <form action={handle_update_profile} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-xs font-medium text-slate-400">
          Display Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="Enter your name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="block text-xs font-medium text-slate-400">
          Profile Image URL
        </label>
        <input
          id="image"
          name="image"
          type="url"
          defaultValue={user.image || ''}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="https://example.com/avatar.jpg"
        />
        <p className="text-[11px] text-slate-500">
          Enter a URL to your profile image
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-emerald-500/40 hover:bg-emerald-300 transition disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          onClick={() => setIsEditing(false)}
          disabled={isLoading}
          className="cursor-pointer rounded-full border border-slate-600 bg-transparent px-4 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-400 hover:bg-slate-800 transition disabled:opacity-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}


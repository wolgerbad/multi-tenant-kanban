'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User } from '@/types'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { socket } from '@/helpers/socket'
import { Camera, CloudUpload, Upload, UserPen } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

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

      {/* <div className="space-y-2">
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
      </div> */}

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


export function UserImage({user}: {user: User}) {
  return <div className="flex flex-col items-center gap-4">
  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-2xl font-semibold text-emerald-300 ring-2 ring-slate-700">
    {user.image ? (
        <img
          src={user.image}
          alt={user.name}
          className="h-full w-full rounded-full object-cover"
        />
    ) : (
        <span>{user.name.slice(0, 2).toUpperCase()}</span>        
    )}
    <UploadDialog user_id={user.id}>
      <span className='cursor-pointer absolute -bottom-2 -right-2 bg-slate-900/60 rounded-full p-2 border border-slate-700'>
        <Camera />
      </span>
    </UploadDialog>
  </div>
  <p className="text-xs text-slate-400">Profile picture</p>
</div>

}

export function UploadDialog({ user_id, children }: { user_id: number; children: React.ReactNode }) {
  const [error, setError] = useState<null | string>(null)
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  async function handle_image_upload(formData: FormData) {
    const image = formData.get('image') as File;
    if(image?.size > 2097151) return setError('Image size should be less than 2MB.')
    if(!image?.type.startsWith('image')) return setError('Invalid file. Please upload an image.')
    // console.log('image', image)
    const result = await fetch('http://localhost:8000/upload/image/create-url', {
      method: 'POST',
      body: JSON.stringify({file_type: image.type, file_name: image.name}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())

    if(!result.ok) return setError('Error occured while uploading! Try again later.')

   const res = await fetch(result.data.signed_url, {
      method: 'PUT',
      headers: {
        'Content-Type': image.type
      },
      body: image
    })
    if(!res.ok) return setError('Error occured while uploading! Try again later.')

    const final_url = result.data.final_url

    await fetch('http://localhost:8000/user/update/image', {
      method: 'POST',
      body: JSON.stringify({ user_id, image: final_url }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    setIsOpen(false)
    router.refresh()
  }
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
  <form action={handle_image_upload} className='flex flex-col gap-4'>
      <DialogHeader>
        <DialogTitle className='flex items-center gap-2 font-semibold'>
          <UserPen />
          Update profile picture  
        </DialogTitle>
      </DialogHeader>
      <div className='border-3 border-dashed rounded-lg flex flex-col gap-5 px-8 py-4 justify-center items-center '>
            <div className='flex flex-col gap-1 items-center'>
              <CloudUpload size={64} color='gray'/>
              <h2 className='text-2xl text-gray-500 font-semibold'>Upload an image</h2>
              <p className='text-sm text-gray-500'>Please upload an image file that is less than 2MB in size. Other file types are not permitted.</p>
            </div>
            {/* <button className='border px-4 py-2 rounded-lg font-semibold border-gray-400 cursor-pointer'>
            </button> */}
              <Input type='file' name="image" className='max-w-40 cursor-pointer' />
      </div>
      {error && <p className='-mt-2 text-red-600'>{error}</p>}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className='cursor-pointer'>Cancel</Button>
        </DialogClose>
        <Button type="submit" className='bg-emerald-400 hover:bg-emerald-500 cursor-pointer'>Upload Image</Button>
      </DialogFooter>
  </form>
    </DialogContent>
</Dialog>
}
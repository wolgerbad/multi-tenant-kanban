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
import { update_user_image, update_user_name } from '@/helpers/user'
import { create_image_url, upload_image_to_bucket } from '@/helpers/upload'
import ProfilePicture from '@/components/profile_picture'

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)


  async function handle_update_profile(formData: FormData) {
    setError(null)
    setIsLoading(true)
    const name = formData.get('name') as string
    if(!name.trim().length || name === user.name) {
    setIsLoading(false)
      return
    }

    const result = await update_user_name({ user_id: user.id, name }) 
    if(!result.ok)  {
      setIsLoading(false)
      setError(result.message)
      return
    }
     setIsLoading(false)
      toast.success('Profile updated successfully')
      router.refresh()
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
      {error && <p className='text-red-600 text-sm font-medium -mt-3 mb-2'>{error}</p>}
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-emerald-500/40 hover:bg-emerald-300 transition disabled:opacity-50"
        >
          {isLoading ? 'Uploading...' : 'Upload profile'}
        </Button>
      </div>
    </form>
  )
}


export function UserImage({user}: {user: User}) {
  return <div className="flex flex-col items-center gap-4">
  <ProfilePicture user={user} className="relative h-24 w-24 text-2xl">
    <UploadDialog user_id={user.id}>
      <span className='cursor-pointer absolute -bottom-2 -right-2 bg-slate-900/60 rounded-full p-2 border border-slate-700'>
        <Camera />
      </span>
    </UploadDialog>
  </ProfilePicture>
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

    const result = await create_image_url(image)

    if(!result.ok) return setError('Error occured while uploading! Try again later.')

    const res = await upload_image_to_bucket(result.data.signed_url, image)
    if(!res.ok) return setError('Error occured while uploading! Try again later.')

    const final_url = result.data.final_url

    const update_result = await update_user_image(user_id, final_url)
    if(!update_result.ok) return setError(update_result.message)

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
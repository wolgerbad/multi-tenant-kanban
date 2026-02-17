"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { create_new_organization } from "@/helpers/organization";
import { create_image_url, upload_image_to_bucket } from "@/helpers/upload";
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateNewOrganization({user_id}: {user_id: number}) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

  async function handle_create_new_organization(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const title = formData.get('title') as string
    const image = formData.get('image') as File
    if(title?.length < 4) return setError('Title must be at least 4 charachter') 
      if(image) {
       const url_result = await create_image_url(image);
       if(!url_result.ok) return setError('Something went wrong with uploading image. Try again later.')
       const res = await upload_image_to_bucket(url_result.data.signed_url, image)
       if(!res.ok) return setError('Something went wrong with uploading image. Try again later.')
       await create_new_organization({ organization_title: title, organization_image: url_result.data.final_url, user_id})
       setIsOpen(false)
       setIsLoading(false)
       router.refresh()
       return
      }
      await create_new_organization({ organization_title: title, user_id, organization_image: null })
      setIsOpen(false)
      setIsLoading(false)
      router.refresh()
    }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild >
          <Button variant="outline" className="bg-slate-400/70 hover:bg-slate-400/60 border-none rounded-sm text-white hover:text-white cursor-pointer">
            <Plus className="font-semibold" />
            Create new organization
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm bg-slate-800 text-white">
      <form action={handle_create_new_organization} className="flex flex-col gap-4">
          <DialogHeader className="">
            <DialogTitle>Create new organization</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="name-1" className="block mb-1">Organization Title</label>
              <input id="name-1" name="title" className="w-full border px-2 py-1 rounded-sm" />
            </div>
            <div>
              <label htmlFor="username-1" className="block mb-1">Organization Image (optional)</label>
              <Input type="file" id="username-1" name="image" className=""  />
            </div>
            {error && <p className="text-red-600" >{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-transparent hover:bg-slate-900 text-white hover:text-white cursor-pointer" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">Save changes</Button>
          </DialogFooter>
      </form>
        </DialogContent>
    </Dialog>
  )
}

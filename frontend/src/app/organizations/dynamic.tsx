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
import { create_new_organization } from "@/helpers/organization";
import { Plus } from "lucide-react"
import { useState } from "react";

export function CreateNewOrganization({user_id}: {user_id: number}) {
    const [error, setError] = useState<null | string>(null)
  async function handle_create_new_organization(formData: FormData) {
    setError(null)
    const title = formData.get('title') as string
    const image = formData.get('image') as string
    if(title?.length < 4) return setError('Title must be at least 4 charachter') 
       const result = await create_new_organization({ organization_title: title, organization_image: image ?? null, user_id })
       if(!result.ok) setError(result.error)
        console.log("result", result)
 
    }
  return (
    <Dialog>
        <DialogTrigger asChild>
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
              <label htmlFor="username-1" className="block mb-1">Organization Image URL (optional)</label>
              <input id="username-1" name="image" className="w-full px-2 py-1 border rounded-sm" />
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

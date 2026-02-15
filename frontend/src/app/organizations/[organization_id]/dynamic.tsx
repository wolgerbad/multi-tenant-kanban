"use client"

import { create_board } from "@/helpers/board"
import { socket } from "@/helpers/socket"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function CreateNewBoard({ organization_id }: { organization_id: number}) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const router = useRouter()
  console.log("orgid", organization_id)

  async function handle_create_board(formData: FormData) {
        // setError(null)
        const board_title = formData.get('board_title') as string
        if(!board_title?.length) return
        const result = await create_board({ board_title, organization_id })
        if(result.ok) {
            socket.emit('created:board', organization_id )
            router.refresh()
        }
        // if(!result.ok) setError(result.error)
    }
    
  return <div>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="rounded-sm ml-2 border border-slate-700 px-3 py-1 text-base cursor-pointer text-slate-300 hover:border-slate-500 hover:text-slate-100 transition">
          Create new board
        </button>
      )}
  {isOpen && <form action={handle_create_board}>
    <div className="mb-2">
      <input type="text" name="board_title" className="bg-white rounded-md px-4 py-2 border border-slate-600 outline-0 text-slate-800" />
    </div>
    <div className="flex gap-1 justify-end">
      <button type="button" className="bg-red-600 rounded-sm px-2 py-1 cursor-pointer" onClick={() => setIsOpen(false)}>cancel</button>
      <button className="bg-emerald-600 rounded-sm px-2 py-1 cursor-pointer">create column</button>
    </div>
  </form>}
  </div>
}
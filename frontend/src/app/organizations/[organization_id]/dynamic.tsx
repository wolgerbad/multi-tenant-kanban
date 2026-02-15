"use client"

import { useState } from "react"

export function CreateNewBoard() {
    const [isOpen, setIsOpen] = useState(false)

    
  return <div>
      {!isOpen && (
        <div onClick={() => setIsOpen(true)} className="rounded-sm ml-2 border border-slate-700 px-3 py-1 text-base cursor-pointer text-slate-300 hover:border-slate-500 hover:text-slate-100 transition">
          Create new board
        </div>
      )}
  {isOpen && <form action={handle_create_board}>
    <div className="mb-2">
      <input type="text" name="column_name" className="bg-white rounded-md px-4 py-2 border border-slate-600 outline-0 text-slate-800" />
    </div>
    <div className="flex gap-1 justify-end">
      <button type="button" className="bg-red-600 rounded-sm px-2 py-1 cursor-pointer" onClick={() => setIsOpen(false)}>cancel</button>
      <button className="bg-emerald-600 rounded-sm px-2 py-1 cursor-pointer">create column</button>
    </div>
  </form>}
  </div>
}
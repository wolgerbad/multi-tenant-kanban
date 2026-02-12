"use client"

import { create_card } from "@/helpers/card";
import { create_column } from "@/helpers/column";
import { Card, ColumnWithCards } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react"

type PropTypes = {
    board_id: number;
    organization_id: number
}

export function CreateColumn({board_id, organization_id}: PropTypes) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  async function handle_create_column(formData: FormData) {
    const column_name = formData.get('column_name') as string;
    if(!column_name.trim().length) return;
    await create_column({title: column_name, board_id, org_id: organization_id, position: 3 })
    router.refresh()
  }

  return <div>
    {!isOpen && <button onClick={() => setIsOpen(true)} className="rounded-full border border-slate-700 px-3 py-1 text-base cursor-pointer text-slate-300 hover:border-slate-500 hover:text-slate-100 transition">
        Add column
    </button>}
    {isOpen && <form action={handle_create_column}>
        <div className="mb-2">
            <input type="text" name="column_name" className="bg-white rounded-md px-4 py-2 border border-slate-600 outline-0 text-slate-800" />
        </div>
        <div className="flex gap-1 justify-end">
            <button type="button" className="bg-red-600 rounded-lg px-2 py-1 cursor-pointer" onClick={() => setIsOpen(false)}>cancel</button> 
            <button className="bg-green-600 rounded-lg px-2 py-1 cursor-pointer">create column</button>
        </div>
    </form>}
    </div>
}

export function Columns({columns, board_id, organization_id, user_id}: {columns: ColumnWithCards[]; board_id: number; organization_id: number; user_id: number}) {
    return <div className="flex gap-4 p-6">
    {columns?.length && columns.map((column: ColumnWithCards) => (
        <Column key={column.id} column={column} user_id={user_id} />
    ))}
    <div>
     <CreateColumn board_id={board_id} organization_id={organization_id} />
    </div>
  </div>
}

export function Column({column, user_id}: {column: ColumnWithCards, user_id: number}) {
   const [isOpen, setIsOpen] = useState(false)
   const router = useRouter();

   async function handle_create_card(formData: FormData) {
       const card_title = formData.get('card_title') as string;
       if(!card_title.trim().length) return;
       const cardDTO = {title: card_title, column_id: column.id, org_id: column.org_id, position: 3, created_by: user_id, priority: 'urgent' }
       const result = await create_card(cardDTO)
       console.log("result", result)
       router.refresh()
    }
    return <div
        key={column.id}
        className="flex h-full min-w-[280px] flex-col rounded-xl border border-slate-800 bg-slate-900/40"
      >
        {/* Column header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-200">{column.title}</h2>
          <span className="text-[11px] text-slate-500">
            {column.cards?.length} {column.cards?.length === 1 ? "card" : "cards"}
          </span>
        </div>
    
        {/* Cards container */}
        <Cards cards={column.cards} />
        {/* Add card button */}
        <div className="border-t border-slate-800 p-3">
          {!isOpen && <button onClick={() => setIsOpen(true)} className="w-full rounded-lg border border-dashed border-slate-700 px-3 py-2 text-[11px] text-slate-400 hover:border-slate-600 hover:text-slate-300 transition">
            + Add card
          </button>}
          {isOpen && <form action={handle_create_card} className="w-full text-[11px] text-slate-400">
            <input type="text" name="card_title" className="w-full px-3 py-2 rounded-lg outline-0 bg-white " />
            <div className="flex justify-end gap-3">
                <button type="button" className="w-12 py-1 hover:text-slate-300 text-sm" onClick={() => setIsOpen(false)}>cancel</button>
                <button className="w-12 hover:text-slate-300 text-sm">create</button>
            </div>
            </form>
            }
        </div>
      </div>
    }
    

export function Cards({cards}: {cards: Card[] | null}) {
   return <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {!cards?.length ? (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-[11px] text-slate-500">
            Drop cards here
          </div>
        ) : (
          cards.map((card: Card) => (
           <Card card={card} key={card.id} />
          ))
        )}
      </div>
    }

export function Card({card}: {card: Card}) {
    return  <div
    key={card.id}
    className="group cursor-pointer rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm hover:border-emerald-400/50 hover:bg-slate-900 transition"
    >
    <div className="font-medium text-slate-100">{card.title}</div>
    {card.description && (
    <div className="mt-1 text-[11px] text-slate-400">
        {card.description}
    </div>
    )}
    </div>
    }
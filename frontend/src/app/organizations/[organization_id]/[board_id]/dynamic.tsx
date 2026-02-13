'use client'

import type { ColumnWithCards, OrgMemberForDropdown, User } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { differenceInDays, format } from 'date-fns'
import { LogOutIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FcInvite } from 'react-icons/fc'
import { IoMdArrowDropdown } from 'react-icons/io'
import { TbCalendarDue } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { create_card } from '@/helpers/card'
import { create_column } from '@/helpers/column'
import { send_organization_invite } from '@/helpers/organization_invite'
import { get_user } from '@/helpers/user'

interface PropTypes {
  board_id: number
  organization_id: number
}

export function CreateColumn({ board_id, organization_id }: PropTypes) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  async function handle_create_column(formData: FormData) {
    const column_name = formData.get('column_name') as string
    if (!column_name.trim().length)
      return
    await create_column({ title: column_name, board_id, org_id: organization_id, position: 3 })
    router.refresh()
  }

  return (
    <div>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="rounded-full border border-slate-700 px-3 py-1 text-base cursor-pointer text-slate-300 hover:border-slate-500 hover:text-slate-100 transition">
          Add column
        </button>
      )}
      {isOpen && (
        <form action={handle_create_column}>
          <div className="mb-2">
            <input type="text" name="column_name" className="bg-white rounded-md px-4 py-2 border border-slate-600 outline-0 text-slate-800" />
          </div>
          <div className="flex gap-1 justify-end">
            <button type="button" className="bg-red-600 rounded-lg px-2 py-1 cursor-pointer" onClick={() => setIsOpen(false)}>cancel</button>
            <button className="bg-green-600 rounded-lg px-2 py-1 cursor-pointer">create column</button>
          </div>
        </form>
      )}
    </div>
  )
}

export function Columns({ columns, board_id, organization_id, user_id}: { columns: ColumnWithCards[], board_id: number, organization_id: number, user_id: number }) {
  return (
    <div className="flex gap-4 p-6">
      {columns?.length && columns.map((column: ColumnWithCards) => (
        <Column key={column.id} column={column} user_id={user_id} />
      ))}
      <div>
        <CreateColumn board_id={board_id} organization_id={organization_id} />
      </div>
    </div>
  )
}

export function Column({ column, user_id}: { column: ColumnWithCards, user_id: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [date, setDate] = useState<Date>()

  const formatted_date = date && format(date, 'yyyy-MM-dd')

  async function handle_create_card(formData: FormData) {
    const card_title = formData.get('card_title') as string
    const priority = formData.get('priority') as string
    if (!card_title.trim().length || !priority || !date)
      return
    const cardDTO = { title: card_title, column_id: column.id, org_id: column.org_id, position: 3, created_by: user_id, priority, due_date: formatted_date }
    const result = await create_card(cardDTO)
    console.log('result', result)
    router.refresh()
  }
  return (
    <div
      key={column.id}
      className="flex h-full min-w-[280px] flex-col rounded-xl border border-slate-800 bg-slate-900/40"
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-200">{column.title}</h2>
        <span className="text-[11px] text-slate-500">
          {column.cards?.length}
          {' '}
          {column.cards?.length === 1 ? 'card' : 'cards'}
        </span>
      </div>

      {/* Cards container */}
      <Cards cards={column.cards} />
      {/* Add card button */}
      <div className="border-t border-slate-800 p-3">
        {!isOpen && (
          <button onClick={() => setIsOpen(true)} className="w-full rounded-lg border border-dashed border-slate-700 px-3 py-2 text-[11px] text-slate-400 hover:border-slate-600 hover:text-slate-300 transition">
            + Add card
          </button>
        )}
        {isOpen && (
          <form action={handle_create_card} className="w-full text-[11px] text-slate-400">
            <input type="text" name="card_title" className="w-full mb-1 px-3 py-2 rounded-lg outline-0 bg-white " />
            <div className="flex items-center gap-4">
              <select name="priority" className="text-[13px] outline-0">
                <option value="low">Low priority</option>
                <option value="normal">Normal priority</option>
                <option value="urgent">Urgent priority</option>
              </select>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 has-[>svg]:px-3 text-sm bg-transparent hover:bg-transparent border-0 justify-between text-left font-normal"
                  >
                    {date
                      ? (
                          <span className="flex hover:bg-slate-800 px-2 py-1 rounded-md cursor-pointer items-center gap-2">
                            <TbCalendarDue />
                            {format(date, 'MMM dd')}
                          </span>
                        )
                      : (
                          <span className="text-2xl hover:bg-slate-800 px-2 py-1 rounded-md cursor-pointer">
                            <TbCalendarDue />
                          </span>
                        )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    disabled={(date) => {
                      const daysdiff = differenceInDays(date, new Date())
                      if (daysdiff < 0)
                        return true

                      return false
                    }}
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" className="w-12 py-1 hover:text-slate-300 text-sm" onClick={() => setIsOpen(false)}>cancel</button>
              <button className="w-12 hover:text-slate-300 text-sm">create</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export function Cards({ cards}: { cards: Card[] | null }) {
  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-3">
      {!cards?.length
        ? (
            <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-[11px] text-slate-500">
              Drop cards here
            </div>
          )
        : (
            cards.map((card: Card) => (
              <Card card={card} key={card.id} />
            ))
          )}
    </div>
  )
}

export function Card({ card}: { card: Card }) {
  const formatted_date = format(card.due_date, 'MMM dd')
  const created_by = card.created_by

  const { data: user, isPending } = useQuery({
    queryKey: ['created_by'],
    queryFn: async () => get_user(created_by),
  })

  console.log('user', user)

  return (
    <div
      key={card.id}
      className="group cursor-pointer rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm hover:border-emerald-400/50 hover:bg-slate-900 transition"
    >
      <div className="flex justify-between font-medium text-slate-100">
        <span>
          {card.title}
        </span>
        <span className="text-[11px] text-slate-400">
          priority:
          {' '}
          {card.priority}
        </span>
      </div>
      {card.description && (
        <div className="mt-1 text-[11px] text-slate-400">
          {card.description}
        </div>
      )}

      <div className="flex justify-between items-center text-slate-400">
        <div className="flex gap-2 items-center">
          <span>
            <TbCalendarDue />
          </span>
          due:
          {' '}
          {formatted_date}
        </div>
        <div>{isPending ? <p>loading..</p> : user?.image ? <img src={user.image} className="w-6 h-6 rounded-full" /> : <div className="w-6 h-6 rounded-full bg-slate-400 text-black flex justify-center items-center text-lg font-semibold">{user.name.slice(0, 1)}</div>}</div>
      </div>
    </div>
  )
}

export function MembersDropdown({ organization_members, organization_id, sender_id }: { organization_members: OrgMemberForDropdown[], organization_id: number, sender_id: number }) {
  const [isOpen, setIsOpen] = useState<boolean>()
  const [error, setError] = useState()

  async function handle_send_invite(formData: FormData) {
    const email = formData.get('email') as string
    const role = formData.get('role') as string
    console.log("role", role)
    const inviteDTO = { email, org_id: organization_id, sender_id, role }
    const result = await send_organization_invite(inviteDTO)
    if (!result.ok)
      return setError(result.error)
    setIsOpen(false)
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IoMdArrowDropdown />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 mr-4 bg-slate-900 text-slate-400 border border-slate-400">
          <DropdownMenuGroup className="bg-transparent hover:bg-transparent ">
            <DropdownMenuLabel>Members</DropdownMenuLabel>
            {organization_members?.map(member => <DropdownMenuItem className="bg-transparent hover:bg-transparent" key={member.id}>{member.user.name}</DropdownMenuItem>)}
            <Button onClick={() => setIsOpen(true)} className="text-slate-300 border-t border-slate-400 rounded-none w-full bg-slate-900 hover:bg-slate-800 cursor-pointer">Invite new member</Button>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-sm bg-slate-900 text-slate-300 border border-slate-600">
          <form action={handle_send_invite} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Add people</DialogTitle>
            </DialogHeader>
            <div>
              <label className="block mb-1" htmlFor="name-1">Email address</label>
              <input id="name-1" type="email" name="email" placeholder="johndoe@gmail.com" className="mb-1 border border-slate-300 px-2 py-1 w-full outline-slate-300 rounded-sm" />
              <span className='text-slate-400'>role:</span>
              <select name="role" className='outline-0 text-slate-400'>
                <option value="member">member</option>
                <option value="admin">admin</option>
              </select>
              {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-transparent text-slate-300 cursor-pointer">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-slate-300 hover:bg-slate-400 cursor-pointer text-black font-semibold px-4 py-2 rounded-md">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function ProfileDropdown({ user}: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          {user.image ? <img src={user.image} className="cursor-pointer w-8 h-8 rounded-full" /> : <div className="cursor-pointer w-8 text-center rounded-full flex items-center justify-center text-xl font-semibold bg-slate-400">{user.name.slice(0, 1)}</div>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-900 text-slate-400">
        <DropdownMenuItem>
          <Link href="/profile" className="flex gap-2 items-center">
            <UserIcon />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/account/invites" className="flex gap-2 items-center">
            <FcInvite />
            Invites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

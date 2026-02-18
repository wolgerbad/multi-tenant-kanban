'use client';

import type {
  Card,
  ColumnWithCards,
  Invite,
  OrgMemberForDropdown,
  User,
} from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInDays, format, formatDistanceToNow, isBefore } from 'date-fns';
import { LogOutIcon, TriangleAlert, UserIcon, Plus, X, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FcInvite } from 'react-icons/fc';
import { IoMdArrowDropdown } from 'react-icons/io';
import { TbCalendarDue, TbOvalVerticalFilled } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  create_card,
  switch_card_column,
  switch_card_positions,
  update_card,
} from '@/helpers/card';
import { create_column, switch_column_positions, update_column_title } from '@/helpers/column';
import {
  get_organization_invites_of_member,
  send_organization_invite,
} from '@/helpers/organization_invite';
import { get_user } from '@/helpers/user';
import { toast } from 'sonner';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { logout } from '@/app/(auth)/actions';
import { socket } from '@/helpers/socket';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { get_members_of_organization } from '@/helpers/organization_member';
import { Input } from '@/components/ui/input';
import { create_card_comment, get_card_comments } from '@/helpers/card_comment';
import ProfilePicture from '@/components/profile_picture';

interface PropTypes {
  board_id: number;
  organization_id: number;
  position: number;
}

export function CreateColumn({
  board_id,
  organization_id,
  position,
}: PropTypes) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handle_create_column(formData: FormData) {
    const column_name = formData.get('column_name') as string;
    if (!column_name.trim().length) return;
    const result = await create_column({
      title: column_name,
      board_id,
      org_id: organization_id,
      position,
    });
    if (!result.ok) return;
    socket.emit('column_created', organization_id);
    router.refresh();
    setIsOpen(false);
  }

  useEffect(
    function () {
      socket.on('column_new', () => {
        router.refresh();
      });
    },
    [router]
  );

  return (
    <div>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="rounded-sm gap-2 text-slate-300 border-slate-400 hover:border-slate-600 hover:text-slate-200 bg-slate-900 hover:bg-slate-900 cursor-pointer"
        >
          <Plus size={16} />
          Add column
        </Button>
      )}
      {isOpen && (
        <form
          action={handle_create_column}
          className="flex flex-col gap-2 min-w-[280px]"
        >
          <Input
            name="column_name"
            placeholder="Add new column"
            className="ring-0 focus-visible:ring-1 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 outline-0"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-100 hover:bg-transparent cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              Create
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export function Columns({
  columns,
  board_id,
  organization_id,
  user_id,
}: {
  columns: ColumnWithCards[];
  board_id: number;
  organization_id: number;
  user_id: number;
}) {
  const last_position = columns?.length ? columns.at(-1)?.position : -1;
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();
  const active_column = columns?.find(
    (column) => `column-${column.id}` === activeId
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  async function handle_drag_end(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    console.log(active, over);
    if (!over) return;

    const drag_id = +active.id.split('-')[1];
    const drop_id = +over.id.split('-')[1];

    if (
      active.data.current?.type === 'column' &&
      over.data.current?.type === 'column'
    ) {
      if (drag_id === drop_id) return;
      const result = await switch_column_positions({
        dragged_column: drag_id,
        dropped_column: drop_id,
      });
      if (result.ok) {
        socket.emit('dragndrop_event', organization_id);
        router.refresh();
      }
    }
    if (
      active.data.current?.type === 'column' &&
      over.data.current?.type === 'card'
    ) {
      if (drag_id === over.data.current.column_id) return;
      const result = await switch_column_positions({
        dragged_column: drag_id,
        dropped_column: over.data.current.column_id,
      });
      if (result.ok) {
        socket.emit('dragndrop_event', organization_id);
        router.refresh();
      }
    }

    if (
      active.data.current?.type === 'card' &&
      over.data.current?.type === 'card'
    ) {
      if (active.data.current?.column_id === over.data.current?.column_id) {
        if (drag_id === drop_id) return;
        console.log(
          'switch_card_positions_same_column_running',
          drag_id,
          drop_id
        );
        const result = await switch_card_positions({
          dragged_card: drag_id,
          dropped_card: drop_id,
        });
        if (result.ok) {
          socket.emit('dragndrop_event', organization_id);
          router.refresh();
        }
      } else if (
        active.data.current?.column_id !== over.data.current?.column_id
      ) {
        const result = await switch_card_column({
          card_id: drag_id,
          column_id: over.data.current.column_id,
        });
        if (result.ok) {
          socket.emit('dragndrop_event', organization_id);
          router.refresh();
        }
      }
    } else if (
      active.data.current?.type === 'card' &&
      over.data.current?.type === 'column'
    ) {
      const result = await switch_card_column({
        card_id: drag_id,
        column_id: drop_id,
      });
      if (result.ok) {
        socket.emit('dragndrop_event', organization_id);
        router.refresh();
      }
    }
    return;
  }

  function handle_drag_start(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  useEffect(
    function () {
      socket.on('dragndrop_new', () => {
        router.refresh();
      });
    },
    [router]
  );

  return (
    <div className="flex gap-4 p-6 ">
      <DndContext
        onDragStart={handle_drag_start}
        onDragEnd={handle_drag_end}
        sensors={sensors}
      >
        <SortableContext
          items={columns?.map((column) => `column-${column.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          {columns?.length &&
            columns.map((column: ColumnWithCards) => (
              <Column
                key={column.id}
                column={column}
                user_id={user_id}
                active_id={activeId}
              />
            ))}
          {activeId && (
            <DragOverlay>
              {activeId && active_column ? (
                <Column
                  column={active_column}
                  user_id={user_id}
                  active_id={activeId}
                />
              ) : null}
            </DragOverlay>
          )}
        </SortableContext>
      </DndContext>
      <div>
        <CreateColumn
          board_id={board_id}
          organization_id={organization_id}
          position={last_position + 1}
        />
      </div>
    </div>
  );
}

export function Column({
  column,
  user_id,
  active_id,
}: {
  column: ColumnWithCards;
  user_id: number;
  active_id: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [client_column_title, set_client_column_title] = useState(() => column.title)
  const [is_editing_title, set_is_editing_title] = useState(false)
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const last_position = column.cards.at(-1)?.position ?? -1;

  const formatted_date = date && format(date, 'yyyy-MM-dd');

  const { data: users, isPending } = useQuery({
    queryKey: ['members_of_organization', column.org_id],
    queryFn: async () => await get_members_of_organization(column.org_id),
  });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `column-${column.id}`,
      data: {
        type: 'column',
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function handle_create_card(formData: FormData) {
    const card_title = formData.get('card_title') as string;
    const priority = formData.get('priority') as string;
    if (!card_title.trim().length || !priority || !date) return;
    const cardDTO = {
      title: card_title,
      column_id: column.id,
      org_id: column.org_id,
      position: last_position + 1,
      created_by: user_id,
      priority,
      due_date: formatted_date,
    };
    const result = await create_card(cardDTO);
    if (result.ok) {
      router.refresh();
      socket.emit('card_created', column.org_id);
    }
  }

  async function handle_update_column_title() {
    if(!client_column_title.trim().length || client_column_title === column.title) return
    set_is_editing_title(false)
    const result = await update_column_title(client_column_title, column.id)
    if(!result.ok) return;
    socket.emit('column_updated', column.org_id)
    router.refresh()
  }

  useEffect(
    function () {
      socket.on('card_new', () => {
        router.refresh();
      });
    },
    [router]
  );

  useEffect(function() {
    socket.on('column_update_new', () => {
      router.refresh()
    })
  }, [router])

  return (
    <div
      ref={setNodeRef}
      key={column.id}
      style={style}
      {...attributes}
      {...listeners}
      className="flex h-full min-w-[280px] flex-col rounded-xl border border-slate-800 bg-slate-900/40"
    >
      {/* Column header Draggable */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 cursor-all-scroll">
        {is_editing_title && <div className='relative flex flex-col'> 
        <input type='text' value={client_column_title} onChange={(e) => set_client_column_title(e.target.value)} onKeyDown={(e) => {
          if(e.key === 'Enter') return handle_update_column_title()
            return
        }} className='h-full w-full p-2 font-semibold outline-0 border-2 border-slate-600 rounded-xs' autoFocus onBlur={() => set_is_editing_title(false)}/>
        <div className='absolute right-2 top-1/2 -translate-y-1/2 self-end'>
          <button onMouseDown={handle_update_column_title} className='p-2 rounded-xs hover:bg-slate-500/60 cursor-pointer '>
            <Check size={14} color='#90a1b9' />
          </button>
        </div>
        </div>}
        {!is_editing_title && <h2 onClick={() => set_is_editing_title(true)} className="text-sm font-semibold text-slate-200">{column.title}</h2>}
        <span className="text-[11px] text-slate-500 ml-2">
          {column.cards?.length} {column.cards?.length === 1 ? 'card' : 'cards'}
        </span>
      </div>
      {/* Cards container */}
      <Cards
        cards={column.cards}
        active_id={active_id}
        column_id={column.id}
        organization_id={column.org_id}
        user_id={user_id}
      />
      {/* Add card button */}
      <div className="border-t border-slate-800 p-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full rounded-lg border border-dashed border-slate-700 px-3 py-2 text-[11px] text-slate-400 hover:border-slate-600 hover:text-slate-300 transition"
          >
            + Add card
          </button>
        )}
        {isOpen && (
          <form
            action={handle_create_card}
            className="w-full text-[11px] text-slate-400"
          >
            <input
              type="text"
              name="card_title"
              className="w-full mb-1 px-3 py-2 rounded-lg outline-0 bg-white "
            />
            <div className="flex items-center">
              <select name="priority" className="text-[13px] outline-0">
                <option value="low">Low priority</option>
                <option value="normal">Normal priority</option>
                <option value="urgent">Urgent priority</option>
              </select>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-2 whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 has-[>svg]:px-3 text-sm bg-transparent hover:bg-transparent border-0 justify-between text-left font-normal">
                    {date ? (
                      <span className="flex hover:bg-slate-800 px-2 py-1 rounded-md cursor-pointer items-center gap-2">
                        <TbCalendarDue />
                        {format(date, 'MMM dd')}
                      </span>
                    ) : (
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
                      const daysdiff = differenceInDays(date, new Date());
                      if (daysdiff < 0) return true;

                      return false;
                    }}
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="w-12 py-1 hover:text-slate-300 text-sm"
                onClick={() => setIsOpen(false)}
              >
                cancel
              </button>
              <button className="w-12 hover:text-slate-300 text-sm">
                create
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function Cards({
  cards,
  active_id,
  user_id,
}: {
  cards: Card[] | null;
  active_id: string | null;
  user_id: number;
}) {
  // const {setNodeRef: droppableNodeRef} = useDroppable({ id: `column-${column_id}`, data: { type: 'column', column_id } })
  if (!cards?.length) return;

  const active_card = cards.find((card) => `card-${card.id}` === active_id);

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-3">
      <SortableContext
        items={cards.map((card) => `card-${card.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {cards.map((card: Card) => (
          <Card card={card} key={card.id} user_id={user_id} />
        ))}
        {active_id && (
          <DragOverlay>
            {active_id && active_card ? <Card card={active_card} user_id={user_id} /> : null}
          </DragOverlay>
        )}
      </SortableContext>
    </div>
  );
}

export function Card({ card, user_id }: { card: Card; user_id: number }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formatted_date = format(card.due_date, 'MMM dd');
  const today = format(new Date(), 'MMM dd');
  const is_passed = isBefore(formatted_date, today);
  const created_by = card.created_by;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `card-${card.id}`,
      data: {
        type: 'card',
        column_id: card.column_id,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    // transition,
  };

  const { data: user, isPending } = useQuery({
    queryKey: ['created_by', card.id],
    queryFn: async () => get_user(created_by),
  });

  return (
    <div
      onClick={() => setIsDialogOpen(true)}
      key={card.id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="group cursor-pointer rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm hover:border-emerald-400/50 hover:bg-slate-900 transition flex flex-col gap-2"
    >
      <div className="flex justify-between font-medium text-slate-100">
        <span>{card.title}</span>
        <span
          className={`text-[11px] ${card.priority === 'low' ? 'text-emerald-400' : card.priority === 'normal' ? 'text-slate-400' : 'text-red-400'}`}
        >
          priority: {card.priority}
        </span>
      </div>
      <div className="flex justify-between items-center text-slate-400">
        <div
          className={`flex gap-2 items-center ${is_passed ? 'text-red-400 border border-red-400 px-2 py-0.5 rounded-sm' : ''}`}
        >
          <span>
            {!is_passed && <TbCalendarDue />}
            {is_passed && <TriangleAlert size={16} color="#ff6467" />}
          </span>
          due: {formatted_date}
        </div>
        <div>
          {isPending ? (
            <p>loading..</p>
          ) : <ProfilePicture user={user} className='w-6 h-6' /> }
        </div>
      </div>
      <CardDetailsDropdown isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} card={card} user_id={user_id} />
    </div>
  );
}

export function CardDetailsDropdown({isOpen, onOpenChange, card, user_id}: { isOpen: boolean; onOpenChange: Dispatch<SetStateAction<boolean>>; card: Card; user_id: number }) {
  const [client_card_title, set_client_card_title] = useState(() => card.title)
  const [client_card_description, set_client_card_description] = useState(() => card.description ?? '')
  const [is_editing_title, set_is_editing_title] = useState(false)
  const [is_editing_description, set_is_editing_description] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const queryClient = useQueryClient()
  const router = useRouter()

  const {data: user, isPending} = useQuery({ 
    queryKey: ['user', user_id],
    queryFn: async () => await get_user(user_id)
   })

   const {data: card_comments, isPending: comments_pending} = useQuery({
    queryKey: ['card_comments', card.id],
    queryFn: async () => await get_card_comments(card.id)
   })

   useEffect(function() {
    socket.on('card_update_new', () => {
      console.log('card_update')
      queryClient.invalidateQueries({
        queryKey: ['card_comments', card.id]
      })
    })
   }, [router, queryClient, card.id])

   async function handle_create_card_comment(formData: FormData) {
      setError(null)
      const comment = formData.get('comment') as string
      if(!comment.trim().length) return;
      const result = await create_card_comment({ sender_id: user_id, comment, card_id: card.id, org_id: card.org_id })
      if(!result.ok) return setError(result.error)
      queryClient.invalidateQueries({queryKey: ['card_comments', card.id]})
      socket.emit('card_updated', card.org_id)
   }

   async function handle_update_card(type: string) {
    if(type === 'title') {
        if(!client_card_title.trim().length || card.title === client_card_title) return;
        const result = await update_card({ title: client_card_title, card_id: card.id })
        set_is_editing_title(false)
      if(result.ok) {
        router.refresh()
        socket.emit('card_updated', card.org_id)
      }
        return;
    }

    if(type === 'description') {
      if(!client_card_description?.trim().length || card.description === client_card_description) return
      const result = await update_card({ description: client_card_description, card_id: card.id })
      if(result.ok)  {
        router.refresh()
        socket.emit('card_updated', card.org_id)
      }
      return;
    }
    return;
   }


return <Dialog open={isOpen} onOpenChange={onOpenChange} >
    <DialogContent className="sm:max-w-lg bg-slate-800 text-white">
      <DialogHeader className='flex flex-col'>
        {is_editing_title && <> 
        <input type='text' value={client_card_title} onKeyDown={(e) => {
          if(e.key === 'Enter') return handle_update_card('title')
          return
        }} onChange={(e) => set_client_card_title(e.target.value) } className='h-full w-full p-2 text-lg font-semibold outline-0 border-2 border-slate-600' autoFocus onBlur={() => set_is_editing_title(false)}/>
        <div className='self-end flex gap-2 items-center'>
          <button className='border-2 p-2 border-slate-400 rounded-xs hover:bg-slate-500/60 cursor-pointer'>
            <X size={18} color='#90a1b9' style={{ fontWeight: 'bold' }} />
          </button>
          <button onMouseDown={() => handle_update_card('title')} className='border-2 border-slate-400 p-2 rounded-xs hover:bg-slate-500/60 cursor-pointer '>
            <Check size={18} color='#90a1b9' />
          </button>
        </div>
        </>
        }
        {!is_editing_title && <DialogTitle onClick={() => set_is_editing_title(true)} className='h-full p-2 hover:bg-slate-400/40 transition-all ease duration-75'>{card.title}</DialogTitle>}
      </DialogHeader>
      <div className='p-2'>
        <h2 className='mb-1 font-semibold'>Description</h2>
        {is_editing_description && <div> 
        <textarea className='w-full border rounded-xs p-4 outline-0 mb-2' value={client_card_description} onChange={(e) => set_client_card_description(e.target.value) } autoFocus onBlur={() => set_is_editing_description(false)} rows={3} placeholder='Add your description here...'/>
        <div className='flex gap-2 items-center'>
          <button onMouseDown={() => handle_update_card('description')} className='bg-emerald-600 hover:bg-emerald-700 px-2 py-1 rounded-xs font-semibold cursor-pointer'>Save</button>
          <button className='cursor-pointer font-semibold hover:bg-slate-500/60 px-2 py-1 rounded-xs'>Cancel</button>
        </div>
         </div>}
        {!is_editing_description && <div onClick={() => set_is_editing_description(true)} className='text-slate-300 hover:bg-slate-400/40 transition-all ease duration-75 py-1'>{card.description ?? 'Add a description...'}</div>}
      </div>

      <div className='p-2'>
        <h2 className='font-semibold mb-2'>Comments</h2>
       <form action={handle_create_card_comment}>
          <div className='flex gap-2 '>
            <div>{isPending ? 'loading' : <ProfilePicture user={user} className='w-8 h-8' />}</div>
            <div className='flex-1'>
            <textarea name='comment' className='w-full border rounded-xs px-4 py-2 outline-0 mb-1' autoFocus rows={2} placeholder='Add a comment'/>
          <div className='flex justify-self-end gap-2 items-center'>
            <button className='bg-emerald-600 hover:bg-emerald-700 px-2 py-1 rounded-xs font-semibold cursor-pointer'>Save</button>
          </div>
            </div>
          </div>
        </form> 
      </div>
      <div className='max-h-48 overflow-y-scroll'>
        {card_comments?.length && card_comments.map(comment => (
          <div key={comment.comment.id} className='p-2'>
            <div className='flex gap-2 '>
              <div className=''>{isPending ? 'loading' : <ProfilePicture user={comment.user} className='w-8 h-8' />}</div>
              <div className='self-start'>
                <h3 className='font-semibold'>{comment.user.name}</h3>
                <p className='text-xs text-slate-300 mb-2'>{formatDistanceToNow(comment.comment.created_at)} ago</p>
               <div className='text-slate-200'>{comment.comment.comment}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  
</Dialog>
}

export function MembersDropdown({
  organization_members,
  organization_id,
  sender_id,
}: {
  organization_members: OrgMemberForDropdown[];
  organization_id: number;
  sender_id: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>();
  const [error, setError] = useState();
  const router = useRouter();
  const queryClient = useQueryClient();

  const authenticated_member = organization_members?.find(
    (member) => member.user.id === sender_id
  );
  const can_send_invite =
    authenticated_member?.role === 'admin'
      ? true
      : authenticated_member?.role === 'owner'
        ? true
        : false;

  async function handle_send_invite(formData: FormData) {
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    console.log('role', role);
    const inviteDTO = { email, org_id: organization_id, sender_id, role };
    const result = await send_organization_invite(inviteDTO);
    if (!result.ok) return setError(result.error);
    setIsOpen(false);
    toast('Invite has been sent.');
    socket.emit('invite_send', result.data);
  }

  useEffect(
    function () {
      socket.on('invite_new', () => {
        queryClient.invalidateQueries({
          queryKey: ['organization_invites', sender_id],
        });
      });
    },
    [router, queryClient, sender_id]
  );

  useEffect(
    function () {
      socket.on('invite_answer_new', () => {
        router.refresh();
      });
    },
    [router]
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IoMdArrowDropdown />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 mr-4 bg-slate-900 text-slate-400 border border-slate-400">
          <DropdownMenuGroup className="bg-transparent hover:bg-transparent ">
            <DropdownMenuLabel>Members</DropdownMenuLabel>
            {organization_members?.map((member) => (
              <DropdownMenuItem
                className="bg-transparent hover:bg-transparent"
                key={member.id}
              >
                {member.user.name}
              </DropdownMenuItem>
            ))}
            <Button
              onClick={() => setIsOpen(true)}
              className="text-slate-300 border-t border-slate-400 rounded-none w-full bg-slate-900 hover:bg-slate-800 cursor-pointer"
            >
              Invite new member
            </Button>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-sm bg-slate-900 text-slate-300 border border-slate-600">
          {!can_send_invite && (
            <div>
              <h3>Only admins and owners are allowed to invite new users.</h3>
              <p>your role: {authenticated_member?.role}</p>
            </div>
          )}
          {can_send_invite && (
            <form action={handle_send_invite} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Add people</DialogTitle>
              </DialogHeader>
              <div>
                <label className="block mb-1" htmlFor="name-1">
                  Email address
                </label>
                <input
                  id="name-1"
                  type="email"
                  name="email"
                  placeholder="johndoe@gmail.com"
                  className="mb-1 border border-slate-300 px-2 py-1 w-full outline-slate-300 rounded-sm"
                />
                <span className="text-slate-400">role:</span>
                <select name="role" className="outline-0 text-slate-400">
                  <option value="member">member</option>
                  <option value="admin">admin</option>
                </select>
                {error && (
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    className="bg-transparent text-slate-300 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-slate-300 hover:bg-slate-400 cursor-pointer text-black font-semibold px-4 py-2 rounded-md"
                >
                  Add
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ProfileDropdown({ user }: { user: User }) {
  const router = useRouter();
  const { data: invites, isPending } = useQuery({
    queryKey: ['organization_invites', user.id],
    queryFn: async () => get_organization_invites_of_member(user.id),
  });
  const pending_invites =
    invites?.length &&
    invites?.filter((invite: Invite) => invite.status === 'pending');

  async function handle_logout() {
    await logout();
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
         <ProfilePicture user={user} className='w-8 h-8 cursor-pointer' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-900 text-slate-400">
        <DropdownMenuItem>
          <Link
            href="/account/profile"
            className="flex gap-2 items-center w-full h-full"
          >
            <UserIcon />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href="/account/invites"
            className="flex gap-2 items-center w-full h-full"
          >
            <FcInvite />
            <span> Invites </span>
            {pending_invites?.length > 0 && (
              <span className="border border-slate-400 rounded-full px-2">
                {pending_invites?.length}
              </span>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <button
            onClick={handle_logout}
            className="w-full h-full flex items-center gap-2"
          >
            <LogOutIcon />
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

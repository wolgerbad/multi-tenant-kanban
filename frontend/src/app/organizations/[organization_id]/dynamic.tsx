'use client';

import { create_board } from '@/helpers/board';
import { socket } from '@/helpers/socket';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

export function CreateNewBoard({
  organization_id,
}: {
  organization_id: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  async function handle_create_board(formData: FormData) {
    // setError(null)
    const board_title = formData.get('board_title') as string;
    if (!board_title?.length) return;
    const result = await create_board({ board_title, organization_id });
    router.refresh();
    if (result.ok) {
      socket.emit('board_create', organization_id);
      setIsOpen(false);
    }
    // if(!result.ok) setError(result.error)
  }

  useEffect(
    function () {
      socket.on('board_new', () => {
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
          className="rounded-sm gap-2 ml-2 bg-slate-900 hover:bg-slate-900 hover:border-slate-600 text-slate-300 hover:text-slate-300 cursor-pointer border-slate-400"
        >
          <Plus size={16} />
          Create new board
        </Button>
      )}
      {isOpen && (
        <form action={handle_create_board} className="flex flex-col gap-2">
          <Input
            name="board_title"
            placeholder="Enter board name..."
            className="bg-slate-800 ring-0 focus-visible:ring-1 border-slate-700 text-slate-100 placeholder:text-slate-500"
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
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      )}
    </div>
  );
}

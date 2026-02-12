import { getSession } from "@/helpers/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { get_columns_by_board_id } from "@/helpers/column";
import { Card, ColumnWithCards } from "@/types";
import { Columns, CreateColumn } from "./dynamic";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ organization_id: number; board_id: number }>;
}) {
  const { organization_id, board_id } = await params;
  const session = await getSession();
  if (!session.ok) redirect("/landing");

  const columns = await get_columns_by_board_id(board_id)
  console.log("columns", columns)
  // TODO: Replace with real fetch
  // const columns = await get_columns_of_board(Number(board_id));
  // const cards = await get_cards_of_board(Number(board_id));

  // Mock data structure - replace with your API call
  // const columns = [
  //   {
  //     id: 1,
  //     title: "Todo",
  //     position: 0,
  //     cards: [
  //       { id: 1, title: "Design onboarding", description: "Update empty state", position: 0 },
  //       { id: 2, title: "Set up backend", description: "Columns and cards API", position: 1 },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     title: "In Progress",
  //     position: 1,
  //     cards: [
  //       { id: 3, title: "Keyboard shortcuts", description: "Move cards with keys", position: 0 },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     title: "Done",
  //     position: 2,
  //     cards: [
  //       { id: 4, title: "Dark UI pass", description: "Shadows and contrast", position: 0 },
  //     ],
  //   },
  // ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="flex min-h-screen flex-col">
        {/* Top navbar */}
        <header className="border-b border-slate-800 bg-slate-900/60 px-6 py-3">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/${organization_id}`}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
              >
                ← Back to boards
              </Link>
              <div className="h-4 w-px bg-slate-700" />
              <h1 className="text-sm font-semibold text-slate-100">
                {/* TODO: Replace with board.title from API */}
                Sprint Board
              </h1>
            </div>
          </div>
        </header>

        {/* Board content - horizontal scroll */}
        <div className="flex-1 overflow-x-auto">
            <Columns columns={columns} organization_id={organization_id} board_id={board_id} user_id={session.data.id} />
        </div>
      </div>
    </main>
  );
}
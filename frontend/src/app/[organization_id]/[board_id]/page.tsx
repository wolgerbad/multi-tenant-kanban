import { getSession } from "@/helpers/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ organization_id: number; board_id: number }>;
}) {
  const { organization_id, board_id } = await params;
  const session = await getSession();
  if (!session.ok) redirect("/landing");

//   const columns = await get_columns(board_id)

  // TODO: Replace with real fetch
  // const columns = await get_columns_of_board(Number(board_id));
  // const cards = await get_cards_of_board(Number(board_id));

  // Mock data structure - replace with your API call
  const columns = [
    {
      id: 1,
      title: "Todo",
      position: 0,
      cards: [
        { id: 1, title: "Design onboarding", description: "Update empty state", position: 0 },
        { id: 2, title: "Set up backend", description: "Columns and cards API", position: 1 },
      ],
    },
    {
      id: 2,
      title: "In Progress",
      position: 1,
      cards: [
        { id: 3, title: "Keyboard shortcuts", description: "Move cards with keys", position: 0 },
      ],
    },
    {
      id: 3,
      title: "Done",
      position: 2,
      cards: [
        { id: 4, title: "Dark UI pass", description: "Shadows and contrast", position: 0 },
      ],
    },
  ];

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
            <button className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500 hover:text-slate-100 transition">
              Add column
            </button>
          </div>
        </header>

        {/* Board content - horizontal scroll */}
        <div className="flex-1 overflow-x-auto">
          <div className="mx-auto flex min-h-full gap-4 p-6" style={{ width: "max-content" }}>
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex h-full min-w-[280px] flex-col rounded-xl border border-slate-800 bg-slate-900/40"
              >
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                  <h2 className="text-sm font-semibold text-slate-200">{column.title}</h2>
                  <span className="text-[11px] text-slate-500">
                    {column.cards.length} {column.cards.length === 1 ? "card" : "cards"}
                  </span>
                </div>

                {/* Cards container */}
                <div className="flex-1 space-y-2 overflow-y-auto p-3">
                  {column.cards.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-[11px] text-slate-500">
                      Drop cards here
                    </div>
                  ) : (
                    column.cards.map((card) => (
                      <div
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
                    ))
                  )}
                </div>

                {/* Add card button */}
                <div className="border-t border-slate-800 p-3">
                  <button className="w-full rounded-lg border border-dashed border-slate-700 px-3 py-2 text-[11px] text-slate-400 hover:border-slate-600 hover:text-slate-300 transition">
                    + Add card
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
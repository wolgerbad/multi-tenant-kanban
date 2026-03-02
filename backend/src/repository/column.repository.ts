import { eq } from 'drizzle-orm';
import { card, Column, column } from '../db/schema.js';
import { db } from '../db/index.js';

async function get_columns_by_board_id(boardId: number) {
  // return await db.select().from(column).where(eq(column.board_id, boardId)).leftJoin(card, eq(card.column_id, column.id))
  return await db.query.column.findMany({
    where: eq(column.board_id, boardId),
    with: {
      cards: {
        orderBy: (card, { asc }) => asc(card.position),
      },
    },
    orderBy: (column, { asc }) => asc(column.position),
  });
}

async function create_column(columnDTO: {
      board_id: number;
      org_id: number;
      position: number;
      title: string;
    }) {
  return await db.insert(column).values(columnDTO);
}

async function get_column(columnId: number) {
  return await db.select().from(column).where(eq(column.id, columnId));
}

async function switch_column_positions(columns: {
  dragged_column: Column;
  dropped_column: Column;
}) {
  await db
    .update(column)
    .set({ position: columns.dropped_column.position })
    .where(eq(column.id, columns.dragged_column.id));
  await db
    .update(column)
    .set({ position: columns.dragged_column.position })
    .where(eq(column.id, columns.dropped_column.id));
}

async function update_column_title(column_id: number, title: string) {
  return await db.update(column).set({ title }).where(eq(column.id, column_id));
}

async function delete_column(column_id: number) {
    return await db.delete(column).where(eq(column.id, column_id))
}

export const column_repository = {
  get_columns_by_board_id,
  get_column,
  create_column,
  switch_column_positions,
  update_column_title,
  delete_column
};

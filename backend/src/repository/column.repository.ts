import { eq } from "drizzle-orm";
import { card, Column, column } from "../db/schema.js";
import { db } from "../db/index.js";

async function get_columns_by_board_id(boardId: number) {
   // return await db.select().from(column).where(eq(column.board_id, boardId)).leftJoin(card, eq(card.column_id, column.id))
  return await db.query.column.findMany({
      where: eq(column.board_id, boardId),
      with: {
        cards: true
      }
    })    
}

async function create_column(columnDTO: Column) {
  return await db.insert(column).values(columnDTO)
}


export const column_repository = { get_columns_by_board_id, create_column }
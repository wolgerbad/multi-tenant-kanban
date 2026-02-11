import { eq } from "drizzle-orm";
import { column } from "../db/schema.js";
import { db } from "../db/index.js";

async function get_columns_by_board_id(boardId: number) {
   return await db.select().from(column).where(eq(column.board_id, boardId))
}

export const column_repository = { get_columns_by_board_id }
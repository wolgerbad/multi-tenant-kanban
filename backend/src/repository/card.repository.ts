import { inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { card } from "../db/schema.js";

async function get_cards_by_column_id(columnId: number[]) {
   return await db.select().from(card).where(inArray(card.column_id, columnId))
}

export const card_repository = { get_cards_by_column_id }
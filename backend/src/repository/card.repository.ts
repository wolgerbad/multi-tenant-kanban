import { asc, eq, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { Card, card } from "../db/schema.js";

async function get_cards_by_column_id(columnId: number) {
   return await db.select().from(card).where(eq(card.column_id, columnId)).orderBy(asc(card.position))
}

async function get_card(card_id: number) {
   return await db.select().from(card).where(eq(card.id, card_id))
}

async function create_card(cardDTO: Card) {
   return await db.insert(card).values(cardDTO)
}

async function switch_card_positions(dragged_card: Card, dropped_card: Card) {
   await db.update(card).set({position: dropped_card.position }).where(eq(card.id, dragged_card.id))
   await db.update(card).set({position: dragged_card.position }).where(eq(card.id, dropped_card.id))
}

async function switch_card_column(DTO: { card_id: number; column_id: number, position: number }) {
   return await db.update(card).set({ column_id: DTO.column_id, position: DTO.position }).where(eq(card.id, DTO.card_id))
}

export const card_repository = { get_cards_by_column_id, create_card, get_card, switch_card_positions, switch_card_column }
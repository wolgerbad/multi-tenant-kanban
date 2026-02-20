import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { board } from "../db/schema.js";
async function create_board(orgId, title) {
    return await db.insert(board).values({ org_id: orgId, title }).$returningId();
}
async function get_boards_of_organization(orgId) {
    return await db.select().from(board).where(eq(board.org_id, orgId));
}
async function get_board_by_id(boardId) {
    return await db.select().from(board).where(eq(board.id, boardId));
}
export const board_repository = { create_board, get_boards_of_organization, get_board_by_id };

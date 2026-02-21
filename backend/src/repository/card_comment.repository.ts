import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { card_comment, users } from '../db/schema.js';

async function get_card_comments(card_id: number) {
  return await db
    .select({ comment: card_comment, user: users })
    .from(card_comment)
    .where(eq(card_comment.card_id, card_id))
    .leftJoin(users, eq(users.id, card_comment.sender_id))
    .orderBy(desc(card_comment.created_at));
}

async function create_card_comment(DTO: {
  sender_id: number;
  card_id: number;
  org_id: number;
  comment: string;
}) {
  await db.insert(card_comment).values(DTO);
}

export const card_comment_repository = {
  get_card_comments,
  create_card_comment,
};

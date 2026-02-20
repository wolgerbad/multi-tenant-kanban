import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
async function get_user_by_email(email) {
    return await db.select().from(users).where(eq(users.email, email));
}
async function get_user_by_id(userId) {
    return await db.select().from(users).where(eq(users.id, userId));
}
async function add_user(newUser) {
    return await db.insert(users).values({ ...newUser }).$returningId();
}
async function update_user_image(DTO) {
    return await db.update(users).set({ image: DTO.image }).where(eq(users.id, DTO.user_id));
}
async function update_user_name(DTO) {
    return await db.update(users).set({ name: DTO.name }).where(eq(users.id, DTO.user_id));
}
export const user_repository = { get_user_by_email, add_user, get_user_by_id, update_user_image, update_user_name };

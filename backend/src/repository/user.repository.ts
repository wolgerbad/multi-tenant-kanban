import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { SignupDTO } from "../types.js";

export async function get_user_by_email(email: string) {
    return await db.select().from(users).where(eq(users.email, email)) 
}

export async function get_user_by_id(userId: number) {
    return await db.select().from(users).where(eq(users.id, userId))
}

export async function add_user(newUser: SignupDTO) {
    return await db.insert(users).values({...newUser}).$returningId();  
}


export const user_repository = { get_user_by_email, add_user, get_user_by_id }
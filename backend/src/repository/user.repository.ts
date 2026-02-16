import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { SignupDTO } from "../types.js";

async function get_user_by_email(email: string) {
    return await db.select().from(users).where(eq(users.email, email)) 
}

async function get_user_by_id(userId: number) {
    return await db.select().from(users).where(eq(users.id, userId))
}

async function add_user(newUser: SignupDTO) {
    return await db.insert(users).values({...newUser}).$returningId();  
}

async function update_user_image(DTO: {user_id: number; image: string}) {
   return await db.update(users).set({ image: DTO.image }).where(eq(users.id, DTO.user_id))
}


export const user_repository = { get_user_by_email, add_user, get_user_by_id, update_user_image }
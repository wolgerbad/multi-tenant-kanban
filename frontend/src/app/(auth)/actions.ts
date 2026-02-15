"use server"

import { cookies } from "next/headers";

export async function logout() {
   return (await cookies()).delete('jwt')
}
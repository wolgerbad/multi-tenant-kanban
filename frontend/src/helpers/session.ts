import { env } from "@/utils/envSchema";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(env.JWT_SECRET)

export async function verifyJWT() {
    const jwt = (await cookies()).get('jwt')?.value
    if(!jwt) return;
    
   return await jwtVerify(jwt, SECRET)
}

export async function getSession() {
    try {
      const verify = await verifyJWT();
      if(!verify?.payload) throw new Error('Not authenticated.')
      const userId = verify?.payload.id;
      const res = await fetch(`http://localhost:8000/user/${userId}`)
      const result = await res.json()

      return { ok:true, data: result }
    } catch (error: any) {
        return {ok: false, message: error.message}
    }
}
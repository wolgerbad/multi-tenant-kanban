import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { serverEnv } from "@/utils/envServer"
import { clientEnv } from '@/utils/envSchema'

const SECRET = new TextEncoder().encode(serverEnv.JWT_SECRET)

export async function verifyJWT() {
  const jwt = (await cookies()).get('jwt')?.value
  if (!jwt)
    return

  return await jwtVerify(jwt, SECRET)
}

export async function getSession() {
  try {
    const verify = await verifyJWT()
    if (!verify?.payload)
      throw new Error('Not authenticated.')
    const userId = verify?.payload.id
    const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/user/${userId}`)
    const result = await res.json()

    return { ok: true, data: result }
  }
  catch (error: any) {
    return { ok: false, message: error.message }
  }
}


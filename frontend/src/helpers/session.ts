import { jwtVerify } from 'jose'
import { cookies, headers } from 'next/headers'
import { serverEnv } from "@/utils/envServer"
import { clientEnv } from '@/utils/envSchema'

const SECRET = new TextEncoder().encode(serverEnv.JWT_SECRET)

export async function getSession() {
  const jwt = (await cookies()).get('jwt')?.value;
  try {
      if(!jwt?.length) throw new Error('no jwt'); 
      const verify = await jwtVerify(jwt, SECRET);
      if (!verify?.payload) throw new Error('Not authenticated.');
      const userId = verify?.payload.id;
      const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/user/${userId}`);
      const user = await res.json();
      
      return {ok: true, data: user};
  }
  catch (error: any) {
    return {ok: false, message: error.message};
  }
}


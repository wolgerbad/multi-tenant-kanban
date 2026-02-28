'use server';

import { clientEnv } from '@/utils/envSchema';
import { SignJWT } from 'jose';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signup(prev: unknown, formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const result = await res.json();
    if (result.error) throw new Error(result.error);
    
    const jwt = await new SignJWT({ id: result.data })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('3 days')
      .sign(SECRET);
  
    (await cookies()).set('jwt', jwt)
  
    revalidatePath('/signup')
  
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}


export async function login(prev: unknown, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // console.log("email pswrd", email, password)
  try {
    const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const result = await res.json();
    console.log("result", result)
    if (result.error) throw new Error(result.error);

    const jwt = await new SignJWT({ id: result.data })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('3 days')
    .sign(SECRET);

  (await cookies()).set('jwt', jwt)
  
  revalidatePath('/login')
  return { error: null }

  } catch (error: any) {
    return { error: error.message }
  }

}

export async function logout() {
  return (await cookies()).delete('jwt');
}

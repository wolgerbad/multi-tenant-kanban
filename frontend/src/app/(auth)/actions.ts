'use server';

import { clientEnv } from '@/utils/envSchema';
import { SignJWT } from 'jose';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signup(prev: unknown, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name.trim().length || !email || !password.length)
    return { error: 'Invalid values.', success: null };

    const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const result = await res.json();
    if (result?.error) return { error: result.error, success: null };
    console.log("result", result)

    const jwt = await new SignJWT({ id: result.data })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('3 days')
      .sign(SECRET);

    (await cookies()).set('jwt', jwt);

    revalidatePath('/signup');

    return { error: null, success: true };
}

export async function login(prev: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password.length)
    return { success: null, error: 'Invalid values.' };

    const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const result = await res.json();
    if (result?.error) return { error: result.error, success: null };
    if (result?.message) return { error: result.message, success: null };

    const jwt = await new SignJWT({ id: result.data })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('3 days')
      .sign(SECRET);

    (await cookies()).set('jwt', jwt);

    revalidatePath('/login');
    return { error: null, success: true };
}

export async function logout() {
  return (await cookies()).delete('jwt');
}

'use server'

import { cookies } from 'next/headers'

export async function setAuthCookie(token) {
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // Set to false so it can be read by client if needed, but middleware will use it
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}

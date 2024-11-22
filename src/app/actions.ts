'use server'

import { cookies } from 'next/headers'

export async function create(locale: string) {
  const cookieStore = await cookies()

  cookieStore.set('locale', locale)
}

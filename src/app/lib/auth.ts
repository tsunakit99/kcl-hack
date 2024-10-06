// lib/auth.ts

import { authOptions } from '@/app/lib/next-auth/authOptions';
import { getServerSession } from 'next-auth';

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

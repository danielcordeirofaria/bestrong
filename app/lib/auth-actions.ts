'use server';

import { signOut } from '@/auth';

export async function signOutAction() {
  console.log('Server Action from auth-actions.ts: signOutAction called!');
  await signOut({ redirectTo: '/' });
}
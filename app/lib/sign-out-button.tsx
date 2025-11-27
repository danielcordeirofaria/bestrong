'use client';

import { signOutAction } from '@/app/lib/auth-actions';
import React from 'react';

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
      >
        Sign Out
      </button>
    </form>
  );
}
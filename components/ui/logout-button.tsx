'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import LogoutModal from './logout-modal';
import { LogOut } from 'lucide-react';
import { signOutAction } from '@/app/lib/auth-actions';


export default function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(() => {
      signOutAction().then(() => {
        setIsModalOpen(false);
        router.refresh();
      });
    });
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </button>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSignOut}
        isConfirming={isPending}
      />
    </>
  );
}

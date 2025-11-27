'use client';

import React, { useState, useTransition } from 'react';
import { signOutAction } from '@/app/lib/actions';
import LogoutModal from './logout-modal';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogoutConfirm = () => {
    startTransition(() => {
      signOutAction();
    });
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </button>
      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

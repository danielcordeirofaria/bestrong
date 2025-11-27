'use client';

import React, { useState } from 'react';
import { signOutAction } from '@/app/lib/actions';
import LogoutModal from './logout-modal';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Este formulário será submetido pelo botão de confirmação no modal */}
      <form action={signOutAction}>
        <button
          type="button" // Importante: tipo 'button' para não submeter o formulário ao abrir o modal
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </form>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => document.querySelector('form[action*="signOutAction"]')?.requestSubmit()}
      />
    </>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { signOutAction } from '@/app/lib/actions';
import LogoutModal from './logout-modal';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleConfirm = () => {
    // Submete o formulário usando a referência
    formRef.current?.requestSubmit();
  };

  return (
    <>
      {/* Este formulário será submetido pelo botão de confirmação no modal */}
      <form action={signOutAction} ref={formRef}>
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
        onConfirm={handleConfirm}
      />
    </>
  );
}

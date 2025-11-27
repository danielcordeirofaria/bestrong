'use client';

import React, { useState, useRef } from 'react';
import LogoutModal from './logout-modal';
import { LogOut } from 'lucide-react';
import { signOutAction } from '@/app/lib/auth-actions';

export default function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleConfirm = () => {
    // Submete o formulário que está sempre no DOM
    formRef.current?.requestSubmit();
  };

  return (
    <>
      {/* O formulário agora está aqui, mas o botão de submit está escondido.
          Ele será acionado programaticamente. */}
      <form action={signOutAction} ref={formRef} className="hidden">
        <button type="submit">Submit</button>
      </form>

      {/* Este é o botão que o usuário vê e clica para abrir o modal */}
      <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </button>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}

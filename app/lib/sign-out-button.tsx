'use client';

import { signOutAction } from '@/app/lib/auth-actions';
import ConfirmationDialog from '@/app/lib/confirmation-dialog';
import React, { useState, useTransition } from 'react';

export function SignOutButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    // A mensagem que você estava vendo no console do navegador
    console.log('Confirm button clicked, calling onConfirm action...');
    startTransition(async () => {
      await signOutAction();
    });
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
      >
        Sign Out
      </button>

      {isOpen && (
        <ConfirmationDialog
          title="Confirmar Sign Out"
          message="Você tem certeza que deseja sair?"
          onConfirm={handleConfirm}
          onCancel={() => setIsOpen(false)}
          isConfirming={isPending}
        />
      )}
    </>
  );
}
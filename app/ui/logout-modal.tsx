'use client';

import React from 'react';
import { signOutAction } from '@/app/lib/auth-actions';
interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  console.log('LogoutModal isOpen:', isOpen); // LOG 1: Verifica se o modal está sendo renderizado

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">Confirm Sign Out</h2>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to sign out?
        </p>
        {/* O formulário agora envolve os botões de ação */}
        <form
          action={signOutAction}
          onSubmit={() => console.log('Form submitted, calling signOutAction...')} // LOG 2: Verifica se a submissão foi acionada
          className="mt-6 flex justify-end space-x-4"
        >
          <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            Cancel
          </button>
            <button type="submit" className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Sign Out
            </button>
        </form>
      </div>
    </div>
  );
}

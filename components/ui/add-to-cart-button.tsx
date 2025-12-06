'use client';

import { addToCart } from '@/app/lib/actions';
import { useFormState, useFormStatus } from 'react-dom';
import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      aria-disabled={pending}
    >
      {pending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}

export default function AddToCartButton({ productId }: { productId: number }) {
  const [showSuccess, setShowSuccess] = useState(false);
  // Vincula o productId à ação ANTES de passá-la para o useFormState.
  const addToCartWithId = addToCart.bind(null, productId);
  const [state, formAction] = useFormState(addToCartWithId, null);

  useEffect(() => {
    if (state?.message === 'Product added to cart!') {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000); // Mostra a mensagem por 2 segundos
      return () => clearTimeout(timer);
    } else if (state?.message) {
      alert(state.message); // Mostra um alerta para outros erros
    }
  }, [state]);

  return (
    <div className="relative">
      {showSuccess ? (
        <div className="flex w-full items-center justify-center gap-2 rounded bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm">
          <CheckCircle className="h-5 w-5" /> Added!
        </div>
      ) : (
        <form action={formAction} className="w-full"><SubmitButton /></form>
      )}
    </div>
  );
}
'use client';

import { deleteProduct } from '@/app/lib/actions';
import { Trash2, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import React from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center rounded-md bg-destructive p-2 text-destructive-foreground transition-colors hover:bg-destructive/80 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Delete product"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}

interface DeleteProductButtonProps {
  productId: number;
}

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const deleteProductWithId = deleteProduct.bind(null, productId);

  return (
    <form action={deleteProductWithId}>
      <SubmitButton />
    </form>
  );
}
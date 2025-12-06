'use client';

import { updateCartItemQuantity, removeCartItem } from '@/app/lib/actions';
import { useTransition } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import React from 'react';

interface UpdateCartQuantityProps {
  itemId: number;
  quantity: number;
}

export default function UpdateCartQuantity({ itemId, quantity }: UpdateCartQuantityProps) {
  const [isPending, startTransition] = useTransition();

  const handleQuantityChange = (newQuantity: number) => {
    startTransition(() => {
      updateCartItemQuantity(itemId, newQuantity);
    });
  };

  const handleRemove = () => {
    startTransition(() => {
      removeCartItem(itemId);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleQuantityChange(quantity - 1)}
        disabled={isPending}
        className="rounded-full p-1.5 hover:bg-gray-100 disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center">{quantity}</span>
      <button
        onClick={() => handleQuantityChange(quantity + 1)}
        disabled={isPending}
        className="rounded-full p-1.5 hover:bg-gray-100 disabled:opacity-50"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button onClick={handleRemove} disabled={isPending} className="ml-4 text-destructive hover:text-destructive/80 disabled:opacity-50" aria-label="Remove item">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
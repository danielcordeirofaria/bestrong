'use client';

import { updateProduct, State } from '@/app/lib/actions';
import ProductForm from '@/components/ui/product-form';
import { useFormState, useFormStatus } from 'react-dom';
import React from 'react';

function FormWrapper({ state, initialData }: { state: State; initialData: any }) {
  const { pending } = useFormStatus();
  return <ProductForm isLoading={pending} serverErrors={state.errors} initialData={initialData} />;
}

export default function EditProductForm({ product }: { product: any }) {
  const initialState: State = { message: null, errors: {} };
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, dispatch] = useFormState(updateProductWithId, initialState);

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Edit Product
      </h1>
      <form action={dispatch}>
        <FormWrapper state={state} initialData={product} />
      </form>
      {state.message && (
        <div className="mt-4 text-center text-sm text-red-600"><p>{state.message}</p></div>
      )}
    </div>
  );
}

'use client';

import { createProduct, State } from '@/app/lib/actions';
import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import ProductForm from '@/components/ui/product-form';


function FormWrapper({ state }: { state: State }) {
  const { pending } = useFormStatus();
  return <ProductForm isLoading={pending} serverErrors={state.errors} />;
}

function CreateProductPage() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createProduct, initialState);

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Create New Product
        </h1>

        <form action={dispatch}>
          <FormWrapper state={state} />
        </form>

        {state.message && (
          <div className="mt-4 text-center text-sm text-red-600">
            <p>{state.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default CreateProductPage;

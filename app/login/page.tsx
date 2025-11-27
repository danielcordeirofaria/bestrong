import React from 'react';
import LoginForm from '@/components/ui/login-form';
import { Suspense } from 'react';

const LoginPage = () => {
  return (
    <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
};

export default LoginPage;

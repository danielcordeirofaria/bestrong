// app/dashboard/page.tsx
import React from 'react';
import { User, ShoppingBag } from 'lucide-react';

export default function DashboardPage() {
  return (
    <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-text-main">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Welcome to your dashboard. Here's an overview of your account.
          </p>
        </div>

        {/* Exemplo de conteúdo do Dashboard */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <User className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold text-text-main">Your Profile</h3>
            <p className="mt-2 text-sm text-secondary">View and edit your personal information.</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <ShoppingBag className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold text-text-main">Your Products/Orders</h3>
            <p className="mt-2 text-sm text-secondary">Manage your products or track your orders.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

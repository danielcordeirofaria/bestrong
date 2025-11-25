import React from 'react';
import { ShoppingBag, User } from 'lucide-react';
import { Session } from 'next-auth';

interface BuyerDashboardProps {
  user: Session['user'];
}

export default function BuyerDashboard({ user }: BuyerDashboardProps) {
  return (
    <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-text-main">
            My Account
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Welcome back, {user.name}! Manage your orders and profile.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <ShoppingBag className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold text-text-main">Order History</h3>
            <p className="mt-2 text-sm text-secondary">View your past and current orders.</p>
            {/* Você pode listar os pedidos recentes aqui */}
          </div>
        </div>
      </div>
    </main>
  );
}
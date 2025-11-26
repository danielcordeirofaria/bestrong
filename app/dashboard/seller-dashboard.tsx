import React from 'react';
import { DollarSign, Package, Users } from 'lucide-react';
import { Session } from 'next-auth';

interface SellerDashboardProps {
  user: Session['user'];
}

export default function SellerDashboard({ user }: SellerDashboardProps) {
  // No futuro, buscará dados reais do banco de dados aqui.
  const totalSales = 1250.75;
  const totalProducts = 15;

  return (
    <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-text-main">
            Seller Dashboard
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Welcome back, {user.name}! Here's your sales overview.
          </p>
        </div>

        {/* Relatório de Vendas */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <DollarSign className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold text-text-main">Total Revenue</h3>
            <p className="text-2xl font-bold text-text-main">${totalSales.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Package className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold text-text-main">Active Products</h3>
            <p className="text-2xl font-bold text-text-main">{totalProducts}</p>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-text-main mb-4">Your Products</h3>
          <p className="text-secondary">This is where your list of products for sale will appear.</p>
          {/* Você pode mapear e listar os produtos aqui */}
        </div>
      </div>
    </main>
  );
}

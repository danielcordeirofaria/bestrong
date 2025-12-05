import React from 'react';
import { DollarSign, Package } from 'lucide-react';
import Link from 'next/link';
import { Session } from 'next-auth';
import { sql } from '@vercel/postgres';

interface SellerDashboardProps {
  user: Session['user'];
}

export default async function SellerDashboard({ user }: SellerDashboardProps) {
  const totalSales = 1250.75;

  const productsCountData = await sql`
    SELECT COUNT(*) 
    FROM products 
    WHERE seller_id = ${user.id}`;
  
  const totalProducts = productsCountData.rows[0].count;

  return (
    <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-text-main">
            Seller Dashboard
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Welcome back, {user.name}! Here&apos;s your sales overview.
          </p>
        </div>

        {/* Relatório de Vendas */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <DollarSign className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold text-text-main">Total Revenue</h3>
            <p className="text-2xl font-bold text-text-main">${totalSales.toLocaleString()}</p>
          </div>
          <Link href="/dashboard/products" className="block rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md hover:border-primary/50">
            <div>
              <Package className="mb-4 h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold text-text-main">Active Products</h3>
              <p className="text-2xl font-bold text-text-main">{totalProducts}</p>
            </div>
          </Link>
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

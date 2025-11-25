// app/dashboard/page.tsx
import React from 'react';
import { auth } from '@/auth';
import SellerDashboard from './seller-dashboard';
import BuyerDashboard from './buyer-dashboard';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  // O middleware já deve proteger esta rota, mas é uma boa prática verificar.
  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user;

  if (user.role === 'seller') {
    return <SellerDashboard user={user} />;
  }

  if (user.role === 'buyer') {
    return <BuyerDashboard user={user} />;
  }

  // Fallback para caso o usuário não tenha um role definido
  return <div>Invalid user role. Please contact support.</div>;
}

import React from 'react';
import { Merriweather, Lato } from 'next/font/google';
import './globals.css';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
});

import type { Metadata } from 'next';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Handcrafted Haven',
    default: 'Handcrafted Haven',
  },
  description: 'The best place to buy and sell handcrafted goods.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${merriweather.variable} ${lato.variable} flex flex-col min-h-screen bg-background font-sans text-text-main antialiased`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
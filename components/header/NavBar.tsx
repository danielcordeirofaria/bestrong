'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, LayoutDashboard, Store, Menu, X } from 'lucide-react';
import LogoutButton from '@/components/ui/logout-button';
import styles from './header.module.css';

interface UserData {
    role?: string;
    id?: string;
}

interface NavBarProps {
    user?: UserData | null;
    cartItemCount: number;
}

export default function NavBar({ user, cartItemCount }: NavBarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between border-b border-ui-border pb-4">

                <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
                    <Image
                        src="/HandcraftedHaven.png"
                        alt="Bestrong Logo"
                        width={50}
                        height={50}
                        className="rounded-full"
                        priority
                    />
                </Link>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-text-main">
                    <Link href="/" onClick={closeMenu}>Handcrafted Haven</Link>
                </h1>

                <div className="hidden md:flex items-center gap-5">
                    {user?.role === 'seller' && (
                        <Link href="/dashboard" aria-label="Dashboard" className={styles.link}>
                            <p className={styles.p}>Dashboard</p>
                            <LayoutDashboard className="h-6 w-6 text-text-main" />
                        </Link>
                    )}
                    {user?.role === 'buyer' && (
                        <Link href="/products" aria-label="Products" className={styles.link}>
                            <p className={styles.p}>Products</p>
                            <Store className="h-6 w-6 text-text-main" />
                        </Link>
                    )}

                    {user?.role !== 'seller' && (
                        <Link href="/cart" className="relative group" aria-label="Cart">
                            <div className={styles.pCart}>
                                <p className={styles.p}>Cart</p>
                                <ShoppingCart className="h-6 w-6 text-text-main" />
                            </div>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {user ? (
                        <LogoutButton />
                    ) : (
                        <Link href="/login" aria-label="Login">
                            <User className="h-6 w-6 text-text-main" />
                        </Link>
                    )}
                </div>

                <div className="md:hidden">
                    <button onClick={toggleMenu} aria-label="Toggle Menu">
                        {isMenuOpen ? (
                            <X className="h-8 w-8 text-text-main" />
                        ) : (
                            <Menu className="h-8 w-8 text-text-main" />
                        )}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden mt-4 flex flex-col items-center gap-4 bg-background py-4 shadow-lg rounded-lg border border-ui-border">
                    {user?.role === 'seller' && (
                        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-text-main p-2" onClick={closeMenu}>
                            <LayoutDashboard className="h-6 w-6" />
                            Dashboard
                        </Link>
                    )}
                    {user?.role === 'buyer' && (
                        <Link href="/products" className="flex items-center gap-2 text-lg font-semibold text-text-main p-2" onClick={closeMenu}>
                            <Store className="h-6 w-6" />
                            Products
                        </Link>
                    )}

                    {user?.role !== 'seller' && (
                        <Link href="/cart" className="relative flex items-center gap-2 text-lg font-semibold text-text-main p-2" onClick={closeMenu}>
                            <ShoppingCart className="h-6 w-6" />
                            Cart
                            {cartItemCount > 0 && (
                                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    )}

                    <div className="mt-2 text-lg">
                        {user ? (
                            <div onClick={closeMenu}>
                                <LogoutButton />
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 font-semibold text-text-main p-2" onClick={closeMenu}>
                                <User className="h-6 w-6" />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}

            <nav className="mt-4 hidden md:flex justify-center gap-10">
            </nav>
        </div>
    );
}

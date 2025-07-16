"use client";

import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const user = null;

  return (
    <header className="sticky top-0 z-10 w-full border-b">
      <div className="container flex items-center justify-between px-4 h-16">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">The Outfit Aura</span>
        </Link>

        <nav className="flex items-center gap-2">categories</nav>

        <input type="text" placeholder="Search..." className="border" />

        <div className="flex items-center gap-4">
          <Link href="/wishlist">
            <Heart className="h-5 w-5" />
          </Link>

          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {user ? (
            <span>Log out</span>
          ) : (
            <Link href="/login">
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

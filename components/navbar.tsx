import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { auth, signOut } from "@/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-10 w-full border-b">
      <div className="container flex items-center justify-between px-4 h-16">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold font-heading">
            The Outfit Aura
          </span>
        </Link>

        <nav className="flex items-center gap-2">categories</nav>

        <div className="max-w-sm">
          <Input placeholder="Search products..." />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/wishlist">
            <Heart className="h-5 w-5" />
          </Link>

          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {session?.user ? (
            <>
              <span className="text-sm">
                Hi, {session.user.name || session.user.email}
              </span>
              <form
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button variant="outline" size="sm" type="submit">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

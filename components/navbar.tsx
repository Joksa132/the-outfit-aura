import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { auth, signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { createSupabaseClient } from "@/lib/supabase-client";
import { cache } from "react";
import { SearchBar } from "./search-bar";

const getCategories = cache(async () => {
  const supabaseClient = createSupabaseClient();
  const { data: categories, error } = await supabaseClient
    .from("categories")
    .select();

  if (error) {
    return [];
  }
  return categories;
});

export async function Navbar() {
  const session = await auth();
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white">
      <div className="container flex items-center justify-between px-4 h-16">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold font-heading">
            The Outfit Aura
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-medium">
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories?.map((category) => (
                <DropdownMenuItem
                  key={category.url}
                  asChild
                  className="cursor-pointer"
                >
                  <Link href={`/category/${category.url}`}>
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/men" className="text-sm font-medium px-2">
            Men
          </Link>
          <Link href="/women" className="text-sm font-medium px-2">
            Women
          </Link>
          <Link href="/sale" className="text-sm font-medium px-2">
            Sale
          </Link>
          <Link href="/new" className="text-sm font-medium px-2">
            New
          </Link>
        </nav>

        <div className="max-w-sm flex items-center mx-6 flex-1">
          <SearchBar />
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

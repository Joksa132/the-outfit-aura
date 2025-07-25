import { Heart, Menu, ShoppingCart } from "lucide-react";
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
import { getCartItems } from "@/lib/cart-actions";
import { Badge } from "./ui/badge";
import { getWishlistItems } from "@/lib/wishlist-actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

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
  const cartItems = await getCartItems();
  const cartItemsCount = cartItems.length;
  const wishlistItems = await getWishlistItems();
  const wishlistItemsCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white">
      <div className="container flex items-center justify-between px-4 h-16">
        <Link href="/" className="flex items-center">
          <span className="text-sm md:text-lg lg:text-2xl font-bold font-heading">
            The Outfit Aura
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
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
        </nav>

        <div className="max-w-sm hidden md:flex items-center mx-6 flex-1">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs">
                  {wishlistItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
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

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right">
            <div className="flex flex-col gap-2 mt-12">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Menu to open category pages or search for products
              </SheetDescription>
              <SearchBar />
              <div className="space-y-2 p-4">
                <h3 className="text-xl font-semibold">Categories</h3>
                {categories.map((category) => (
                  <Link
                    key={category.url}
                    href={`/category/${category.url}`}
                    className="block py-1 text-sm font-semibold hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

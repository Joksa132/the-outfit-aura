import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { WishlistProductCard } from "@/components/wishlist-product-card";
import { getWishlistItems } from "@/lib/wishlist-actions";
import { Heart } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const wishlistItems = await getWishlistItems();

  let title = "Your Wishlist | The Outfit Aura";
  let description =
    "Browse your saved favorite products on your personal wishlist. Items you love, all in one place.";
  const keywords = "wishlist, favorites, saved items, online store";

  if (!session) {
    title = "Login to View Wishlist | The Outfit Aura";
    description =
      "Please log in to view or manage your personal product wishlist.";
  } else if (wishlistItems.length === 0) {
    title = "Your Wishlist is Empty | The Outfit Aura";
    description =
      "Your wishlist is empty. Start exploring our products and add your favorites!";
  } else {
    description = `You have ${wishlistItems.length} items on your wishlist. Discover your favorites and save them for later.`;
  }

  return {
    title: title,
    description: description,
    keywords: keywords,
  };
}

export default async function WishlistPage() {
  const wishlistItems = await getWishlistItems();
  const session = await auth();

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-6">
          You need to log in to wishlist items.
        </p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Save items you love to your wishlist and buy them later.
        </p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} items saved
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <WishlistProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

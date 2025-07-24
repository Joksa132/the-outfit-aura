"use client";

import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { WishlistItem } from "@/lib/types";
import { useWishlist } from "./providers/wishlist-context";

export function WishlistProductCard({ product }: { product: WishlistItem }) {
  const defaultImageUrl = "/placeholder-image.svg";
  const imageUrl = product.product_variants.image_urls?.[0] || defaultImageUrl;
  const mainProduct = product.product_variants.products;
  const { removeItem, isAddingOrRemoving } = useWishlist();

  const handleRemoveItem = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await removeItem(product.id);
  };

  return (
    <Link
      href={`/products/${mainProduct.url_slug}?color=${encodeURIComponent(
        product.product_variants.color
      )}`}
    >
      <Card className="group hover:shadow-lg transition-shadow h-full">
        <CardContent>
          <div className="relative">
            <Image
              src={imageUrl}
              alt={mainProduct.name}
              width={300}
              height={400}
              className="w-full h-80 object-cover rounded-t-lg group-hover:scale-105 transition-transform cursor-pointer"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
              onClick={handleRemoveItem}
              disabled={isAddingOrRemoving}
            >
              <Heart className="h-4 w-4 fill-red-500" />
            </Button>
          </div>
          <div className="p-4 flex flex-col justify-between">
            <h3 className="font-semibold mb-2 text-sm">
              {mainProduct.name.toUpperCase()}
            </h3>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  ${mainProduct.discounted_price ?? mainProduct.price}
                </span>
                {mainProduct.discounted_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${mainProduct.price}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Color: {product.product_variants.color}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

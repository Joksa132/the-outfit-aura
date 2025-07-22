"use client";

import { ProductVariantsDetails } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";

export function ProductCard({ product }: { product: ProductVariantsDetails }) {
  const mainProduct = product.products;
  const defaultImageUrl = "/placeholder-image.svg";
  const imageUrl = product.image_urls?.[0] || defaultImageUrl;

  return (
    <Link
      href={`/products/${mainProduct.url_slug}?color=${encodeURIComponent(
        product.color
      )}`}
    >
      <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent>
          <div className="relative">
            <Image
              src={imageUrl}
              alt={`${mainProduct.name} - ${product.color}`}
              width={300}
              height={300}
              className="w-full h-80 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80"
            >
              <Heart className="h-4 w-4" />
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
                Color: {product.color}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

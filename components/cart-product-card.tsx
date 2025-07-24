"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { CartItem } from "@/lib/types";
import { useCart } from "./providers/cart-context";

export function CartProductCard({ product }: { product: CartItem }) {
  const defaultImageUrl = "/placeholder-image.svg";
  const imageUrl = product.product_variants.image_urls?.[0] || defaultImageUrl;
  const mainProduct = product.product_variants.products;

  const { removeItem, updateItemQuantity, isUpdatingCart } = useCart();

  const handleUpdateQuantity = async (newQuantity: number) => {
    await updateItemQuantity(product.id, newQuantity);
  };

  const handleRemoveItem = async () => {
    await removeItem(product.id);
  };

  return (
    <Card
      key={`${product.id}-${product.selected_size}-${product.product_variants.color}`}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Image
            src={imageUrl}
            alt={mainProduct.name}
            width={100}
            height={100}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold mb-2">{mainProduct.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Color: {product.product_variants.color} | Size:{" "}
              {product.selected_size}
            </p>
            <p className="font-bold text-lg">${mainProduct.price}</p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveItem}
              disabled={isUpdatingCart}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleUpdateQuantity(product.quantity - 1)}
                disabled={isUpdatingCart}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                minLength={0}
                maxLength={10}
                value={product.quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    handleUpdateQuantity(val);
                  }
                }}
                className="w-16 text-center"
                min="1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleUpdateQuantity(product.quantity + 1)}
                disabled={isUpdatingCart}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

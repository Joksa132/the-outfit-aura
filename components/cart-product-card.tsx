"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { CartItem } from "@/lib/types";
import { removeCartItem, updateCartItemQuantity } from "@/lib/cart-actions";
import { useTransition } from "react";
import { toast } from "sonner";

export function CartProductCard({ product }: { product: CartItem }) {
  const defaultImageUrl = "/placeholder-image.svg";
  const imageUrl = product.product_variants.image_urls?.[0] || defaultImageUrl;
  const mainProduct = product.product_variants.products;

  const [isPending, startTransition] = useTransition();

  const handleUpdateQuantity = async (newQuantity: number) => {
    startTransition(async () => {
      const result = await updateCartItemQuantity(product.id, newQuantity);

      if (result.success) {
        toast.success("Cart updated", {
          description: `${mainProduct.name} quantity changed to ${newQuantity}.`,
        });
      } else {
        toast.error("Failed to remove item", {
          description: "There was an error updating the item.",
        });
      }
    });
  };

  const handleRemoveItem = async () => {
    startTransition(async () => {
      const result = await removeCartItem(product.id);
      if (result.success) {
        toast.success(
          `${mainProduct.name} (${product.product_variants.color}, ${product.selected_size}) removed from cart.`
        );
      } else {
        toast.error("Failed to remove item", {
          description: "There was an error removing the item.",
        });
      }
    });
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
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleUpdateQuantity(product.quantity - 1)}
                disabled={isPending}
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
                disabled={isPending}
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

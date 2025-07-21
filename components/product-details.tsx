"use client";

import { ProductVariantsDetails } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSession } from "next-auth/react";

export function ProductDetails({
  product,
}: {
  product: ProductVariantsDetails;
}) {
  const mainProduct = product.products;
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const { data: session, status } = useSession();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.image_urls![selectedImage] || "/placeholder.svg"}
              alt={mainProduct.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.image_urls!.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 cursor-pointer ${
                  selectedImage === index ? "border-primary" : "border-muted"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${mainProduct.name} ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{mainProduct.name}</h1>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 cursor-pointer`} />
            ))}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold">
              ${mainProduct.discounted_price ?? mainProduct.price}
            </span>
            {mainProduct.discounted_price && (
              <span className="text-xl text-muted-foreground line-through">
                ${mainProduct.price}
              </span>
            )}
          </div>

          <Separator />

          <div className="mt-2">
            <p className="text-muted-foreground leading-relaxed">
              {mainProduct.description}
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Size</Label>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              <div className="flex gap-3 flex-wrap">
                {mainProduct.available_sizes!.map((size) => (
                  <div key={size} className="flex items-center gap-2">
                    <RadioGroupItem value={size} id={size} />
                    <Label htmlFor={size} className="min-w-[40px] text-center">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Quantity</Label>
            <Select
              value={quantity.toString()}
              onValueChange={(value) => setQuantity(Number.parseInt(value))}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Button className="w-full" size="lg">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {session?.user ? "Add to Cart" : "Log in to Add to Cart"}
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
            >
              <Heart className="w-4 h-4 mr-2" />
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

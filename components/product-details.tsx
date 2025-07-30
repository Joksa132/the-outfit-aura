"use client";

import { ProductVariantsDetails } from "@/lib/types";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Heart, ShoppingCart, Sparkles, Star } from "lucide-react";
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
import { toast } from "sonner";
import { useWishlist } from "./providers/wishlist-context";
import { useCart } from "./providers/cart-context";
import { getOutfitRecommendations } from "@/lib/outfit-recommendation-actions";
import { ProductCard } from "./product-card";

export function ProductDetails({
  product,
}: {
  product: ProductVariantsDetails;
}) {
  const mainProduct = product.products;
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const { data: session } = useSession();

  const [outfitRecommendations, setOutfitRecommendations] = useState<
    ProductVariantsDetails[]
  >([]);
  const [isGeneratingOutfit, setIsGeneratingOutfit] = useState<boolean>(false);
  const [showOutfitSection, setShowOutfitSection] = useState<boolean>(false);

  const {
    isProductWishlisted,
    getWishlistItemId,
    addItem: addWishlistItem,
    removeItem,
    isAddingOrRemoving,
  } = useWishlist();

  const { addItem: addCartItem, isUpdatingCart } = useCart();

  const isWishlisted = isProductWishlisted(product.id);
  const wishlistItemId = getWishlistItemId(product.id);

  const handleAddToCart = async () => {
    if (!session) {
      toast.warning("Login required", {
        description: "Please log in to add items to your cart.",
      });
      return;
    }

    if (!selectedSize || selectedSize === "") {
      toast.warning("Failed to add to cart.", {
        description: "You must select product size first.",
      });
      return;
    }

    await addCartItem(product.id, quantity, selectedSize);
  };

  const handleWishlist = async () => {
    if (isWishlisted && wishlistItemId) {
      await removeItem(wishlistItemId);
    } else {
      await addWishlistItem(product.id);
    }
  };

  const handleGetOutfitRecommendations = useCallback(async () => {
    setIsGeneratingOutfit(true);
    setShowOutfitSection(true);
    setOutfitRecommendations([]);

    try {
      const recommended = await getOutfitRecommendations(product);
      if (recommended && recommended.length > 0) {
        setOutfitRecommendations(recommended);
        toast.success("Outfit ideas generated!");
      } else {
        toast.info("Could not generate outfit ideas for this product.", {
          description: "Try again later or with a different product.",
        });
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";

      if (errorMessage.includes("Rate limit exceeded")) {
        toast.error("Too many requests.", {
          description: errorMessage,
        });
      } else {
        toast.error("Failed to generate outfit ideas.", {
          description: errorMessage,
        });
      }
    } finally {
      setIsGeneratingOutfit(false);
    }
  }, [product]);

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
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={isUpdatingCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {session?.user ? "Add to Cart" : "Log in to Add to Cart"}
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
              onClick={handleWishlist}
              disabled={isAddingOrRemoving}
            >
              <Heart className="w-4 h-4 mr-2" />
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
              onClick={handleGetOutfitRecommendations}
              disabled={isGeneratingOutfit}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGeneratingOutfit
                ? "Generating Outfit Ideas..."
                : "Get AI Outfit Ideas"}
            </Button>
          </div>
        </div>
      </div>

      <Separator className="mt-6" />

      {showOutfitSection && (
        <div className="mt-6">
          <h2 className="flex items-center text-2xl font-bold">
            <Sparkles className="w-5 h-5 mr-2" />
            AI Outfit Suggestions
          </h2>
          <p className="text-muted-foreground text-lg mt-2 mb-4">
            Our advanced AI stylist analyzed your{" "}
            {product.products.name.toLowerCase()} and curated these perfect
            matches based on current fashion trends and style compatibility.
          </p>
          {isGeneratingOutfit ? (
            <div className="text-center py-10 text-muted-foreground">
              <Sparkles className="w-8 h-8 animate-pulse mx-auto mb-4" />
              Thinking of the perfect outfit...
            </div>
          ) : outfitRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {outfitRecommendations.map((recProduct) => (
                <ProductCard product={recProduct} key={recProduct.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No outfit ideas found. Try again!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

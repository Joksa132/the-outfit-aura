"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useTransition,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  getWishlistItems,
  addWishlistItem,
  removeWishlistItem,
} from "@/lib/wishlist-actions";
import { WishlistItem } from "@/lib/types";

type WishlistContext = {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  isAddingOrRemoving: boolean;
  addItem: (productVariantId: string) => Promise<void>;
  removeItem: (wishlistItemId: string) => Promise<void>;
  isProductWishlisted: (productVariantId: string) => boolean;
  getWishlistItemId: (productVariantId: string) => string | null;
};

const WishlistContext = createContext<WishlistContext>({} as WishlistContext);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddingOrRemoving, startTransition] = useTransition();

  const fetchWishlist = useCallback(async () => {
    if (sessionStatus === "loading") return;

    setIsLoading(true);
    if (session?.user?.id) {
      try {
        const items = await getWishlistItems();
        setWishlistItems(items);
      } catch (error) {
        console.log(error);
        setWishlistItems([]);
        toast.error("Failed to load wishlist.");
      }
    } else {
      setWishlistItems([]);
    }
    setIsLoading(false);
  }, [session, sessionStatus]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addItem = useCallback(
    async (productVariantId: string) => {
      if (!session?.user?.id) {
        toast.warning("Login required", {
          description: "Please log in to add items to your wishlist.",
        });
        return;
      }

      startTransition(async () => {
        const result = await addWishlistItem(productVariantId);
        if (result.success) {
          toast.success("Added to wishlist!");
          await fetchWishlist();
        } else {
          toast.error("Failed to add to wishlist.", {
            description:
              "There was an issue adding the item. Please try again.",
          });
        }
      });
    },
    [session, fetchWishlist]
  );

  const removeItem = useCallback(
    async (wishlistItemId: string) => {
      const originalItems = wishlistItems;
      setWishlistItems((prev) =>
        prev.filter((item) => item.id !== wishlistItemId)
      );

      startTransition(async () => {
        const result = await removeWishlistItem(wishlistItemId);
        if (result.success) {
          toast.success("Removed from wishlist.");
        } else {
          setWishlistItems(originalItems);
          toast.error("Failed to remove from wishlist.", {
            description:
              "There was an issue removing the item. Please try again.",
          });
        }
      });
    },
    [wishlistItems]
  );

  const isProductWishlisted = useCallback(
    (productVariantId: string) => {
      return wishlistItems.some(
        (item) => item.product_variant_id === productVariantId
      );
    },
    [wishlistItems]
  );

  const getWishlistItemId = useCallback(
    (productVariantId: string) => {
      const item = wishlistItems.find(
        (item) => item.product_variant_id === productVariantId
      );
      return item ? item.id : null;
    },
    [wishlistItems]
  );

  const value = {
    wishlistItems,
    isLoading,
    isAddingOrRemoving,
    addItem,
    removeItem,
    isProductWishlisted,
    getWishlistItemId,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  return context;
};

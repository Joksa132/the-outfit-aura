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
  getCartItems,
  addOrUpdateCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/cart-actions";
import { CartItem } from "@/lib/types";

type CartContextType = {
  cartItems: CartItem[];
  isLoading: boolean;
  isUpdatingCart: boolean;
  addItem: (
    productVariantId: string,
    quantity: number,
    selectedSize: string
  ) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateItemQuantity: (
    cartItemId: string,
    newQuantity: number
  ) => Promise<void>;
  totalPrice: number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingCart, startTransition] = useTransition();

  const fetchCart = useCallback(async () => {
    if (sessionStatus === "loading") return;

    setIsLoading(true);
    if (session?.user?.id) {
      try {
        const items = await getCartItems();
        setCartItems(items);
      } catch (error) {
        console.log(error);
        setCartItems([]);
        toast.error("Failed to load cart.");
      }
    } else {
      setCartItems([]);
    }
    setIsLoading(false);
  }, [session, sessionStatus]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async (
      productVariantId: string,
      quantity: number,
      selectedSize: string
    ) => {
      if (!session?.user?.id) {
        toast.warning("Login required", {
          description: "Please log in to add items to your cart.",
        });
        return;
      }

      startTransition(async () => {
        const result = await addOrUpdateCartItem(
          productVariantId,
          quantity,
          selectedSize
        );
        if (result.success) {
          toast.success(`${quantity} item(s) added/updated in cart!`);
          await fetchCart();
        } else {
          toast.error("Failed to add/update cart.", {
            description: "There was an issue. Please try again.",
          });
        }
      });
    },
    [session, fetchCart]
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      const originalItems = cartItems;
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

      startTransition(async () => {
        const result = await removeCartItem(cartItemId);
        if (result.success) {
          toast.success("Item removed from cart.");
        } else {
          setCartItems(originalItems);
          toast.error("Failed to remove item.", {
            description: "There was an issue. Please try again.",
          });
        }
      });
    },
    [cartItems]
  );

  const updateItemQuantity = useCallback(
    async (cartItemId: string, newQuantity: number) => {
      startTransition(async () => {
        const result = await updateCartItemQuantity(cartItemId, newQuantity);
        if (result.success) {
          toast.success("Cart updated.", {
            description: `Quantity changed to ${newQuantity}.`,
          });
        } else {
          toast.error("Failed to update quantity.", {
            description: "There was an issue. Please try again.",
          });
        }
      });
    },
    []
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product_variants.products.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    isLoading,
    isUpdatingCart,
    addItem,
    removeItem,
    updateItemQuantity,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);

  return context;
};

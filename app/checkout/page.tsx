import { auth } from "@/auth";
import { CheckoutForm } from "@/components/checkout-form";
import { getCartItems } from "@/lib/cart-actions";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const cartItems = await getCartItems();

  let title = "Checkout | The Outfit Aura";
  let description =
    "Complete your purchase at The Outfit Aura. Provide shipping details and finalize your order.";
  let keywords =
    "checkout, buy online, finalize order, shipping information, The Outfit Aura";

  if (!session) {
    title = "Login to Checkout | The Outfit Aura";
    description =
      "Please log in to your account to proceed with your order checkout.";
    keywords = "login, checkout, secure login, The Outfit Aura";
  } else if (cartItems.length === 0) {
    title = "Cart Empty | The Outfit Aura";
    description =
      "Your shopping cart is empty. Please add items before proceeding to checkout.";
    keywords = "empty cart, checkout error, add to cart, The Outfit Aura";
  } else {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    description = `Proceed to checkout with ${totalItems} items from The Outfit Aura. Fast and secure payment process.`;
  }

  return {
    title: title,
    description: description,
    keywords: keywords,
  };
}

export default function CheckoutPage() {
  return <CheckoutForm />;
}

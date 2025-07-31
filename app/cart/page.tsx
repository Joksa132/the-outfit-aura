import { auth } from "@/auth";
import { CartProductCard } from "@/components/cart-product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCartItems } from "@/lib/cart-actions";
import { ShoppingBag } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const cartItems = await getCartItems();

  let title = "Your Shopping Cart | The Outfit Aura";
  let description =
    "Review the items in your shopping cart before proceeding to checkout.";
  const keywords = "shopping cart, cart, checkout, online store";

  if (!session) {
    title = "Login to View Cart | The Outfit Aura";
    description =
      "Please log in to view your shopping cart and continue shopping.";
  } else if (cartItems.length === 0) {
    title = "Your Cart is Empty | The Outfit Aura";
    description =
      "Your shopping cart is currently empty. Start browsing our products to find something you love!";
  } else {
    description = `You have ${cartItems.length} items in your cart. Review your selection and proceed to checkout.`;
  }

  return {
    title: title,
    description: description,
    keywords: keywords,
  };
}

export default async function CartPage() {
  const cartItems = await getCartItems();
  const session = await auth();

  const total = cartItems.reduce(
    (sum, item) => sum + item.product_variants.products.price * item.quantity,
    0
  );

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-6">
          You need to log in to view your shopping cart.
        </p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {cartItems.map((item) => (
          <CartProductCard key={item.id} product={item} />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link href="/checkout">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

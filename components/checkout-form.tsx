"use client";

import { useSession } from "next-auth/react";
import { useCart } from "./providers/cart-context";
import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Truck } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export function CheckoutForm() {
  const { cartItems, totalPrice } = useCart();
  const { data: session } = useSession();

  const [orderInfo, setOrderInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    try {
    } catch (error) {
      console.log(error);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-6">
          You need to log in to proceed with checkout.
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
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some items to your cart before checking out.
        </p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="mb-1">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={orderInfo.firstName}
                      onChange={(e) => {
                        setOrderInfo((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }));
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="mb-1">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={orderInfo.lastName}
                      onChange={(e) => {
                        setOrderInfo((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }));
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="mb-1">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={orderInfo.email}
                    onChange={(e) => {
                      setOrderInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    }}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="mb-1">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={orderInfo.phone}
                      onChange={(e) => {
                        setOrderInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }));
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="mb-1">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={orderInfo.address}
                      onChange={(e) => {
                        setOrderInfo((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }));
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="mb-1">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={orderInfo.city}
                      onChange={(e) => {
                        setOrderInfo((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }));
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="mb-1">
                      ZIP Code / Postal Code
                    </Label>
                    <Input
                      id="zipCode"
                      value={orderInfo.zipCode}
                      onChange={(e) => {
                        setOrderInfo((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }));
                      }}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {cartItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Your cart is empty.
                    </p>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={`${item.id}-${item.selected_size}-${item.product_variants.color}`}
                        className="flex justify-between text-sm items-start"
                      >
                        <div>
                          <p className="font-medium line-clamp-1">
                            {item.product_variants.products.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {item.product_variants.color} • {item.selected_size}{" "}
                            • x{item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          $
                          {(
                            (item.product_variants.products.discounted_price ||
                              item.product_variants.products.price) *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isPlacingOrder || cartItems.length === 0}
                >
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

"use server";

import { createSupabaseClient } from "@/lib/supabase-client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { CartItem } from "./types";

export async function addOrUpdateCartItem(
  productVariantId: string,
  quantity: number,
  selectedSize: string
) {
  const supabase = createSupabaseClient();
  const session = await auth();

  const userId = session?.user?.id;
  try {
    const { data: existingItem, error: selectError } = await supabase
      .from("cart")
      .select()
      .eq("user_id", userId)
      .eq("product_variant_id", productVariantId)
      .eq("selected_size", selectedSize)
      .single();

    if (selectError && selectError.code === "PGRST116") {
      await supabase
        .from("cart")
        .insert({
          user_id: userId,
          product_variant_id: productVariantId,
          selected_size: selectedSize,
          quantity,
        })
        .select()
        .single();
    } else {
      await supabase
        .from("cart")
        .update({
          quantity: existingItem.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)
        .select()
        .single();
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function removeCartItem(cartItemId: string) {
  const supabase = createSupabaseClient();
  const session = await auth();

  const userId = session?.user?.id;

  try {
    await supabase
      .from("cart")
      .delete()
      .eq("id", cartItemId)
      .eq("user_id", userId);

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function getCartItems() {
  const supabase = createSupabaseClient();
  const session = await auth();

  const userId = session?.user?.id;

  try {
    const { data: cartItems, error } = await supabase
      .from("cart")
      .select(
        `
        id,
        quantity,
        selected_size,
        product_variant_id,
        product_variants!inner (
          id,
          color,
          image_urls,
          product_id,
          products!inner (
            id,
            name,
            description,
            price,
            discounted_price,
            url_slug,
            category_id,
            available_sizes,
            features,
            is_active,
            is_featured,
            average_rating,
            review_count,
            gender,
            tags
          )
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      return [];
    }

    return cartItems as unknown as CartItem[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  newQuantity: number
) {
  const supabase = createSupabaseClient();
  const session = await auth();

  const userId = session?.user?.id;

  try {
    await supabase
      .from("cart")
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq("id", cartItemId)
      .eq("user_id", userId)
      .select()
      .single();

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

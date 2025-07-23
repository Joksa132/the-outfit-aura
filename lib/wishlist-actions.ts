"use server";

import { auth } from "@/auth";
import { createSupabaseClient } from "./supabase-client";
import { WishlistItem } from "./types";
import { revalidatePath } from "next/cache";

export async function getWishlistItems() {
  const supabase = createSupabaseClient();
  const session = await auth();

  const userId = session?.user?.id;

  try {
    const { data: wishlistItems, error } = await supabase
      .from("wishlist")
      .select(
        `
        id,
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

    return wishlistItems as unknown as WishlistItem[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getWishlistItem(itemId: string) {
  const supabase = createSupabaseClient();
  const session = await auth();

  const userId = session?.user?.id;

  try {
    const { data: wishlistItem, error } = await supabase
      .from("wishlist")
      .select(
        `
        id,
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
      .eq("user_id", userId)
      .eq("product_variant_id", itemId)
      .single();

    if (error && error.code !== "PGRST116") {
      return null;
    }

    return wishlistItem as unknown as WishlistItem;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function addWishlistItem(productVariantId: string) {
  const supabase = createSupabaseClient();
  const session = await auth();

  const userId = session?.user?.id;
  try {
    const { data: existingItem, error: selectError } = await supabase
      .from("wishlist")
      .select()
      .eq("user_id", userId)
      .eq("product_variant_id", productVariantId)
      .single();

    if (selectError && selectError.code === "PGRST116") {
      await supabase
        .from("wishlist")
        .insert({
          user_id: userId,
          product_variant_id: productVariantId,
        })
        .select()
        .single();
    }

    revalidatePath("/wishlist");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function removeWishlistItem(wishlistItemId: string) {
  const supabase = createSupabaseClient();
  const session = await auth();

  const userId = session?.user?.id;

  try {
    await supabase
      .from("wishlist")
      .delete()
      .eq("id", wishlistItemId)
      .eq("user_id", userId);

    revalidatePath("/wishlist");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

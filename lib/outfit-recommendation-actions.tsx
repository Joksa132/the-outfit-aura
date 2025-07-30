"use server";

import { createSupabaseClient } from "@/lib/supabase-client";
import { generateObject } from "ai";
import { ProductVariantsDetails } from "@/lib/types";
import { z } from "zod";
import { google } from "./llm-client";

const outfitRecommendationSchema = z.object({
  recommendedProducts: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .min(3)
    .max(5),
});

export async function getOutfitRecommendations(
  product: ProductVariantsDetails
) {
  const supabase = createSupabaseClient();

  if (!product) {
    return [];
  }

  const currentProduct = product.products;
  try {
    const { data: potentialVariants, error: potentialVariantsError } =
      await supabase
        .from("product_variants")
        .select(
          `
        id,
        color,
        products!inner (
          id,
          name,
          description,
          gender,
          category_id
        )
      `
        )
        .eq("products.gender", currentProduct.gender)
        .not("products.category_id", "eq", currentProduct.category_id);

    if (potentialVariantsError) {
      console.log(potentialVariantsError.message);
      return [];
    }

    const productPoolString = potentialVariants
      .map(
        (v) =>
          `ID: ${v.id}\nName: ${v.products[0]?.name}\nColor: ${v.color}\nDescription: ${v.products[0]?.description}`
      )
      .join("\n---\n");

    const prompt = `You are a professional fashion stylist for an e-commerce store.
      A customer is viewing this product and wants to build a complete, stylish outfit around it.

      Product Name: "${currentProduct.name}"
      Color: "${product.color || "N/A"}"
      Description: "${currentProduct.description || "N/A"}"
      Gender: "${currentProduct.gender || "N/A"}"

      Here is a list of other available products and their colors in the store. 
      Your task is to recommend 3 to 5 products from this list that would create a stylish and cohesive outfit with the current product.

      Available Products:
      ---
      ${productPoolString}
      ---

      Task:
        1. Choose 3 to 5 products from the list above.
        2. For each chosen product, provide its exact ID
        3. The ID you choose MUST correspond to the 'ID' in the Available Products list.
        4. Do NOT recommend the current product itself.
        5. Respond ONLY with a JSON object.
    `;

    const { object: llmResponse } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: outfitRecommendationSchema,
      prompt,
      temperature: 0.7,
    });

    const recommendedProductIds = llmResponse.recommendedProducts.map(
      (rec) => rec.id
    );

    const uniqueRecommendedProductIds = Array.from(
      new Set(recommendedProductIds)
    ).filter((id) => id !== product.id);

    if (uniqueRecommendedProductIds.length === 0) {
      return [];
    }

    const { data: recommendedProducts, error: productsError } = await supabase
      .from("product_variants")
      .select(
        `
          id,
          created_at,
          updated_at,
          product_id,
          color,
          image_urls,
          products!inner (
            id,
            name,
            description,
            price,
            discounted_price,
            category_id,
            available_sizes,
            features,
            is_active,
            is_featured,
            average_rating,
            review_count,
            gender,
            tags,
            url_slug
          )
        `
      )
      .in("id", uniqueRecommendedProductIds);

    if (productsError) {
      console.error(
        "Error fetching recommended products from DB:",
        productsError.message
      );
      return [];
    }

    const transformedProducts = recommendedProducts.map((variant) => ({
      ...variant,
      products: Array.isArray(variant.products)
        ? variant.products[0]
        : variant.products,
    })) as ProductVariantsDetails[];

    return transformedProducts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

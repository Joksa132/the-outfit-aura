import { ProductDetails } from "@/components/product-details";
import { createSupabaseClient } from "@/lib/supabase-client";
import { ProductVariantsDetails } from "@/lib/types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { cache } from "react";

const getProductDetails = cache(async (urlSlug: string, color?: string) => {
  const supabaseClient = createSupabaseClient();

  let query = supabaseClient
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
    .eq("products.url_slug", urlSlug);

  if (color) {
    query = query.eq("color", color);
  } else {
    query = query.limit(1);
  }

  const { data, error }: PostgrestSingleResponse<ProductVariantsDetails> =
    await query.single();

  if (error || !data) {
    return null;
  }

  return data;
});

export async function generateStaticParams() {
  const supabaseClient = createSupabaseClient();
  const { data: products, error } = await supabaseClient
    .from("products")
    .select("url_slug");

  if (error) {
    console.log(error.message);
    return [];
  }

  return products.map((product) => ({
    url_slug: product.url_slug,
  }));
}

export type ProductPageParams = Promise<{
  url_slug: string;
}>;

export type ProductPageSearchParams = Promise<{
  color?: string;
}>;

type ProductPageProps = {
  params: ProductPageParams;
  searchParams?: ProductPageSearchParams;
};

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const resolvedParams = await params;
  const { url_slug } = resolvedParams;

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const { color } = resolvedSearchParams || {};

  const productVariant = await getProductDetails(url_slug, color);

  if (!productVariant) {
    notFound();
  }

  return <ProductDetails product={productVariant} />;
}

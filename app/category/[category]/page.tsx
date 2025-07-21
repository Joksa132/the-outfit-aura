import { ProductCard } from "@/components/ProductCard";
import { createSupabaseClient } from "@/lib/supabase-client";
import { ProductVariantsDetails } from "@/lib/types";
import { notFound } from "next/navigation";
import { cache } from "react";

const getCategoryProducts = cache(async (categoryUrl: string) => {
  const supabaseClient = createSupabaseClient();

  const { data: categoryData, error: categoryError } = await supabaseClient
    .from("categories")
    .select("id, name, url")
    .eq("url", categoryUrl)
    .single();

  if (categoryError || !categoryData) {
    notFound();
  }

  const { data: categoryProductVariants, error: variantsError } =
    await supabaseClient
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
      .eq("products.category_id", categoryData?.id);

  if (variantsError) {
    return { categoryData, productVariants: [] };
  }

  const productVariants: ProductVariantsDetails[] = (categoryProductVariants ||
    []) as unknown as ProductVariantsDetails[];

  return { categoryData, productVariants };
});

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const { categoryData, productVariants } = await getCategoryProducts(category);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col justify-between items-start gap-2 mb-8">
        <h1 className="text-3xl font-bold">{categoryData?.name}</h1>
        <p className="text-muted-foreground">
          {productVariants.length} products found
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {productVariants.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

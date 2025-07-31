import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { createSupabaseClient } from "@/lib/supabase-client";
import { ProductVariantsDetails } from "@/lib/types";
import { Metadata } from "next";
import { cache } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const title = "The Outfit Aura | High-Quality Fashion for Everyone";
  const description = "Shop the latest trends in clothing at The Outfit Aura.";
  const keywords =
    "The Outfit Aura, online fashion, clothing store, men's fashion, rends, shop online, e-commerce, ecommerce";

  return {
    title: title,
    description: description,
    keywords: keywords,
  };
}

const getFeaturedProducts = cache(async () => {
  const supabaseClient = createSupabaseClient();

  const { data: featuredProducts, error } = await supabaseClient
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
    .eq("products.is_featured", true);

  if (error) {
    return [];
  }

  const products: ProductVariantsDetails[] = (featuredProducts ||
    []) as unknown as ProductVariantsDetails[];

  return products;
});

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen">
      <HeroCarousel />

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Featured Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

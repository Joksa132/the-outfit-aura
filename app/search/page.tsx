import { ProductCard } from "@/components/product-card";
import { createSupabaseClient } from "@/lib/supabase-client";
import { ProductVariantsDetails } from "@/lib/types";
import { Search } from "lucide-react";
import { cache } from "react";

const getSearchResults = cache(async (query: string) => {
  const supabaseClient = createSupabaseClient();

  const { data: searchProducts, error } = await supabaseClient
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
    .ilike("products.name", `%${query}%`);

  if (error) {
    return [];
  }

  const productVariantsToDisplay: ProductVariantsDetails[] = (searchProducts ||
    []) as unknown as ProductVariantsDetails[];

  return productVariantsToDisplay;
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const { query } = searchParams || "";

  const products = await getSearchResults(query);

  console.log("Search Results (from page.tsx):", products);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col justify-between items-start gap-2 mb-8">
        <div className="flex items-center gap-2">
          <Search className="w-6 h-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold font-heading">
            {query ? `Search Results for "${query}"` : "Search Products"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {products.length} products found
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

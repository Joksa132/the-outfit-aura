import { ProductDisplayFilters } from "@/components/product-display-filters";
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
    return {
      productVariants: [],
      availableColors: [],
      availableSizes: [],
      initialMinPrice: 0,
      initialMaxPrice: 200,
    };
  }

  const productVariants: ProductVariantsDetails[] = (searchProducts ||
    []) as unknown as ProductVariantsDetails[];

  const availableColors = productVariants.reduce(
    (uniqueColors: string[], p) => {
      if (p.color && !uniqueColors.includes(p.color)) {
        uniqueColors.push(p.color);
      }
      return uniqueColors;
    },
    []
  );

  const availableSizes = productVariants.reduce((uniqueSizes: string[], p) => {
    if (p.products.available_sizes) {
      for (const size of p.products.available_sizes) {
        if (size && !uniqueSizes.includes(size)) {
          uniqueSizes.push(size);
        }
      }
    }
    return uniqueSizes;
  }, []);

  const allPrices = productVariants
    .map((p) => p.products.discounted_price ?? p.products.price)
    .filter((price) => typeof price === "number") as number[];

  const initialMinPrice =
    allPrices.length > 0 ? Math.floor(Math.min(...allPrices)) : 0;
  const initialMaxPrice =
    allPrices.length > 0 ? Math.ceil(Math.max(...allPrices)) : 200; // Default max price

  return {
    productVariants,
    availableColors,
    availableSizes,
    initialMinPrice,
    initialMaxPrice,
  };
});

export type SearchPageSearchParams = Promise<{
  query?: string;
}>;

type SearchPageProps = {
  searchParams: SearchPageSearchParams;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";

  const {
    productVariants,
    availableColors,
    availableSizes,
    initialMinPrice,
    initialMaxPrice,
  } = await getSearchResults(query);

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
          {productVariants.length} products found
        </p>
      </div>

      <ProductDisplayFilters
        initialProducts={productVariants}
        availableColors={availableColors}
        availableSizes={availableSizes}
        initialMinPrice={initialMinPrice}
        initialMaxPrice={initialMaxPrice}
      />
    </div>
  );
}

import { ProductDisplayFilters } from "@/components/product-display-filters";
import { createSupabaseClient } from "@/lib/supabase-client";
import { ProductVariantsDetails } from "@/lib/types";
import { Metadata } from "next";
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
    return {
      categoryData,
      productVariants: [],
      availableColors: [],
      availableSizes: [],
      initialMinPrice: 0,
      initialMaxPrice: 200,
    };
  }

  const productVariants: ProductVariantsDetails[] = (categoryProductVariants ||
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
    allPrices.length > 0 ? Math.ceil(Math.max(...allPrices)) : 200;

  return {
    categoryData,
    productVariants,
    availableColors,
    availableSizes,
    initialMinPrice,
    initialMaxPrice,
  };
});

const getCategoryData = cache(async (categoryUrl: string) => {
  const supabaseClient = createSupabaseClient();
  const { data: categoryData, error: categoryError } = await supabaseClient
    .from("categories")
    .select("id, name, url, description")
    .eq("url", categoryUrl)
    .single();

  if (categoryError || !categoryData) {
    return null;
  }
  return categoryData;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categoryUrl } = await params;

  const categoryData = await getCategoryData(categoryUrl);

  if (!categoryData) {
    return {
      title: "Category Not Found | The Outfit Aura",
      description: "The category you are looking for does not exist.",
    };
  }

  const defaultDescription = `Browse our collection of ${categoryData.name.toLowerCase()}. Discover the latest styles and trends.`;

  const defaultKeywords = `${
    categoryData.name
  }, ${categoryData.name.toLowerCase()} fashion, ${categoryData.name.toLowerCase()} clothes, online shopping`;

  return {
    title: `${categoryData.name} | The Outfit Aura`,
    description: categoryData.description || defaultDescription,
    keywords: defaultKeywords,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const {
    categoryData,
    productVariants,
    availableColors,
    availableSizes,
    initialMinPrice,
    initialMaxPrice,
  } = await getCategoryProducts(category);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col justify-between items-start gap-2 mb-8">
        <h1 className="text-3xl font-bold">{categoryData?.name}</h1>
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

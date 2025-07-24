"use client";

import { ProductVariantsDetails } from "@/lib/types";
import { useCallback, useMemo, useState } from "react";
import { CategoryFilters } from "./category-filters";
import { ProductCard } from "./product-card";

type ProductDisplayFiltersProps = {
  initialProducts: ProductVariantsDetails[];
  availableColors: string[];
  availableSizes: string[];
  initialMinPrice: number;
  initialMaxPrice: number;
};

export function ProductDisplayFilters({
  initialProducts,
  availableColors,
  availableSizes,
  initialMinPrice,
  initialMaxPrice,
}: ProductDisplayFiltersProps) {
  const [filters, setFilters] = useState({
    sortBy: "name",
    selectedColors: [] as string[],
    selectedSizes: [] as string[],
    priceRange: [initialMinPrice, initialMaxPrice] as [number, number],
  });

  const handleFilterChange = useCallback(
    (newFilters: {
      sortBy: string;
      selectedColors: string[];
      selectedSizes: string[];
      priceRange: [number, number];
    }) => {
      setFilters(newFilters);
    },
    []
  );

  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = [...initialProducts];

    if (filters.selectedColors.length > 0) {
      currentProducts = currentProducts.filter((product) =>
        filters.selectedColors.includes(product.color)
      );
    }

    if (filters.selectedSizes.length > 0) {
      currentProducts = currentProducts.filter((product) =>
        product.products.available_sizes?.some((size) =>
          filters.selectedSizes.includes(size)
        )
      );
    }

    currentProducts = currentProducts.filter((product) => {
      const price = product.products.discounted_price ?? product.products.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    switch (filters.sortBy) {
      case "price-low":
        currentProducts.sort(
          (a, b) =>
            (a.products.discounted_price ?? a.products.price) -
            (b.products.discounted_price ?? b.products.price)
        );
        break;
      case "price-high":
        currentProducts.sort(
          (a, b) =>
            (b.products.discounted_price ?? b.products.price) -
            (a.products.discounted_price ?? a.products.price)
        );
        break;
      case "name":
      default:
        currentProducts.sort((a, b) =>
          a.products.name.localeCompare(b.products.name)
        );
        break;
    }

    return currentProducts;
  }, [initialProducts, filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <CategoryFilters
          availableColors={availableColors}
          availableSizes={availableSizes}
          onFilterChange={handleFilterChange}
          initialMinPrice={initialMinPrice}
          initialMaxPrice={initialMaxPrice}
        />
      </div>

      <div className="col-span-3">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No products found matching your selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

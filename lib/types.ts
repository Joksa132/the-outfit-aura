export type Category = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  url: string;
};

export type Product = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  price: number;
  discounted_price: number | null;
  category_id: string | null;
  available_sizes: string[] | null;
  features: string[] | null;
  is_active: boolean;
  is_featured: boolean;
  average_rating: number | null;
  review_count: number | null;
  gender: string;
  tags: string[] | null;
  url_slug: string;
};

export type ProductVariants = {
  id: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  color: string;
  image_urls: string[] | null;
};

export interface ProductVariantsDetails extends ProductVariants {
  products: Product;
}

export type CartItem = {
  id: string;
  quantity: number;
  selected_size: string;
  product_variant_id: string;
  product_variants: ProductVariantsDetails;
};

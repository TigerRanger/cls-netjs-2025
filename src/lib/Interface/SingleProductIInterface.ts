// Root query response
export interface ProductQueryResponse {
  products: {
    items: Product[];
  };
}

// Base product type
export interface Product {
  id: string;
  sku: string;
  name: string;
  stock_status:string;
  canonical_url: string;
  description: Description;
  short_description: Description;
  price: ProductPrice;
  special_price?: number | null;
  final_price?: number | null;
  media_gallery_entries: MediaGalleryEntry[];
  discount_percent?: number | null;
  meta_description?: string | null;
  meta_keyword?: string | null;
  meta_title?: string | null;
  product_type: string;
  review_count?: number | null;
  related_products: RelatedProduct[];
  reviews: ReviewData;
  rating_summary: string;
  configurable_options?: ConfigurableOption[];
  variants?: Variant[];
}

// Supporting types
export interface Description {
  html: string;
}

export interface MediaGalleryEntry {
  file: string;
  label: string;
}

export interface PriceAmount {
  value: number;
  currency: string;
}

export interface ProductPrice {
  regularPrice: {
    amount: PriceAmount;
  };
}

export interface RelatedProduct {
  id: string;
  sku: string;
  name: string;
  url_key: string;
  custom_image?: string | null;
  small_image?: {
    url: string;
  };
  price: ProductPrice;
  final_price?: number | null;
  rating_summary: string;
  discount_percent?: number | null;
}

export interface ReviewData {
  items: Review[];
  page_info: PageInfo;
}

export interface Review {
  nickname: string;
  summary: string;
  text: string;
  created_at: string;
  average_rating: number;
}

export interface PageInfo {
  current_page: number;
  page_size: number;
  total_pages: number;
}

// Configurable options
export interface ConfigurableOption {
  id:number;
  attribute_code: string;
  label: string;
  values: ConfigurableOptionValue[];
}

export interface ConfigurableOptionValue {
  label: string;
  value_index: number;
  swatch_data?: {
    value: string;
    __typename: string;
  };
}

// Variant structure
export interface Variant {
  product: {
    sku: string;
    name: string;
    price: ProductPrice;
  };
  attributes: VariantAttribute[];
}

export interface VariantAttribute {
  code: string;
  value_index: number;
}

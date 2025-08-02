export interface MagentoCategoryPageResponse {
  data: {
    categoryList: Category[];
    products: ProductSearchResult;
  };
}



export interface Category {
  id: number;
  name: string;
  description?: string;
  canonical_url?: string;
  children_count?: string;
  image?: string;
  is_anchor?: number;
  meta_description?: string;
  meta_keywords?: string;
  meta_title?: string;
  product_count?: number;
  display_mode?: string;
  video_code?: string;
    enable_custom_title?:string;
  custom_title?:string;
  cms_block?: {
    identifier: string;
    content: string;
  };
  children?: ChildCategory[];
  ans_set : string | null;
  que_set : string | null;

}

export interface ChildCategory {
  canonical_url: string;
  name: string;
  position: number;
  url_key: string;
}


  export interface page_info {
    current_page: number;
    total_pages: number;
    page_size: number;
  };

export interface ProductSearchResult {
  total_count: number;
  page_info: {
    current_page: number;
    total_pages: number;
    page_size: number;
  };
  items: Product[] | null;
  aggregations: Aggregation[] | null;
}

export interface Product {
  canonical_url?: string;
  id: number;
  name: string;
  new?: boolean;
  rating_summary?: number;
  review_count?: number;
  sku: string;
  special_price?: number;
  url_key: string;
   discount_percent:number;
  image?: {
    label?: string;
    url: string;
  };
  price?: {
    regularPrice?: {
      amount: {
        currency: string;
        value: number;
      };
    };
  };
      custom_image:string;
      product_type:string;
      final_price:number;

  short_description?: {
    html: string;
  };
}

export interface Aggregation {
  attribute_code: string;
  count: number;
  label: string;
  position: number;
  options: AggregationOption[];
}

export interface AggregationOption {
  count: number;
  label: string;
  value: string;
  active: boolean | null;
}

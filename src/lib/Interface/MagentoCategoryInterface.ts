export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  canonical_url?: string;
  children_count?: number;
  image?: string;
  is_anchor?: boolean;
  meta_description?: string;
  meta_keywords?: string;
  meta_title?: string;
  product_count?: number;
  display_mode?: string;

  enable_custom_title?:string;
  custom_title?:string;
  cms_block?: {
    identifier: string;
    content: string;
  };
  children?: {
    canonical_url: string;
    name: string;
    position: number;
    url_key: string;
  }[];
  products: Products;
}

export interface Products{
  total_count: number;
  page_info: {
    current_page: number;
    total_pages: number;
    page_size: number;
  };
  items: Product[];
}

export interface page_info{
  current_page: number;
  total_pages: number;
  page_size: number;
}


export interface Product {
  id: number;
  name: string;
  sku: string;
  type: string;
  url_key: string;
  canonical_url?: string;
  new?: boolean;
  special_price?: number;
  rating_summary?: number;
  review_count?: number;


  image?: {
    url: string;
    label?: string;
  };

  price: {
    regularPrice: {
      amount: {
        currency: string;
        symbol?: string;
        value: number;
      };
    };
    final_price?: {
      currency: string;
      value: number;
    };
    discount?: {
      amount_off?: number;
      percent_off?: number;
    };
  };

  short_description?: {
    html: string;
  };

  price_html?: string;
}







export interface GetProductPageResponse {
  categoryList: CategoryData[];
}


export interface GetProductPageVariables{

  categoryUrl :string ;
  pageSize :number ;
  currentPage :number;
  sort : { name: "ASC" | "DESC" }
}
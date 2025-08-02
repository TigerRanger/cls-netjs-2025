export interface OtherSiteItem {
  active: boolean;
  alt: string;
  caption: string | null;
  id: string;
  image: string;
  sort: number;
  title: string | null;
  url: string | null;
}

export interface CmsPage {
  identifier: string;
  title: string | null;
  meta_title: string | null;
  meta_keywords: string | null;
  meta_description: string | null;
  content: string | null;
  meta_extra: string ;
  url_key: string;
  content_heading: string;
}

export interface SliderItem {
  active: boolean;
  alt: string | null;
  caption: string | null;
  id: string | null;
  image: string | null;
  mobile_image: string | null;
  sort: number;
  title: string | null;
  url: string | null;
}

export interface CategoryListItem {
  id: number;
  image: string;
  name: string;
  url_key: string;
  canonical_url: string | null
}

export interface HomePageData {
  enable_secondary_menu: string | null;
  blog_p: string | null;
  blog_sort_order: string;
  blog_title: string | null;
  brand_images: string;
  brand_sort_order: string;
  brand_title: string;
  category_list_sort: string;
  category_p: string;
  category_title: string;
  home_h1: string;
  home_h1_sort: string;
  home_p: string;
  home_slider_banner_block: string;
  home_slider_banner_enable: string;
  map_content: string;
  map_sort_order: string;
  other_site_auto_slide: string;
  other_site_p: string;
  other_site_slide_grid: string;
  other_site_sort: string;
  other_site_title: string;
  promo_block: string;
  promo_sort_order: string;
  short_map: [string] | null;
  show_blog: string;
  show_brand: string;
  show_category_list: string;
  show_home_h1: string;
  show_map: string;
  show_other_site: string;
  show_promo_block: string;
  show_visible_content: string;
  visible_content: string;
  visible_title: string;
  store_phone:string | null;
  category_list: CategoryListItem[];
}

export interface HomeProducts {
  id: number;
  name: string;
  sku: string;
  type: string;
  url_key: string;
  canonical_url: string;
  new: boolean;
  rating_summary: number;
  review_count: number;
  special_price?: number;
    image: {
    label: string;
    url: string;
  };
  price: {
    regularPrice: {
      amount: {
        value: number;
        currency: string;
        symbol: string;
      };
    };
    final_price: {
      value: number;
      currency: string;
    };
    discount: {
      amount_off: number;
      percent_off: number;
    };
  };
  short_description: {
    html: string;
  };
  price_html: string;
}

export interface HomeSlider {
  Banner_block: string;
  auto_slide: string;
  banner_before_title: string;
  show_banner: string;
  slider_enable: string;
  slider_p: string;
  slider_title: string;
  sort_order: string;
  slider_products: HomeProducts[];
}

export interface DailyOffer {
  auto_slide: string;
  daily_end_time: string;
  daily_offer_content: string;
  daily_offer_title: string;
  daily_show: string;
  sort_order: string;
  daily_offer_products: HomeProducts[];
}

export interface WeeklyOffer {
  auto_slide: string;
  show_weekly_banner: string;
  sort_order: string;
  weekly_banner_block: string;
  weekly_end_time: string;
  weekly_offer_content: string;
  weekly_offer_title: string;
  weekly_show: string;
  weekly_offer_products: HomeProducts[];
}

export interface HomeQueryResponse {
  OtherSiteItems: OtherSiteItem[];
  cmsPage: CmsPage;
  sliderItems: SliderItem[];
  HomePageData: HomePageData;
  HomeSlider: HomeSlider;
  DailyOffer: DailyOffer;
  WeeklyOffer: WeeklyOffer;
}


  export interface FeaturedImage {
    node: {
      sourceUrl: string;
      altText: string;
    };
  }

  export interface Post {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    slug: string;
    featuredImage?: FeaturedImage | null;
  }
     
  export interface PostEdge {
    node: Post;
  }
  
  export interface PostsData {
    posts: {
      edges: PostEdge[];
    };
  }
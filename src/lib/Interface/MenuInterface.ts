export interface MenuItem {
    id:number; 
    name:string;
    url_key:string;
    canonical_url:string;
    custom_link_enable:number;
    custom_link_text: string; 
    include_in_menu: number;
    menutype:string;
    menutypecol:string;
    mega_icon:string | null;
    is_anchor:string | null;
    children : MenuItem[];
    display_mode:string | null;
 }

  export  interface MenuData {
   categoryList?: MenuItem[];
   storeConfig?: StoreConfig; 
   getStoreInfo?: StoreInfo;
 }
 
 export interface StoreConfig {
   absolute_footer: string | null;
   copyright: string | null;
   logo_alt: string | null;
   logo_height: string | null;
   logo_width: string | null;
   header_logo_src: string | null;
   is_guest_checkout_enabled: string | null;
   root_category_id: number;
   store_name: string | null;
   website_name: string | null;
   head_includes: string;
   default_description:string | null;
   default_keywords: string | null;
   default_title: string | null;
   head_shortcut_icon: string | null;
   base_currency_code:string | null;
   product_reviews_enabled:string | null;
   allow_guests_to_write_product_reviews: string | null;

 }


export interface StoreInfo {
  apple_store_link: string | null;
  company_address: string | null;
  company_info: string | null;
  enable_latest_offers: boolean | null;
  enable_secondary_menu: boolean | null;
  faccbook_app_id: string | null;
  facebook: string | null;
  footer_first_block_content: string | null;
  footer_first_block_title: string | null;
  footer_logo: string | null;
  footer_logo_alt: string | null;
  footer_logo_enable: boolean | null;
  footer_logo_height: string | null;
  footer_logo_width: string | null;
  footer_second_block_content: string | null;
  footer_second_block_title: string | null;
  instagram: string | null;
  latest_offer_link: string | null;
  latest_offers_content: string | null;
  latest_offers_title: string | null;
  linkedin: string | null;
  pinterest: string | null;
  play_store_link: string | null;
  secondary_menu: string | null;
  store_city: string | null;
  store_country: string | null;
  store_hours: string | null;
  store_name: string | null;
  store_phone: string | null;
  store_postcode: string | null;
  store_street_line1: string | null;
  store_street_line2: string | null;
  store_support_email: string | null;
  top_mega_menu: string | null;
  twitter_X: string | null;
  youtube: string | null;
  grid_per_page_values : string | null;
  grid_per_page : string | null;
  default_sort_by : string | null;
  default_sort_direction : string | null;
}

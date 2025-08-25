 const  homeQuery = `
query Home {
    OtherSiteItems {
        active
        alt
        caption
        id
        image
        sort
        title
        url
    }
    cmsPage(identifier: "home") {
        identifier
        title
        meta_title
        meta_keywords
        meta_description
        content
        meta_extra
        url_key
        content_heading
    }
    sliderItems {
        active
        alt
        caption
        id
        image
        mobile_image
        sort
        title
        url
    }

    HomePageData {
        enable_secondary_menu
        store_phone
        blog_p
        blog_sort_order
        blog_title
        brand_images
        brand_sort_order
        brand_title
        category_list_sort
        category_p
        category_title
        home_h1
        home_h1_sort
        home_p
        home_slider_banner_block
        home_slider_banner_enable
        map_content
        map_sort_order
        other_site_auto_slide
        other_site_p
        other_site_slide_grid
        other_site_sort
        other_site_title
        promo_block
        promo_sort_order
        short_map
        show_blog
        show_brand
        show_category_list
        show_home_h1
        show_map
        show_other_site
        show_promo_block
        show_visible_content
        visible_content
        visible_title
        category_list {
            id
            image
            name
            url_key
            canonical_url
        }
    }

    HomeSlider {
        Banner_block
        auto_slide
        banner_before_title
        show_banner
        slider_enable
        slider_p
        slider_title
        sort_order
        slider_products  {
            canonical_url
            id
            name
            new
            rating_summary
            review_count
            sku
            special_price
            type
            url_key
            back_image
            image {
                label
                url
            }
            price {
                regularPrice {
                    amount {
                        currency
                        symbol
                        value
                    }
                }
                final_price {
                    currency
                    value
                }
                discount {
                    amount_off
                    percent_off
                }
            }
            short_description {
                html
            }
            price_html
        }
    }


    DailyOffer {
        auto_slide
        daily_end_time
        daily_offer_content
        daily_offer_title
        daily_show
        sort_order
        daily_offer_products  {
            canonical_url
            id
            name
            new
            rating_summary
            review_count
            sku
            special_price
            type
            url_key
            back_image
            image {
                label
                url
            }
            price {
                regularPrice {
                    amount {
                        currency
                        symbol
                        value
                    }
                }
                final_price {
                    currency
                    value
                }
                discount {
                    amount_off
                    percent_off
                }
            }
            short_description {
                html
            }
            price_html
        }
    }
    WeeklyOffer {
        auto_slide
        show_weekly_banner
        sort_order
        weekly_banner_block
        weekly_end_time
        weekly_offer_content
        weekly_offer_title
        weekly_show
            weekly_offer_products {
            canonical_url
            id
            name
            new
            rating_summary
            review_count
            sku
            special_price
            type
            url_key
            back_image
            image {
                label
                url
            }
            price {
                regularPrice {
                    amount {
                        currency
                        symbol
                        value
                    }
                }
                final_price {
                    currency
                    value
                }
                discount {
                    amount_off
                    percent_off
                }
            }
            short_description {
                html
            }
            price_html
        }
    }

}

`;

export default homeQuery;
import { gql } from '@apollo/client';

export const GET_PRODUCT_PAGE = gql`
query Products($productUrl: String!)  {
products(filter: { url_key: { eq: $productUrl } }) {
    items {
      id
      sku
      name
      stock_status
      canonical_url
      description {
        html
      }
      short_description {
        html
      }
      price {
        regularPrice {
          amount {
            value
            currency
          }
        }
      }
      special_price
      final_price
      media_gallery_entries {
        file
        label
      }
      discount_percent
      meta_description
      meta_keyword
      meta_title
      product_type
      review_count
      rating_summary
      related_products {
        id
        sku
        name
        url_key
        rating_summary
        custom_image
        small_image {
          url
        }
        price {
          regularPrice {
            amount {
              value
              currency
            }
          }
        }
        final_price
        discount_percent
      }

      reviews {
        items {
          nickname
          summary
          text
          created_at
          average_rating
        }
        page_info {
          current_page
          page_size
          total_pages
        }
      }

      ... on ConfigurableProduct {
        configurable_options {
          attribute_code
          label
          id
          values {
            label
            value_index
            swatch_data {
              value
              __typename
            }
          }
        }
        variants {
          product {
            sku
            name
            price {
              regularPrice {
                amount {
                  value
                  currency
                }
              }
            }
          }
          attributes {
            code
            value_index
          }
        }
      }
    }
  }
}`;
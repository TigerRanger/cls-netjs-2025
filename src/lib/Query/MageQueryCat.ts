const MagentoCat = `
query getProductPage(
  $categoryId: String!,
  $pageSize: Int!,
  $currentPage: Int!,
  $sort: ProductAttributeSortInput
) {
  categoryList(filters: { ids: { eq: $categoryId } }) {
    id
    name
    description
    canonical_url
    children_count
    image
    is_anchor
    meta_description
    meta_keywords
    meta_title
    product_count
    display_mode
    video_code
    ans_set
    que_set
    enable_custom_title
    custom_title

    cms_block {
      identifier
      content
    }
    children {
      canonical_url
      name
      position
      url_key
    }
  }
  products(
    filter: { category_id: { eq: $categoryId } }
    pageSize: $pageSize
    currentPage: $currentPage
    sort: $sort
  ) {
    total_count
    page_info {
      current_page
      total_pages
      page_size
    }
    items {
      canonical_url
      id
      name
      new
      rating_summary
      review_count
      sku
      special_price
      custom_image
      product_type
      final_price
      discount_percent
      url_key
      image {
        label
        url
      }
      price {
        regularPrice {
          amount {
            currency
            value
          }
        }
      }
      short_description {
        html
      }
    }
    aggregations {
      attribute_code
      count
      label
      position
      options {
        count
        label
        value
      }
    }
  }
}
`; // <-- ✅ Final closing backtick and bracket

export default MagentoCat;

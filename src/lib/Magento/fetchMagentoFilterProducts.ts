
const MAGENTO_GRAPHQL_ENDPOINT = process.env.MAGENTO_ENDPOINT ?? '';
const token = process.env.NEXTJS_SECRET_KEY ?? '';


type MagentoFilter = {
  [attribute_code: string]: {
    eq?: string;
    in?: string[];
    from?: string;
    to?: string;
  };
};


interface Option {
  count: number;
  label: string;
  value: string;
  active: boolean;
}

interface FilterList {
  attribute_code: string;
  count: number;
  label: string;
  position: string | null;
  options: Option[];
  value:string | null  
}


interface LayoutUpdatePayload {
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  categoryId?: string;
  filters?: FilterList[];  // Pass filter list explicitly
  minPrice:number | null,
  maxPrice:number | null,
}

export const fetchMagentoFilterProducts = async ({
  currentPage,
  pageSize,
  sortBy,
  sortDirection,
  categoryId,
  filters,
  minPrice,
  maxPrice,
}: LayoutUpdatePayload) => {
  const filter: MagentoFilter  = {};

  if (categoryId) {
    filter.category_id = { eq: categoryId };
  }

  if (filters) {
    for (const f of filters) {
      const activeOptions = f.options?.filter((o) => o.active);
      if (activeOptions && activeOptions.length > 0) {
        filter[f.attribute_code] = {
          in: activeOptions.map((o) => o.value),
        };
      }
    }
  }

  if (minPrice != null && maxPrice != null) {
    filter.price = {
      from: `${minPrice}`,
      to: `${maxPrice}`,
    };
  }

  const query = `
    query getFilteredProducts(
      $pageSize: Int!,
      $currentPage: Int!,
      $filter: ProductAttributeFilterInput,
      $sort: ProductAttributeSortInput
    ) {
      products(
        filter: $filter
        currentPage: $currentPage
        pageSize: $pageSize
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
  `;

  const variables = {
    pageSize,
    currentPage,
    filter,
    sort: {
      [sortBy]: sortDirection.toUpperCase(),
    },
  };

  try {
    const response = await fetch(MAGENTO_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`GraphQL Error: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors.map((e: { message: string }) => e.message).join(', '));
    }
    return result.data?.products;
  } catch (error) {
    console.error('Magento fetch error:', error);
    return null;
  }
};

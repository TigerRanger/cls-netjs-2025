'use server';

import { ProductSearchResult } from "@/lib/Interface/MagentoCatResponse";

import { CartProduct } from '@/redux/cartSlice';

import { FilterList } from "@/lib/Interface/FilterInterface";

import { CartQueryResult } from "@/lib/Interface/CartInterface";

const MAGENTO_GRAPHQL_ENDPOINT = process.env.MAGENTO_ENDPOINT ?? '';
const token = process.env.NEXTJS_SECRET_KEY ?? '';

interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, unknown>;
}

/**
 * Create empty guest cart and return cartId
 */
export async function createGuestCart(): Promise<string> {
  const query = `mutation { createEmptyCart }`;

  const res = await fetch(MAGENTO_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (!json.data?.createEmptyCart) {
    throw new Error('Failed to create guest cart');
  }

  return json.data.createEmptyCart;
}

/**
 * Add product (simple or configurable) to Magento cart
 */
export async function addProductToMagentoCart(cartId: string, product: CartProduct): Promise<unknown> {
  const isConfigurable = product.option && product.option.length > 0;

  let query: string;
  let variables: Record<string, unknown> = {};

  if (isConfigurable) {
    const configurableOptions = (product.option ?? []).map(opt => ({
      option_id: opt.option_id,              // must be option_id, not id
      option_value: Number(opt.option_value), // must be option_value, not value_index
    }));

    query = `
      mutation AddConfigurableProductToCart(
        $cartId: String!,
        $parentSku: String!,
        $childSku: String!,
        $qty: Float!,
        $configurableOptions: [ConfigurableProductOptionInput!]!
      ) {
        addConfigurableProductsToCart(
          input: {
            cart_id: $cartId,
            cart_items: [
              {
                parent_sku: $parentSku,
                data: {
                  sku: $childSku,
                  quantity: $qty
                },
                configurable_options: $configurableOptions
              }
            ]
          }
        ) {
          cart {
            items {
              id
              quantity
              product {
                name
                sku
              }
            }
          }
        }
      }
    `;

    variables = {
      cartId,
      parentSku: product.sku,   // parent (configurable) product sku
      childSku: product.id,     // child (simple) product sku
      qty: product.qty,
      configurableOptions,
    };
  } else {
    query = `
      mutation AddSimpleProductToCart(
        $cartId: String!,
        $sku: String!,
        $qty: Float!
      ) {
        addSimpleProductsToCart(
          input: {
            cart_id: $cartId,
            cart_items: [
              {
                data: {
                  sku: $sku,
                  quantity: $qty
                }
              }
            ]
          }
        ) {
          cart {
            items {
              id
              quantity
              product {
                name
                sku
              }
            }
          }
        }
      }
    `;

    variables = {
      cartId,
      sku: product.sku,
      qty: product.qty,
    };
  }

  const res = await fetch(MAGENTO_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: GraphQLError) => e.message).join(', '));
  }

  return json.data;
}

/**
 * Update product quantity in cart (correct input shape)
 */
export async function updateProductQtyInMagentoCart(
  cartId: string,
  cartItemId: number,
  quantity: number
): Promise<unknown> {
  const query = `
    mutation UpdateCartItemsQty(
      $cartId: String!,
      $cartItems: [CartItemUpdateInput!]!
    ) {
      updateCartItems(
        input: {
          cart_id: $cartId,
          cart_items: $cartItems
        }
      ) {
        cart {
          items {
            id
            quantity
            product {
              name
              sku
            }
          }
        }
      }
    }
  `;

  const variables = {
    cartId,
    cartItems: [
      {
        cart_item_id: cartItemId,
        quantity,
      },
    ],
  };

  const res = await fetch(MAGENTO_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: GraphQLError) => e.message).join(', '));
  }

  return json.data;
}

/**
 * Remove product from cart
 */
export async function removeProductFromMagentoCart(
  cartId: string,
  itemId: number
): Promise<unknown> {
  const query = `
    mutation RemoveItemFromCart($cartId: String!, $itemId: Int!) {
      removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId }) {
        cart {
          items {
            id
            quantity
            product {
              name
              sku
            }
          }
        }
      }
    }
  `;

  const variables = { cartId, itemId };

  const res = await fetch(MAGENTO_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: GraphQLError) => e.message).join(', '));
  }

  return json.data;
}

/**
 * Get cart items by cartId
 */
export async function getCartItems(cartId: string): Promise<CartQueryResult> {
  const query = `
query GetCartItems($cartId: String!) {
  cart(cart_id: $cartId) {
    items {
      id
      quantity
      ... on ConfigurableCartItem {
        configurable_options {
          id
          option_label
          value_id
          value_label
        }
      }
      prices {
        price {
          value
          currency
        }
        row_total {
          value
          currency
        }
        total_item_discount {
          value
          currency
        }
      }
      product {
        name
        sku
        __typename
        canonical_url
        url_key
        image {
          url
        }
        custom_image 
      }
    }
    prices {
      grand_total {
        value
        currency
      }
      subtotal_excluding_tax {
        value
        currency
      }
      subtotal_including_tax {
        value
        currency
      }
      applied_taxes {
        amount {
          value
          currency
        }
        label
      }
    }
  }
}
`;

  const variables = { cartId };

  const res = await fetch(MAGENTO_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: GraphQLError) => e.message).join(', '));
  }

  return json.data ?? null;
}



interface LayoutUpdatePayload {
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  categoryId?: string;
  filters?: FilterList[]; // Pass filter list explicitly
  minPrice: number;
  maxPrice: number;
}

export const fetchMagentoProducts = async ({
  currentPage,
  pageSize,
  sortBy,
  sortDirection,
  categoryId,
  filters,
  minPrice,
  maxPrice,
}: LayoutUpdatePayload): Promise<ProductSearchResult  | null> => {
  const filterObject: string[] = [];

  if (categoryId) {
    filterObject.push(`category_id: { eq: "${categoryId}" }`);
  }

  if (filters) {
    for (const f of filters) {
      const activeOptions = f.options?.filter((o) => o.active);
      if (activeOptions && activeOptions.length > 0) {
        const values = activeOptions.map((o) => `"${o.value}"`).join(', ');
        filterObject.push(`${f.attribute_code}: { in: [${values}] }`);
      }
    }
  }

  if (minPrice !== undefined && minPrice !== null && maxPrice !== undefined && maxPrice !== null) {
    filterObject.push(`price: { from: "${minPrice}", to: "${maxPrice}" }`);
  }

  const filterBlock = filterObject.length > 0
    ? `filter: {\n${filterObject.join(',\n')}\n}`
    : '';

  const query = `
    query getProductList {
      products(
        ${filterBlock}
        currentPage: ${currentPage}
        pageSize: ${pageSize}
        sort: { ${sortBy}: ${sortDirection.toUpperCase()} }
      ) {
        items {
          id
          sku
          name
          new
          canonical_url
          rating_summary
          review_count
          special_price
          custom_image 
          url_key
          discount_percent
          short_description {
            html
          }
          final_price
          price {
            regularPrice {
              amount {
                value
                currency
              }
            }
          }
          image {
            url
            label
          }
          product_type
        }
        total_count
        page_info {
          current_page
          page_size
          total_pages
        }
      }
    }
  `;

  try {
    const response = await fetch(MAGENTO_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`GraphQL Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    

    if (result.errors) {
      throw new Error(result.errors.map((e: GraphQLError) => e.message).join(', '));
    }

    return result.data?.products;
  } catch (error) {
    console.error('Magento fetch error:', error);
    return null;
  }
};

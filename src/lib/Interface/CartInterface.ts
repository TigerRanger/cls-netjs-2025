export interface ShippingMethod {
  available: boolean;
  carrier_code: string;
  carrier_title: string;
  error_message: string;
  method_code: string;
  method_title: string;
  amount: {
    value: number;
    currency: string;
  };
}



export interface CartQueryResult {
  cart: Cart | null;
}

export interface Cart {
  items: MagentoCartItem[];
  prices: CartPrices;
}

export interface MagentoCartItem {
  id: string;
  quantity: number;
  row_total?: number;
  prices?: {
    price?: {
      value: number;
      currency: string;
    };
  };
  product: {
    sku: string;
    name: string;
    __typename?: string;
    image?: {
      url?: string;
    };
    custom_image?: string | null;
    canonical_url?: string;
    url_key?: string;
  };
  configurable_options?: Array<{
    id: number;
    option_label: string;
    value_label: string;
    value_id: number;
  }>;
}

export interface ConfigurableOption {
  id: string | number;
  option_label: string;
  value_id: string | number;
  value_label: string;
}

export interface Money {
  value: number;
  currency: string;
}

export interface Product {
  name: string;
  sku: string;
  __typename?: string;
  canonical_url?: string | null;
  url_key?: string | null;
  image?: {
    url?: string | null;
  } | null;
  custom_image?: string | null;
}

export interface CartPrices {
  grand_total: Money;
  subtotal_excluding_tax: Money;
  subtotal_including_tax: Money;
  applied_taxes: AppliedTax[];
}

export interface AppliedTax {
  amount: Money;
  label: string;
}

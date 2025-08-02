export interface PaymentMethod {
  code: string;
  title: string;
}

export interface GetPaymentMethodsResponse {
  success: boolean;
  payment_methods: PaymentMethod[];
}

export interface ErrorResponse {
  error: string;
}



export interface ShippingMethod {
  available: boolean;
  carrier_code: string;
  carrier_title: string;
  method_code: string;
  method_title: string;
  error_message: string;
  amount: {
    value: number;
    currency: string;
  };
}


const AvailablePaymentMethodsQuery = `
  query GetAvailablePaymentMethods($cart_id: String!) {
    cart(cart_id: $cart_id) {
      available_payment_methods {
        code
        title
      }
    }
  }
`;

export default AvailablePaymentMethodsQuery;

import { PaymentMethod, ShippingMethod } from "@/lib/Interface/PaymentInterface";
import { Address } from "@/lib/Interface/AddressInterface";

// Define the expected response type
interface SubmitPaymentResponse {
  success: boolean;
  order_id: number;
  redirect_url: string;
}

interface PaymentInterface {
  cart_id: string;
  customerEmail: string;
  billingAddress: Address;
  shippingAddress: Address;
  isGuest: boolean;
  selectedShippingMethod: ShippingMethod;
  selectedPaymentMethod: PaymentMethod;
  shippingBillingSame: boolean;
  agreedToPolicy: boolean;
}

export const submitPayment = async ({
  cart_id,
  customerEmail,
  billingAddress,
  shippingAddress,
  isGuest,
  selectedShippingMethod,
  selectedPaymentMethod,
  shippingBillingSame,
  agreedToPolicy,
}: PaymentInterface): Promise<SubmitPaymentResponse> => {
  try {
    if (!agreedToPolicy) {
      throw new Error("User must agree to the privacy policy.");
    }

    const payload = {
      cart_id,
      customer_email: customerEmail,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      is_guest: isGuest,
      shipping_method: selectedShippingMethod,
      payment_method: selectedPaymentMethod,
      same_address: shippingBillingSame,
    };

    const response = await fetch("/api/submit-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to submit payment");
    }

    const result: SubmitPaymentResponse = await response.json();
    return result;
  } catch (error) {
    console.error("submitPayment error:", error);
    throw error;
  }
};

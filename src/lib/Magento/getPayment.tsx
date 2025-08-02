import { GetPaymentMethodsResponse , ErrorResponse } from "../Interface/PaymentInterface";

export const getAvailablePaymentMethods = async (
  cart_id: string
): Promise<GetPaymentMethodsResponse | null> => {
  try {
    const response = await fetch("/api/payment/available", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart_id }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorResult = result as ErrorResponse;
      console.error("Payment API error:", errorResult.error || "Unknown error");
      return null;
    }

    return result as GetPaymentMethodsResponse;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch payment methods:", error.message);
    } else {
      console.error("Unknown error occurred during getAvailablePaymentMethods.");
    }
    return null;
  }
};

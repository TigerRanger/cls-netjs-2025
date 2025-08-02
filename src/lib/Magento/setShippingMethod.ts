import { ShippingMethod } from "@/lib/Interface/CartInterface";

interface PriceAmount {
  value: number;
  currency: string;
}

interface ShippingPrices {
  subtotal_excluding_tax: PriceAmount;
  grand_total: PriceAmount;
  applied_taxes: {
    amount: PriceAmount;
  }[];
}

interface SetShippingMethodResponse {
  success: boolean;
  prices: ShippingPrices;
}

interface ErrorResponse {
  error: string;
}

export const setShippingMethod = async (
  cart_id: string,
  shippingMethod: ShippingMethod,
  
): Promise<SetShippingMethodResponse | null> => {
  try {
    const response = await fetch("/api/shipping/method", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart_id,
        carrier_code: shippingMethod.carrier_code,
        method_code: shippingMethod.method_code,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorResult = result as ErrorResponse;
      console.error("Shipping API error:", errorResult.error || "Unknown error");
      return null;
    }

    return result as SetShippingMethodResponse;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to set shipping method:", error.message);
    } else {
      console.error("Unknown error occurred during setShippingMethod.");
    }
    return null;
  }
};


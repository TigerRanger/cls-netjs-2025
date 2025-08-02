import { ShippingMethod } from "@/lib/Interface/CartInterface";

export const get_avialbaleShipping = async (
  cart_id: string,
  country_code: string,
  region: string,
  postcode: string
): Promise<ShippingMethod[]> => {
  try {
    const response = await fetch("/api/shipping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart_id,
        country_code,
        postcode,
        region: {
          region,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Shipping API error:", result?.error);
      return [];
    }

    return result as ShippingMethod[];
  } catch (error) {
    console.error("Failed to fetch shipping methods:", error);
    return [];
  }
};

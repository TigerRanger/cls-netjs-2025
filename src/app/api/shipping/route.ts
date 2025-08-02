import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart_id, country_code, region, postcode } = body;

    if (!cart_id || !country_code) {
      return NextResponse.json({ error: "Missing cart_id or country_code" }, { status: 400 });
    }

    if (typeof country_code !== "string") {
      return NextResponse.json({ error: "country_code must be a string" }, { status: 400 });
    }

    const countryCodeEnum = country_code.toUpperCase();

    if (!/^[A-Z]{2}$/.test(countryCodeEnum)) {
      return NextResponse.json({ error: "Invalid country code" }, { status: 400 });
    }

    const query = `
      mutation estimateShipping($cartId: String!, $postcode: String!, $regionName: String) {
        estimateShippingMethods(
          input: {
            cart_id: $cartId,
            address: {
              country_code: ${countryCodeEnum},
              postcode: $postcode,
              region: { region: $regionName }
            }
          }
        ) {
          available
          carrier_code
          carrier_title
          error_message
          method_code
          method_title
          amount {
            value
            currency
          }
        }
      }
    `;

    const variables = {
      cartId: cart_id,
      postcode: postcode || "",
      regionName: region?.region || "",
    };

    if (!process.env.MAGENTO_ENDPOINT || !process.env.NEXTJS_SECRET_KEY) {
      return NextResponse.json(
        { error: "MAGENTO_ENDPOINT or NEXTJS_SECRET_KEY env variable is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(process.env.MAGENTO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXTJS_SECRET_KEY}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const rawResponse = await response.text();
    console.log("Magento response:", rawResponse);

    let result;
    try {
      result = JSON.parse(rawResponse);
    } catch {
      return NextResponse.json(
        { error: "Magento response is not valid JSON", rawResponse },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error("Magento API returned error:", result);
      return NextResponse.json({ error: result }, { status: response.status });
    }

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return NextResponse.json({ error: result.errors }, { status: 400 });
    }

    return NextResponse.json(result.data.estimateShippingMethods);
  } catch (error: unknown) {
    console.error("Internal server error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

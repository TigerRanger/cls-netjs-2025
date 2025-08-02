import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart_id, carrier_code, method_code } = body;

    if (!cart_id || !carrier_code || !method_code) {
      return NextResponse.json(
        { error: "Missing required fields: cart_id, carrier_code, or method_code" },
        { status: 400 }
      );
    }

    const carrierCodeSafe = carrier_code.trim();
    const methodCodeSafe = method_code.trim();

    if (!/^[a-z0-9_]+$/i.test(carrierCodeSafe) || !/^[a-z0-9_]+$/i.test(methodCodeSafe)) {
      return NextResponse.json(
        { error: "Invalid carrier_code or method_code format." },
        { status: 400 }
      );
    }

    const query = `
      mutation SetShippingMethod($cartId: String!, $carrierCode: String!, $methodCode: String!) {
        setShippingMethodsOnCart(
          input: {
            cart_id: $cartId,
            shipping_methods: [
              {
                carrier_code: $carrierCode,
                method_code: $methodCode
              }
            ]
          }
        ) {
          cart {
            prices {
              grand_total {
                value
                currency
              }
              subtotal_including_tax {
                value
                currency
              }
              subtotal_excluding_tax {
                value
                currency
              }
              applied_taxes {
                label
                amount {
                  value
                  currency
                }
              }
              discounts {
                amount {
                  value
                  currency
                }
                label
              }
            }
          }
        }
      }
    `;

    const variables = {
      cartId: cart_id,
      carrierCode: carrierCodeSafe,
      methodCode: methodCodeSafe,
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

    if (!response.ok || result.errors) {
      return NextResponse.json({ error: result.errors || result }, { status: 400 });
    }

    const prices = result?.data?.setShippingMethodsOnCart?.cart?.prices;
    return NextResponse.json({ success: true, prices });
  } catch (error: unknown) {
    console.error("Internal server error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

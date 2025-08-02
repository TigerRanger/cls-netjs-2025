import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

const MAGENTO_REST_ENDPOINT = process.env.MAGENTO_ENDPOINT_SITE + "/rest/V1/";

interface Address {
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  region: string;
  region_code?: string;
  region_id?: number;
  country_id: string;
  postcode: string;
  telephone: string;
  [key: string]: unknown; // Fix: replaces `any` with `unknown`
}

interface ShippingMethod {
  carrier_code: string;
  method_code: string;
}

interface PaymentMethod {
  code: string;
  additional_data?: Record<string, unknown>; // Fix: replaces `any` with `unknown`
}

interface SubmitPaymentRequest {
  cart_id: string;
  customerEmail?: string;
  billingAddress: Address;
  shippingAddress: Address;
  isGuest: boolean;
  selectedShippingMethod: ShippingMethod;
  selectedPaymentMethod: PaymentMethod;
  shippingBillingSame: boolean;
  agreedToPolicy: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const reqBody: SubmitPaymentRequest = await req.json();

    const {
      cart_id,
      customerEmail,
      billingAddress,
      shippingAddress,
      isGuest,
      selectedShippingMethod,
      selectedPaymentMethod,
      shippingBillingSame,
      agreedToPolicy,
    } = reqBody;

    // Validation
    if (!cart_id || !selectedShippingMethod || !selectedPaymentMethod) {
      return NextResponse.json(
        { error: "Missing cart ID, shipping method, or payment method." },
        { status: 400 }
      );
    }

    if (!agreedToPolicy) {
      return NextResponse.json(
        { error: "You must agree to the policy before proceeding." },
        { status: 400 }
      );
    }

    // Set Shipping Information
    await axios.post(`${MAGENTO_REST_ENDPOINT}carts/${cart_id}/shipping-information`, {
      addressInformation: {
        shipping_address: shippingAddress,
        billing_address: shippingBillingSame ? shippingAddress : billingAddress,
        shipping_carrier_code: selectedShippingMethod.carrier_code,
        shipping_method_code: selectedShippingMethod.method_code,
      },
    });

    // Set Payment Information
    const paymentPayload = {
      cartId: cart_id,
      billing_address: shippingBillingSame ? shippingAddress : billingAddress,
      paymentMethod: {
        method: selectedPaymentMethod.code,
        ...(selectedPaymentMethod.additional_data && {
          additional_data: selectedPaymentMethod.additional_data,
        }),
      },
      ...(isGuest && customerEmail && { email: customerEmail }),
    };

    const paymentResponse = await axios.post(
      `${MAGENTO_REST_ENDPOINT}guest-carts/${cart_id}/payment-information`,
      paymentPayload
    );

    return NextResponse.json({ success: true, data: paymentResponse.data });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error in submit-payment:", axiosError.response?.data || axiosError.message);

    return NextResponse.json(
      {
        error: "Payment submission failed",
        details: axiosError.response?.data || axiosError.message,
      },
      { status: 500 }
    );
  }
}

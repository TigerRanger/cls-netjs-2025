import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart_id, email } = body;

    const MAGENTO_ENDPOINT = process.env.MAGENTO_ENDPOINT;
    const TOKEN = process.env.NEXTJS_SECRET_KEY;

    if (!MAGENTO_ENDPOINT || !TOKEN) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    if (!cart_id || !email) {
      return NextResponse.json({ error: 'Missing cart_id or email in request' }, { status: 400 });
    }

    const mutation = `
      mutation setGuestEmailOnCart($cartId: String!, $email: String!) {
        setGuestEmailOnCart(input: {
          cart_id: $cartId,
          email: $email
        }) {
          cart {
            email
          }
        }
      }
    `;

    const variables = { cartId: cart_id, email };

    const magentoRes = await axios.post(
      MAGENTO_ENDPOINT,
      { query: mutation, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/json',
        },
      }
    );

    const emailResponse = magentoRes.data?.data?.setGuestEmailOnCart?.cart?.email;

    if (!emailResponse) {
      return NextResponse.json({ error: 'Magento did not return an email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          {
            error: 'Remote API Error',
            details: error.response.data,
            status: error.response.status,
          },
          { status: 500 }
        );
      }
      if (error.request) {
        return NextResponse.json({ error: 'No response from remote API' }, { status: 500 });
      }
      return NextResponse.json({ error: error.message || 'Unexpected Axios Error' }, { status: 500 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected Error' },
      { status: 500 }
    );
  }
}

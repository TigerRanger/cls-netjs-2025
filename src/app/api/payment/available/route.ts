import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

import AvailablePaymentMethodsQuery from '@/lib/Query/AvailablePaymentMethodsQuery';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart_id } = body;



    const MAGENTO_ENDPOINT = process.env.MAGENTO_ENDPOINT;
    const TOKEN = process.env.NEXTJS_SECRET_KEY;

    if (!MAGENTO_ENDPOINT || !TOKEN) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    if (!cart_id) {
      return NextResponse.json({ error: 'Missing cart_id in request' }, { status: 400 });
    }

    // Make Magento GraphQL call
    const magentoRes = await axios.post(
      MAGENTO_ENDPOINT,
      {
        query: AvailablePaymentMethodsQuery,
        variables: { cart_id },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/json',
        },
      }
    );

    const paymentMethods = magentoRes.data?.data?.cart?.available_payment_methods;

    if (!paymentMethods || paymentMethods.length === 0) {
      return NextResponse.json({ error: 'No payment methods found' }, { status: 404 });
    }

    // Optional: cache payment methods for this cart_id
    const dirPath = path.join(process.cwd(), 'data', '_cache');
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(
      path.join(dirPath, `PaymentMethods-${cart_id}.json`),
      JSON.stringify(paymentMethods, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true, payment_methods: paymentMethods });

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

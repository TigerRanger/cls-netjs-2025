import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

import homeQuery from '@/lib/Query/Home';
import HomeBlogQuery from '@/lib/Query/HomeBlogQuery';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { security_api } = body;

    if (security_api !== process.env.NEXTJS_SECRET_KEY) {
      return NextResponse.json({ error: 'Access Not Allowed' }, { status: 403 });
    }

    const MAGENTO_ENDPOINT = process.env.MAGENTO_ENDPOINT;
    const WP_ENDPOINT = process.env.WP_ENDPOINT;
    const TOKEN = process.env.NEXTJS_SECRET_KEY;

    if (!MAGENTO_ENDPOINT || !WP_ENDPOINT || !TOKEN) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    // --- Fetch from Magento ---
    const magentoRes = await axios.post(
      MAGENTO_ENDPOINT,
      { query: homeQuery },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!magentoRes?.data?.data) {
      return NextResponse.json({ error: 'No Magento data found' }, { status: 500 });
    }

    const homeData = magentoRes.data.data;

    // --- Create directory and save Magento data ---
    const dirPath = path.join(process.cwd(), 'data', '_cache');
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(path.join(dirPath, 'homeData.json'), JSON.stringify(homeData, null, 2), 'utf-8');

    // --- Fetch from WordPress ---
    const wpRes = await axios.post(
      WP_ENDPOINT,
      { query: HomeBlogQuery },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXTJS_SECRET_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    console.log('WordPress Response:', wpRes.data);

    if (!wpRes?.data?.data) {
      return NextResponse.json({ error: 'No WordPress data found' }, { status: 500 });
    }

    const blogData = wpRes.data.data;

    // --- Save WordPress data ---
    await fs.writeFile(path.join(dirPath, 'homeBlogData.json'), JSON.stringify(blogData, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: 'Home and blog data saved' });

  }  catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return NextResponse.json({
        error: 'Remote API Error',
        details: error.response.data,
        status: error.response.status,
      }, { status: 500 });
    } else if (error.request) {
      return NextResponse.json({ error: 'No response from remote API' }, { status: 500 });
    } else {
      return NextResponse.json({ error: error.message || 'Unexpected Axios Error' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected Error' }, { status: 500 });
}
}

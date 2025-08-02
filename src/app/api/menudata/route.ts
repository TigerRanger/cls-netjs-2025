import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

import MenuHelper from '@/lib/jslib/MenuHelper';
import { menuQuery } from '@/lib/Query/Menu';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { security_api } = body;

    if (security_api !== process.env.NEXTJS_SECRET_KEY) {
      return NextResponse.json({ error: 'Access Not Allowed' }, { status: 403 });
    }

    if (!process.env.MAGENTO_ENDPOINT) {
      return NextResponse.json({ error: 'MAGENTO_ENDPOINT is not defined' }, { status: 500 });
    }

      const response = await axios.post(
        process.env.MAGENTO_ENDPOINT,
        {
          query: menuQuery,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXTJS_SECRET_KEY}`,
            'Accept': 'application/json',
          },
        }
      );

    if (response.status !== 200) {
      return NextResponse.json({ error: 'Failed to fetch data from Magento' }, { status: 500 });
    }

    if (!response?.data?.data) {
      return NextResponse.json({ error: 'No data found in the response' }, { status: 500 });
    }


    const categoryList = response?.data?.data?.categoryList || [];
    const menuData = MenuHelper.getMenuRouteList(categoryList);
    const fullMenuData = response?.data?.data || null;

    const dirPath = path.join(process.cwd(), 'data', '_cache');
    await fs.mkdir(dirPath, { recursive: true });



    const filePathJson = path.join(dirPath, 'menuData.json');
    await fs.writeFile(filePathJson, JSON.stringify(menuData, null, 2), 'utf-8');



    const filePathAllJson = path.join(dirPath, 'menuAllData.json');
    await fs.writeFile(filePathAllJson, JSON.stringify(fullMenuData, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: 'Menu data saved' });
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

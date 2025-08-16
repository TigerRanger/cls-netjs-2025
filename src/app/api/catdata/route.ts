import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import MagentoCat from "@/lib/Query/MageQueryCat";


type sortType = {
  position?: 'ASC' | 'DESC';
  price?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';  
} | null;


export async function POST(req: NextRequest) {
  
  try {
    const body = await req.json();
    const { security_api } = body;



    if (security_api !== process.env.NEXTJS_SECRET_KEY) {
      return NextResponse.json({ error: 'Access Not Allowed' }, { status: 403 });
    }


   
    const MAGENTO_ENDPOINT = process.env.MAGENTO_ENDPOINT;
    const TOKEN = process.env.NEXTJS_SECRET_KEY;

    if (!MAGENTO_ENDPOINT || !TOKEN) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }


     

    const readPath = path.join(process.cwd(), 'data', '_cache');
    const fileContent = await fs.readFile(path.join(readPath, 'menuData.json'), 'utf-8');
    const categories = JSON.parse(fileContent);

    const globalData = await fs.readFile(path.join(readPath, 'menuAllData.json'), 'utf-8');

        
    let pageSize = JSON.parse(globalData)?.getStoreInfo?.grid_per_page || 15;
    pageSize = typeof pageSize === 'string' ? Number(pageSize) : pageSize;


    

    const default_sort_by = JSON.parse(globalData)?.getStoreInfo?.default_sort_by || 'position';


    

    const default_sort_direction = JSON.parse(globalData)?.getStoreInfo?.default_sort_direction || 'ASC';


    

  let sort : sortType = null; 
  
    if(default_sort_by === 'name') {
        sort = {
          name: default_sort_direction === 'ASC' ? 'ASC' : 'DESC',
        }
    }

    else if(default_sort_by === 'price') 
      {
          sort = {
            price: default_sort_direction === 'ASC' ? 'ASC' : 'DESC',
          }
      }

    else {
      sort = {
        position: default_sort_direction === 'ASC' ? 'ASC' : 'DESC',
      };
    }
  
   
    
    // Call saveCategory for each category
     for (const category of categories) {
       await saveCategory(category.id, MAGENTO_ENDPOINT ??'', TOKEN ??'', pageSize, sort);
     }

    return NextResponse.json({ success: true, message: 'All category data saved.' });

  } catch (error: unknown) {
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


// ----------------------------------------
// Save data per category
// ----------------------------------------
async function saveCategory(categoryId: number, endpoint: string, token: string ,  pageSize: number , sort: sortType) {
  const response = await axios.post(
    endpoint,
    {
      query: MagentoCat,
      variables: {
        categoryId: String(categoryId),
        pageSize: pageSize || 12, // Default to 12 if not provided
        currentPage: 1,
        sort: sort || { position: 'ASC' }, // Default sort if not provided
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    }
  );

  const categoryData = response?.data?.data;
  if (!categoryData) {
    console.warn(`No data found for category ${categoryId}`);
    return;
  }

  const dirPath = path.join(process.cwd(), 'data', '_cache', 'cat');
  await fs.mkdir(dirPath, { recursive: true });
  const filePath = path.join(dirPath, `cat_${categoryId}.json`);
  await fs.writeFile(filePath, JSON.stringify(categoryData, null, 2), 'utf-8');
}

import React from 'react';
import PageBuilder from '@/lib/jslib/PageBuilder';
import { Category , ProductSearchResult } from '@/lib/Interface/MagentoCatResponse';
import Image from 'next/image';
import "@/sass/product_category.scss";
import CategoryChild from './CategoryChild';
import ProductList from './ProductList';
import ProductNotFound from './ProductNotFound';


import { getMenuData } from "@/lib/loaders/menuLoader";

import CmsDescription from  "@/components/CmsDescription";




import {Aggregation , CustomFilter } from "@/lib/Interface/FilterInterface";


interface ProductPagePops{
    CategoryList : Category;
    Agg :Aggregation[] | null;
    products: ProductSearchResult;
    filter_data: CustomFilter | null;
}

import PriceTable from './PriceTable';
import FAQPage from '../Page/faq';
import CategoryVideo from './CategoryVideo';

export const revalidate = 60;


const  PageWithFilter : React.FC<ProductPagePops> = async ({CategoryList , Agg ,  products , filter_data=null }) => {

    const CateoryBanner = CategoryList?.image;
    const categoryVideoCode = CategoryList?.video_code;
    const magento = process.env.MAGENTO_ENDPOINT_SITE ;

     const MenuData= await getMenuData();

    const storeInfo = MenuData?.getStoreInfo;
    const phone = MenuData?.getStoreInfo?.store_phone;
    const Currency_code = MenuData?.storeConfig?.base_currency_code ?? 'USD';

  

    const Category_id = CategoryList?.id;
    const pageSizeOptions = storeInfo?.grid_per_page_values?.split(',').map(val => parseInt(val.trim(), 10)).filter(val => !isNaN(val));
    
    const queList = CategoryList?.que_set ? CategoryList.que_set.trim() : "" ;
    const ansList = CategoryList?.ans_set ? CategoryList.ans_set.trim() : "" ;

    const page_sort_data ={
      default_sort_by:  filter_data && filter_data.sortBy ? filter_data.sortBy : storeInfo?.default_sort_by || "position",
      default_sort_direction: filter_data && filter_data.sortDirection ?     filter_data.sortDirection:    storeInfo?.default_sort_direction || "ASC",
      grid_per_page: filter_data && filter_data.pageSize ? filter_data.pageSize : parseInt(storeInfo?.grid_per_page ?? "0"),
      grid_per_page_values: pageSizeOptions || [15, 30, 45, 60],
    }
  return (
    <>
      <section className="category-page">
        <div className="container-fluid">
         <div className='title-block'>

         {CateoryBanner &&
            ( 
                <div className='category_banner'>
                  {categoryVideoCode &&
                  <CategoryVideo video_code={categoryVideoCode ?? ""} name={CategoryList?.name} />
                  }
                   <Image src={CateoryBanner} width={1300} height={250} alt={CategoryList?.name} />
                </div> 
            )
         }



              <h1 className='category_heading'>
                  { CategoryList?.custom_title?CategoryList?.custom_title:CategoryList.name}     
             </h1>
          {/* Render CMS block */}
          {CategoryList?.cms_block && CategoryList?.display_mode==='PRODUCTS_AND_PAGE' && (
            <div className='cms-block'
              dangerouslySetInnerHTML={{
                __html: PageBuilder.reove_css_tag(CategoryList.cms_block.content),
              }}
            />
          )}
        </div>
          





          {/* Render Category Children */}
          {Number(CategoryList?.children_count) > 0 && (
            <CategoryChild cats={CategoryList?.children || null} />
          )}
            {/* Render Product List Section */}
            {CategoryList && CategoryList?.display_mode !== "PAGE" && (
              <section className="product_list_wrapper">
                  {CategoryList.product_count && CategoryList.product_count > 0 ? (
                    <ProductList
                      products={products.items || []} // Pass `products` as an array of `IProduct[]`
                      info = {products.page_info}
                      type={!!CategoryList.is_anchor} // Ensure type is boolean
                      total = {products.total_count}
                       filters = { Agg || null }
                       magento = {magento ?? ""}
                       phone={phone ?? ""}
                      Category_id={Category_id ? String(Category_id) : ""}
                      page_sort_data ={page_sort_data}
                      filter_data ={filter_data}
                      Currency_code ={Currency_code}
                    />
                  ) : (
                    <ProductNotFound />
                  )}
           
              </section>
            )}




          {/* Render  Description */}
{CategoryList?.description && CategoryList?.description !== "" && (

  <CmsDescription data={PageBuilder.reove_css_tag(CategoryList.description)} />
  
)}
        </div>
          {  products && products.items && products.items.length > 0 &&
          ( 
         <section className='price_table_section'>
            <div className='container-fluid'>
                    <PriceTable products={products.items || []}/>
            </div>
         </section>
        )} 

        {queList!=="" && ansList!=="" &&
          (<section className='gray-block faq_section'>
             <div className='container'>
                    <FAQPage queList={queList} ansList={ansList}/>
            </div>
        </section>)
          }
    </section>
    </>
  )
}

export default PageWithFilter



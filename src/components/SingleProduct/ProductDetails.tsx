import React from 'react';
import { Product } from '@/lib/Interface/SingleProductIInterface';
import BreadCramp from '@/components/Page/BreadCramp';
import ProductGallery from '@/components/SingleProduct/ProductGallery';
import PageBuilder from '@/lib/jslib/PageBuilder';

import Image from 'next/image';

import "@/sass/single_product.scss";


//import { getMenuData } from "@/lib/loaders/menuLoader";

import ProductAction from './ProductAction';

import EcommercePrice from '@/lib/jslib/Price';

import SocialShare from './SocialShare';

// import  PCOwn  from '@/components/SingleProduct/PCOwn';

import { getCurrencySymbol } from '@/utils/currencySymbols';

 import TabBlock from '@/components/SingleProduct/TabBlock';

interface SingleProduct {
  product: Product;
  urlkey: string;
}

const ProductDetails: React.FC<SingleProduct> = async ({ product, urlkey }) => {
  const BreadCramps = [
    {
      name: `${product?.name}`,
      url: `/${urlkey}`, // Added a slash before urlkey
    },
  ];

    const magento = process.env.MAGENTO_ENDPOINT_SITE + '/pub/media/catalog/product' ;


   // const menuData = await getMenuData();

   // const phone = menuData?.getStoreInfo?.store_phone;

  return (
    <>
     <BreadCramp links={BreadCramps} />
     <div className='product-details'>
        <div className='container'>
          <div className='row'>
             <div className='col-sm-5 gallery-row'>
                {product.media_gallery_entries.length > 1 ? (
                  <ProductGallery gallery={product.media_gallery_entries} magento={magento ?? ""} />
                ) : (
                    <div id="single_image" className="image_box">
                  <Image
                    src={product.media_gallery_entries[0].file ? magento+product.media_gallery_entries[0].file : "/images/no_image.avif"}
                    width={450}
                    height={450}
                    alt={product.media_gallery_entries[0].label ?? product.name}
                    priority
                  />
                  </div>
                )}
              </div>
              <div className='col-sm-7 p-details-row'>
                <div className='product-title-wrapper'>
                   <h1 className='product-title'>{product.name}</h1>
                    <div className="sku-main"><strong>Artikelnr.</strong>{product.sku}</div>
                    <div className="sku-review">
                            <div className="rating-stars">
                                  {EcommercePrice.generateStars(EcommercePrice.calculate_review_percent(Number(product?.rating_summary))).map(
                                    (star, index) => (
                                      <span key={index} className={`star ${star}`}>
                                        ★
                                      </span>
                                    )
                                  )}
                            </div>
                           <div className='rewiew-count'>{`${product?.review_count ?? 0} ${(product?.review_count ?? 0) > 1 ? 'Reviews' : 'Review'}`}</div>   
                           <a href='#' className='create_review'>Add Your Review</a>
                    </div> 

                      <div className='price-wrapper'>
                           <div className='price-group'>

                                { product.price.regularPrice?.amount.value !== product.final_price &&  
                                (<span className='old-price'>                 {EcommercePrice.getEuroPrice(
                                                                Number(product?.price.regularPrice.amount.value) ,
                                                                product.price.regularPrice.amount.currency,
                                                                getCurrencySymbol( product.price.regularPrice.amount.currency)
                                                               )} </span>

                                )}       

                                <span className='price'>                                    
                                  {EcommercePrice.getEuroPrice(
                                                              Number(product?.final_price) ,
                                                                product.price.regularPrice.amount.currency,
                                                                getCurrencySymbol( product.price.regularPrice.amount.currency)
                                                               )}
                                </span>

                                 {product.discount_percent!==0 &&(      
                                     <span className='ribbon-box'>{Math.round(Number(product?.discount_percent))} % Off</span>
                                 )}
                           </div>     

                            <div className='stock-staus'>
                              {product.stock_status === 'IN_STOCK' ?
                               (<div className='in_stock'><Image src="/ok-round.svg" width={20} height={20} alt='ok'/>    In Stock </div>)
                               :
                               (<div className='out_of_stock'><Image src="/cross-round.svg" width={20} height={20} alt='cross'/>    Out Of Stock </div>)
                              }
                            </div>  
                      </div>  



                             <ProductAction product={product} magento={magento ?? ""} />   


                              <SocialShare productName={product.name} />

                    


                </div>    


                      <div className='short_des'>

                        {   product.short_description?.html ? (
                            <div dangerouslySetInnerHTML={{ __html: product.short_description.html }} />
                            ) : (
                            <div dangerouslySetInnerHTML={{ __html: PageBuilder.truncateWords(product.description.html,30) }} />
                            )}

                        </div>
               
              </div>  

          </div>  

          {/* <PCOwn /> */}

        </div>
      </div>  
      <section className='tab-block'>
            <div className='container'>
                  {product?.description && (
                       <TabBlock details={product.description.html ?? ""} special={product.meta_description ?? ""} /> 
                  )}    
             </div>                                   
      </section>     
    </>
  );
};

export default ProductDetails;



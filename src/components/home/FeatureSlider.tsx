import React from 'react'
import ProductSlider from '../ProductSlider';
import { Product } from "@/lib/Interface/MagentoCategoryInterface";
import BannerItem from './BannerItem';
const breakpoints = {
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
    1280: { slidesPerView: 5 },
  };  
interface FeatureSlider {
    title:string;
    paragaph:string;
    show_banner:boolean | string;
    banner_before_title:boolean | string;
    banner:string | undefined;
    slider_products: Product[] ;
    auto: string | boolean;
    magento?: string;
    phone?: string;
    autoplay?: { delay: number } | boolean;
}
const FeatureSlider :React.FC<FeatureSlider> = ({  title , paragaph , banner, show_banner, banner_before_title,
  slider_products,
  auto,
  magento,
  phone,
  autoplay=false }) => {
    if(auto === '1' || auto === true || auto === 'true') {
         autoplay = {
          delay: 3100 
        };
    }
  return (
        <>
          <section className="featureProduct-section gray-block">
              <div className="container">
                <BannerItem title={title} paragraph={paragaph} banner={banner ?? ''}
                show_banner={show_banner} banner_before_title={banner_before_title} />
                  <div className='product_slider_f'>
                       <ProductSlider products={slider_products} autoplay={autoplay} 
                       breakpoints={breakpoints} magento={magento} phone={phone}
                       /> 
                </div>
              </div>            
          </section>
        </>
  )
}

export default FeatureSlider
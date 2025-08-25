"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import {useDispatch } from "react-redux";
import { Navigation , Autoplay } from "swiper/modules";
import FallbackImage from "@/components/Helper/FallbackImage";
import Image from "next/image";
import EcommercePrice from "@/lib/jslib/Price";

const  PhoneSvg = "/svg-icon/phone.svg";
const ConfigSvg = "/svg-icon/config.svg";
const ClockSvg = "/images/clock.svg";
const CartPlus = "/images/cart_plus.svg";



import {  AppDispatch } from "@/redux/store";
import { getCurrencySymbol } from '@/utils/currencySymbols';


import { addProductToCart } from "@/redux/cartSlice";


import { Product } from "@/lib/Interface/MagentoCategoryInterface";

interface ProductSliderProps {
  products: Product[];
  autoplay?: { delay: number } | boolean;
  breakpoints?: { [key: number]: { slidesPerView: number } };
  magento: string | undefined;
  phone?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products: initialProducts , autoplay , breakpoints , magento , phone  }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setProducts(initialProducts);
      setLoading(false);
    }, 0); // simulate loading
  }, [initialProducts]);

  const [productID, setProductID] = useState<string | null>(null);
const dispatch = useDispatch<AppDispatch>();
  const showPreload = () => {
    const preloadWrapper = document.querySelector('.preloadWrapper');
    if (preloadWrapper) {
      (preloadWrapper as HTMLElement).style.display = 'flex';
    }
  };

  const hidePreload = () => {
    const preloadWrapper = document.querySelector('.preloadWrapper');
    if (preloadWrapper) {
      (preloadWrapper as HTMLElement).style.display = 'none';
    }
    setProductID(null);
  };

  const handleAddToCart = (product: Product, qty: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setProductID(String(product.id));
    const cartProduct = {
      id: String(product.id),
      sku: product.sku,
      name: product.name,
      price:product.price.final_price?.value  ?? 0,
      type: product.type ?? null,
      option: [],
      qty: qty ?? 1,
      price_text: '',
      product_url: product.canonical_url ?? '',
      product_image: product.image?.url
        ? magento+'/pub/media/catalog/product/'+product.image?.url
        : "/images/no_image.avif",
      is_egis: false,
      isLoading: false,
    };
    dispatch(addProductToCart(cartProduct, qty, showPreload, hidePreload));
  };



  const renderPlaceholders = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <SwiperSlide key={`placeholder-${index}`}>

        <div className="product-box">
          <div className="product-item">
          <div className="image-placeholder placeholder-glow" />
          <h5 className="card-title placeholder-glow">
          <span className="placeholder"></span>
          </h5>
          <p className="card-text placeholder-wave">
              <span className="placeholder col-7"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-8"></span>
        </p>
        <a href="#" tabIndex={-1} className="btn btn-primary disabled placeholder "></a>
        </div>
        </div>
      </SwiperSlide>
    ));
  };

  return (
    <div className="product-slider-container">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        autoplay={autoplay}
        breakpoints={breakpoints}
        navigation
        modules={[Navigation , Autoplay]}
        className="swiper-container-daily"
      >
        {loading
          ? renderPlaceholders()
          : products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-item">
                 {( product.price.regularPrice?.amount.value !== product.price.final_price?.value &&
                  <>
                  <div className="ribbon">% SALE</div>
                  </>
                 )}

                  <div className="product-image-holder">


                    { product.back_image && (
                    <FallbackImage
                      src={product?.back_image || "/images/no_image.avif"}
                      fallbackSrc="/images/no_image.avif"
                      alt={product?.image?.label ?? product.name}
                      width={250}
                      height={250}
                      class_name="back-image"
                    />
                    )
                  }



                    <FallbackImage
                      src={magento+'/pub/media/catalog/product/'+product.image?.url || "/images/no_image.avif"}
                      fallbackSrc="/images/no_image.avif"
                      alt={product?.image?.label ?? product.name}
                      width={250}
                      height={250}
                      class_name="product-image"
                    />
                  </div>

                  <div className="sku-review">
                    <div className="rating-stars">
                      {EcommercePrice.generateStars(
                       product?.rating_summary ?? 4
                      ).map((star, index) => (
                        <span key={index} className={`star ${star}`}>
                          {(star === "fill") ?
                            (<Image src="/images/review-fill.svg" alt="Star" width={16
                             } height={16} />
                            ):(
                              <Image src="/images/review-empty.svg" alt="Star" width={16} height={16} />
                            )
                            }
                        </span>
                      ))}
                    </div>
                    <div className="sku-main">{product.sku}</div>
                  </div>



                  <a href={`/${product.canonical_url}`} className="product-name" >
                    {product.name}
                  </a>


                      {typeof product?.short_description?.html === 'string' && product.short_description.html.length > 0 && (
                        <div className="product-desc" dangerouslySetInnerHTML={{ __html: product.short_description.html }} />
                      )}



                  <div className="cs-delivery-info">
                      <Image src={ClockSvg} width={17} height={20} alt="CLS Computer" />
                      <span>Lieferzeit 6-8 Werktage</span>
                  </div>

                 
                  <div className="button-wrapper">

                {product.price.final_price?.value !== undefined && product.price.final_price.value > 0 ? (
                   <div className="price-wrapper">

                    {( product.price.regularPrice?.amount.value !== product.price.final_price?.value &&
                          <span className="old-price">
                             {EcommercePrice.getEuroPrice(
                            product?.price?.regularPrice.amount.value ?? 0,
                             product.price.regularPrice.amount.currency,
                           getCurrencySymbol( product.price.regularPrice.amount.currency)
                             )}
                          </span>
                    )}

                    <span className="price">
                      {EcommercePrice.getEuroPrice(
                        product?.price.final_price.value  ?? 0,
                        product.price.regularPrice.amount.currency,
                         getCurrencySymbol( product.price.regularPrice.amount.currency)
                      )}
                    </span>
                    </div>
                     ) : (
                  <span className="call-for-price">
                    Call for Price
                  </span>
                  )}

                      {(product.price.final_price?.value !== undefined && product.price.final_price.value > 0) ? (
                        product.type === 'configurable' || product.type === 'bundle' ? (
                          <a href={`/${product.canonical_url}`} className="config-btn" title="addto-product" >
                            <Image src={ConfigSvg} width={27} height={27} alt="Add to product" /> Configure
                          </a>
                        ) : (
                          <div className="att-to-group">
                          <button className="addto-btn" onClick={handleAddToCart(product, 1)}>
                             {productID !== String(product.id) ? (
                              <>
                                <Image src={CartPlus} width={37} height={35} alt="Add to product" />
                                
                              </>
                            ) : (
                              <>
                                <span className="loading-spinner"></span> Adding...
                              </>
                            )}
                          </button>

                              <div className="cs-product-tile__main-bottom">
                                <span className="cs-product-tile__details-link-span">Mehr</span>
                              </div>

                          </div>
                        )
                      ) : (
                        <a href={`tel:${phone ?? ''}`} className="call-price" title="addto-product">
                          <Image src={PhoneSvg} width={17} height={17} alt="Add to product" /> {phone ? phone : 'Call Us'}
                        </a>
                      )}

                  </div>
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;

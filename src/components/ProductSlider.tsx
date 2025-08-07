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


const plusSvg =  "/svg-icon/cart-main.svg";
const  PhoneSvg = "/svg-icon/phone.svg";
const ConfigSvg = "/svg-icon/config.svg";



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
        spaceBetween={6}
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
                  <div className="ribbon">{product?.price?.discount?.percent_off}% OFF</div>
                  </>
                 )}

                  <div className="product-image-holder">
                    <FallbackImage
                      src={magento+'/pub/media/catalog/product/'+product.image?.url || "/images/no_image.avif"}
                      fallbackSrc="/images/no_image.avif"
                      alt={product?.image?.label ?? product.name}
                      width={250}
                      height={250}
                      class_name="product-image"
                    />
                  </div>
                  <a href={`/${product.canonical_url}`} className="product-name" >
                    {product.name}
                  </a>
                  <div className="sku-review">
                    <div className="rating-stars">
                      {EcommercePrice.generateStars(
                       product?.rating_summary ?? 0
                      ).map((star, index) => (
                        <span key={index} className={`star ${star}`}>★</span>
                      ))}
                    </div>
                    <div className="sku-main">{product.sku}</div>
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
                          <button className="addto-btn" onClick={handleAddToCart(product, 1)}>
                             {productID !== String(product.id) ? (
                              <>
                                <Image src={plusSvg} width={25} height={25} alt="Add to product" /> Add to Cart
                              </>
                            ) : (
                              <>
                                <span className="loading-spinner"></span> Adding...
                              </>
                            )}
                          </button>
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

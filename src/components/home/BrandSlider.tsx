"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

interface BrandSliderProps {
  images: string[];
  site: string;
}

const BrandSlider: React.FC<BrandSliderProps> = ({ images, site }) => {

  const [brandImages, setBrandImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBrandImages(images);
      setLoading(false);
    }, 0); // CSR hydration timing
  }, [images]);

  const renderPlaceholders = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <SwiperSlide key={`placeholder-${index}`}>
        <div className="breand-slider-item animate-pulse flex items-center justify-center">
          <div className="w-[100px] h-[100px] bg-gray-300 rounded" />
        </div>
      </SwiperSlide>
    ));
  };

  return (
    <section className="breand-slider gray-block">
      <div className="container">
        <h2 className="breand-slider-title">Shop by Brand</h2>

        <Swiper
          className="breand-slider-swiper"
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3000 }}
          spaceBetween={10}
          slidesPerView={3}
          loop={true}
          breakpoints={{
            400: { slidesPerView: 2 },
            640: { slidesPerView: 4 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
            1200: { slidesPerView: 10 },
          }}
        >
          {loading
            ? renderPlaceholders()
            : brandImages.map((brand, index) => (
                            <SwiperSlide key={index}>
                              <div className="breand-slider-item flex items-center justify-center">
                                <Image
                                  src={site+brand}
                                  alt={brand.split("/").pop()?.replace(/\.[^/.]+$/, "") || "Brand Image"}
                                  width={100}
                                  height={100}
                                  className="object-contain"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/images/no_image.avif";
                                  }}
                                />
                              </div>
                            </SwiperSlide>
                          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BrandSlider;

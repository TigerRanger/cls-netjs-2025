"use client";

import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import Image from "next/image";
import { OtherSiteItem } from "@/lib/Interface/HomeInterface";

interface ServiceCardSliderProps {
  PostsData: OtherSiteItem[];
  site: string;
  auto: string;
}

const ServiceCardSlider: React.FC<ServiceCardSliderProps> = ({
  PostsData,
  site,
  auto,
}) => {
  const [data, setData] = useState<OtherSiteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation button refs
  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setData(PostsData);
      setLoading(false);
    }, 0);
  }, [PostsData]);

  const renderPlaceholders = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <SwiperSlide key={`placeholder-${index}`}>
        <div className="service-card placeholder-glow">
          <div
            className="image-placeholder placeholder"
            style={{ height: 200, background: "#eee" }}
          />
          <h3
            className="placeholder"
            style={{ height: 24, background: "#ddd", margin: "12px 0" }}
          />
          <p className="placeholder" style={{ height: 16, background: "#ccc" }} />
        </div>
      </SwiperSlide>
    ));
  };

  return (
    <div className="w-full relative">
      {/* Custom Navigation Arrows */}
      <div
        ref={prevRef}
        className="swiper-button-prev !left-0 !text-black z-10"
      />
      <div
        ref={nextRef}
        className="swiper-button-next !right-0 !text-black z-10"
      />

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        autoplay={auto === "1" ? { delay: 3000, disableOnInteraction: false } : false}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        modules={[Navigation , Autoplay]}

      >
        {loading
          ? renderPlaceholders()
          : data.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="service-card">
                    <div className="service-content">
                      <div className="service-header-info">
                        <Image
                          src={
                            item.image
                              ? `${site}/pub/media/othersite/${item.image}`
                              : "/images/blog_1.webp"
                          }
                          alt={item.title ?? "Service image"}
                          className="service-image"
                          width={400}
                          height={300}
                        />
                      </div>
                      <div className="service-body-info">
                        <h3 className="service-h3">{item.title}</h3>
                        <p className="service-p">{item.caption}</p>
                        <a className="category-button" href={item.url??''}> Mehr </a>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
      </Swiper>
    </div>
  );
};

export default ServiceCardSlider;

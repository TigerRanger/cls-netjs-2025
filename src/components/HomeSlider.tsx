'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { SliderItem } from '@/lib/Interface/HomeInterface';

interface SliderProps {
  SliderItems: SliderItem[];
  site: string;
}

const HomeSlider: React.FC<SliderProps> = ({ SliderItems, site }) => {
  // Clone and sort the slider items by position (ascending)
  const sortedItems = [...SliderItems].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  return (
    <div className="slider-wrapper" id="home-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        loop={true}
        className="mySwiper"
      >
        {sortedItems.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slider-fixed">
              <Image
                src={`${site}/pub/media/slider/${slide.image}`}
                alt={slide.alt ?? 'slider item'}
                width={770}
                height={450}
                style={{ width: '100%', height: 'auto' }}
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;

"use client";

import React, { useRef } from "react";
import { Swiper as SwiperClass } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Pagination, Autoplay } from "swiper/modules";
import { ButtonCommon } from "@/components/Buttons";
import Link from "next/link";
import Image from "next/image";

import {  StoreInfo} from "@/lib/Interface/MenuInterface";

import { SliderItem } from "@/lib/Interface/HomeInterface";

import TwiterSvg from "../../public/images/twiter.svg";
import facebookSvg from "../../public/images/facebook.svg";
import LinkedInSvg from "../../public/images/linkedin.svg";

import HeroEmail from "../../public/images/email.svg";
import HeroAddress from "../../public/images/location.svg";
import HeroPhone from "../../public/images/phone.svg";

interface SliderProps {
  SliderItems: SliderItem[];
  StoreInfo: StoreInfo | undefined;
}
const MainSlider: React.FC<SliderProps> = ({ SliderItems:SliderItems , StoreInfo:StoreInfo}) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const site_url = process.env.MAGENTO_ENDPOINT_SITE + "/pub/media/slider/";
  return (
    <section className="ak-slider ak-slider-hero-1">
      <Swiper
        speed={1000}
        loop={true}
        slidesPerView={"auto"}
        parallax={true}
        pagination={{
          clickable: true,
          el: ".hero-swiper-pagination",
          renderBullet: (index, className) =>
            `<p class="${className}">${index + 1}</p>`,
        }}
        autoplay={{
          delay: 3000, // Adjust the delay for how long each slide is shown
          disableOnInteraction: false, // Autoplay continues after user interaction
        }}
        modules={[Parallax, Pagination, Autoplay]} // Include Autoplay in the modules
        onSwiper={(swiper) => {
          swiperRef.current = swiper; // Assign Swiper instance to the ref
        }}
      >
        {SliderItems.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="ak-hero ak-style1 slide-inner">
              <Image
                className="ak-hero-bg ak-bg object-cover"
                width={1920} // Use actual numbers
                height={630}
                src={site_url + item.image}
                alt={item.alt ?? "CLS Computer"}
                priority
              />
              <div className="container">
                <div className="hero-slider-info">
                  <div className="slider-info">
                    <div className="hero-title">
                      <h2 className="hero-main-title" data-swiper-parallax="300">
                        {item.title}
                      </h2>
                      <p className="mini-title" data-swiper-parallax="400">
                        {item.caption}
                      </p>
                    </div>
                    <div className="ak-height-45 ak-height-lg-30"></div>
                    <div data-swiper-parallax="300">
                      <ButtonCommon to={item.url ?? "#"}>Mehr Erfahren</ButtonCommon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Contact Info */}
      <div className="container-fluid">
        <div className="hero-contact-info">
              { StoreInfo?.store_support_email && (
                <div className="d-flex align-items-center gap-2">
                  <div className="heartbeat-icon blueglow">
                    <Image src={HeroEmail} alt="CLS Email" width={24} height={24} />
                  </div>
                  <p className="ak-font-15 ak-white-color ak-semi-bold">{StoreInfo?.store_support_email}</p>
                </div>
              )}
            <div className="d-flex align-items-center gap-2">
              <div className="heartbeat-icon blueglow">
                <Image src={HeroAddress} alt="CLS Address" width={24} height={24} />
              </div>
              <p className="ak-font-15 ak-white-color ak-semi-bold">
                {StoreInfo?.store_street_line1} , {StoreInfo?.store_postcode} {StoreInfo?.store_city} ,
                {StoreInfo?.store_country}
              </p>
            </div>
            { StoreInfo?.store_phone && (
          <div className="d-flex align-items-center gap-2">
            <div className="heartbeat-icon blueglow">
              <Image src={HeroPhone} alt="CLS Time" width={24} height={24} />
            </div>
            <p className="ak-font-15 ak-white-color ak-semi-bold">  {StoreInfo?.store_phone}</p>
           </div>
            )}
        </div>
      </div>
      {/* Pagination */}
      <div className="hero-pagination">
        <div className="hero-swiper-pagination"></div>
      </div>
      {/* Social Links */}
      <div className="social-hero">
      { StoreInfo?.twitter_X && (
        <Link href={`https://x.com/${StoreInfo?.twitter_X}`} className="social-icon1">
          <Image src={TwiterSvg} alt="CLS twitter icon" width={24} height={24} />
        </Link>
      )}
     { StoreInfo?.facebook && (
        <Link href={`https://www.facebook.com/${StoreInfo?.facebook}`} className="social-icon1">
          <Image src={facebookSvg} alt="CLS Facebook icon" width={24} height={24} />
        </Link>
      )}
      { StoreInfo?.linkedin && (
        <Link href={`hhttps://www.linkedin.com/${StoreInfo?.linkedin}`} className="social-icon1">
          <Image src={LinkedInSvg} alt="CLS LinkedIn icon" width={24} height={24} />
        </Link>
      )}
        <div className="social-horizontal"></div>
        <strong className="social-link">FOLLOW US</strong>
      </div>
    </section>
  );
};

export default MainSlider;

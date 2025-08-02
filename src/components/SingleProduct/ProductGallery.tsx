"use client"

import React, { useState } from "react";
import { MediaGalleryEntry } from "@/lib/Interface/SingleProductIInterface";
import Image from "next/image";


// Import Swiper styles and components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperCore } from "swiper/types";

// Import Lightbox
import Lightbox, { ViewCallbackProps } from "yet-another-react-lightbox";

import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";

interface ProductDetailsProps {
  gallery: MediaGalleryEntry[];
  magento:string;
}

const ProductGallery: React.FC<ProductDetailsProps> = ({ gallery , magento }) => {

  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null); // Store the Swiper instance
  const [activeIndex, setActiveIndex] = useState(0); // Track the active slide index
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // Lightbox visibility state

  const handleThumbnailClick = (index: number) => {
    if (swiperInstance && index !== activeIndex) {
      swiperInstance.slideTo(index); // Navigate to the corresponding slide only if necessary
    }
  };

  const handleMainImageClick = () => {
    setIsLightboxOpen(true); // Open the lightbox
  };

  // Callback for Lightbox's `view` property
  const handleLightboxView = (props: ViewCallbackProps) => {
    if (props.index !== undefined) {
      setActiveIndex(props.index); // Update the active index when a slide becomes active
    }
  };

  return (
    <>
      <div className="product-details-gallery">
        <div id="gal1" className="nz-gal">
          <div className="wrapper">
            {gallery.map((image, index) => (
              <a
                href="#"
                key={index}
                className={`item ${activeIndex === index ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  handleThumbnailClick(index); // Handle thumbnail click
                }}
              >
                <Image
                  className="nz-load"
                  src={magento+image.file}
                  data-src={magento+image.file}
                  width="140"
                  height="140"
                  alt={image.label?image.label:"GCTL"}
                />
              </a>
            ))}
          </div>
        </div>
        <div id="imageBOX" className="image_box">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            onSwiper={(swiper) => {
              if (swiperInstance !== swiper) {
                setSwiperInstance(swiper); // Set Swiper instance only once
              }
            }}
            onSlideChange={(swiper) => {
              const newIndex = swiper.activeIndex;
              if (activeIndex !== newIndex) {
                setActiveIndex(newIndex); // Update active index only if it changes
              }
            }}
          >
            {gallery.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                className="nz_image"
                  src={magento+image.file}
                  alt={image.label?image.label:"GCTL"}
                  height={400}
                  width={400}
                  onClick={handleMainImageClick} // Open lightbox on image click
                  style={{ cursor: "pointer" }} // Indicate clickable image
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* Lightbox for the gallery */}
      <Lightbox
        open={isLightboxOpen}
        plugins={[Zoom]}
        close={() => setIsLightboxOpen(false)} // Close the lightbox
        slides={gallery.map((image) => ({
          src: magento+image.file,
          alt: image.label?image.label:"GCTL",
        }))}
        index={activeIndex} // Start lightbox at active index
        on={{ view: handleLightboxView }} // Use the custom callback
      />
    </>
  );
};
export default ProductGallery;

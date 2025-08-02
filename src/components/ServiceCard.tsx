'use client';

import React, { useState } from "react";
import Image from "next/image";
import { OtherSiteItem } from "@/lib/Interface/HomeInterface";

interface BlogCardProps {
  OtherSiteItem: OtherSiteItem;
  site: string;
}

const ServiceCard: React.FC<BlogCardProps> = ({ OtherSiteItem, site }) => {
  const [isLoading, setIsLoading] = useState(true);

  const imageSrc = OtherSiteItem?.image
    ? `${site}/pub/media/othersite/${OtherSiteItem.image}`
    : "/images/blog_1.webp";

  const isExternalImage = typeof imageSrc === "string";

  return (
    <div className="col-md-4 col-sm-6 blog-col">
      <div className="service-card">
        <div className="service-content">
          <div className="service-header-info relative w-full h-[300px] overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            <Image
              src={imageSrc}
              alt={OtherSiteItem.title ?? "Service image"}
              width={400}
              height={300}
              className={`service-image transition-opacity duration-700 ease-in-out ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              placeholder={!isExternalImage ? "blur" : "empty"}
              blurDataURL={!isExternalImage ? "/images/blog_1.webp": undefined}
              onLoadingComplete={() => setIsLoading(false)}
            />
          </div>

          <div className="service-body-info mt-4">
            <h3 className="text-xl font-semibold">{OtherSiteItem.title}</h3>
            <p className="text-gray-600">{OtherSiteItem.caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

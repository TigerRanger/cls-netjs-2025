"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // ✅ Import Link
import { StoreConfig } from "@/lib/Interface/MenuInterface";

interface BrandingProps {
  storeConfig: StoreConfig | null;
}

const defaultLogo = {
  src: "/images/logo.png",
  alt: "GCTL Security Logo",
};

const Branding: React.FC<BrandingProps> = ({ storeConfig }) => {
  const logoSrc = storeConfig?.header_logo_src || defaultLogo.src;
  const logoAlt = storeConfig?.logo_alt || defaultLogo.alt;
  const logoWidth = storeConfig?.logo_width ? parseInt(storeConfig.logo_width) : 125;
  const logoHeight = storeConfig?.logo_height ? parseInt(storeConfig.logo_height) : 40;

  const currentPath = usePathname();

  return (
    <>
      {currentPath === "/" ? (
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          priority
        />
      ) : (
        <div className="ak-site_branding">
          <Link href="/" onClick={() => window.location.href = "/"} passHref>
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              priority
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default Branding;

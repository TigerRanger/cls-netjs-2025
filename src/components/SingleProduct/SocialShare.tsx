"use client";



import React, { useEffect, useState } from "react";

import Image from "next/image";

interface Props {
  productName: string;
}

const SocialShare = ({ productName }: Props) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const encodedURL = encodeURIComponent(url);
  const encodedName = encodeURIComponent(productName);

  return (
    <div className="product-share">
      <span>Share Product</span>
      <div className="share-links">
        <a href={`https://www.facebook.com/sharer.php?u=${encodedURL}`} target="_blank" rel="nofollow" className="share-facebook">
        <Image src="/social/facebook.svg" width={20} height={20} alt="Facebook" />
        </a>
        <a href={`https://twitter.com/intent/tweet?text=${encodedName}&url=${encodedURL}`} target="_blank" rel="nofollow" className="share-twitter">
        <Image src="/social/twitter.svg" width={20} height={20} alt="Twitter" />
        </a>
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedURL}&title=${encodedName}`} target="_blank" rel="nofollow" className="share-linkedin">
        <Image src="/social/linkedin.svg" width={20} height={20} alt="LinkedIn" />
        </a>
        <a href={`https://web.whatsapp.com/send?text=${encodedURL}`} target="_blank" rel="nofollow" className="share-whatsapp">
        <Image src="/social/whatsapp.svg" width={20} height={20} alt="WhatsApp" />
        </a>
        <a href={`mailto:?subject=${encodedName}&body=${encodedURL}`} target="_blank" rel="nofollow" className="share-email">
            <Image src="/social/email.svg" width={20} height={20} alt="Email" />
        </a>
      </div>
    </div>
  );
};

export default SocialShare;

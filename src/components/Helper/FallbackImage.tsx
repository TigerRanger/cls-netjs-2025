import Image from 'next/image';
import { useState } from 'react';

interface FallbackImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  width: number;
  height: number;
}

const FallbackImage: React.FC<FallbackImageProps> = ({ src, alt, fallbackSrc, width, height }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      loading='lazy'
      onError={() => setImgSrc(fallbackSrc)} // Fallback to default image
    />
  );
};

export default FallbackImage;

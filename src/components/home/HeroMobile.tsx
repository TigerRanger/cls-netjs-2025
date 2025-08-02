// components/HomeSlider.tsx
import React from 'react';
import Image from 'next/image';

import { SliderItem  } from '@/lib/Interface/HomeInterface';


interface SliderInterface {
  SliderItems: SliderItem[]
}


const HeroMobile : React.FC<SliderInterface> = ({ SliderItems }) => {

  const site_url =process.env.MAGENTO_ENDPOINT_SITE+'/pub/media/slider/';

  return (
    <>
  {SliderItems && SliderItems.length > 0 && (
    <div className='hero-wrapper'>
      <Image
        src={(site_url + (SliderItems[0].mobile_image ?? SliderItems[0].image ?? ''))}
        alt={SliderItems[0].alt ?? 'Gctl Security'}
        width={500}
        height={400}
        style={{ width: '100%', height: 'auto', margin: '0 auto' }}
        priority
      />
    </div>
  )}
    </>
  );
};

export default HeroMobile;

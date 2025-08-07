import React from 'react'
import HomeSliderComponent from '../HomeSlider'; // use Component avoid same name conflict

import  '@/sass/homeSlider.scss';
import { SliderItem  } from '@/lib/Interface/HomeInterface';
import { StoreInfo } from '@/lib/Interface/MenuInterface';

interface SliderInterface {
  SliderItems: SliderItem[],
  StoreInfo:StoreInfo| undefined,
}


const SliderSection: React.FC<SliderInterface> = ({ SliderItems , StoreInfo }) =>  {
  return (
        <section className="ak-slider ak-slider-hero-1">
                    <HomeSliderComponent SliderItems={SliderItems} StoreInfo={StoreInfo} />
       </section>
  )
}

export default SliderSection
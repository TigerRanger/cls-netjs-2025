import React  from 'react';

import CountDownTimer from "../Helper/CountDownTimer";

import ProductSlider from '../ProductSlider';

import { DailyOffer as Daily } from '@/lib/Interface/HomeInterface';
import style from "@/sass/daily.module.scss";



const breakpoints = {
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
    1280: { slidesPerView: 5 },
  };  


interface DailyPops{
  dailyData : Daily;
  site:string;
  phone?: string;
  auto:string;
}



const DailyOffer: React.FC<DailyPops> = ({dailyData , site , phone , auto}) => {

      let autoplay: boolean | { delay: number } = false;
      
      if(auto === '1'){
        autoplay = {
          delay: 3100 
        };
      }


       const dateOnly = dailyData?.daily_end_time.split(' ')[0];
       const endTimeInMs = new Date(dateOnly).getTime();
        const now = new Date().getTime();
        const distance = endTimeInMs - now;
        let show=true;
        if (distance < 0) {
          show=false;
        }

        
  return (
    <>
    <section className="daily-offer-section gray-block">
    <div className='container'>

                <div className={style['daily-offer']}>
                    <div className={style['daily-offer-head']}>
                        <div className={style.headline}>
                            <h2 className="category_heading">Daily Deals!!</h2>
                            <p>Grab the best deals of the day with our limited-time offers! These unbeatable discounts are only available for a short time.</p>
                        </div>
                        <CountDownTimer endTime={dateOnly} eday={false} />
                    </div>

                    <div className={show ? style['daily-offer-body'] : 'hidden_block'}>
                         {show ?
                        <ProductSlider
                          products={dailyData?.daily_offer_products}
                          autoplay={autoplay}
                          breakpoints={breakpoints}
                          magento={site ?? ""}
                          phone={phone ?? ''}
                        /> 
                          :
                          <div className='end_offer'> Offer is END</div>
                        }
                    </div>
                </div>
           </div>    
      </section>  

    </>
  )
}

export default DailyOffer;
import React  from 'react';

import CountDownTimer from "../Helper/CountDownTimer";

import ProductSlider from '../ProductSlider';

import { DailyOffer as Daily } from '@/lib/Interface/HomeInterface';
import style from "@/sass/daily.module.scss";



const breakpoints = {
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
    1280: { slidesPerView: 4 },
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
    <section className="daily-offer-section offer-block">
    <div className='container-fluid'>

                <div className={style['daily-offer']}>
                  
                        {( dailyData?.daily_offer_title &&
                            <h2 className="feature_heading" dangerouslySetInnerHTML={{ __html: dailyData?.daily_offer_title  }} />
                            )}
                         {( dailyData?.daily_offer_content &&
                            <p className= "feature_para" dangerouslySetInnerHTML={{ __html: dailyData.daily_offer_content }} />)}
                  
                        <CountDownTimer endTime={dateOnly} eday={false} />
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
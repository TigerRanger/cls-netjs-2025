import React from 'react';

import CountDownTimer from "../Helper/CountDownTimer";


import ProductSlider from '../ProductSlider';

import { WeeklyOffer as Weekly } from '@/lib/Interface/HomeInterface';

import style from "@/sass/weekly.module.scss";
import WeeklyBanner from './WeeklyBanner';



 const autoplay = {
   delay: 3100
 }

const breakpoints = {
    640: { slidesPerView: 2 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
    1280: { slidesPerView: 4 },
  };  

interface WeeklyPops{
  weeklyData : Weekly;
  mobile:boolean ;
  site:string;
  phone?: string;
  auto:string
}

const WeeklyOffer : React.FC<WeeklyPops> = ({weeklyData , mobile , site , phone , auto }) => {

        const endTimeInMs = new Date(weeklyData?.weekly_end_time).getTime();
        const now = new Date().getTime();
        const distance = endTimeInMs - now;
        let show=true;
        if (distance < 0) {
          show=false;
        }


  return (
    <>
    <section className={ style['weekly-offer-section']}>
      
    <div className='container'>
        <div className='row'>
            <div className={ mobile && weeklyData.show_weekly_banner ?  `col-lg-12 ${style['weekly-block']}` : `col-lg-9 ${style['weekly-block']}`}>
                <div className={style['weekly-offer']}>
                    <div className={style['weekly-offer-head']}>
                        <div className='headline'>
                           {( weeklyData?.weekly_offer_title &&
                            <h2 className="category_heading">Weekday Deals!!</h2>
                           )}
                            {( weeklyData?.weekly_offer_content &&
                            <p>Get your desired product from featured category</p>
                            )}
                        </div>
                        <CountDownTimer endTime={weeklyData.weekly_end_time} eday={true} />
                    </div>

                    <div className={style['weekly-offer-body']}>
                        {show ?
                        <ProductSlider
                          products={weeklyData?.weekly_offer_products}
                          autoplay={auto === "1" ? autoplay : false}
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
            {( !mobile && weeklyData.show_weekly_banner &&
             <div className={`col-lg-3 ${style['banner-block']}`}>
                    <div className={style['banner-image']}>
                        <WeeklyBanner content={weeklyData?.weekly_banner_block} />
                        {/* <img src="/banner/special.png" width={250} height={550} alt="Weekly Offer Banner" loading='lazy' /> */}
                    </div> 
             </div>    
            )}
        </div>
    </div>
    </section>  

    </>
  )
}

export default WeeklyOffer;
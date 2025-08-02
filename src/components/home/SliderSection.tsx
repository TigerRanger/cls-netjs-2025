import React from 'react'
import HomeSliderComponent from '../HomeSlider'; // use Component avoid same name conflict

import  '@/sass/homeSlider.scss';
import { SliderItem  } from '@/lib/Interface/HomeInterface';

import PageBuilder , {convertMagentoImage} from '@/lib/jslib/PageBuilder';


interface SliderInterface {
  SliderItems: SliderItem[],
  SideBanner: string,
  BannerBlock: string,
  showVmenu:string,
  site:string
}


const SliderSection: React.FC<SliderInterface> = ({ SliderItems , SideBanner ,BannerBlock, showVmenu , site }) =>  {
  return (
       <section className="Slider-section">
                 <div className="container">
                    <div className='row'>
                              {( showVmenu === '1' &&
                                   <div className="col-sm-2p"></div>
                              )} 
                            <div className={`${showVmenu === '1' ? 'col-sm-9p' : 'col-sm-12'} menuddp`}>
                                    <div className="row">
                                         <div className={`${SideBanner === '1' ? 'col-sm-9' : 'col-sm-12'} slid`} > 
                                                <HomeSliderComponent SliderItems={SliderItems} site={site} />
                                          </div>
                                         {( SideBanner === '1' &&
                                             <div className="col-sm-3 slid2" >
                                                  <div className="Banner-cv">
                                                       {/* // for two banner use ban1 , ban2 class div  */}
                                                                   <div
                                                                 dangerouslySetInnerHTML={{
                                                       __html: convertMagentoImage(PageBuilder.reove_css_tag(BannerBlock),  process.env.MAGENTO_ENDPOINT_SITE+'/'),
                                                     }}
                                                       />
                                                  </div> 
                                             </div>
                                         )}
                            </div>
                        </div>
                     </div>
                </div>
       </section>
  )
}

export default SliderSection
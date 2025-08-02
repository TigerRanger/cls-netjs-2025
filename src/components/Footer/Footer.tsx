import React from "react";
import { StoreConfig, StoreInfo } from "@/lib/Interface/MenuInterface";
import SubscribeForm from '../SubscribeForm';

import FacbookSvg from "../../../public/svg-icon/facebookicon.svg";
import LinkedInSvg from "../../../public/svg-icon/linkedinicon.svg";
import TwitterSvg from "../../../public/svg-icon/twittericon.svg";

import YouTubeSvg from "../../../public/svg-icon/youtube.svg";
import PintersetSvg from "../../../public/svg-icon/pinterest.svg";
import InstagramSvg from "../../../public/svg-icon/insta.svg";

import Image from 'next/image';

import Link from "next/link";


interface FooterLink {
  link_name: string;
  link: string;
}

interface FooterProps {
  Setting?: StoreConfig;
  StoreInfo?: StoreInfo;
}

const Footer: React.FC<FooterProps> = ({ Setting :Setting , StoreInfo:StoreInfo }) => {

   const firstData = Object.values(JSON.parse(StoreInfo?.footer_first_block_content || '{}')) as FooterLink[];
   const secondData = Object.values(JSON.parse(StoreInfo?.footer_second_block_content || '{}')) as FooterLink[];

  return (
    <footer className="page-footer">
        <div className="footer_top">
            <div className='container'>
                <div className="row"> 
                    <div className="col-md-6">
                      <SubscribeForm/>
                    </div>
                    <div className="col-md-6">
                          <div className="social-footer">
                              {StoreInfo?.facebook && (
                                <Link className='f-social-icon ' href={StoreInfo?.facebook} target="_blank" rel="noopener noreferrer">
                                  <span className='image_layer fb'>
                                    <Image src={FacbookSvg} width={20} height={20} alt="CLS Facebook" />
                                  </span>
                                </Link>
                              )}

                              {StoreInfo?.twitter_X && (
                                <Link className='f-social-icon ' href={StoreInfo?.twitter_X} target="_blank" rel="noopener noreferrer">
                                    <span className='image_layer  x'>
                                      <Image src={TwitterSvg} width={20} height={20} alt="CLS Facebook" />
                                      </span>
                                </Link>
                              )}

                              {StoreInfo?.youtube && (
                                <Link className='f-social-icon ' href={StoreInfo?.youtube} target="_blank" rel="noopener noreferrer">
                                    <span className='image_layer tube' >
                                      <Image src={YouTubeSvg} width={20} height={20} alt="CLS Facebook" />
                                      </span> 
                                </Link>
                              )}      

                              {StoreInfo?.instagram && (
                                <Link className='f-social-icon ' href={StoreInfo?.instagram} target="_blank" rel="noopener noreferrer">
                                    <span className='image_layer insta'>
                                      <Image src={InstagramSvg} width={20} height={20} alt="CLS Facebook" />
                                      </span>
                                </Link>
                              )}  

                              {StoreInfo?.linkedin && (
                                <Link className='f-social-icon ' href={StoreInfo?.linkedin} target="_blank" rel="noopener noreferrer">  
                                    <span className='image_layer linked'>
                                      <Image src={LinkedInSvg} width={20} height={20} alt="CLS Facebook" />
                                      </span> 
                                </Link>
                              )}
                              {StoreInfo?.pinterest && (
                                <Link className='f-social-icon ' href={StoreInfo?.pinterest} target="_blank" rel="noopener noreferrer">
                                    <span className='image_layer pinta'>
                                      <Image src={PintersetSvg} width={20} height={20} alt="CLS Facebook" />
                                      </span>       
                                </Link>
                              )}  

                          </div>
                    </div>
                </div>
            </div>  
        </div>
        <div className="footer_middle"> 
            <div className="container">
              <div className="row"> 
                <div className="col-xl-4">


                    <div className="Logo-foot">
                        {Setting?.header_logo_src ? (
                              <Image
                                  src={Setting.header_logo_src}
                                  alt={Setting?.logo_alt || "CLS Computer"}
                                  width={Setting?.logo_width ? parseInt(Setting.logo_width) : 182}
                                  height={Setting?.logo_height ? parseInt(Setting.logo_height) : 54}
                                  loading="lazy"
                              />
                          ) : (
                              <Image src="/images/logo.png" loading="lazy" alt="Gctl Security" width={182} height={54} />
                          )}
                    </div>
               
                    {StoreInfo?.company_info && (
                      <p className="desp">{StoreInfo?.company_info}</p>
                    )}

                    { (StoreInfo?.apple_store_link || StoreInfo?.play_store_link) && (
                      <div className="app-store">
                          {StoreInfo?.apple_store_link && (
                          <Link href={StoreInfo.apple_store_link} target="_blank" rel="noopener noreferrer">
                              <Image src="/svg-icon/app_store_badge.svg" loading="lazy" width={150} height={44} alt="apple store" />
                          </Link>
                          )}
                          {StoreInfo?.play_store_link && (
                          <Link href={StoreInfo.play_store_link} target="_blank" rel="noopener noreferrer">
                              <Image src="/svg-icon/google_play_badge.svg" loading="lazy" width={150} height={44} alt="google store" />
                          </Link>
                          )}
                      </div>
                    
                    )}
                </div>
                <div className="col-xl-8 foot-last"> 
                  <div className="row">
                        <div className="col-sm-6 col-md-4"> 
                        {StoreInfo?.footer_first_block_title && (
                          <div className="introduce-title">  {StoreInfo?.footer_first_block_title}</div>
                        )}


                          {firstData && (
                            <ul className="introduce-list">
                              {firstData.map((item, index) => (
                                <li key={index}> <Link    className="text-hover-animaiton menu-item white" href={item?.link}>{item?.link_name}</Link></li>
                              ))}
                            </ul> 
                          )}

                          </div>
                          <div className="col-sm-6 col-md-4"> 
                          {StoreInfo?.footer_second_block_title && (
                            <div className="introduce-title">  {StoreInfo?.footer_second_block_title}</div>
                          )}                            
                          {secondData && (
                            <ul className="introduce-list">
                              {secondData.map((item, index) => (
                                <li key={index}> <Link    className="text-hover-animaiton menu-item white" href={item?.link}>{item?.link_name}</Link></li>
                              ))}                          
                            </ul>
                          )}
                          </div>
                          <div className="col-sm-6 col-md-4"> 
                          <div className="introduce-title">Contact Us</div> 
                          
                          {StoreInfo?.company_address && (
                            <div className="store_address" dangerouslySetInnerHTML={{__html: StoreInfo?.company_address}}></div>
                          )}

                          {StoreInfo?.store_support_email && (
                              <p><strong>Email: </strong> {StoreInfo?.store_support_email}</p>
                          )}

                   {StoreInfo?.store_phone && (
                     <div className='footer-phone'>
                            <Link className='heartbeat-icon phone-icon' href={`tel:${StoreInfo.store_phone.replace(/[\s+\-]/g, "")}`}>
                            <span className="ak-heartbeat-btn">
                              <Image alt="CLS Compter Phone" loading="lazy" width={15} height={15} decoding="async" data-nimg="1" src="/svg-icon/phone.svg"/></span>
                            </Link>
                            <span className='p-number'>{StoreInfo.store_phone}</span> 
                     </div>
                   )}
                            
                  </div>
                  </div>
                </div>  
              </div>
            </div>
         </div> 
         <div className="bottom_foot">
              <div className="container">
                  <div className='row'>
                        <div className='col-md-6'>
                          <p className='copy-right'>
                              Copyright © 2017 gctlsecurity.com. All rights reserved.
                          </p>
                        </div>
                        <div className='col-md-6'>
                        <div className="design"> <Image src="/images/payment.png" width={164} height={20} alt="gctl payment" /> </div>
                        </div>
                  </div>
              </div>
          </div>
    </footer>    
  )
}


export default Footer
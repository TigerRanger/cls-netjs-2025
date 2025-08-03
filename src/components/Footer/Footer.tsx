import React from "react";
import { StoreConfig, StoreInfo } from "@/lib/Interface/MenuInterface";
import SubscribeForm from '../SubscribeForm';

import Image from 'next/image';
import Link from "next/link";


import FacbookSvg from "../../../public/svg-icon/facebookicon.svg";
import LinkedInSvg from "../../../public/svg-icon/linkedinicon.svg";
import TwitterSvg from "../../../public/svg-icon/twittericon.svg";

import YouTubeSvg from "../../../public/svg-icon/youtube.svg";
import PintersetSvg from "../../../public/svg-icon/pinterest.svg";
import InstagramSvg from "../../../public/svg-icon/insta.svg";


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
            <div className='container-fluid'>
                <div className="row"> 
                    <div className="col-md-6">
                        <div className="cs-newsletter__background-wrapper"> 
                            <Image className="cs-newsletter__discount-background" src="/background/newsletter_bg.jpg" width={1920} height={698} alt="cls computer" />
                        </div>  
                    </div>

                    <div className="col-md-6">
                      <div className="cs-newsletter__subscribe-wrapper">
                           <SubscribeForm/>
                      </div>
                    </div>

                </div>
            </div>  
        </div>
        <div className="footer_middle"> 
            <div className="container-fluid">
              <div className="row"> 

                       <div className="col-sm-6 col-md-4 col-lg-2"> 
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
                          <div className="col-sm-6 col-md-4 col-lg-2"> 
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


                       <div className="col-sm-6 col-md-4 col-lg-2"> 
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
                          <div className="col-sm-6 col-md-4 col-lg-2"> 
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

                          <div className="col-sm-6 col-md-4 col-lg-2"> 
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



                          <div className="col-sm-6 col-md-4 col-lg-2"> 
                          <div className="introduce-title">CLS Hotline</div> 
                                                    {StoreInfo?.store_phone && (
                            <div className='footer-phone'>
                                    <Link className='foot_phone' href={`tel:${StoreInfo.store_phone.replace(/[\s+\-]/g, "")}`}>
                                           <span className='p-number'>{StoreInfo.store_phone}</span> 
                                    </Link>
                                  
                            </div>
                          )}
                          
                          {StoreInfo?.company_address && (
                            <div className="store_address" dangerouslySetInnerHTML={{__html: StoreInfo?.company_address}}></div>
                          )}

                          {StoreInfo?.store_support_email && (
                              <p><strong>Email: </strong> {StoreInfo?.store_support_email}</p>
                          )}
                           
                  </div>
                  </div>
                </div>  
              </div>

         <div className="bottom_foot">
              <div className="container-fluid">
                  <div className='row'>
                        <div className='col-md-6'>

                         <p className="cs-page-bottom__text">Zahlungsarten</p>

                         <div className="method_image">
                            <Image src="/payment/icon-visa.svg" width={60} height={29} alt="visa" />
                            <Image src="/payment/icon-mastercard.svg" width={60} height={29} alt="mastercard" />
                            <Image src="/payment/icon-paypal.svg" width={95} height={40} alt="paypal" />
                            <Image src="/payment/icon-amazon.png" width={120} height={29} alt="AmazonPay" />
                            <Image src="/payment/icon-ratenkauf.png" width={60} height={29} alt="easycredit" />
                         </div>

                        </div>
                        <div className='col-md-6'>

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


                           <p className='copy-right'>


                            
                                 Copyright © 2025 cls-computer.de All rights reserved.
                          </p>

                        </div>
                  </div>
              </div>
          </div>
    </footer>    
  )
}


export default Footer
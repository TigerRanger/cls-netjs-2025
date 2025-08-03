"use client";

import React, { useState } from 'react';

import CartSvg from "../../../public/svg-icon/shopping-cart-icon.svg";
import SearchToogle from "../../../public/svg-icon/yellow-search.svg";
import Image from "next/image";

import MenuSvg from "../../../public/svg-icon/menu-toogle.svg";
import OfferIcon from "../../../public/svg-icon/gift.svg";
import HotlineIcon from "../../../public/svg-icon/hotline.svg";
import MenuIconBlack from "../../../public/svg-icon/menu_black.svg";
import ArrowDown from "../../../public/svg-icon/down-chevron_black.svg";

import {  MenuItem , StoreConfig , StoreInfo } from "@/lib/Interface/MenuInterface";
import Menu from './Menu';

import  Branding  from "@/components/header/Branding";
import TopSearch from './TopSearch';
import Link from 'next/link';

import Vertical_Menu from './Vertical_Menu';

import OffCanvasMenuCart from './OffCanvasMenuCart';

import LoginTop from './LoginTop';

interface HeaderProps{
  MenuItem: MenuItem[] | undefined;
  StoreConfig: StoreConfig | undefined;
  StoreInfo:StoreInfo | undefined;
}
const Header: React.FC<HeaderProps> = ({MenuItem, StoreConfig , StoreInfo}) => {

  let FinalMenu: MenuItem | null = MenuItem?.find(
    (items: MenuItem) => items.id === Number(StoreInfo?.top_mega_menu)
  ) || null;

  if(!FinalMenu) {
    FinalMenu = MenuItem?.find( (items: MenuItem) => items.id === StoreConfig?.root_category_id) || null;
  }
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

const openDrawer = () => {
    if (!isOpen) setIsOpen(true);
};


  return (
    <>
    <header>
        <section className="topbar">
            <div className="container">
                <div className='row top-row'>
                <div className='col-lg-6 col-md-12 '>
                        <div className="left-side">
                            <div className="logo">
                                <Branding storeConfig={StoreConfig ?? null} />
                            </div>  
                                <TopSearch categories = {MenuItem} rootCategory = {StoreConfig?.root_category_id !== undefined ? String(StoreConfig.root_category_id) : undefined} />
                        </div>
                </div>

                <div className='col-lg-6 col-md-12 '>
                <div className='right-side'>
                             {( StoreInfo?.store_phone &&
                                <div className='btn-top-toogle hotline-toogle'>      
                                    <Image src={HotlineIcon} alt="Offer toogle"  width={30} height={30} />
                                <div className='white-text'>
                                   <p className='big'>Hotline</p>
                                   <p className='small'>{StoreInfo.store_phone}</p>
                                </div>
                                 </div>
                                )}
                      {( StoreInfo?.enable_latest_offers &&
                        <Link href="/offers"> 
                            <div className='btn-top-toogle offer-toogle'>         
                            
                                <Image src={OfferIcon} alt="Offer toogle"  width={30} height={30} />
                                <div className='white-text'>
                                   <p className='big'>{StoreInfo.latest_offers_title}</p>
                                   <p className='small'>{StoreInfo.latest_offers_content}</p>
                                </div>
                            
                            </div>
                        </Link>
                        )}
                    <div className='btn-top-toogle search-toogle'>         
                           <Image src={SearchToogle} alt="search toogle"  width={30} height={30} />
                    </div>
                    <div className='btn-top-toogle cart-toogle' onClick={openDrawer}>         
                           <Image src={CartSvg} alt="cart toogle"  width={30} height={30} />

                        <OffCanvasMenuCart isOpen={isOpen} onClose={toggleDrawer} />  
                    </div>
                    <LoginTop/>
                         <div className='btn-top-toogle menu-toogle'>         
                                    <Image src={MenuSvg} alt="menu toogle"  width={30} height={30} />
                        </div>
                  </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="navbar nz-menu">
            <div className="container">
                <div className='row'>
                    {( StoreInfo?.secondary_menu &&
                        <div className="col-sm-2p"> 
                            <div className='v-menu'>
                                <div className="MenuHead">
                                    <div className="Headline">
                                    <Image src={MenuIconBlack} alt="All Category"  width={20} height={20} />
                                        All Categories </div>
                                        <Image src={ArrowDown} alt="All"  width={12} height={12} />    
                                </div>
                                 <div className="MenuBody">
                                       {MenuItem?.find((items: MenuItem) => items.id === Number(StoreInfo?.secondary_menu)) && (
                                         <Vertical_Menu MenuItem={MenuItem.find((items: MenuItem) => items.id === Number(StoreInfo?.secondary_menu))!} />
                                       )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`menuddp ${StoreInfo?.secondary_menu ? 'col-sm-9p' : 'col-sm-12'}`}>
                            {FinalMenu && <Menu MenuItem={FinalMenu} />}
                    </div>
 
                </div>
            </div>          
         </section>   
    </header>
    
</>
  )
}
export default Header
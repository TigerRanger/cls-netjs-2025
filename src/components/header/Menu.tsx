"use client";

import React, { useState } from 'react';
import {  MenuItem , StoreConfig , StoreInfo } from "@/lib/Interface/MenuInterface";
import Branding from './Branding';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import Login from './Login';

import OffCanvasMenuCart from './OffCanvasMenuCart'; 
import MegaMenu from './MegaMenu';

//import OffCanvasMenuCart from '@/components/global/OffCanvasMenuCart';


interface MenuProps {
  StoreConfig: StoreConfig | undefined;
  StoreInfo:StoreInfo | undefined;
  MenuItem: MenuItem [] | [];
}

const Menu: React.FC<MenuProps> = ({ StoreConfig, StoreInfo, MenuItem }) => {

  const currentPath = usePathname() || "/";
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const [navBar, setNavbar] = useState("");
  const [navlist, setNavList] = useState("");

  const navBarShow = () => {
    if (navBar == "") {
      setNavbar("ak-toggle_active");
    } else {
      setNavbar("");
    }

    if (navlist == "") {
      setNavList("ak-show-moblie-nav-list");
    } else {
      setNavList("");
    }
  };

  return (
    <>
      <div className="ak-main-header-left">

           {StoreConfig && <Branding storeConfig={StoreConfig} />} 

      </div>

      <div className="ak-main-header-center">
        <div className="ak-nav ak-medium">
         <ul id="ak-nav_list" className={`ak-nav_list ${navlist}`}>
             <MegaMenu Items={MenuItem} path = {currentPath} lavel = {1} /> 
          </ul>
          <div  onClick={() => navBarShow()}
                id="navBar"
                className={`ak-munu_toggle ${navBar}`}>
            <span></span>
          </div>
        </div>
      </div>

      <div className="ak-main-header-right">
        <div className="top-button-box">
           <div className="icon-container">
            <Image src="/images/search-icon.svg" alt="cls search" width={25} height={30} />
          </div>
           <Login/> 

          <div className="icon-container cart-box" onClick={toggleMenu}>
            <Image src="/images/cart-main.svg" alt="cls Cart" width={25} height={40} />
          </div> 
            <OffCanvasMenuCart isOpen={isMenuOpen} onClose={toggleMenu} /> 
  
        </div>
      </div>
    </>
  );
};

export default Menu;

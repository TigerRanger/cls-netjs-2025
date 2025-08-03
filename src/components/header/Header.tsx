"use client";

import React, { useState } from 'react';

import {  MenuItem , StoreConfig , StoreInfo } from "@/lib/Interface/MenuInterface";

import Menu from './Menu';



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
    <header className="ak-site_header ak-style1 ak-sticky_header ak-gescout_sticky ak-gescout_show">
      <div className="ak-main_header">
        <div className="container-fluid">
          <div className="ak-main_header_in">
              <Menu StoreConfig={StoreConfig} StoreInfo={StoreInfo} MenuItem={FinalMenu || []}    />
          </div>
        </div>
        <div className="nav-bar-border"></div>
      </div>
    </header>
    
</>
  )
}
export default Header
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import {  MenuItem } from "@/lib/Interface/MenuInterface"
import MegaMenu from './MegaMenu';
interface MenuPops{
  MenuItem: MenuItem;
 }

const Menu: React.FC<MenuPops> = ({MenuItem}) => {
     const currentPath = usePathname() || "/";
  return (
    <div className="menu-DD">
       <nav className="nav-bar">
         <ul className="nav-list">
          <MegaMenu Items={MenuItem.children} path = {currentPath} lavel = {1} />  
        </ul>
      </nav>
    </div>
  )
}

export default Menu
import React from 'react'

import {  MenuItem } from "@/lib/Interface/MenuInterface";

interface VMenuPops{
  MenuItem: MenuItem;
 }


const Vs_second_level: React.FC<VMenuPops> = ({MenuItem}) =>{

          const menuChildren = MenuItem.children; 


  return (
    <div className="Mega Sys-alpha">
        <div className="menuST">
                {menuChildren && menuChildren.length > 0 && (
                      <ul className="Pong">
                        {menuChildren.map((item, itemIndex) => (
                            <li key={itemIndex} > 
                                <a 
                                    href={`/${item.canonical_url}`} 
                                    className={`level_2`}
                                >
                                    {item.name}
                                </a>

                                    {item.children && item.children.length > 0 && (
                                      <>
                                            <div className="openerHolder">
                                                <div className="INC"></div>
                                                <div className="Opener"></div>
                                            </div>

                                            <div className="mg">
                                                <strong>{item.name}</strong>
                                                        <ul className=''>
                                                            {item.children.map((subItem, subItemIndex) => (
                                                                <li key={subItemIndex} > 
                                                                    <a 
                                                                        href={`/${subItem.canonical_url}`} 
                                                                        className={`level_3`}
                                                                    >
                                                                        {subItem.name}
                                                                    </a>
                                                                </li>                                
                                                            ))}


                                                        </ul>

                                            </div>


                                      </>
                                    )}


                            </li>                                
                        ))}
                    </ul>
                )}
        </div>
    </div>            
  )
}

export default Vs_second_level
import React from 'react';

import {  MenuItem } from "@/lib/Interface/MenuInterface";

import Vs_second_level from './Vs_second_level';

interface VMenuPops{
  MenuItem: MenuItem;
 }



const Vertical_Menu: React.FC<VMenuPops> = ({MenuItem}) => {

      const menuChildren = MenuItem.children;  

        return (
        <>
                {menuChildren && menuChildren.length > 0 && (
                    <ul >
                       {menuChildren.map((item, itemIndex) => (
                           <li key={itemIndex} > 

                                        {item.mega_icon && (
                                          <div className='iconHolder' dangerouslySetInnerHTML={{ __html: item.mega_icon }} />
                                        )}
                           
                               <a 
                                    href={`/${item.canonical_url}`} 
                                    className={`level_1`}
                                >
                                    <strong>{item.name}</strong>

                                         </a>

                                    {item.children && item.children.length > 0 && (
                                      <>
                                            <div className="openerHolder">
                                                <div className="INC"></div>
                                                <div className="Opener"></div>
                                            </div>

                                          <Vs_second_level MenuItem={item} />  

                                      </>
                                    )}

                           

                            </li>                                
                            ))}
                </ul>
                )}
        </>
  )
}

export default Vertical_Menu
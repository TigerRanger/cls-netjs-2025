import React from 'react';
import Image from 'next/image';
import SearchToogle from "../../../public/svg-icon/yellow-search.svg";


import {  MenuItem } from "@/lib/Interface/MenuInterface";


interface HeaderProps{
  categories: MenuItem[] | undefined;
  rootCategory:string | undefined;
 }

const TopSearch: React.FC<HeaderProps> = ({categories, rootCategory}) => {
    const topCategires = categories?.find((category) => category.id.toString() === rootCategory);
  return (
    <>
    <div className="search-bar">
          <select className="S_topcat" id="S_topcat" name="s_topcat" title="Alle Kategorien">
               <option value="0">All Category</option>
                {topCategires?.children.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
          </select>
               <input type="text" placeholder="Search..." />
                        <button type="button" className='btn s-button'>
                   <Image src={SearchToogle} alt="search toogle"  width={30} height={30} />
              </button>
     </div>
    </>
  )
}

export default TopSearch
// MegaChild.tsx

import React from 'react';
import { MenuItem } from "@/lib/Interface/MenuInterface";
import MenuHelper from '@/lib/jslib/MenuHelper';
import ChildMegaElement from './ChildMegaElement';


interface MPops {
    Item: MenuItem;
}

const MegaChild: React.FC<MPops> = ({ Item }) => {

    let col_setting = [4, 4];

    if(Item?.menutypecol!==null){
         col_setting = Item?.menutypecol.split(",").map(Number) || [4, 4];
    }
    
    const class_name = MenuHelper.getTrow(col_setting.length);
    const total_item = MenuHelper.getTotal(Item)-2;
  
   return (
        <div className="container-fluid">
            <div className='meg-wrapper'>
                <div className="row">
                    <ChildMegaElement
                        items={Item.children}
                        columnClassName={class_name}
                        total_item = {total_item}
                        count={col_setting.map(String)}
                    />
                </div>
            </div>
        </div>
    );
};

export default MegaChild;

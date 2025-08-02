import React, { useState, useEffect } from 'react';
import { MenuItem } from "@/lib/Interface/MenuInterface";
import MenuHelper, { MenuFinal } from '@/lib/jslib/MenuHelper';

interface ChildMegaElementProps {
    items: MenuItem[];
    columnClassName: string;
    count: string[];
    total_item: number;
    level?: number;
}

const ChildMegaElement: React.FC<ChildMegaElementProps> = ({
    items,
    columnClassName,
    count,
    total_item,
    level = 0,
}) => {
    // State to store the menu map
    const [menumap, setMenumap] = useState<{ [key: number]: MenuFinal[] }>({});

    // Load menu map after component mounts and when dependencies change
    useEffect(() => {
        const generatedMenuMap = MenuHelper.getMenuMap(items, level, count, total_item);
        setMenumap(generatedMenuMap);
    }, [items, level, count, total_item]); // Dependencies



    return (
        <>
            {/* Render the menu map only when it has items */}
            {Object.keys(menumap).length > 0 && 
                Object.keys(menumap).map((key) => {
                    const menuItems = menumap[parseInt(key)];
                    return (
                        <div key={key} className={columnClassName}>
                            {menuItems.map((item, itemIndex) => (
                                <a 
                                    href={`/${item.canonical_url}`} 
                                    key={itemIndex} 
                                    className={`level_${item.lavel}`}
                                >
                                    <strong>{item.name}</strong>
                                </a>
                            ))}
                        </div>
                    );
                })
            }
        </>
    );
};

export default ChildMegaElement;

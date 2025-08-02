import React, { useState } from "react";
import classNames from "classnames";
import { MenuItem } from "@/lib/Interface/MenuInterface";


type DropDownProps = {
  Items: MenuItem[]; // Assuming each child has a unique 'id'
  path: string;
  lavel: number;
};

const DropDown: React.FC<DropDownProps> = ({ Items, path, lavel }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (canonicalUrl: string) => {
    setOpenMenus((prevMenus) => ({
      ...prevMenus,
      [canonicalUrl]: !prevMenus[canonicalUrl],
    }));
  };

  return (
    <>
      {Items.map((item) => {
        const isActive = path === item.canonical_url;
        const isMenuOpen = openMenus[item.canonical_url];

        const showActive = classNames("ak-menu_dropdown_toggle", {
          active: isMenuOpen,
        });

        const showActiveParent = classNames("menu-item-has-children", {
          active: isMenuOpen,
        });

        return (
          <li
            key={item.canonical_url}
            className={`lvl-${lavel} nav-item ${
              item.children && item.children.length > 0 ? `dropdown ${showActiveParent}` : ""
            }`}
          >
            <a href={`/${item.canonical_url}`} title={item.name} className={`nav-link ${isActive ? "active" : ""} ${
                item.children && item.children.length > 0 ? "nav-pages-item" : ""
              }`}  >
              {item.name}
            </a>

            {item.children && item.children.length > 0 && (
              <>
                <ul className="dropdown-menu">
                  <DropDown Items={item.children} path={path} lavel={lavel + 1} />
                </ul>

                <span className={showActive} onClick={() => toggleMenu(item.canonical_url)}></span>
              </>
            )}
          </li>
        );
      })}
    </>
  );
};

export default DropDown;

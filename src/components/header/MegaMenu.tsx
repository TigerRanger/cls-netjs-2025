import React, { useState } from "react";
import classNames from "classnames";
import { MenuItem } from "@/lib/Interface/MenuInterface";


import DropDown from "./DropDown";
import MegaChild from "./MegaChild";

type MegaProps = {
  Items: MenuItem[] |undefined; // Assuming each child has a unique 'id'
  path: string;
  lavel: number;
};

const MegaMenu: React.FC<MegaProps> = ({ Items, path, lavel }) => {
  // State to manage visibility for each item
  const [visibleMenu, setVisibleMenu] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (canonicalUrl: string) => {
    setVisibleMenu((prev) => ({
      ...prev,
      [canonicalUrl]: !prev[canonicalUrl],
    }));
  };

  return (
    <>
      {Items && Items.map((item) => {
        const isActive = path === item.canonical_url;
        const isMenuOpen = visibleMenu[item.canonical_url];

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
              item.children && item.children.length > 0 ? `dropdown ` : ""
            } ${item.menutype === "Mega" ? "ak-mega_menu" : ""} ${item.name === "Sale" || item.name === "sale" ? "sale" : ""}`   }
          >
            <a
              href={`/${item.canonical_url}`}
              className={`nav-link ${isActive ? "active" : ""} ${
                item.children && item.children.length > 0 ? "nav-pages-item" : "" 
              } ${showActiveParent} `}
              title={item.name}
            >
              <span> {item.name}</span>
            </a>

            {item.children && item.children.length > 0 && (
              <>
                {item.menutype === "Mega" ? (
                  <>
                    <div className="ak-mega_wrapper">
                      <MegaChild Item={item} />
                    </div>
                    <span className={showActive} onClick={() => toggleMenu(item.canonical_url)}></span>
                  </>
                ) : (
                  <>
                    <ul className="dropdown-menu">
                      <DropDown Items={item.children} path={path} lavel={lavel + 1} />
                    </ul>
                    <span className={showActive} onClick={() => toggleMenu(item.canonical_url)}></span>
                  </>
                )}
              </>
            )}
          </li>
        );
      })}
    </>
  );
};

export default MegaMenu;

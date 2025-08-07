import { MenuItem } from "@/lib/Interface/MenuInterface";

export type MenuList = {
  id: number;
  name: string;
  url: string;
  canonical_url: string;
  type:string;
};

export type MenuFinal = {
  name: string;
  canonical_url: string;
  custom_link_enable: number;
  custom_link_text: string;
  include_in_menu: number;
  lavel: number;
  is_anchor: string | number;
  display_mode:string | null
};

export default class MenuHelper {
  // Initialize the data array to an empty array.
  private static data: MenuFinal[][] = [];

  private static current_item =0;

  private static current_index =0;

  private static j =0;

  private static MenuDta: MenuList[] = [];

  public static getTotal(item: MenuItem): number {
    let total = 2;
    if (Array.isArray(item.children)) {
        item.children.forEach(child => {
        total += this.getTotal(child); // Recursively add count of child items
        });
    }
    return total;
  }
  
  public static getTrow(col: number): string {

    if(col > 5) col = 5;
    if (col < 1) col = 1;
    switch (col) {
      case 1:
        return 'col-sm-12';
      case 2:
        return 'col-sm-12 col-md-6';
      case 3:
        return 'col-sm-6 col-md-4';
      case 4:
        return 'col-sm-6 col-md-3';
      case 5:
        return 'col-sm-6 col-lg-2p';
      default:
        return 'col-sm-12 col-md-6 col-lg-4';
    }
  }

  public static getMenuRouteList(Item: MenuItem[]): MenuList[] {
    // Process each MenuItem in the input array
    Item.forEach((menuItem) => {
      // Check if the item already exists in the MenuDta array based on `id`
      const isDuplicate = MenuHelper.MenuDta.some((existingItem) => existingItem.id === menuItem.id);
  
      if (!isDuplicate) {
        // Map MenuItem properties to MenuList properties
        const menuList: MenuList = {
          id: menuItem.id,
          name: menuItem.name,
          url: menuItem.url_key, // Adjust property names as needed
          canonical_url: menuItem.canonical_url, // Map canonical_url
          type: menuItem.menutype??'magento', // Map menutype
        };
        // Recursively process children if they exist
        if (menuItem.children && menuItem.children.length > 0) {
          MenuHelper.getMenuRouteList(menuItem.children);
        }
        // Add the processed item to the results array
        MenuHelper.MenuDta.push(menuList);
      }
    });
    return MenuHelper.MenuDta;
  }


  public static filter_head(data:string): string {
   const magentoEndpoint = process.env.MAGENTO_ENDPOINT ?? "";
   const updated = data.replace(/{{MEDIA_URL}}/g, magentoEndpoint + '/pub/media/')
   .replace(/{{base_url}}/g, magentoEndpoint);
   return updated;
  }

 public static getMenuMap(
    items: MenuItem[],
    level: number,
    colsetting: string[],
    total_item: number
  ): MenuFinal[][] {
    let currentIndex = 0;
    const currentColItems: MenuFinal[][] = Array(colsetting.length).fill(null).map(() => []);
    let itemCounter = 0;

    function distributeItems(itemList: MenuItem[], lvl: number) {
      for (const item of itemList) {
        if (item.include_in_menu === 1 && itemCounter < total_item) {
          // Determine which column to insert into
          const maxPerColumn = parseInt(colsetting[currentIndex] || "0");
          // Move to next column if limit reached
          if (currentColItems[currentIndex].length >= maxPerColumn && currentIndex < colsetting.length - 1) {
            currentIndex++;
          }
          currentColItems[currentIndex].push({
            name: item.name,
            canonical_url: item.canonical_url,
            custom_link_enable: item.custom_link_enable,
            custom_link_text: item.custom_link_text,
            include_in_menu: item.include_in_menu,
            is_anchor: item?.is_anchor ?? "0",
            lavel: lvl,
            display_mode: item?.display_mode ?? "CMS"
          });
          itemCounter++;
        }
        // Recurse into children
        if (Array.isArray(item.children) && item.children.length > 0) {
          distributeItems(item.children, lvl + 1);
        }
      }
    }
    distributeItems(items, level);
    return currentColItems;
  }
  public static getMenuRouteListById(categories: MenuItem[], targetId: string): MenuItem | null {
    for (const category of categories) {
      if (category.id.toString() === targetId) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const result = this.getMenuRouteListById(category.children, targetId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }
}


"use server"
import fs from 'fs/promises';
import path from 'path';
import { MenuData , MenuItem} from '@/lib/Interface/MenuInterface';


export async function getMenuData(): Promise<MenuData | null> {
  try {
    const dirPath = path.join(process.cwd(), 'data', '_cache');
    const filePath = path.join(dirPath, 'menuAllData.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading menuAllData.json:", error);
    return null;
  }
}


export async function getOnlyMenuData(): Promise<MenuItem[] | null> {
    let menuItems: MenuItem[] | null = null;

    try {
      const dirPath = path.join(process.cwd(), 'data', '_cache');
      // Read JSON file, not .ts file
      const filePath = path.join(dirPath, 'menuData.json'); 
      const fileContent = await fs.readFile(filePath, 'utf-8');
      menuItems = JSON.parse(fileContent);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
        return menuItems;
  }
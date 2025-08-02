"use server"
import fs from 'fs/promises';
import path from 'path';

export async function load_category(file: string) {
  try {
    const dirPath = path.join(process.cwd(), 'data', '_cache', 'cat');
    const filePath = path.join(dirPath, file + '.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error fetching category data:", error);
    return null;
  }
}

export async function check_cache(file: string) {
  try {
    const dirPath = path.join(process.cwd(), 'data', '_cache', 'product');
    const filePath = path.join(dirPath, file + '.json');
    try {
      await fs.access(filePath); // Check file exists
    } catch {
      return null;
    }
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}

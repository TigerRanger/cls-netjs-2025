"use server"
import fs from 'fs/promises';
import path from 'path';
import { HomeQueryResponse, PostsData } from '@/lib/Interface/HomeInterface';

export async function getHomeData(): Promise<HomeQueryResponse | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', '_cache', 'homeData.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading homeData.json:', error);
    return null;
  }
}

export async function getHomePost(): Promise<PostsData | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', '_cache', 'homeBlogData.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading homeBlogData.json:', error);
    return null;
  }
}

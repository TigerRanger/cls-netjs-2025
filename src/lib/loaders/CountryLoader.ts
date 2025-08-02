"use server"

import fs from 'fs/promises';
import path from 'path';

import { CountryQueryData } from "@/lib/Interface/CountryInterface";

export async function CountryLoader(): Promise<CountryQueryData | null> {
    try {
        const filePath = path.join(process.cwd(), 'data', '_cache', 'CountryData.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading CountryData.json:', error);
        return null;
    }
}



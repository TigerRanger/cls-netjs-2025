import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.security_api !== process.env.NEXTJS_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const folderPath = path.join(process.cwd(), 'data', '_cache', 'product');

      try {
        await fs.access(folderPath); // Check if folder exists
      } catch {
        // Folder doesn't exist, so create it
        await fs.mkdir(folderPath, { recursive: true });
         return NextResponse.json({ success: true, message: 'Folder Created ' });
      }


    await clearFolder(folderPath);

    return NextResponse.json({ success: true, message: 'Folder cleared' });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to clear folder';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ✅ Helper function with proper typing
async function clearFolder(folderPath: string): Promise<void> {
  const files = await fs.readdir(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stat = await fs.stat(filePath);

    if (stat.isFile()) {
      await fs.unlink(filePath);
    }
  }
}

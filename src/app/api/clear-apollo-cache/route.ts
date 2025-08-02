import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/Apollo/apolloClientToken';
import clientwp from '@/lib/Apollo/apolloClientWP';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.security_api !== process.env.NEXTJS_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await client.clearStore();   // Clears all cached data
    await clientwp.clearStore(); // Clears all cached data

    return NextResponse.json({ success: true, message: 'Apollo cache cleared.' });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to clear cache';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { optimizePostingTime } from '@/lib/ai-services';
import type { Platform } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, timezone } = body;

    if (!platform) {
      return NextResponse.json(
        { error: 'Missing required field: platform' },
        { status: 400 }
      );
    }

    const optimalTimes = await optimizePostingTime(
      platform as Platform,
      timezone || 'EST'
    );

    return NextResponse.json({
      success: true,
      data: optimalTimes,
    });
  } catch (error) {
    console.error('Scheduling optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize posting time' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { predictEngagement } from '@/lib/ai-services';
import type { Platform } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caption, platform, audienceSegment, brandVoiceProfile } = body;

    if (!caption || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields: caption and platform' },
        { status: 400 }
      );
    }

    const prediction = await predictEngagement(
      caption,
      platform as Platform,
      audienceSegment || 'general',
      brandVoiceProfile || [80, 75, 85, 70]
    );

    return NextResponse.json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.error('Engagement prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict engagement' },
      { status: 500 }
    );
  }
}

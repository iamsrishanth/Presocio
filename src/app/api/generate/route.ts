import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/ai-services';
import type { Platform, ContentTone } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      brandName,
      campaignObjective,
      targetAudience,
      tone,
      platform,
      keyMessages,
    } = body;

    if (!brandName || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields: brandName and platform' },
        { status: 400 }
      );
    }

    const content = await generateContent(
      brandName,
      campaignObjective || '',
      targetAudience || '',
      tone as ContentTone || 'professional',
      platform as Platform,
      keyMessages || []
    );

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

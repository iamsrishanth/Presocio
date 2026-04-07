import { NextResponse } from 'next/server';
import { generateCampaignPlan } from '@/lib/ai-services';
import type { CampaignBrief } from '@/types';

export async function POST(req: Request) {
  try {
    const brief: CampaignBrief = await req.json();

    if (!brief || !brief.brandName || !brief.platforms || !brief.campaignDuration) {
      return NextResponse.json(
        { success: false, error: 'Missing required campaign brief fields' },
        { status: 400 }
      );
    }

    const plans = await generateCampaignPlan(brief);

    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error('API Error (/api/plan):', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during plan generation' },
      { status: 500 }
    );
  }
}

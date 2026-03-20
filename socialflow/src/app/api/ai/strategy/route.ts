import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, totalPosts, totalLikes, totalComments, engagementRate, followers } = body;

        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            // Use Gemini API
            const prompt = `You are a social media strategist. Analyze this Instagram profile and provide a content strategy:

Username: @${username}
Total Posts: ${totalPosts}
Total Likes: ${totalLikes}
Total Comments: ${totalComments}
Engagement Rate: ${engagementRate}%
Followers: ${followers}

Provide specific, actionable advice in these 4 sections:

1. **Best Content Types to Post** — What formats (Reels, Carousels, Stories, etc.) would work best based on these metrics?

2. **Optimal Posting Times** — When should they post for maximum engagement?

3. **Audience Engagement Tips** — How to increase interaction with followers?

4. **Suggested Content Pillars** — 4-5 content categories they should focus on.

Be concise, practical, and data-driven. Use bullet points for readability.`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const strategy =
                data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate strategy.";
            return NextResponse.json({ strategy });
        }

        // Mock response if no API key
        await new Promise((r) => setTimeout(r, 1500));

        const strategy = `📊 **Best Content Types to Post**

• **Reels (Short-form Video)** — With your engagement rate of ${engagementRate}%, Reels will amplify reach by 3-5x. Focus on 15-30 second educational clips.
• **Carousel Posts** — Your comment rate suggests high save potential. Use carousels for listicles and step-by-step guides.
• **Stories with Polls/Quizzes** — Drive daily engagement with interactive story features. Aim for 5-7 story frames per day.
• **Collab Posts** — Partner with accounts in your niche to tap into new audiences.

⏰ **Optimal Posting Times**

• **Weekdays:** 7:00-9:00 AM & 6:00-8:00 PM (peak commute/wind-down hours)
• **Weekends:** 10:00 AM-12:00 PM (leisure browsing window)
• **Best Days:** Tuesday, Wednesday, and Thursday show highest engagement across similar accounts
• **Stories:** Post between 12:00-1:00 PM for maximum views

💡 **Audience Engagement Tips**

• Reply to every comment within the first hour — this signals the algorithm to boost your post
• Use 3-5 niche-specific hashtags instead of 30 generic ones
• End every caption with a question to encourage comments
• Create a weekly series (e.g., "Tip Tuesday") for habit-forming content
• Use the "Add Yours" sticker in Stories for viral participation

🎯 **Suggested Content Pillars**

1. **Educational Tips** (40%) — Quick tips, how-tos, and tutorials in your niche
2. **Behind the Scenes** (20%) — Show your process, workspace, and daily routines
3. **Community Stories** (20%) — User-generated content, testimonials, and shoutouts
4. **Trending/Cultural** (10%) — Hop on relevant trends with your unique spin
5. **Personal Brand** (10%) — Share your journey, values, and milestones`;

        return NextResponse.json({ strategy });
    } catch (error) {
        console.error("Strategy API error:", error);
        return NextResponse.json(
            { error: "Failed to generate content strategy" },
            { status: 500 }
        );
    }
}

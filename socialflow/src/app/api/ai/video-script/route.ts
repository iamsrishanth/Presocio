import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topic, audience, tone, duration } = body;

        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            const prompt = `You are an expert short-form video scriptwriter for social media (Instagram Reels, TikTok, YouTube Shorts).

Create a ${duration} video script with the following details:
- Topic/Hook: ${topic}
- Target Audience: ${audience}
- Tone: ${tone}

Return your response as a valid JSON object with this exact structure:
{
  "hook": "The opening hook (first 3-5 seconds to grab attention)",
  "body": "The main content of the video. Use line breaks for different sections.",
  "cta": "The call to action at the end",
  "onScreenText": ["Caption for scene 1", "Caption for scene 2", "Caption for scene 3", "Caption for scene 4"],
  "bRollSuggestions": ["Visual description 1", "Visual description 2", "Visual description 3", "Visual description 4"]
}

Make it engaging, concise, and tailored for the ${duration} format. The hook must stop the scroll. Only return the JSON, no additional text.`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            responseMimeType: "application/json",
                        },
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            // Parse JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const script = JSON.parse(jsonMatch[0]);
                return NextResponse.json(script);
            }
            throw new Error("Invalid response format");
        }

        // Mock response
        await new Promise((r) => setTimeout(r, 1500));

        const script = {
            hook: `"Stop scrolling — this is the ${topic.toLowerCase()} advice nobody's talking about." [Look directly at camera, energetic expression]`,
            body: `Here's the thing about ${topic.toLowerCase()} that most people get completely wrong...\n\nFirst, let's debunk the biggest myth: [Address the core misconception about the topic]\n\nInstead, here's what actually works:\n\n1. Start with [specific action step #1] — this alone can change everything\n2. Then focus on [specific action step #2] — most ${audience.toLowerCase()} skip this\n3. Finally, [specific action step #3] — this is the game-changer\n\nThe key difference? It's not about working harder, it's about working smarter. The best ${audience.toLowerCase()} already know this.`,
            cta: `Follow for more ${tone.toLowerCase()} content on ${topic.toLowerCase()}! 🔥 Save this for later and share with someone who needs to hear it. Drop a "🙌" in the comments if you agree!`,
            onScreenText: [
                `🛑 "${topic}" — The truth nobody tells you`,
                `Myth: [Common misconception about ${topic.toLowerCase()}]`,
                `✅ Step 1: [Key action for ${audience.toLowerCase()}]`,
                `✅ Step 2: Work smarter, not harder`,
                `✅ Step 3: The game-changer most miss`,
                `Follow for more ${tone.toLowerCase()} tips! 🚀`,
            ],
            bRollSuggestions: [
                `Close-up of someone engaging with ${topic.toLowerCase()} — shows immediate relevance`,
                `Screen recording or overhead shot demonstrating the process`,
                `Quick montage of before/after results or transformation`,
                `Text overlay animation with the key statistics or facts`,
                `Lifestyle shot of the target audience (${audience.toLowerCase()}) in their element`,
                `Trending transition effect to emphasize the key revelation moment`,
            ],
        };

        return NextResponse.json(script);
    } catch (error) {
        console.error("Video script API error:", error);
        return NextResponse.json(
            { error: "Failed to generate video script" },
            { status: 500 }
        );
    }
}

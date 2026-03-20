import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topic, numSlides, tone, audience } = body;

        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            const prompt = `You are an expert Instagram carousel content creator.

Create a ${numSlides}-slide carousel about: "${topic}"
- Target Audience: ${audience}
- Tone: ${tone}

Return your response as a valid JSON object with this exact structure:
{
  "slides": [
    {
      "slideNumber": 1,
      "headline": "Cover slide headline",
      "body": "Subtitle or teaser text",
      "isCover": true,
      "isCta": false
    },
    {
      "slideNumber": 2,
      "headline": "Slide headline",
      "body": "Main content text for this slide. Keep it concise and impactful.",
      "isCover": false,
      "isCta": false
    },
    ...more slides...,
    {
      "slideNumber": ${numSlides},
      "headline": "CTA headline",
      "body": "Clear call to action",
      "isCover": false,
      "isCta": true
    }
  ]
}

Guidelines:
- Slide 1 is always the cover with a compelling headline
- Last slide is always a CTA
- Each slide should be concise (headline: max 8 words, body: max 25 words)
- Make it visually scannable and engaging
- Include exactly ${numSlides} slides
- Only return the JSON, no additional text.`;

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

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const carousel = JSON.parse(jsonMatch[0]);
                return NextResponse.json(carousel);
            }
            throw new Error("Invalid response format");
        }

        // Mock response
        await new Promise((r) => setTimeout(r, 1500));

        const slideTemplates = [
            {
                headline: `${topic}`,
                body: `Everything ${audience.toLowerCase()} need to know — swipe to learn more →`,
                isCover: true,
                isCta: false,
            },
            {
                headline: "Start With Why",
                body: `Understanding the 'why' behind ${topic.toLowerCase()} is the foundation for lasting success.`,
                isCover: false,
                isCta: false,
            },
            {
                headline: "The Common Mistake",
                body: `Most ${audience.toLowerCase()} jump straight to tactics. Instead, build a solid strategy first.`,
                isCover: false,
                isCta: false,
            },
            {
                headline: "The Framework",
                body: "Use the 3-step framework: Research → Plan → Execute. Simple but powerful.",
                isCover: false,
                isCta: false,
            },
            {
                headline: "Pro Tip",
                body: "Consistency beats perfection. Show up daily, iterate weekly, and review monthly.",
                isCover: false,
                isCta: false,
            },
            {
                headline: "The Data Says...",
                body: "People who apply structured strategies see 3x better results within 90 days.",
                isCover: false,
                isCta: false,
            },
            {
                headline: "Take Action Today",
                body: "Pick ONE insight from this carousel and implement it this week. Small steps = big results.",
                isCover: false,
                isCta: false,
            },
            {
                headline: "Quick Checklist",
                body: "✅ Define your goal\n✅ Research your niche\n✅ Create a plan\n✅ Execute consistently",
                isCover: false,
                isCta: false,
            },
            {
                headline: "Bonus Insight",
                body: `The secret sauce? Community. Connect with other ${audience.toLowerCase()} and learn together.`,
                isCover: false,
                isCta: false,
            },
            {
                headline: "Found This Helpful? 🔥",
                body: "Follow for more content like this! Save this post & share it with someone who needs it 🚀",
                isCover: false,
                isCta: true,
            },
        ];

        const slides = [];
        // Always include cover (first)
        slides.push({ ...slideTemplates[0], slideNumber: 1 });
        // Fill middle slides
        for (let i = 1; i < numSlides - 1; i++) {
            const templateIndex = Math.min(i, slideTemplates.length - 2);
            slides.push({ ...slideTemplates[templateIndex], slideNumber: i + 1 });
        }
        // Always include CTA (last)
        slides.push({
            ...slideTemplates[slideTemplates.length - 1],
            slideNumber: numSlides,
        });

        return NextResponse.json({ slides });
    } catch (error) {
        console.error("Carousel API error:", error);
        return NextResponse.json(
            { error: "Failed to generate carousel content" },
            { status: 500 }
        );
    }
}

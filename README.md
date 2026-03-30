# Presocio

AI-powered social media automation platform. Generate, schedule, and publish content across Instagram, Facebook, LinkedIn, YouTube, and X from a single dashboard.

## Features

- **AI Content Generation** — Gemini-powered caption writing with engagement scoring, hashtag optimization, and brand voice matching
- **6-Stage Workflow** — Input → Planning → Generation → Approval → Scheduling → Posting
- **Cross-Platform Publishing** — Unified API via [Zernio](https://getlate.dev) supporting 14+ social platforms
- **Engagement Prediction** — ML-based scoring for hooks, CTAs, hashtags, and brand voice alignment
- **Optimal Scheduling** — Platform-specific posting time recommendations
- **Glassmorphism UI** — Dark theme with animated backgrounds and smooth Framer Motion transitions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 3.4 |
| State | Zustand (persisted to localStorage) |
| Animation | Framer Motion |
| UI Primitives | Radix UI |
| Icons | Lucide React |
| AI | Google Gemini 3.0 Flash |
| Social API | Zernio (free tier) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Required for AI content generation (optional — falls back to mock data)
GEMINI_API_KEY=your_gemini_key

# Required for real social media publishing (optional — falls back to demo mode)
ZERNIO_API_KEY=your_zernio_key
```

Both keys are optional. Without them, the app runs in demo mode with simulated AI content and publishing.

### Development

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # AI content generation endpoint
│   │   ├── schedule/route.ts    # Posting time optimization
│   │   ├── engage/route.ts      # Engagement prediction
│   │   └── social/route.ts      # Zernio social publishing
│   ├── globals.css               # Glassmorphism theme + animations
│   ├── layout.tsx                # Root layout with blob backgrounds
│   └── page.tsx                  # Main dashboard
├── components/
│   ├── content/
│   │   ├── InputForm.tsx         # Campaign brief collection
│   │   ├── PlanningStage.tsx     # Content calendar generation
│   │   ├── ContentGenerator.tsx  # AI content creation UI
│   │   ├── ApprovalStage.tsx     # Review with edit/approve/reject
│   │   ├── SchedulingStage.tsx   # Posting time selection
│   │   └── PostingStage.tsx      # Cross-platform publishing
│   ├── dashboard/
│   │   └── Dashboard.tsx         # Stats and platform cards
│   └── workflow/
│       └── Workflow.tsx          # 6-stage pipeline indicator
├── lib/
│   ├── ai-services.ts            # Gemini API + mock content
│   ├── social-api.ts             # Zernio API client
│   └── utils.ts                  # Helpers (cn, formatDate, etc.)
├── store/
│   └── index.ts                  # Zustand stores (workflow, UI, analytics)
└── types/
    └── index.ts                  # TypeScript definitions
```

## Workflow Stages

| Stage | Description |
|-------|-------------|
| **Input** | Collect brand name, objectives, target audience, tone, platforms |
| **Planning** | AI generates a content calendar with themes, formats, and pillars |
| **Generation** | Create post content with captions, hashtags, and image prompts |
| **Approval** | Review queue with inline editing, scoring, and approve/reject |
| **Scheduling** | Select optimal posting times per platform |
| **Posting** | Publish across all platforms via Zernio API |

## Platform Limits

| Platform | Caption | Hashtags | Rate Limit |
|----------|---------|----------|------------|
| Instagram | 2,200 | 30 | 200/hr |
| Facebook | 63,206 | 30 | 200/hr |
| LinkedIn | 3,000 | 5 | 100/day |
| YouTube | 5,000 | 500 chars | 10K quota/day |
| X | 280 | 30 | 1,500/mo |

## Social Publishing

Presocio uses [Zernio](https://getlate.dev) (formerly Late) for unified social media publishing.

**Free tier:** 20 posts/month, 2 social sets, 14 platforms, no credit card required.

To connect real social accounts:

1. Sign up at [getlate.dev](https://getlate.dev)
2. Create a profile and connect your social accounts via OAuth
3. Copy your API key from Settings → API Keys
4. Add `ZERNIO_API_KEY=sk_...` to `.env.local`
5. Restart the dev server

Without the key, publishing runs in demo mode with simulated results.

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Generate content with AI |
| `/api/schedule` | POST | Get optimal posting times |
| `/api/engage` | POST | Predict engagement scores |
| `/api/social` | POST | Publish via Zernio (actions: `publish`, `accounts`, `connect`) |

## License

ISC

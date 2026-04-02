# Presocio

Presocio is an AI-powered social media automation platform built to help teams move from campaign idea to cross-platform publishing in a single workflow. It combines campaign planning, content generation, approval, scheduling, and publishing for Instagram, Facebook, LinkedIn, YouTube, and X.

## Table of Contents

- [Why Presocio](#why-presocio)
- [Core Capabilities](#core-capabilities)
- [How the Workflow Works](#how-the-workflow-works)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Run the App](#run-the-app)
- [Configuration Notes](#configuration-notes)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Social Publishing with Zernio](#social-publishing-with-zernio)
- [Platform Constraints](#platform-constraints)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Scripts Reference](#scripts-reference)
- [Roadmap Ideas](#roadmap-ideas)
- [License](#license)

## Why Presocio

Managing social media at scale typically requires multiple disconnected tools for ideation, writing, approvals, timing, and posting. Presocio centralizes this lifecycle into one guided workflow so teams can:

- reduce context switching,
- keep campaign strategy and execution aligned,
- speed up content production,
- and maintain publishing consistency across channels.

## Core Capabilities

- **AI Content Generation**
  - Creates platform-aware captions, hashtag ideas, and creative direction.
  - Supports brand voice input to improve consistency.
  - Falls back to mock generation when API keys are not configured.

- **6-Stage Guided Workflow**
  - Input → Planning → Generation → Approval → Scheduling → Posting.
  - Structured progression reduces missed steps and improves team handoffs.

- **Engagement-Aware Suggestions**
  - Predictive scoring for content quality signals (hooks, CTA strength, relevance).

- **Cross-Platform Publishing**
  - Unified social publishing integration using Zernio.
  - Designed to support multi-account workflows and platform-specific constraints.

- **Modern UX**
  - Glassmorphism-inspired UI with smooth motion and responsive layout.

## How the Workflow Works

| Stage | Purpose | Typical Output |
|------|---------|----------------|
| **Input** | Capture campaign brief, goals, audience, tone, and platforms | Structured campaign context |
| **Planning** | Generate content strategy and posting plan | Calendar-style content plan |
| **Generation** | Produce post drafts and variations | Captions, hashtags, prompts |
| **Approval** | Review/edit and approve final drafts | Approved or revised posts |
| **Scheduling** | Suggest and select best posting windows | Scheduled publishing plan |
| **Posting** | Send content to social platforms | Published or queued posts |

## Architecture at a Glance

Presocio is implemented with Next.js App Router and a modular frontend/backend split:

- **Frontend:**
  - App Router pages + React components
  - Tailwind CSS styling
  - Framer Motion animations

- **State Layer:**
  - Zustand store with persisted workflow state (localStorage)

- **Backend/API Layer:**
  - Route handlers under `src/app/api/*`
  - AI generation and utility logic under `src/lib/*`
  - Social publishing integration through Zernio API client

## Tech Stack

| Layer | Technology |
|------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Motion/Animation | Framer Motion |
| UI Primitives | Radix UI |
| Icons | Lucide React |
| AI Integration | Gemini (with mock fallback) |
| Social Publishing | Zernio API |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional: enables real AI generation
GEMINI_API_KEY=your_gemini_api_key

# Optional: enables real publishing via Zernio
ZERNIO_API_KEY=your_zernio_api_key
```

If either key is missing, Presocio uses fallback/demo behavior where applicable.

### Run the App

```bash
npm run dev
```

Then open: <http://localhost:3000>

For production build checks:

```bash
npm run build
npm run start
```

## Configuration Notes

- **Demo-first behavior:** The app is designed to remain usable without external service keys.
- **Persistent workflow state:** Zustand persistence stores workflow progress in localStorage.
- **Platform-aware generation:** Content is adapted for caption lengths and posting norms.

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── engage/route.ts
│   │   ├── generate/route.ts
│   │   ├── schedule/route.ts
│   │   └── social/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── content/
│   ├── dashboard/
│   ├── ui/
│   └── workflow/
├── lib/
│   ├── ai-services.ts
│   ├── social-api.ts
│   └── utils.ts
├── store/
│   └── index.ts
└── types/
    └── index.ts
```

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | `POST` | Generates content drafts from campaign context |
| `/api/schedule` | `POST` | Returns posting-time recommendations |
| `/api/engage` | `POST` | Predicts engagement-related scoring |
| `/api/social` | `POST` | Executes social actions (`publish`, `accounts`, `connect`) |

## Social Publishing with Zernio

Presocio uses Zernio for unified social publishing across multiple platforms.

Typical setup flow:

1. Create a Zernio account.
2. Connect platform accounts via OAuth.
3. Generate an API key.
4. Add `ZERNIO_API_KEY` to `.env.local`.
5. Restart the application.

Without a valid key, posting routes can fall back to simulated/demo responses.

## Platform Constraints

| Platform | Caption Limit | Hashtags | Rate Limit |
|----------|---------------|----------|------------|
| Instagram | 2,200 | 30 | 200/hour |
| Facebook | 63,206 | 30 | 200/hour |
| LinkedIn | 3,000 | 5 | 100/day |
| YouTube | 5,000 | 500 characters | 10K quota/day |
| X | 280 | 30 | 1,500/month |

## Development Guidelines

- Use strict TypeScript typing and avoid `any` when possible.
- Keep shared interfaces/types in `src/types/index.ts`.
- Keep interactive components as client components (`'use client'`).
- Use utility helpers (for example, `cn`) for class composition.
- Prefer reusable UI patterns over one-off styling.

## Troubleshooting

- **`npm run dev` fails immediately**
  - Ensure Node.js version is 18+.
  - Reinstall dependencies with `npm install`.

- **AI output not generating**
  - Confirm `GEMINI_API_KEY` is set.
  - If not set, verify fallback/mock flow is expected.

- **Publishing fails**
  - Confirm `ZERNIO_API_KEY` is valid.
  - Check social account connections in Zernio.

- **State seems stale in browser**
  - Clear localStorage key associated with workflow persistence.

## Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start local development server |
| `npm run build` | Build production bundle |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint checks |
| `npm run typecheck` | Run TypeScript compiler checks |
| `npm test` | Run test command (placeholder/project-defined) |

## Roadmap Ideas

- Collaborative review comments and approval assignments
- Content versioning and rollback
- Calendar drag-and-drop scheduling experience
- Expanded analytics integration and historical performance learning
- Multi-workspace/team permission management

## License

ISC

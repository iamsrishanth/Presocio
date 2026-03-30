# Presocio - Agent Guidelines

## Project Overview

Presocio is an AI-powered social media automation platform built with Next.js 14, TypeScript, and Tailwind CSS. The application enables content generation, scheduling, and publishing across Instagram, Facebook, LinkedIn, YouTube, and X (Twitter) platforms.

## Build Commands

```bash
# Navigate to the project directory
cd PresocioApp

# Install dependencies
npm install

# Development
npm run dev          # Start Next.js dev server on localhost:3000
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking (tsc --noEmit)

# Testing
npm test             # Run tests (currently a placeholder)
```

## Project Structure

```
PresocioApp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (AI services, integrations)
│   │   ├── globals.css         # Global styles with glassmorphism theme
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx           # Main dashboard page
│   ├── components/
│   │   ├── content/            # Workflow stage components
│   │   │   ├── InputForm.tsx   # Campaign brief form
│   │   │   ├── PlanningStage.tsx
│   │   │   ├── ContentGenerator.tsx
│   │   │   ├── ApprovalStage.tsx
│   │   │   ├── SchedulingStage.tsx
│   │   │   └── PostingStage.tsx
│   │   ├── dashboard/          # Dashboard components
│   │   │   └── Dashboard.tsx   # Main dashboard with stats
│   │   ├── ui/                # Reusable UI components
│   │   └── workflow/          # Workflow visualization
│   │       └── Workflow.tsx    # 6-stage pipeline display
│   ├── store/                 # Zustand state management
│   │   └── index.ts           # Store definitions
│   ├── lib/                   # Utilities and services
│   │   ├── ai-services.ts     # AI content generation
│   │   └── utils.ts           # Helper functions
│   └── types/                 # TypeScript definitions
│       └── index.ts           # Core type definitions
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.js            # Next.js configuration
```

## Code Style Guidelines

### TypeScript Conventions

1. **Type Definitions**: Define all shared types in `src/types/index.ts`
2. **Strict Typing**: Use explicit types; avoid `any`
3. **Interface over Type**: Prefer interfaces for object shapes
4. **Generic Types**: Use generics for reusable components

```typescript
// Good
interface GeneratedPost {
  id: string;
  platform: Platform;
  caption: string;
  status: ApprovalStatus;
}

// Good - Generic utility
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Naming Conventions

| Entity | Convention | Example |
|--------|------------|---------|
| Components | PascalCase | `ContentGenerator.tsx` |
| Hooks | camelCase with `use` prefix | `useWorkflowStore` |
| Types/Interfaces | PascalCase | `PlatformLimits` |
| Enums | PascalCase | `WorkflowStage` |
| Variables | camelCase | `isGenerating` |
| Constants | SCREAMING_SNAKE | `PLATFORM_LIMITS` |
| Files | kebab-case | `ai-services.ts` |

### React Component Patterns

1. **Client Components**: Use `'use client'` directive for interactive components
2. **Server Components**: Default for pages; avoid client-side hooks
3. **Component Structure**:
   - Imports (external → internal → relative)
   - Type definitions
   - Component function
   - Export

```typescript
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Platform } from '@/types';

interface PlatformCardProps {
  platform: Platform;
  connected: boolean;
}

export function PlatformCard({ platform, connected }: PlatformCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div className={cn('card', connected && 'connected')}>
      {/* JSX content */}
    </motion.div>
  );
}
```

### Import Organization

Order imports alphabetically within groups:

```typescript
// 1. External dependencies
import { motion } from 'framer-motion';
import { useState } from 'react';

// 2. Internal packages (from @/*)
import type { Platform } from '@/types';
import { useWorkflowStore } from '@/store';

// 3. Relative imports
import { cn } from '@/lib/utils';
import { Workflow } from '@/components/workflow/Workflow';
```

### CSS/Tailwind Guidelines

1. **Glassmorphism Theme**: Use CSS variables defined in `globals.css`
2. **Component Classes**: Use `@apply` in `globals.css` for reusable patterns
3. **Custom Colors**: Use theme colors from `tailwind.config.ts`
4. **Responsive Design**: Mobile-first approach

```css
/* Custom utility classes in globals.css */
@layer components {
  .glass {
    @apply bg-card/70 backdrop-blur-xl border border-border/60;
  }

  .btn-primary {
    @apply px-4 py-2 rounded font-syne font-semibold text-sm transition-all duration-200;
    @apply bg-gradient-to-r from-accent2 to-accent text-white shadow-glow;
  }
}
```

### State Management (Zustand)

```typescript
// Store pattern
interface WorkflowState {
  currentStage: WorkflowStage;
  setCurrentStage: (stage: WorkflowStage) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set) => ({
      currentStage: 'input',
      setCurrentStage: (stage) => set({ currentStage: stage }),
    }),
    { name: 'presocio-workflow' }
  )
);
```

### Error Handling

1. **API Routes**: Return proper error responses with status codes
2. **Async Operations**: Use try/catch with graceful fallbacks
3. **User Feedback**: Show loading states and error messages via toast

```typescript
// API route error handling
export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Process data
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### AI Service Integration

The AI services layer (`src/lib/ai-services.ts`) handles:
- Content generation via Gemini API
- Engagement prediction scoring
- Posting time optimization
- Mock generation for demo mode

When integrating real AI services:
1. Check for API keys in environment variables
2. Provide graceful fallbacks to mock data
3. Handle rate limits and errors

## Workflow Stages

The application implements a 6-stage workflow pipeline:

1. **Input** - Campaign brief collection
2. **Planning** - AI-powered content calendar generation
3. **Generation** - Content creation with multiple variants
4. **Approval** - Team review with inline editing
5. **Scheduling** - Optimal posting time selection
6. **Posting** - Cross-platform publishing via Ayrshare API

## Platform Specifications

| Platform | Caption Limit | Hashtags | Rate Limit |
|----------|--------------|----------|------------|
| Instagram | 2,200 | 30 | 200/hr |
| Facebook | 63,206 | 30 | 200/hr |
| LinkedIn | 3,000 | 5 | 100/day |
| YouTube | 5,000 | 500 chars | 10K quota/day |
| X | 280 | 30 | 1,500/mo |

## Environment Variables

Create `.env.local` for sensitive configuration:

```env
GEMINI_API_KEY=your_api_key_here
ZERNIO_API_KEY=your_zernio_key
```

## Notes for Agents

- The glassmorphism design uses CSS variables from `globals.css`
- Zustand store persists to localStorage under `presocio-workflow` key
- Framer Motion is used for animations; prefer `motion` components over CSS animations
- All interactive components must be client components (`'use client'`)
- Use `cn()` utility for conditional class merging
- The project uses Radix UI primitives for accessible components

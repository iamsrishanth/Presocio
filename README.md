# Presocio 🚀

Presocio is an AI-powered social media management platform designed to help creators and businesses streamline their social media presence. 

## Features ✨

- **Analytics Dashboard**: Connect your Instagram account using the Instagram Graph API to view live engagement metrics and recent posts.
- **AI Content Strategy**: Generate comprehensive 30-day content strategies tailored to your brand using Google's Gemini AI.
- **AI Video Scripts**: Create engaging, platform-optimized video scripts for TikTok, Instagram Reels, and YouTube Shorts.
- **AI Carousels**: Automatically generate educational and engaging carousel posts with slide-by-slide copy.

## Getting Started 🛠️

### Prerequisites

- Node.js 18+
- npm or yarn
- An Instagram Creator/Business account linked to a Facebook Page (for live data)
- Google Gemini API Key (for AI features)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.local.example` or `.env` to `.env.local`
   - Add your `GEMINI_API_KEY`
   - Add your `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_ACCOUNT_ID` (Instructions provided in `.env.local`)
4. Run the development server:
   ```bash
   npm run dev
   ```

### Mock Data Mode
If you don't have an Instagram Access Token, Presocio will automatically fall back to using mock data so you can still explore the dashboard and analytics features.

## Tech Stack 💻

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API (@google/genai)
- **Social API**: Instagram Graph API

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Presocio - AI-Powered Social Media Automation',
  description: 'Automate social media content creation with AI. Generate, schedule, and publish across Instagram, Facebook, LinkedIn, YouTube, and X.',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🚀</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('presocio-theme');
                  if (theme) {
                    var parsed = JSON.parse(theme);
                    var mode = parsed.state ? parsed.state.theme : 'dark';
                    var resolved = mode;
                    if (mode === 'system') {
                      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    if (resolved === 'light') {
                      document.documentElement.classList.add('light');
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text antialiased">
        <div className="noise-overlay" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}

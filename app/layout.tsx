import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkedIn Content Engine",
  description: "Analyze LinkedIn profiles and generate winning content ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-full flex antialiased">
        {/* Sidebar Navigation */}
        <nav className="w-60 bg-slate-900 text-white p-8 border-r border-slate-700 fixed h-screen overflow-y-auto z-50">
          <div className="mb-8">
            <h1 className="text-lg font-bold -tracking-wider">Content Engine</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-medium">
              LinkedIn Assets
            </p>
          </div>

          {/* Main Navigation */}
          <div className="pb-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 mb-3">
              Materials
            </div>

            <a
              href="/linkedin-materials"
              className="block px-4 py-2 text-white text-sm font-medium rounded hover:bg-slate-800 transition-colors"
            >
              ▸ All Materials
            </a>

            <a
              href="/materials"
              className="block px-4 py-2 text-slate-300 text-sm font-normal rounded hover:bg-slate-800 hover:text-white transition-colors"
            >
              Design System
            </a>
          </div>

          {/* Quick Info */}
          <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-orange-500 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-500 mb-2">
              Design System
            </div>
            <p className="text-slate-300 text-xs leading-relaxed mb-2">
              Anthropic colors, typography, and spacing.
            </p>
            <a
              href="/design-tokens/DESIGN_PLAYBOOK.md"
              className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
            >
              View Playbook →
            </a>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 ml-60">
          {children}
        </main>
      </body>
    </html>
  );
}

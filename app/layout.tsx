import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Github } from "lucide-react"; // Import the icon

export const metadata: Metadata = {
  title: "Opaque",
  description: "Client-side 'images to PDF' converter",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className="font-mono bg-neutral-900 text-white min-h-screen">
        <header className="navbar bg-neutral-950 border-b flex justify-between border-gray-700 px-6 md:px-10 py-4 shadow-lg">
          <div className="border border-gray-600 border-dashed hover:border-secondary rounded-lg py-1 px-3 hover:text-white transition-colors text-secondary">
            <Link
              href="/"
              className="text-xl cursor-pointer font-bold tracking-tighter"
            >
              Opaque.pdf
            </Link>
          </div>

          {/* GitHub Icon Link */}
          <div className="flex-none">
            <Link
              href="https://github.com/ppriyankuu/opaque"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle text-secondary hover:bg-gray-800 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <Github size={24} />
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 md:px-8 py-8">{children}</main>
      </body>
    </html>
  );
}

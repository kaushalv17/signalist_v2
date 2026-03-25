import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Signalist',
    template: '%s | Signalist',
  },
  description:
    'Track real-time stock prices, get personalized alerts and explore detailed company insights.',
  keywords: ['stocks', 'market', 'investing', 'watchlist', 'alerts', 'trading'],
  openGraph: {
    title: 'Signalist',
    description: 'Real-time stock tracking and personalized market alerts.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}

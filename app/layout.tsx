import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'just fuck my shit up | QB House ranker',
  description: 'QB House Japan ranked by composite score. Highest = least likely to ruin your life. ¥1,350 per regret.',
  openGraph: {
    title: 'just fuck my shit up',
    description: 'QB House Japan ranked by composite score. ¥1,350 per regret.',
    url: 'https://jfmsu.vercel.app',
    siteName: 'just fuck my shit up',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'just fuck my shit up',
    description: 'QB House Japan ranked by composite score. ¥1,350 per regret.',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✂️</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-[#f2f2fa]">{children}<Analytics /></body>
    </html>
  );
}

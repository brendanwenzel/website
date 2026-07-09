import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.brendanwenzel.com'),
  title: {
    default: 'Brendan Wenzel · Director of Social Commerce',
    template: '%s · Brendan Wenzel',
  },
  description:
    'Brendan Wenzel — Director of Social Commerce. Media buying, social commerce, and the engineering to automate it. TikTok, Amazon, YouTube, Meta, Shopify.',
  openGraph: {
    type: 'website',
    siteName: 'Brendan Wenzel',
    url: 'https://www.brendanwenzel.com',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

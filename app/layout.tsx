import type { Metadata } from 'next';
import { Noto_Sans_JP, Space_Grotesk } from 'next/font/google';
import { StructuredData } from '@/components/structured-data';
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  socialLinks
} from '@/lib/site';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-sans-jp' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | Sacchan Token'
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  icons: { icon: '/logo.JPG', apple: '/logo.JPG' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' }
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: 'Small contributions. Massive impact.'
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Small contributions. Massive impact.',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE
  }
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Sacchan Token',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.JPG`,
      description: SITE_DESCRIPTION,
      sameAs: [socialLinks.twitter, socialLinks.telegram, socialLinks.discord]
    }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${notoSansJP.variable}`}>
      <body className={`${spaceGrotesk.variable} ${notoSansJP.variable} antialiased font-[family-name:var(--font-space-grotesk)]`}>
        <StructuredData data={structuredData} />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Noto_Sans_JP, Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-sans-jp' });

export const metadata: Metadata = {
  title: 'Sacchan Token (SAC)',
  description: 'A premium Web3 landing page inspired by the legendary Osaka dog Sacchan and the power of many small contributions.',
  metadataBase: new URL('https://sacchan-token.example'),
  openGraph: {
    title: 'Sacchan Token (SAC)',
    description: 'Small contributions. Massive impact.',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${notoSansJP.variable}`}>
      <body className={`${spaceGrotesk.variable} ${notoSansJP.variable} antialiased font-[family-name:var(--font-space-grotesk)]`}>{children}</body>
    </html>
  );
}

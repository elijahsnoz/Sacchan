// Central site config. Update the placeholders below and the values flow
// everywhere (metadata, sitemap, robots, JSON-LD, and the community CTAs).

// Production domain (no trailing slash).
export const SITE_URL = 'https://sacchan.com';

export const SITE_NAME = 'Sacchan Token (SAC)';

export const SITE_DESCRIPTION =
  'Sacchan Token (SAC) turns the true story of a legendary Osaka dog fed by a whole town into a premium Web3 community network — small contributions, massive collective impact.';

export const SITE_KEYWORDS = [
  'Sacchan Token',
  'SAC token',
  'Sacchan',
  'Osaka dog',
  'Web3 community token',
  'meme token',
  'community-driven crypto',
  'decentralized community'
];

// Community links. Handle is "SacchanCoin" across social.
export const socialLinks = {
  telegram: 'https://t.me/SacchanCoin',
  // Not shown in the UI right now. To re-enable: paste a real invite here, add a
  // Discord entry back to `communityChannels` in app/page.tsx, and add
  // socialLinks.discord back to `sameAs` in app/layout.tsx.
  discord: 'https://discord.gg/YOUR_INVITE',
  twitter: 'https://x.com/SacchanCoin'
};

// X/Twitter @handle (used for Twitter card attribution).
export const TWITTER_HANDLE = '@SacchanCoin';

// TODO: paste a serverless form endpoint to enable the waitlist form.
// e.g. Formspree: 'https://formspree.io/f/xxxxxxx'  (no backend/DB to run).
// Leave empty and the form renders a tasteful "opening soon" state instead.
export const WAITLIST_ENDPOINT = '';

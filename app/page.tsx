import { ArrowRight, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
import { AnimatedNetwork } from '@/components/animated-network';
import { Faq } from '@/components/faq';
import { FeatureGrid } from '@/components/feature-grid';
import { FeedSacchan } from '@/components/feed-sacchan';
import { Waitlist } from '@/components/waitlist';
import { Roadmap } from '@/components/roadmap';
import { SectionHeading } from '@/components/section-heading';
import { TelegramIcon, XIcon } from '@/components/social-icons';
import { StructuredData } from '@/components/structured-data';
import { StoryTimeline } from '@/components/timeline';
import { comparisonItems, faqs } from '@/lib/content';
import { socialLinks } from '@/lib/site';

const communityChannels = [
  {
    name: 'Telegram',
    handle: 'Join the daily chat',
    href: socialLinks.telegram,
    Icon: TelegramIcon,
    accent: 'hover:border-sac-blue/60 hover:bg-sac-blue/10'
  },
  {
    name: 'X / Twitter',
    handle: 'Follow the legend',
    href: socialLinks.twitter,
    Icon: XIcon,
    accent: 'hover:border-sac-gold/60 hover:bg-sac-gold/10'
  }
];

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer }
  }))
};

const tokenStats = [
  { label: 'Token Name', value: 'Sacchan Token' },
  { label: 'Symbol', value: 'SAC' },
  { label: 'Theme', value: 'Community-driven value' },
  { label: 'Identity', value: 'Legendary Osaka dog' }
];

const tokenSlices = [
  { label: 'Community', value: 34, color: 'from-sac-gold to-sac-cream' },
  { label: 'Rewards', value: 24, color: 'from-sac-blue to-sky-300' },
  { label: 'Treasury', value: 18, color: 'from-emerald-400 to-teal-300' },
  { label: 'Ecosystem', value: 24, color: 'from-violet-400 to-fuchsia-300' }
];

export default function HomePage() {
  return (
    <main className="relative">
      <AnimatedNetwork />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 sm:px-8 lg:px-12">
        <header className="mb-20 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-full border border-sac-gold/30 bg-black/40">
              <Image src="/logo.JPG" alt="Sacchan mascot and SAC token logo" width={44} height={44} className="h-full w-full object-cover" priority />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-sac-blue">Sacchan Token</p>
              <p className="text-sm text-slate-300">The Town That Feeds Sacchan</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <a className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-sac-gold/50 hover:text-white" href="#legend">Story</a>
            <a className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-sac-gold/50 hover:text-white" href="#tokenomics">Tokenomics</a>
            <a className="rounded-full bg-sac-gold px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110" href="#community">Join Community</a>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sac-gold/20 bg-sac-gold/10 px-4 py-2 text-sm text-sac-cream">
              <Sparkles className="h-4 w-4" />
              Inspired by a true story of collective generosity
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span className="block">Sacchan Token</span>
                <span className="sac-gradient-text block">Small Contributions. Massive Impact.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Inspired by the legendary dog who proved that thousands of small contributions can create extraordinary value. SAC turns the spirit of a beloved Osaka icon into a premium Web3 community network.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-sac-cream px-6 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-white">
                Read Whitepaper
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#community" className="inline-flex items-center justify-center gap-2 rounded-full border border-sac-blue/30 bg-sac-blue/10 px-6 py-3 font-semibold text-sac-cream transition hover:-translate-y-0.5 hover:border-sac-blue/60 hover:bg-sac-blue/20">
                Join Community
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tokenStats.map((stat) => (
                <div key={stat.label} className="sac-panel p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="sac-panel relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(215,181,109,0.18),transparent_45%)]" />
              <div className="relative rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
                <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                  <span>The Sacchan Story</span>
                  <span className="text-sac-gold">SAC / Osaka</span>
                </div>
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
                  <video
                    controls
                    playsInline
                    preload="none"
                    poster="/sacchan-story-poster.jpg"
                    className="aspect-[662/496] w-full object-cover"
                  >
                    <source src="/sacchan-story.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-full border border-sac-gold/25 bg-slate-950/85 px-5 py-3">
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-sac-gold/25">
                    <Image src="/logo.JPG" alt="SAC logo" width={32} height={32} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-sm font-medium text-white">Collective value flows here</span>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  How a whole town quietly fed one dog — the true story behind Sacchan.{' '}
                  <a
                    href="https://x.com/DoctorLemma/status/2017449510155280872"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sac-gold underline-offset-2 hover:underline"
                  >
                    Source: @DoctorLemma
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="legend" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="The Legend of Sacchan" title="A town-sized story of generosity" description="An owner, a reporter, train workers, shopkeepers, neighbors, and strangers all became part of one decentralized care network." />
        <div className="mt-12"><StoryTimeline /></div>
        <div className="sac-panel mt-8 overflow-hidden p-6">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
            <span>Animated Osaka Route Map</span>
            <span className="text-sac-gold">Route visualization</span>
          </div>
          <div className="relative h-72 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07111f]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,167,255,0.15),transparent_30%),radial-gradient(circle_at_30%_70%,rgba(215,181,109,0.12),transparent_25%)]" />
            <svg viewBox="0 0 1200 420" className="absolute inset-0 h-full w-full">
              <path d="M90 110 C200 70, 260 180, 370 150 S560 90, 640 180 S820 270, 940 140 S1070 80, 1120 210" fill="none" stroke="rgba(245,234,215,0.55)" strokeWidth="4" strokeDasharray="20 14" className="animate-routeLine" />
              {[
                [120, 120],
                [260, 150],
                [420, 160],
                [590, 180],
                [760, 230],
                [930, 150],
                [1080, 200]
              ].map(([x, y], index) => (
                <g key={`${x}-${y}`}>
                  <circle cx={x} cy={y} r="16" fill="rgba(99,167,255,0.16)" stroke="rgba(215,181,109,0.6)" strokeWidth="2" />
                  <circle cx={x} cy={y} r="6" fill="#f5ead7" />
                  <text x={x} y={y + 34} textAnchor="middle" fontSize="14" fill="rgba(245,234,215,0.8)">{index + 1}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="From Story to Blockchain" title="A visual comparison of shared growth" description="Sacchan’s town and the SAC network are built on the same logic: many contributors, shared incentives, and no central gatekeeper." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="sac-panel p-6">
            <div className="mb-6 flex items-center gap-3 text-sac-cream"><Users className="h-5 w-5" /><h3 className="text-xl font-semibold">Sacchan&apos;s Town</h3></div>
            <div className="space-y-4">
              {comparisonItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-sac-gold">{item.label}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.left}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="sac-panel p-6">
            <div className="mb-6 flex items-center gap-3 text-sac-blue"><ShieldCheck className="h-5 w-5" /><h3 className="text-xl font-semibold">Sacchan Token</h3></div>
            <div className="space-y-4">
              {comparisonItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-sac-blue">{item.label}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.right}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Why SAC Exists" title="Blockchain can mirror the spirit of the legend" description="A token can encode the same principles of contribution, transparency, and shared ownership that made Sacchan a townwide phenomenon." />
        <div className="mt-12"><FeatureGrid /></div>
      </section>

      <section id="tokenomics" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Tokenomics" title="Designed for a community-first economy" description="This layout uses future-proof allocation placeholders so the token model can evolve without breaking the brand system." />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="sac-panel p-6">
            <div className="space-y-4">
              {tokenSlices.map((slice) => (
                <div key={slice.label}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <span>{slice.label}</span>
                    <span>{slice.value}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/8">
                    <div className={`h-full rounded-full bg-gradient-to-r ${slice.color}`} style={{ width: `${slice.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sac-panel p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sac-gold">Sacchan Token</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">SAC allocation preview</h3>
              </div>
              <div className="rounded-full border border-sac-gold/20 bg-sac-gold/10 px-4 py-2 text-sm text-sac-cream">Future-ready</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-[conic-gradient(from_180deg,#d7b56d_0_34%,#63a7ff_34%_58%,#44d19d_58%_76%,#b28dff_76%_100%)] shadow-glow">
                <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-slate-950/95 text-center">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-sac-cream">SAC</p>
                    <p className="mt-2 text-lg font-semibold text-white">Community-first</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Roadmap" title="Built in phases, like a growing neighborhood" description="The roadmap mirrors the way Sacchan’s legend spread: one visit at a time, one contributor at a time, until the whole town was part of the story." />
        <div className="mt-12"><Roadmap /></div>
      </section>

      <section id="community" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Community" title="The town that feeds Sacchan" description="Members are not spectators. They are contributors, caretakers, advocates, and governors of the ecosystem." />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="sac-panel p-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-sac-gold/25 bg-sac-gold/10">
                <Image src="/logo.JPG" alt="Sacchan community mascot" width={64} height={64} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-sac-gold">Community Identity</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">The Town That Feeds Sacchan</h3>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">Just as Sacchan grew through countless small acts of generosity, the SAC ecosystem grows through participation, shared ownership, and collective support systems.</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
              {['Contributors', 'Supporters', 'Builders', 'Governors', 'Collectors', 'Local legends'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{item}</span>
              ))}
            </div>
          </div>
          <div className="sac-panel flex flex-col justify-between gap-6 p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sac-blue">Join the collective</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Find your channel</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">Every contribution matters and every supporter leaves a visible footprint. Pick where you want to show up.</p>
            </div>
            <div className="flex flex-col gap-3">
              {communityChannels.map(({ name, handle, href, Icon, accent }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition ${accent}`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-sac-cream">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-white">{name}</span>
                    <span className="block text-xs text-slate-400">{handle}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
                </a>
              ))}
            </div>
            <div className="flex gap-3">
              <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="rounded-full bg-sac-cream px-5 py-3 text-sm font-semibold text-slate-950">Read Whitepaper</a>
              <a href="#faq" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white">Explore FAQ</a>
            </div>
          </div>
        </div>
      </section>

      <section id="feed" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Take part" title="Feed the legend, join the town" description="Two small acts: add a meal to Sacchan’s bowl, and leave your mark so we can tell you when SAC goes live." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <FeedSacchan />
          <Waitlist />
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <StructuredData data={faqStructuredData} />
        <SectionHeading eyebrow="FAQ" title="Answers for first-time visitors" description="A clear explanation of the story, the token, and the connection between legend and Web3 utility." />
        <div className="mt-12"><Faq /></div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 pb-16 pt-8 sm:px-8 lg:px-12">
        <div className="sac-panel flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-300">Sacchan Token (SAC) - premium community-driven Web3 identity.</p>
          <p className="text-xs uppercase tracking-[0.35em] text-sac-gold">Powered by community</p>
        </div>
      </footer>
    </main>
  );
}

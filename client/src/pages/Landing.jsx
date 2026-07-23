import { Sparkles, Palette, Image as ImageIcon, Layers, ChevronDown, Camera, Briefcase, Users, MessageCircle } from 'lucide-react';
import Button from '../components/Button';
import TiltCard from '../components/TiltCard';
import HeroScene from '../components/HeroScene';
import OrbitNodes from '../components/OrbitNodes';

const FEATURES = [
  {
    icon: Palette,
    title: 'Build your brand kit',
    description: 'Set your colors, fonts, logo, and tone of voice once — every design after that stays on-brand automatically.',
  },
  {
    icon: Sparkles,
    title: 'Generate with AI',
    description: 'Describe your post in plain English and get a polished, on-brand image back in seconds.',
  },
  {
    icon: Layers,
    title: 'Every platform, right size',
    description: 'Instagram, LinkedIn, Facebook, and Twitter — sized and styled correctly, every time.',
  },
  {
    icon: ImageIcon,
    title: 'Your gallery, organized',
    description: "Every design you generate is saved and searchable, so nothing you've made ever gets lost.",
  },
];

const STEPS = [
  { title: 'Create a brand kit', description: 'Set your colors, fonts, and tone of voice — it takes about two minutes.' },
  { title: 'Describe your post', description: 'A sale, a launch, an announcement — just type what you need.' },
  { title: 'Download & post', description: 'Get a platform-ready design in under 20 seconds.' },
];

const PLATFORMS = [
  { icon: Camera, label: 'Instagram' },
  { icon: Briefcase, label: 'LinkedIn' },
  { icon: Users, label: 'Facebook' },
  { icon: MessageCircle, label: 'Twitter' },
];

export default function Landing({ onGetStarted, onLogin }) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-surface-container-low/80 border-b border-surface-variant">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1">
              <img src="/logo-icon.png" alt="" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold">BrandForge</span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-sm text-on-surface-variant">
            <a href="#features" className="hover:text-on-background transition-colors duration-150">Features</a>
            <a href="#how-it-works" className="hover:text-on-background transition-colors duration-150">How it works</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" radius="full" size="sm" onClick={onLogin}>Log in</Button>
            <Button radius="full" size="sm" onClick={onGetStarted}>Get Started</Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden mx-3 mt-3 md:mx-6 md:mt-5 rounded-[2rem] md:rounded-[2.5rem] border border-surface-variant bg-surface-container-low">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[40rem] h-[40rem] rounded-full bg-primary-container/15 blur-[100px]" />
        </div>
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-container/25 blur-3xl motion-safe:animate-[blob-float_20s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute top-32 -right-24 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl motion-safe:animate-[blob-float_24s_ease-in-out_infinite]" />

        <div className="relative">
          <div className="relative max-w-6xl mx-auto px-5 pt-14 pb-14 md:pt-20 md:pb-16 grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary-container/20 text-primary border border-primary-container/30 mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                AI-powered brand design
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-4">
                On-brand social posts,
                <br className="hidden md:block" />
                <span className="text-on-surface-variant"> generated in seconds.</span>
              </h1>
              <p className="text-base md:text-lg text-on-surface-variant max-w-md mx-auto md:mx-0 mb-8">
                Set up your brand once. Describe what you need. BrandForge generates a polished, on-brand design for any platform — no design skills required.
              </p>
              <div className="flex flex-col items-center md:items-start gap-4">
                <Button
                  size="lg"
                  radius="full"
                  onClick={onGetStarted}
                  className="shadow-[0_0_50px_-10px_var(--color-primary-container)] hover:shadow-[0_0_60px_-8px_var(--color-primary-container)]"
                >
                  Get Started Free
                </Button>
                <button
                  type="button"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-background transition-colors duration-150"
                >
                  See how it works
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative h-[340px] md:h-[440px] -mx-5 md:mx-0">
              <div className="absolute inset-0" aria-hidden="true">
                <HeroScene />
              </div>
              <OrbitNodes />
            </div>
          </div>

          <div className="hidden md:flex absolute bottom-4 left-8 items-center gap-2 text-xs text-on-surface-variant">
            <span className="w-7 h-7 rounded-full border border-surface-variant flex items-center justify-center motion-safe:animate-bounce">
              <ChevronDown className="w-3.5 h-3.5" />
            </span>
            Scroll to explore
          </div>
        </div>

        <div className="relative border-t border-surface-variant/60">
          <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Designed for</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 opacity-80">
              {PLATFORMS.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-3">Everything you need to stay on-brand</h2>
          <p className="text-on-surface-variant">From brand kit to finished post, without the back-and-forth with a designer.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <TiltCard
              key={title}
              className="bg-surface-container-low rounded-2xl border border-surface-variant p-6 hover:border-primary-container/50"
            >
              <div className="w-11 h-11 rounded-xl bg-primary-container flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-on-primary-container" />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-on-surface-variant">{description}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-surface-container-low/50 border-y border-surface-variant">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-3">Three steps to your next post</h2>
            <p className="text-on-surface-variant">No templates to hunt through, no design software to learn.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container font-semibold flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-1.5">{step.title}</h3>
                <p className="text-sm text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-primary-container/30 bg-surface-container-low px-6 py-16 text-center">
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-primary-container/25 blur-3xl motion-safe:animate-[blob-float_18s_ease-in-out_infinite]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to create on-brand content in seconds?</h2>
            <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
              Set up your first brand kit and generate your first design in the next two minutes.
            </p>
            <Button
              size="lg"
              radius="full"
              onClick={onGetStarted}
              className="shadow-[0_0_50px_-10px_var(--color-primary-container)] hover:shadow-[0_0_60px_-8px_var(--color-primary-container)]"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-surface-variant">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center p-0.5">
              <img src="/logo-icon.png" alt="" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-medium">BrandForge</span>
          </div>
          <p className="text-xs text-on-surface-variant">&copy; {new Date().getFullYear()} BrandForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Check, Menu, X, Star, Zap, Brain, Shield, MessageSquare } from 'lucide-react';

/* ─── HEADER ─────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="size-8 bg-white rounded-lg flex items-center justify-center">
            <MessageSquare className="size-4 text-zinc-950" strokeWidth={1.5} />
          </div>
          <span className="font-semibold text-white tracking-tight">AI Chat</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Features', href: '#features' },
            { label: 'Why Claude', href: '#why-claude' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Contact', href: '#contact' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Sign in
          </a>
          <a
            href="#pricing"
            className="px-4 py-2 bg-white text-zinc-950 text-sm rounded-lg font-medium hover:bg-zinc-100 transition-colors"
          >
            Try free
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-6 py-4 flex flex-col gap-2">
          {['Features', 'Why Claude', 'Pricing', 'Contact'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              onClick={() => setOpen(false)}
              className="py-2 text-zinc-300 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
          <a href="#pricing" className="mt-2 py-3 bg-white text-zinc-950 text-sm rounded-lg text-center font-medium">
            Try free
          </a>
        </div>
      )}
    </header>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function HeroSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNoYXRib3QlMjByb2JvdCUyMGludGVyZmFjZSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzgwMjI1MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI Robot"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/20 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-8"
        >
          <span className="size-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Powered by Claude AI
        </motion.div>

        <h1 className="text-8xl md:text-9xl font-light text-white mb-6 leading-tight">
          The Future
          <br />
          <span className="font-bold">is here</span>
        </h1>
        <p className="text-2xl text-white/80 font-light mb-10 max-w-xl mx-auto">
          The world's most thoughtful AI, now accessible to everyone.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton className="px-8 py-4 bg-white text-zinc-950 rounded-full text-base font-semibold hover:bg-zinc-100 transition-colors inline-flex items-center gap-2">
            Start for free
            <ArrowRight className="size-4" />
          </MagneticButton>
          <a href="#why-claude" className="px-8 py-4 border border-white/30 text-white rounded-full text-base font-light hover:border-white/60 transition-colors">
            Why Claude?
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-white/20" />
      </motion.div>
    </motion.section>
  );
}

/* ─── POWERED BY CLAUDE ───────────────────────────────────────── */
function PoweredBySlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -80]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y }}
      className="h-screen flex items-center justify-center bg-zinc-950 text-white px-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Claude logo placeholder */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center size-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl mb-10 shadow-2xl"
        >
          <Brain className="size-12 text-white" strokeWidth={1.5} />
        </motion.div>

        <h2 className="text-6xl md:text-7xl font-light mb-6">
          Powered by
          <br />
          <span className="font-bold">Claude</span>
        </h2>
        <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
          Built on Anthropic's Claude — one of the world's most capable and safest AI models.
          Exceptional writing, reasoning, and analysis, every single time.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16">
          {[
            { value: '#1', label: 'In reasoning benchmarks' },
            { value: '200K', label: 'Token context window' },
            { value: '100+', label: 'Languages supported' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <div className="text-5xl font-bold text-amber-400 mb-2">{stat.value}</div>
              <p className="text-zinc-400 text-sm font-light">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── WHY CLAUDE ──────────────────────────────────────────────── */
function WhyClaudeSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const reasons = [
    {
      icon: Brain,
      title: 'Exceptional reasoning',
      desc: 'Claude understands nuance, context, and complex instructions better than any other model.',
    },
    {
      icon: Shield,
      title: 'Safe & reliable',
      desc: 'Built by Anthropic with safety at its core. Honest, harmless, and helpful by design.',
    },
    {
      icon: Zap,
      title: 'Incredibly fast',
      desc: 'Get detailed, thoughtful responses in seconds — even for long, complex requests.',
    },
  ];

  return (
    <motion.section
      id="why-claude"
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center bg-white py-24 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-light text-zinc-950 mb-4">
            Why <span className="font-bold">Claude?</span>
          </h2>
          <p className="text-xl text-zinc-500 font-light max-w-xl mx-auto">
            Not all AI is created equal. Here's why Claude stands apart.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="size-20 bg-zinc-950 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <r.icon className="size-10 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-zinc-950 mb-3">{r.title}</h3>
              <p className="text-zinc-500 font-light leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── REVIEWS ─────────────────────────────────────────────────── */
function ReviewsSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const reviews = [
    {
      stars: 5,
      text: 'Claude understands what I actually mean — not just what I typed. It\'s on another level compared to anything else I\'ve tried.',
      name: 'Matti K.',
      role: 'Product Designer',
    },
    {
      stars: 5,
      text: 'The writing quality is unmatched. I use it for everything from emails to long-form articles. It sounds human, not robotic.',
      name: 'Laura V.',
      role: 'Content Strategist',
    },
    {
      stars: 5,
      text: 'I\'ve tried every AI tool out there. Claude is the only one that actually reasons through problems instead of just pattern-matching.',
      name: 'Juho A.',
      role: 'Software Developer',
    },
    {
      stars: 5,
      text: 'The context window is huge and it actually remembers what you said earlier in the conversation. Game changer for complex work.',
      name: 'Sanna M.',
      role: 'Research Analyst',
    },
    {
      stars: 5,
      text: 'Safe, honest, and incredibly capable. I trust Claude with sensitive business documents in a way I wouldn\'t with other models.',
      name: 'Pekka R.',
      role: 'Legal Consultant',
    },
    {
      stars: 5,
      text: 'It refuses to just tell you what you want to hear. It pushes back, corrects mistakes, and gives you the real answer.',
      name: 'Elina T.',
      role: 'Marketing Manager',
    },
  ];

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center bg-zinc-950 py-24 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-light text-white mb-4">
            What users <span className="font-bold">say</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-5 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-zinc-400 text-sm ml-2">5.0 · Thousands of reviews</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(r.stars)].map((_, j) => (
                  <Star key={j} className="size-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-zinc-300 font-light leading-relaxed mb-5">"{r.text}"</p>
              <div>
                <div className="text-white font-medium text-sm">{r.name}</div>
                <div className="text-zinc-500 text-xs">{r.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── PRICING ─────────────────────────────────────────────────── */
function PricingSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

  const plans = [
    {
      name: 'Starter',
      price: '€9',
      period: '/month',
      desc: 'Perfect for personal use.',
      features: ['Claude access', '500 messages/mo', 'Basic features', 'Email support'],
      cta: 'Get started',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '€19',
      period: '/month',
      desc: 'For power users.',
      features: [
        'Unlimited Claude access',
        'Unlimited messages',
        'Priority responses',
        'File uploads',
        'Chat history',
        'Priority support',
      ],
      cta: 'Start free trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For teams and businesses.',
      features: [
        'Everything in Pro',
        'Team management',
        'Custom integrations',
        'SLA guarantee',
        'Dedicated support',
      ],
      cta: 'Contact us',
      highlight: false,
    },
  ];

  return (
    <motion.section
      id="pricing"
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center bg-white py-24 px-6"
    >
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-light text-zinc-950 mb-4">
            Simple <span className="font-bold">pricing</span>
          </h2>
          <p className="text-xl text-zinc-500 font-light">No hidden fees. Cancel anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              style={plan.highlight ? { scale } : {}}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-3xl p-8 relative ${
                plan.highlight
                  ? 'bg-zinc-950 text-white shadow-2xl scale-105'
                  : 'bg-zinc-50 border border-zinc-100'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-zinc-950 rounded-full text-sm font-semibold">
                  Most popular
                </div>
              )}
              <div className={`text-xs uppercase tracking-widest mb-3 ${plan.highlight ? 'text-zinc-400' : 'text-zinc-400'}`}>
                {plan.name}
              </div>
              <div className={`text-5xl font-light mb-1 ${plan.highlight ? 'text-white' : 'text-zinc-950'}`}>
                {plan.price}
              </div>
              <div className={`text-sm mb-2 ${plan.highlight ? 'text-zinc-400' : 'text-zinc-400'}`}>
                {plan.period}
              </div>
              <p className={`text-sm font-light mb-8 ${plan.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {plan.desc}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlight ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    <Check className="size-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-full text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-white text-zinc-950 hover:bg-zinc-100'
                    : 'bg-zinc-950 text-white hover:bg-zinc-800'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── CTA FINAL ───────────────────────────────────────────────── */
function CTASlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1674027444485-cec3da58eef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZSUyMG1vZGVybnxlbnwxfHx8fDE3ODAyMjUzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Start Now"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6"
      >
        <h2 className="text-8xl md:text-9xl font-light text-white mb-8 leading-tight">
          Ready to
          <br />
          <span className="font-bold">transform?</span>
        </h2>
        <p className="text-2xl text-white/80 font-light mb-10 max-w-2xl mx-auto">
          Join thousands of users already using Claude — the world's most thoughtful AI.
        </p>
        <MagneticButton className="px-14 py-5 bg-white text-zinc-950 rounded-full text-xl font-semibold hover:shadow-2xl transition-shadow inline-flex items-center gap-3">
          Start free trial
          <ArrowRight className="size-5" />
        </MagneticButton>
        <p className="text-white/50 mt-5 text-sm">No credit card required</p>
      </motion.div>
    </motion.section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer id="contact" className="bg-zinc-950 text-zinc-400 py-16 px-6 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-7 bg-white rounded-md flex items-center justify-center">
                <MessageSquare className="size-3.5 text-zinc-950" strokeWidth={1.5} />
              </div>
              <span className="text-white font-semibold text-sm">AI Chat</span>
            </div>
            <p className="text-sm font-light leading-relaxed">
              Powered by Claude — the world's most thoughtful AI.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Terms', 'Privacy', 'Refund policy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2025 AI Chat. All rights reserved.</p>
          <p className="text-xs text-zinc-600">Powered by Anthropic's Claude API.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN EXPORT ─────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="bg-zinc-950">
      <Header />
      <HeroSlide />
      <PoweredBySlide />
      <WhyClaudeSlide />
      <ReviewsSlide />
      <PricingSlide />
      <CTASlide />
      <Footer />
    </div>
  );
}

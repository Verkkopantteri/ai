import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowRight, Check, Menu, X, Star,
  Zap, Brain, Shield, TrendingUp, Clock, Users, MessageSquare
} from 'lucide-react';

/* ─── HEADER ─────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Pantteri AI" className="size-8 object-contain" />
          <span className="font-semibold text-white tracking-tight">Pantteri AI</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Features', href: '#features' },
            { label: 'Why Pantteri AI', href: '#why-pantteri' },
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
          <a href="#contact" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Sign in
          </a>
          <a
            href="#pricing"
            className="px-4 py-2 bg-white text-zinc-950 text-sm rounded-lg font-medium hover:bg-zinc-100 transition-colors"
          >
            Get a demo
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-6 py-4 flex flex-col gap-2">
          {['Features', 'Why Pantteri AI', 'Pricing', 'Contact'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setOpen(false)}
              className="py-2 text-zinc-300 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
          <a href="#pricing" className="mt-2 py-3 bg-white text-zinc-950 text-sm rounded-lg text-center font-medium">
            Get a demo
          </a>
        </div>
      )}
    </header>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function HeroSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNoYXRib3QlMjByb2JvdCUyMGludGVyZmFjZSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzgwMjI1MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI Robot"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

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
        <p className="text-2xl text-white/80 font-light mb-10 max-w-2xl mx-auto">
          AI chatbots for your website — built on Claude, installed in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton className="px-8 py-4 bg-white text-zinc-950 rounded-full text-base font-semibold hover:bg-zinc-100 transition-colors inline-flex items-center gap-2">
            Get a free demo
            <ArrowRight className="size-4" />
          </MagneticButton>
          <a href="#features" className="px-8 py-4 border border-white/30 text-white rounded-full text-base font-light hover:border-white/60 transition-colors">
            See how it works
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

/* ─── WHY YOUR BUSINESS NEEDS THIS ───────────────────────────── */
function ProblemSlide() {
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
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-6xl md:text-7xl font-light mb-6">
          Your customers are
          <br />
          <span className="font-bold text-red-400">waiting</span>
        </h2>
        <p className="text-xl text-zinc-400 font-light mb-16 max-w-2xl mx-auto">
          Every unanswered question on your website is a lost customer. An AI chatbot fixes that — 24/7, instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { value: '73%', desc: 'of customers leave if they don\'t get an instant answer' },
            { value: '24/7', desc: 'availability your team can\'t provide — your chatbot can' },
            { value: '3×', desc: 'more leads converted with instant chat support' },
          ].map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="text-6xl font-bold text-red-400 mb-4">{stat.value}</div>
              <p className="text-zinc-400 text-lg font-light">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── FEATURES ────────────────────────────────────────────────── */
function FeaturesSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const features = [
    {
      icon: MessageSquare,
      title: 'Installed on your website',
      desc: 'A small snippet of code is all it takes. Works on any website — WordPress, Shopify, custom-built.',
    },
    {
      icon: Brain,
      title: 'Trained on your content',
      desc: 'The chatbot knows your products, services, FAQs and pricing — and answers like a real team member.',
    },
    {
      icon: Clock,
      title: 'Available 24/7',
      desc: 'Answers customers at 3am on a Sunday. No extra cost, no overtime, no missed opportunities.',
    },
    {
      icon: TrendingUp,
      title: 'Converts visitors to leads',
      desc: 'Guides users toward booking, buying, or contacting you — proactively and intelligently.',
    },
    {
      icon: Users,
      title: 'Handles multiple chats at once',
      desc: 'One chatbot handles thousands of simultaneous conversations. Your team handles none of them.',
    },
    {
      icon: Zap,
      title: 'Instant setup',
      desc: 'We handle everything. From training to installation — your chatbot is live within 48 hours.',
    },
  ];

  return (
    <motion.section
      id="features"
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
            Everything your
            <br />
            <span className="font-bold">business needs</span>
          </h2>
          <p className="text-xl text-zinc-500 font-light max-w-xl mx-auto">
            A fully managed AI chatbot. You focus on your business — we handle the AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group p-8 rounded-2xl border border-zinc-100 hover:border-zinc-300 hover:shadow-lg transition-all"
            >
              <div className="size-12 bg-zinc-950 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="size-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-3">{f.title}</h3>
              <p className="text-zinc-500 font-light leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── WHY PANTTERI AI ─────────────────────────────────────────── */
function WhyPantteriSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const reasons = [
    {
      icon: Brain,
      title: 'Built on Claude — the world\'s smartest AI',
      desc: 'Claude by Anthropic consistently ranks #1 in reasoning, writing quality, and accuracy. Your chatbot isn\'t just fast — it\'s actually intelligent.',
    },
    {
      icon: Shield,
      title: 'Safe, honest, brand-safe responses',
      desc: 'Claude is designed to be honest and refuse harmful requests. Your brand reputation is protected — the bot will never say anything embarrassing.',
    },
    {
      icon: TrendingUp,
      title: 'We manage everything for you',
      desc: 'Training, updates, monitoring, improvements — Pantteri AI handles the entire AI stack. You get results without the technical headache.',
    },
  ];

  return (
    <motion.section
      id="why-pantteri"
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center bg-zinc-950 py-24 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Pantteri AI" className="size-12 object-contain" />
          </div>
          <h2 className="text-6xl md:text-7xl font-light text-white mb-4">
            Why <span className="font-bold">Pantteri AI?</span>
          </h2>
          <p className="text-xl text-zinc-400 font-light max-w-xl mx-auto">
            Not all AI chatbots are created equal. Here's why Pantteri AI stands apart.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="size-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                <r.icon className="size-10 text-zinc-950" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{r.title}</h3>
              <p className="text-zinc-400 font-light leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Claude callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-zinc-900 border border-zinc-700 rounded-3xl p-8 md:p-12 text-center"
        >
          <p className="text-zinc-400 text-sm uppercase tracking-widest mb-4">Powered by</p>
          <h3 className="text-4xl font-light text-white mb-3">
            Anthropic's <span className="font-bold">Claude</span>
          </h3>
          <p className="text-zinc-400 font-light max-w-2xl mx-auto">
            The same AI trusted by Fortune 500 companies, researchers, and millions of professionals worldwide.
            200K token context window. Ranked #1 in reasoning. Available in 100+ languages.
          </p>
          <div className="flex justify-center gap-8 mt-8">
            {[
              { value: '#1', label: 'Reasoning benchmarks' },
              { value: '200K', label: 'Token context' },
              { value: '100+', label: 'Languages' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-amber-400">{stat.value}</div>
                <div className="text-zinc-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
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
      text: 'Our website chatbot now handles 80% of customer inquiries automatically. Our team is free to focus on real work.',
      name: 'Matti K.',
      role: 'CEO, Verkkokauppa Oy',
    },
    {
      stars: 5,
      text: 'We installed it on our real estate site and leads went up 40% in the first month. It books viewings automatically.',
      name: 'Laura V.',
      role: 'Founder, Nordic Properties',
    },
    {
      stars: 5,
      text: 'The quality of answers is incredible. Customers can\'t tell it\'s a bot — and we\'re available 24/7 now.',
      name: 'Juho A.',
      role: 'Head of Sales, TechStore Finland',
    },
    {
      stars: 5,
      text: 'Setup was done in 48 hours. Pantteri AI handled everything — we just gave them our product info and they did the rest.',
      name: 'Sanna M.',
      role: 'Marketing Director, Klinikka Pro',
    },
    {
      stars: 5,
      text: 'It speaks perfect Finnish and Swedish. Our Nordic customers get instant, accurate answers in their own language.',
      name: 'Pekka R.',
      role: 'CTO, Logistiikka Nord',
    },
    {
      stars: 5,
      text: 'ROI was clear within 2 weeks. Fewer support tickets, more leads, happier customers. Simple as that.',
      name: 'Elina T.',
      role: 'Operations Manager, Palvelu Plus',
    },
  ];

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center bg-white py-24 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-light text-zinc-950 mb-4">
            What clients <span className="font-bold">say</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-5 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-zinc-400 text-sm ml-2">5.0 · Verified business reviews</span>
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
              className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(r.stars)].map((_, j) => (
                  <Star key={j} className="size-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-zinc-700 font-light leading-relaxed mb-5">"{r.text}"</p>
              <div>
                <div className="font-semibold text-zinc-950 text-sm">{r.name}</div>
                <div className="text-zinc-400 text-xs">{r.role}</div>
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
      price: '€199',
      period: '/month',
      desc: 'For small businesses getting started.',
      features: [
        'Chatbot on 1 website',
        'Trained on your content',
        'Up to 1 000 chats/mo',
        'Email support',
        '48h setup',
      ],
      cta: 'Get started',
      highlight: false,
    },
    {
      name: 'Growth',
      price: '€499',
      period: '/month',
      desc: 'For growing businesses.',
      features: [
        'Chatbot on 3 websites',
        'Advanced training & updates',
        'Up to 5 000 chats/mo',
        'Lead capture integration',
        'Analytics dashboard',
        'Priority support',
      ],
      cta: 'Get a demo',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For large organisations.',
      features: [
        'Unlimited websites',
        'Unlimited chats',
        'Custom integrations (CRM, etc.)',
        'White-label option',
        'Dedicated account manager',
        'SLA guarantee',
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
      className="min-h-screen flex items-center justify-center bg-zinc-950 py-24 px-6"
    >
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-light text-white mb-4">
            Simple <span className="font-bold">pricing</span>
          </h2>
          <p className="text-xl text-zinc-400 font-light">No hidden fees. Cancel anytime.</p>
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
                  ? 'bg-white text-zinc-950 shadow-2xl scale-105'
                  : 'bg-zinc-900 border border-zinc-800'
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
              <div className={`text-5xl font-light mb-1 ${plan.highlight ? 'text-zinc-950' : 'text-white'}`}>
                {plan.price}
              </div>
              <div className={`text-sm mb-2 ${plan.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {plan.period}
              </div>
              <p className={`text-sm font-light mb-8 ${plan.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {plan.desc}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    <Check className="size-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-full text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
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

/* ─── CTA ─────────────────────────────────────────────────────── */
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
          alt="CTA"
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
          Get an AI chatbot on your website within 48 hours. Free demo — no commitment.
        </p>
        <MagneticButton className="px-14 py-5 bg-white text-zinc-950 rounded-full text-xl font-semibold hover:shadow-2xl transition-shadow inline-flex items-center gap-3">
          Book a free demo
          <ArrowRight className="size-5" />
        </MagneticButton>
        <p className="text-white/50 mt-5 text-sm">No credit card required · Live in 48 hours</p>
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
              <img src="/logo.png" alt="Pantteri AI" className="size-7 object-contain" />
              <span className="text-white font-semibold text-sm">Pantteri AI</span>
            </div>
            <p className="text-sm font-light leading-relaxed">
              AI chatbots for businesses — powered by Claude.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Case studies'] },
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
          <p className="text-xs">© 2025 Pantteri AI. All rights reserved.</p>
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
      <ProblemSlide />
      <FeaturesSlide />
      <WhyPantteriSlide />
      <ReviewsSlide />
      <PricingSlide />
      <CTASlide />
      <Footer />
    </div>
  );
}

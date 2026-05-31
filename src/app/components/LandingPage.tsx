import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowRight, Check, Menu, X, Star,
  Zap, Brain, Shield, TrendingUp, Clock, Users, MessageSquare
} from 'lucide-react';

/* ─── ANIMATED PARTICLES ──────────────────────────────────────── */
function FloatingParticle({ delay, duration, x, size }: { delay: number; duration: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/5 pointer-events-none"
      style={{ left: `${x}%`, bottom: 0, width: size, height: size }}
      animate={{ y: [0, -900], opacity: [0, 0.6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function ParticleField({ count = 18 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: (i * 0.7) % 8,
    duration: 6 + (i * 1.3) % 6,
    x: (i * 7.3) % 100,
    size: 2 + (i * 3.1) % 6,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => <FloatingParticle key={p.id} {...p} />)}
    </div>
  );
}

/* ─── ANIMATED COUNTER ────────────────────────────────────────── */
function AnimatedNumber({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── HEADER ─────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 80) setHidden(y > lastY.current);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Why TIA AI', href: '#why-pantteri' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      animate={{ y: hidden ? '-120%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className={`pointer-events-auto transition-all duration-500 ease-in-out ${
        scrolled
          ? 'mx-4 mt-3 rounded-2xl bg-zinc-900/90 backdrop-blur-xl border border-white/8 shadow-2xl shadow-black/40'
          : 'mx-0 mt-0 rounded-none bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center"
            >
              <img src="/logo.png" alt="TIA AI" className="size-14 object-contain" />
              
            </motion.div>

            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  className="px-3.5 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Right: Sign in + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-3"
          >
            <a href="#contact" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2">
              Sign in
            </a>
            <a
              href="#pricing"
              className="px-4 py-2 bg-white text-zinc-950 text-sm rounded-lg font-semibold hover:bg-zinc-100 transition-all hover:shadow-lg hover:shadow-white/10"
            >
              Get a demo
            </a>
          </motion.div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu — inside the fixed pill so it stays attached */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-zinc-800 px-6 py-4 flex flex-col gap-2 overflow-hidden rounded-b-2xl bg-zinc-900/95"
            >
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-zinc-300 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a href="#pricing" className="mt-2 py-3 bg-white text-zinc-950 text-sm rounded-lg text-center font-semibold">
                Get a demo
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function HeroSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-zinc-950" />
      </div>

      <ParticleField count={24} />

      <motion.div
        style={{ y }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 text-center px-6"
      >
        <h1 className="text-8xl md:text-9xl font-light text-white mb-6 leading-tight">
          The Future
          <br />
          is here
        </h1>
        <p className="text-2xl text-white/80 font-light mb-10 max-w-2xl mx-auto">
          TIA AI chatbots for your website — installed in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="group px-8 py-4 bg-white text-zinc-950 rounded-full text-base font-semibold inline-flex items-center gap-2 hover:bg-zinc-100 transition-colors"
          >
            Get a free demo
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ArrowRight className="size-4" />
            </motion.span>
          </a>
          <a href="#features" className="px-8 py-4 border border-white/30 text-white rounded-full text-base font-light hover:border-white/60 transition-colors">
            See how it works
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator — only the line, no text */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </motion.section>
  );
}

/* ─── PROBLEM (animated counters) ────────────────────────────── */
function ProblemSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -80]);

  const stats = [
    { animated: true, target: 73, suffix: '%', label: 'of customers leave if they don\'t get an instant answer' },
    { animated: false, display: '24/7', label: 'availability your team cannot provide. Your chatbot can.' },
    { animated: true, target: 3, suffix: '×', label: 'more leads converted with instant chat support' },
  ];

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y }}
      className="h-screen flex items-center justify-center bg-zinc-950 text-white px-6 relative overflow-hidden"
    >
      <ParticleField count={12} />
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-6xl md:text-7xl font-light mb-6">
          Your customers are
          <br />
          <span className="text-red-400">waiting</span>
        </h2>
        <p className="text-xl text-zinc-400 font-light mb-16 max-w-2xl mx-auto">
          Every unanswered question on your website is a lost customer. An AI chatbot fixes that. 24/7, instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="text-6xl font-light text-red-400 mb-4 tabular-nums">
                {stat.animated
                  ? <AnimatedNumber target={stat.target!} suffix={stat.suffix} duration={2.2} />
                  : stat.display
                }
              </div>
              <p className="text-zinc-400 text-lg font-light">{stat.label}</p>
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
    { icon: MessageSquare, title: 'Installed on your website', desc: 'A small code snippet. Works on WordPress, Shopify, or any custom site.' },
    { icon: Brain, title: 'Trained on your content', desc: 'Knows your products, FAQs, and pricing. Answers like a real team member.' },
    { icon: Clock, title: 'Available 24/7', desc: 'Answers at 3am on Sunday. No overtime, no missed opportunities.' },
    { icon: TrendingUp, title: 'Converts visitors to leads', desc: 'Guides users toward booking, buying, or contacting you. Intelligently.' },
    { icon: Users, title: 'Unlimited simultaneous chats', desc: 'One chatbot, thousands of conversations. Your team handles none of them.' },
    { icon: Zap, title: 'Live in 48 hours', desc: 'We handle everything: training, setup, launch. You just share your content.' },
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
            business needs
          </h2>
          <p className="text-xl text-zinc-500 font-light max-w-xl mx-auto">
            A fully managed AI chatbot. You focus on your business. We handle the AI.
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
              className="group p-8 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-xl transition-all duration-300"
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
      title: 'Powered by Claude',
      desc: 'Ranks #1 in reasoning and accuracy. Your chatbot is not just fast. It is genuinely intelligent.',
    },
    {
      icon: Shield,
      title: 'Safe, brand-safe responses',
      desc: 'Claude is designed to be honest and refuse harmful requests. Your brand is protected.',
    },
    {
      icon: TrendingUp,
      title: 'We manage everything',
      desc: 'Training, updates, monitoring. TIA AI handles the full AI stack. Zero technical headache.',
    },
  ];

  return (
    <motion.section
      id="why-pantteri"
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center bg-zinc-950 py-24 px-6 relative overflow-hidden"
    >
      <ParticleField count={16} />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <img src="/logo.png" alt="TIA AI" className="w-24 h-24 object-contain" />
          </motion.div>
          <h2 className="text-6xl md:text-7xl font-light text-white mb-4">
            Why
          </h2>
          <p className="text-lg text-zinc-500 font-light max-w-lg mx-auto">
            Not all AI chatbots are created equal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm hover:border-zinc-600 transition-colors"
            >
              <div className="size-14 bg-zinc-800 rounded-xl flex items-center justify-center mb-6">
                <r.icon className="size-7 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{r.title}</h3>
              <p className="text-zinc-400 font-light leading-relaxed text-sm">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/40 border border-zinc-700/60 rounded-3xl p-8 md:p-10 text-center backdrop-blur-sm"
        >
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Powered by</p>
          <h3 className="text-3xl font-light text-white mb-3">
            Anthropic's Claude
          </h3>
          <p className="text-zinc-400 font-light max-w-xl mx-auto text-sm">
            Trusted by Fortune 500 companies and millions of professionals worldwide. 200K token context. Ranked #1 in reasoning. 100+ languages.
          </p>
          <div className="flex justify-center gap-10 mt-8">
            {[
              { value: '#1', label: 'Reasoning' },
              { value: '200K', label: 'Token context' },
              { value: '100+', label: 'Languages' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-light text-white">{stat.value}</div>
                <div className="text-zinc-600 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ─── EARLY RESULTS (3 reviews) ───────────────────────────────── */
function ReviewsSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const reviews = [
    { stars: 5, text: 'Our chatbot now handles 80% of inquiries automatically. Our team focuses on real work.', name: 'Matti K.', role: 'CEO, Verkkokauppa Oy' },
    { stars: 5, text: 'Leads went up 40% in the first month. It books viewings automatically. Incredible.', name: 'Laura V.', role: 'Founder, Nordic Properties' },
    { stars: 5, text: 'Setup done in 48 hours. TIA AI handled everything. We just shared our content.', name: 'Sanna M.', role: 'Marketing Director, Klinikka Pro' },
  ];

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center bg-white py-24 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-light text-zinc-950 mb-4">
            Early results
          </h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 text-zinc-950 fill-zinc-950" />
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
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-zinc-50 border border-zinc-100 rounded-2xl p-7 hover:border-zinc-200 hover:shadow-md transition-all"
            >
              <div className="flex gap-0.5 mb-5">
                {[...Array(r.stars)].map((_, j) => (
                  <Star key={j} className="size-4 text-zinc-800 fill-zinc-800" />
                ))}
              </div>
              <p className="text-zinc-700 font-light leading-relaxed mb-6 text-sm">"{r.text}"</p>
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
  const cardScale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

  const plans = [
    {
      name: 'Starter',
      price: '€199',
      period: '/month',
      desc: 'For small businesses getting started.',
      features: ['Chatbot on 1 website', 'Trained on your content', 'Up to 1 000 chats/mo', 'Email support', '48h setup'],
      cta: 'Get started',
      highlight: false,
    },
    {
      name: 'Growth',
      price: '€499',
      period: '/month',
      desc: 'For growing businesses.',
      features: ['Chatbot on 3 websites', 'Advanced training & updates', 'Up to 5 000 chats/mo', 'Lead capture integration', 'Analytics dashboard', 'Priority support'],
      cta: 'Get a demo',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For large organisations.',
      features: ['Unlimited websites', 'Unlimited chats', 'Custom integrations (CRM, etc.)', 'White-label option', 'Dedicated account manager', 'SLA guarantee'],
      cta: 'Contact us',
      highlight: false,
    },
  ];

  return (
    <motion.section
      id="pricing"
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center bg-zinc-950 py-24 px-6 relative overflow-hidden"
    >
      <ParticleField count={10} />
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-light text-white mb-4">
            Simple pricing
          </h2>
          <p className="text-lg text-zinc-500 font-light">No hidden fees. Cancel anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              style={plan.highlight ? { scale: cardScale } : {}}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-8 relative transition-all duration-300 ${
                plan.highlight
                  ? 'bg-zinc-100 text-zinc-950 shadow-2xl shadow-white/5 scale-105 border border-white/20'
                  : 'bg-zinc-900/70 border border-zinc-800 hover:border-zinc-600 backdrop-blur-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-zinc-950 text-white rounded-full text-xs font-semibold border border-zinc-700">
                  Most popular
                </div>
              )}
              <div className={`text-xs uppercase tracking-widest mb-3 ${plan.highlight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                {plan.name}
              </div>
              <div className={`text-5xl font-light mb-1 ${plan.highlight ? 'text-zinc-950' : 'text-white'}`}>
                {plan.price}
              </div>
              <div className={`text-sm mb-2 ${plan.highlight ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {plan.period}
              </div>
              <p className={`text-sm font-light mb-8 ${plan.highlight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                {plan.desc}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                    <Check className={`size-4 shrink-0 ${plan.highlight ? 'text-zinc-950' : 'text-zinc-400'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                    : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
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
  // Mirror hero: track from when section enters viewport to center
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });

  // Reverse of hero exit: scale 0.9→1, opacity 0→1
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.1, 0.6], [30, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

  return (
    <motion.section
      ref={ref}
      style={{ scale, opacity }}
      className="h-screen flex items-center justify-center relative overflow-hidden bg-zinc-900"
    >
      {/* Video background */}
      <video
        src="/dots.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <ParticleField count={20} />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-6"
      >
        <h2 className="text-8xl md:text-9xl font-light text-white mb-8 leading-tight">
          Ready to
          <br />
          transform?
        </h2>
        <p className="text-2xl text-white/70 font-light mb-10 max-w-2xl mx-auto">
          Get an AI chatbot on your website within 48 hours. Free demo — no commitment.
        </p>
        <a
          href="#contact"
          className="group inline-flex items-center gap-3 px-14 py-5 bg-white text-zinc-950 rounded-full text-xl font-semibold hover:shadow-2xl hover:shadow-white/10 transition-all"
        >
          Book a free demo
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          >
            <ArrowRight className="size-5" />
          </motion.span>
        </a>
        <p className="text-white/40 mt-5 text-sm">No credit card required · Live in 48 hours</p>
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
              <img src="/logo.png" alt="TIA AI" className="size-7 object-contain" />
              <span className="text-white font-semibold text-sm">TIA AI</span>
            </div>
            <p className="text-sm font-light leading-relaxed">
              AI chatbots for businesses, powered by Claude.
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
          <p className="text-xs">© 2025 TIA AI. All rights reserved.</p>
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

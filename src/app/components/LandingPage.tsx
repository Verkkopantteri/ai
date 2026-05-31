import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowRight, Check, MessageSquare, Zap, BarChart3,
  Globe, FileText, Mic, Menu, X, ChevronDown
} from 'lucide-react';

/* ─── HEADER ─────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="size-8 bg-zinc-950 rounded-lg flex items-center justify-center">
            <MessageSquare className="size-4 text-white" strokeWidth={1.5} />
          </div>
          <span className="font-semibold text-zinc-950 tracking-tight">ChatBot App</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {['Models', 'Features', 'Pricing', 'Contact'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-all"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#pricing" className="text-sm text-zinc-600 hover:text-zinc-950 transition-colors">
            Sign in
          </a>
          <a
            href="#pricing"
            className="px-4 py-2 bg-zinc-950 text-white text-sm rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Try free
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-100 bg-white px-6 py-4 flex flex-col gap-2">
          {['Models', 'Features', 'Pricing', 'Contact'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="py-2 text-zinc-700 hover:text-zinc-950 transition-colors"
            >
              {item}
            </a>
          ))}
          <a
            href="#pricing"
            className="mt-2 py-3 bg-zinc-950 text-white text-sm rounded-lg text-center"
          >
            Try free
          </a>
        </div>
      )}
    </header>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNoYXRib3QlMjByb2JvdCUyMGludGVyZmFjZSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzgwMjI1MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/88" />
      </div>

      <motion.div
        style={{ y }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium mb-8">
          <span className="size-1.5 bg-emerald-500 rounded-full" />
          All AI models in one place
        </div>

        <h1 className="text-6xl md:text-8xl font-light text-zinc-950 mb-6 leading-tight">
          The smartest
          <br />
          <span className="font-bold">AI chatbot</span>
        </h1>

        <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto mb-10">
          Access GPT-5, Claude, Gemini, Grok and DeepSeek — all under one affordable subscription.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton className="px-8 py-4 bg-zinc-950 text-white rounded-full text-base font-semibold hover:bg-zinc-800 transition-colors inline-flex items-center gap-2">
            Get started free
            <ArrowRight className="size-4" />
          </MagneticButton>
          <a href="#features" className="px-8 py-4 border border-zinc-200 text-zinc-700 rounded-full text-base font-medium hover:border-zinc-400 transition-colors inline-flex items-center gap-2">
            See features
            <ChevronDown className="size-4" />
          </a>
        </div>

        <p className="text-zinc-400 text-sm mt-5">No credit card required · Cancel anytime</p>
      </motion.div>

      {/* Model logos strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 mt-20 px-6 w-full max-w-4xl mx-auto"
      >
        <p className="text-center text-zinc-400 text-sm mb-6 uppercase tracking-widest">Powered by</p>
        <div className="flex flex-wrap justify-center gap-6 items-center">
          {['GPT-5', 'Claude', 'Gemini', 'Grok', 'DeepSeek', 'Mistral'].map(model => (
            <div key={model} className="px-5 py-2 bg-white border border-zinc-200 rounded-full text-zinc-600 text-sm font-medium shadow-sm">
              {model}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

/* ─── MODELS SECTION ──────────────────────────────────────────── */
function ModelsSection() {
  const models = [
    { name: 'GPT-5', provider: 'OpenAI', desc: 'Best for creativity and complex reasoning tasks.' },
    { name: 'Claude', provider: 'Anthropic', desc: 'Nuanced, thoughtful responses and long-form writing.' },
    { name: 'Gemini', provider: 'Google', desc: 'Real-time web access and multimodal understanding.' },
    { name: 'Grok', provider: 'xAI', desc: 'Real-time data and bold, direct answers.' },
    { name: 'DeepSeek V3', provider: 'DeepSeek', desc: 'State-of-the-art coding and mathematics.' },
    { name: 'Mistral', provider: 'Mistral AI', desc: 'Fast, cost-effective for high-volume tasks.' },
  ];

  return (
    <section id="models" className="py-32 px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-light text-white mb-4">
            All the best <span className="font-bold">models</span>
          </h2>
          <p className="text-xl text-zinc-400 font-light max-w-xl mx-auto">
            Switch between models in a single click. No more managing multiple subscriptions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {models.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="size-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                  <MessageSquare className="size-5 text-emerald-400" strokeWidth={1.5} />
                </div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">{model.provider}</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{model.name}</h3>
              <p className="text-zinc-400 text-sm font-light">{model.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES SECTION ────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Switch models instantly',
      desc: 'Compare answers across models to reduce hallucinations and fact-check effectively.',
    },
    {
      icon: FileText,
      title: 'Chat with documents',
      desc: 'Upload PDFs and files. Ask questions, extract info, and get AI-powered summaries.',
    },
    {
      icon: Globe,
      title: 'Real-time web search',
      desc: 'Some models can search the web live — always up to date with current information.',
    },
    {
      icon: Mic,
      title: 'Voice chat',
      desc: 'Talk to your AI assistant with speech-to-text built directly into the interface.',
    },
    {
      icon: BarChart3,
      title: 'Image generation',
      desc: 'Create stunning images with FLUX and SDXL directly in the same interface.',
    },
    {
      icon: MessageSquare,
      title: 'Chat history sync',
      desc: 'All conversations saved and synced across web, iOS, and Android devices.',
    },
  ];

  return (
    <section id="features" className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-light text-zinc-950 mb-4">
            Built for <span className="font-bold">performance</span>
          </h2>
          <p className="text-xl text-zinc-500 font-light max-w-xl mx-auto">
            Everything you need to get the most out of AI — in one clean, fast interface.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group p-8 rounded-2xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
            >
              <div className="size-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="size-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 mb-3">{feature.title}</h3>
              <p className="text-zinc-500 font-light leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ───────────────────────────────────────────────────── */
function StatsSection() {
  const stats = [
    { value: '15+', label: 'AI models available' },
    { value: '80%', label: 'Cost savings vs separate subs' },
    { value: '100+', label: 'Languages supported' },
    { value: '24/7', label: 'Always available' },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold text-emerald-600 mb-2">{stat.value}</div>
              <p className="text-zinc-600 text-sm font-light">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ─────────────────────────────────────────────────── */
function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      desc: 'Start free, upgrade anytime.',
      features: ['GPT-5 Mini access', 'Limited messages', 'Basic web search'],
      cta: 'Get started',
      highlight: false,
    },
    {
      name: 'Pro',
      price: { monthly: 19.99, yearly: 9.99 },
      desc: 'All models, unlimited power.',
      features: [
        'All 15 AI models',
        'Unlimited messages',
        'Image generation (3 600/mo)',
        'Chat with PDF',
        'Voice mode',
        'Priority support',
      ],
      cta: 'Start free trial',
      highlight: true,
    },
    {
      name: 'Ultra Pro',
      price: { monthly: 39.99, yearly: 19.99 },
      desc: 'For power users and teams.',
      features: [
        'Everything in Pro',
        'Image generation (14 000/mo)',
        'Extended PDF limits',
        'Custom bots',
        'Team management',
        'Dedicated support',
      ],
      cta: 'Get Ultra Pro',
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 px-6 bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-light mb-4">
            Simple <span className="font-bold">pricing</span>
          </h2>
          <p className="text-xl text-zinc-400 font-light mb-8">
            No hidden fees. No surprises.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-full p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-full text-sm transition-all ${billing === 'monthly' ? 'bg-white text-zinc-950 font-medium' : 'text-zinc-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-white text-zinc-950 font-medium' : 'text-zinc-400 hover:text-white'}`}
            >
              Yearly
              <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">-50%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-3xl p-8 relative ${
                plan.highlight
                  ? 'bg-white text-zinc-950 scale-105 shadow-2xl'
                  : 'bg-zinc-900 border border-zinc-800'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white rounded-full text-sm font-semibold">
                  Most popular
                </div>
              )}

              <div className={`text-xs uppercase tracking-widest mb-3 ${plan.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {plan.name}
              </div>
              <div className={`text-5xl font-light mb-1 ${plan.highlight ? 'text-zinc-950' : 'text-white'}`}>
                €{plan.price[billing]}
              </div>
              <div className={`text-sm mb-2 ${plan.highlight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                /month{billing === 'yearly' ? ', billed yearly' : ''}
              </div>
              <p className={`text-sm mb-8 font-light ${plan.highlight ? 'text-zinc-600' : 'text-zinc-400'}`}>
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
    </section>
  );
}

/* ─── TESTIMONIALS ────────────────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    { name: 'Matti K.', role: 'Product Manager', text: 'Ei enää hyppimistä palvelusta toiseen. Kaikki yhdessä paikassa.' },
    { name: 'Laura V.', role: 'Content Writer', text: 'Käytän tätä joka päivä. Claude kirjoittamiseen, GPT ideointiin.' },
    { name: 'Juho A.', role: 'Software Developer', text: 'DeepSeek koodaukseen on huikea. Ja hinta on järjetön verrattuna erillisiin tilauksiin.' },
  ];

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-7xl font-light text-zinc-950 text-center mb-16"
        >
          What users <span className="font-bold">say</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="p-8 bg-zinc-50 rounded-2xl border border-zinc-100"
            >
              <p className="text-zinc-700 font-light leading-relaxed mb-6 text-lg">"{t.text}"</p>
              <div>
                <div className="font-semibold text-zinc-950">{t.name}</div>
                <div className="text-zinc-400 text-sm">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1674027444485-cec3da58eef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZSUyMG1vZGVybnxlbnwxfHx8fDE3ODAyMjUzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="CTA"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 to-teal-900/95" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <h2 className="text-6xl md:text-8xl font-light text-white mb-6 leading-tight">
          Start today
          <br />
          <span className="font-bold">for free</span>
        </h2>
        <p className="text-xl text-white/80 font-light mb-10">
          Join thousands of users already using all major AI models in one place.
        </p>
        <MagneticButton className="px-10 py-5 bg-white text-zinc-950 rounded-full text-lg font-semibold hover:shadow-2xl transition-shadow inline-flex items-center gap-3">
          Get started free
          <ArrowRight className="size-5" />
        </MagneticButton>
        <p className="text-white/50 mt-5 text-sm">No credit card required</p>
      </motion.div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-7 bg-white rounded-md flex items-center justify-center">
                <MessageSquare className="size-3.5 text-zinc-950" strokeWidth={1.5} />
              </div>
              <span className="text-white font-semibold text-sm">ChatBot App</span>
            </div>
            <p className="text-sm font-light leading-relaxed">
              All major AI models under one subscription.
            </p>
          </div>

          {[
            { title: 'Product', links: ['Models', 'Features', 'Pricing', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Contact', 'Help center'] },
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
          <p className="text-xs">© 2025 ChatBot App. All rights reserved.</p>
          <p className="text-xs text-zinc-600">
            Not affiliated with OpenAI, Anthropic, Google or other AI providers.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN EXPORT ─────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="bg-white">
      <Header />
      <HeroSection />
      <ModelsSection />
      <FeaturesSection />
      <StatsSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

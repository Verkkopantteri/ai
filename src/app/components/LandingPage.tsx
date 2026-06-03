import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowRight, Check, Menu, X, Star, ChevronRight,
  Zap, Brain, Shield, TrendingUp, Clock, Users, MessageSquare, Globe,
  ChevronDown, Target, RefreshCw
} from 'lucide-react';

/* ─── LEAD FORM MODAL ─────────────────────────────────────────── */
const SERVICES = [
  { id: 'M', label: 'S', desc: '149€/mo · 1,000 messages / month' },
  { id: 'L', label: 'M', desc: '299€/mo · 2,500 messages / month' },
  { id: 'XL', label: 'L', desc: '699€/mo · 10,000 messages / month' },
];

const SERVICE_PRICES = { M: 149, L: 299, XL: 699 };

function LeadFormModal({ isDark, onClose, initialService = '' }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    service: initialService,
    company: '',
    website: '',
    email: '',
    analytics: 'basic',
    botSetup: '', // 'tia' | 'custom' | ''
  });

  const basePrice = SERVICE_PRICES[form.service] || 0;
  const analyticsPrice = form.analytics === 'advanced' ? 50 : 0;
  const discountMultiplier = form.botSetup === 'tia' ? 0.80 : 1.0;
  const discountedBase = Math.round(basePrice * discountMultiplier);
  const total = discountedBase + analyticsPrice;

  const handleSubmit = () => {
    if (!form.service || !form.botSetup || !form.company || !form.website || !form.email) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className={`w-full max-w-md rounded-2xl p-8 relative shadow-2xl overflow-y-auto max-h-[92vh] ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'}`}
        >
          <button onClick={onClose} className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${isDark ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'}`}>
            <X className="size-4" />
          </button>

          {!submitted ? (
            <>
              <h3 className={`text-2xl font-light mb-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Get Started</h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>No commitment · Cancel anytime</p>
              <div className="flex flex-col gap-4">

                {/* Service selector */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Which Plan Interests You? <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {SERVICES.map(s => (
                      <button key={s.id} onClick={() => setForm(f => ({ ...f, service: s.id }))}
                        className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                          form.service === s.id
                            ? isDark ? 'border-white bg-white/10 text-white' : 'border-zinc-950 bg-zinc-950 text-white'
                            : isDark ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                        }`}>
                        <div className="text-xs font-semibold">{s.label}</div>
                        <div className={`text-[10px] mt-0.5 ${form.service === s.id ? 'opacity-70' : isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bot Setup — single choice */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Bot Setup <span className="text-red-400">*</span></label>
                  <div className="flex flex-col gap-2">
                    {[
                      {
                        id: 'tia',
                        title: 'TIA Theme',
                        subtitle: 'White or Black',
                        badge: '−20% forever',
                        badgeColor: 'text-emerald-400',
                      },
                      {
                        id: 'custom',
                        title: 'Custom Theme',
                        subtitle: 'Fully personalized',
                        badge: null,
                        badgeColor: '',
                      },
                    ].map(opt => {
                      const active = form.botSetup === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setForm(f => ({ ...f, botSetup: opt.id }))}
                          className={`flex items-start gap-3 w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                            active
                              ? isDark ? 'border-white bg-white/10' : 'border-zinc-950 bg-zinc-950'
                              : isDark ? 'border-zinc-700 hover:border-zinc-500' : 'border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          {/* Radio indicator */}
                          <div className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${
                            active
                              ? 'bg-white border-white'
                              : isDark ? 'border-zinc-600' : 'border-zinc-300'
                          }`}>
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-xs font-semibold ${active ? isDark ? 'text-white' : 'text-white' : isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {opt.title}
                              {opt.subtitle && <span className={`ml-1.5 font-normal ${active ? 'opacity-70' : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{opt.subtitle}</span>}
                            </p>
                            {opt.badge && (
                              <span className={`text-xs font-medium ${active ? opt.badgeColor : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                {opt.badge}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Analytics Dashboard */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Analytics Dashboard <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'basic', label: 'Basic', price: '0€/mo' },
                      { id: 'advanced', label: 'Advanced', price: '+50€/mo' },
                    ].map(opt => (
                      <button key={opt.id} onClick={() => setForm(f => ({ ...f, analytics: opt.id }))}
                        className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                          form.analytics === opt.id
                            ? isDark ? 'border-white bg-white/10 text-white' : 'border-zinc-950 bg-zinc-950 text-white'
                            : isDark ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                        }`}>
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div className={`text-[10px] mt-0.5 ${form.analytics === opt.id ? 'opacity-70' : isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{opt.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className={`rounded-xl px-4 py-4 border ${isDark ? 'bg-zinc-800/60 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                  {form.service && (
                    <div className={`flex justify-between text-xs mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      <span>{SERVICES.find(s => s.id === form.service)?.label}</span>
                      <span className="flex items-center gap-1.5">
                        {form.botSetup === 'tia' && <span className="line-through opacity-50">{basePrice}€/mo</span>}
                        {discountedBase}€/mo
                      </span>
                    </div>
                  )}
                  {form.botSetup === 'tia' && form.service && (
                    <div className={`flex justify-between text-xs mb-2 text-emerald-500`}>
                      <span>TIA Theme discount (-20%)</span>
                      <span>-{basePrice - discountedBase}€/mo</span>
                    </div>
                  )}
                  {form.analytics === 'advanced' && (
                    <div className={`flex justify-between text-xs mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      <span>Advanced Analytics</span>
                      <span>+50€/mo</span>
                    </div>
                  )}
                  <div className={`flex justify-between text-sm font-semibold pt-2 mt-1 border-t ${isDark ? 'border-zinc-700 text-white' : 'border-zinc-200 text-zinc-950'}`}>
                    <span>Total</span>
                    <span>{total > 0 ? `${total}€/mo` : '—'}</span>
                  </div>
                </div>

                {/* Text fields */}
                {[
                  { key: 'company', label: 'Company Name', placeholder: 'TIA.AI Inc' },
                  { key: 'website', label: 'Website URL', placeholder: 'https://yourcompany.com' },
                  { key: 'email', label: 'Email Address', placeholder: 'you@yourcompany.com' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{label} <span className="text-red-400">*</span></label>
                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-600 focus:border-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 placeholder-zinc-400 focus:border-zinc-400'}`}
                    />
                  </div>
                ))}
                <p className={`text-xs text-center ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>We'll get back to you shortly</p>
                <button
                  onClick={handleSubmit}
                  disabled={!form.service || !form.botSetup || !form.company || !form.website || !form.email}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}
                >
                  Send Request
                </button>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="size-6 text-emerald-400" />
              </div>
              <h3 className={`text-xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>You're all set!</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Thanks! We'll review your website and contact you within 24 hours with a custom AI chatbot plan.
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── PARTICLES ───────────────────────────────────────────────── */
function FloatingParticle({ delay, duration, x, size }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/5 pointer-events-none"
      style={{ left: `${x}%`, bottom: 0, width: size, height: size }}
      animate={{ y: [0, -900], opacity: [0, 0.6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}
function ParticleField({ count = 18 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i, delay: (i * 0.7) % 8, duration: 6 + (i * 1.3) % 6, x: (i * 7.3) % 100, size: 2 + (i * 3.1) % 6,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => <FloatingParticle key={p.id} {...p} />)}
    </div>
  );
}

/* ─── HEADER ──────────────────────────────────────────────────── */
function Header({ isDark, onGetStarted }) {
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
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      animate={{ y: hidden ? '-120%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className={`pointer-events-auto transition-all duration-500 ease-in-out ${
        scrolled
          ? `mx-4 mt-3 rounded-2xl backdrop-blur-xl border shadow-2xl ${isDark ? 'bg-zinc-900/20 border-white/5 shadow-black/40' : 'bg-white/80 border-zinc-200 shadow-black/10'}`
          : 'mx-0 mt-0 rounded-none bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <img src={isDark ? '/logo.png' : '/logo-black.png'} alt="TIA AI" className="h-12 w-auto object-contain" />
            </motion.div>
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item, i) => (
                <motion.a key={item.label} href={item.href}
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  className="px-3.5 py-2 text-base transition-colors text-zinc-400 hover:text-white"
                >{item.label}</motion.a>
              ))}
            </nav>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden md:flex items-center gap-3">
            <a href="#contact" className="text-base transition-colors px-3 py-2 text-zinc-400 hover:text-white">Sign in</a>
            <button onClick={() => onGetStarted()} className={`px-4 py-2 text-base rounded-lg font-semibold transition-all hover:shadow-lg ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>Get Started</button>
          </motion.div>
          <button onClick={() => setOpen(!open)} className={`md:hidden p-2 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t px-6 py-4 flex flex-col gap-2 overflow-hidden rounded-b-2xl ${isDark ? 'border-zinc-800 bg-zinc-900/95' : 'border-zinc-200 bg-white/95'}`}>
              {navItems.map(item => (
                <a key={item.label} href={item.href} onClick={() => setOpen(false)}
                  className={`py-2 transition-colors ${isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'}`}>{item.label}</a>
              ))}
              <button onClick={() => { setOpen(false); onGetStarted(); }} className={`mt-2 py-3 text-sm rounded-lg text-center font-semibold ${isDark ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white'}`}>Get Started</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}



/* ─── HOW IT WORKS ────────────────────────────────────────────── */
function HowItWorksSlide() {
  const steps = [
    {
      number: '01',
      icon: Globe,
      title: 'We train TIA on your business',
      desc: 'Share your website URL, product pages, FAQs, and pricing. TIA learns your entire knowledge base in minutes — no manual input required.',
      detail: 'Supports any URL, PDF, or document',
    },
    {
      number: '02',
      icon: Zap,
      title: 'We install it on your site',
      desc: 'One line of code added to your website. Works with WordPress, Shopify, Wix, and any custom-built site. We handle the entire setup.',
      detail: 'Setup completed in under 48 hours',
    },
    {
      number: '03',
      icon: Target,
      title: 'TIA starts converting visitors',
      desc: 'From the moment it goes live, TIA greets visitors, answers questions, qualifies leads, and captures contact details — 24/7, in any language.',
      detail: 'Average 40% increase in lead capture',
    },
    {
      number: '04',
      icon: RefreshCw,
      title: 'TIA gets smarter every week',
      desc: 'The AI learns from every conversation. You review insights on your analytics dashboard and TIA continuously improves its responses.',
      detail: 'Weekly AI evolution cycle',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden" style={{ background: '#09090b' }}>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-5">
            <span className="text-xs text-white/60 tracking-wide">Simple process</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-3 text-white">From zero to live<br />in 48 hours</h2>
          <p className="text-lg font-light text-zinc-500 max-w-xl">No technical expertise needed. We do everything — you just get more leads.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <motion.div key={step.number}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-7 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 transition-colors overflow-hidden">
              <div className="absolute top-4 right-6 text-7xl font-light text-white/4 select-none pointer-events-none"></div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-700 transition-colors">
                  <step.icon className="size-5 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-zinc-500">{step.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
                <Check className="size-3.5 flex-shrink-0" style={{ color: '#00BC7D' }} />
                <span className="text-xs text-zinc-500">{step.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HERO SECTION ────────────────────────────────────────────── */
function HeroAISlide({ onGetStarted }) {
  const stats = [
    { value: '3 min', label: 'Average setup time' },
    { value: '24/7', label: 'Always online' },
    { value: '100+', label: 'Languages supported' },
    { value: '40%', label: 'More leads captured' },
  ];

  return (
    <section className="px-6 relative" style={{ display: 'flex', flexDirection: 'column', background: '#09090b', minHeight: '100vh' }}>
      {/* AI head image — right side, bottom-anchored */}
      <img
        src="/br-bb.avif"
        alt=""
        className="absolute pointer-events-none select-none"
        style={{
          right: 'calc(5% - 190px)',
          bottom: '12%',
          height: '78%',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom right',
          opacity: 0.9,
          maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
          zIndex: 1,
        }}
      />
      <div className="max-w-6xl mx-auto w-full flex flex-col py-24 relative z-10">

        {/* Top: main title + subtitle + CTAs */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }}>
          <h2 className="text-5xl md:text-6xl font-light mb-3 text-white leading-tight">
            Live chat support by the<br />world's smartest AI Agent
          </h2>
          <p className="text-lg font-light text-zinc-400 max-w-2xl mb-8">
            The AI Agent resolves complex inquiries, learns your business, and helps increase conversions while reducing support workload.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <button onClick={onGetStarted}
              className="px-8 py-4 rounded-full text-base font-semibold transition-colors bg-white text-zinc-950 hover:bg-zinc-100">
              Get Started
            </button>
            <a href="#tia-in-action"
              className="px-8 py-4 rounded-full text-base font-semibold transition-colors border border-white/20 text-white hover:bg-white/10">
              See it live
            </a>
          </div>
        </motion.div>

        {/* Bottom row: Try it free left, stats right */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-10 pt-10 border-t border-white/5 pb-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={onGetStarted}
              className="text-2xl md:text-3xl font-light text-white leading-tight mb-4 inline-flex items-center gap-3 group"
              style={{ textDecoration: 'underline', textUnderlineOffset: '5px', textDecorationColor: 'rgba(255,255,255,0.4)' }}
            >
              Try it free for 14 days <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-base italic text-white/70 mb-1">"Best hire we never made."</p>
            <p className="text-sm text-white/40 mb-3">— Verkkopantteri.fi</p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4" style={{ color: '#00BC7D', fill: '#00BC7D' }} />
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

/* ─── STATS STRIP ──────────────────────────────────────────────── */
function StatsStrip() {
  const stats = [
    { value: '3 min', label: 'Average setup time' },
    { value: '24/7', label: 'Always online' },
    { value: '100+', label: 'Languages supported' },
    { value: '40%', label: 'More leads captured' },
  ];
  return (
    <section className="py-16 px-6 bg-zinc-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex justify-end">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: i * 0.08 }}
              className="text-center">
              <div className="text-4xl font-light text-white mb-1">{s.value}</div>
              <div className="text-sm text-zinc-500">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
function FAQSlide() {
  const faqs = [
    { q: 'How long does setup take?', a: 'Most customers are live within 48 hours. We handle everything — from training TIA on your content to installing the widget on your site.' },
    { q: 'Does TIA work with my website platform?', a: 'Yes. TIA integrates with WordPress, Shopify, Wix, and any custom-built website via a single line of JavaScript.' },
    { q: 'What languages does TIA support?', a: 'TIA supports over 100 languages out of the box. It automatically detects and responds in the visitor\'s language.' },
    { q: 'Can I cancel anytime?', a: 'Absolutely. No long-term contracts. Cancel from your dashboard at any time, and you\'ll retain access until the end of your billing period.' },
    { q: 'Is my data secure?', a: 'Yes. All data is encrypted in transit and at rest. We are GDPR-compliant, EU-hosted, and offer data deletion on request.' },
    { q: 'What happens when TIA doesn\'t know the answer?', a: 'TIA gracefully escalates to a human or collects the visitor\'s contact details so your team can follow up. No dead-ends.' },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 bg-zinc-950">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-light text-white">Everything you<br />need to know</h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                  <ChevronDown className="size-4 text-zinc-500" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <p className="px-6 pb-5 text-sm font-light leading-relaxed text-zinc-500">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CHAT THEMES ─────────────────────────────────────────────── */
const CHAT_THEMES = {
  dark: {
    name: 'Obsidian Black',
    bg: '#09090b',
    headerBg: 'rgba(13,13,15,0.97)',
    msgBg: '#232325',
    userMsgBg: '#2c2c30',
    border: 'rgba(255,255,255,0.09)',
    inputBg: '#1e1e22',
    chipColor: 'rgba(255,255,255,0.45)',
    textColor: 'rgba(232,232,232,0.95)',
    userTextColor: 'rgba(232,232,232,0.95)',
    subtleText: 'rgba(255,255,255,0.22)',
    accentDot: '#34d399',
    sendArrow: 'rgba(255,255,255,0.6)',
    glow: '0 32px 80px rgba(0,0,0,0.7)',
    avatarSrc: '/logo.png',
    scrollTrack: 'rgba(255,255,255,0.04)',
    scrollThumb: 'rgba(255,255,255,0.12)',
    scrollThumbHover: 'rgba(255,255,255,0.22)',
    chipBg: 'rgba(20,20,24,0.85)',
    msgAreaBg: 'transparent',
  },
  light: {
    name: 'Pearl White',
    bg: '#f4f4f5',
    headerBg: '#ffffff',
    msgBg: '#e4e4e7',
    userMsgBg: '#e4e4e7',
    border: 'rgba(0,0,0,0.08)',
    inputBg: '#ffffff',
    chipColor: 'rgba(0,0,0,0.45)',
    textColor: '#18181b',
    userTextColor: '#18181b',
    subtleText: 'rgba(0,0,0,0.3)',
    accentDot: '#34d399',
    sendArrow: 'rgba(0,0,0,0.5)',
    glow: '0 32px 80px rgba(0,0,0,0.35)',
    avatarSrc: '/logo-black.png',
    scrollTrack: 'rgba(0,0,0,0.04)',
    scrollThumb: 'rgba(0,0,0,0.12)',
    scrollThumbHover: 'rgba(0,0,0,0.22)',
    chipBg: 'rgba(255,255,255,0.7)',
    msgAreaBg: '#ececee',
  },
};

/* ─── MINI CHAT (hero stack static) ──────────────────────────── */
function MiniChat({ theme }) {
  const messages = [
    { from: 'bot', text: "Hey! I'm TIA, your AI assistant. How can I help?" },
    { from: 'user', text: 'Can you set up a demo for us?' },
    { from: 'bot', text: "Absolutely! I'll connect you with our team. Leave your email and we'll schedule within 24h." },
  ];
  const isLight = theme.name === 'Pearl White';

  return (
    <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, boxShadow: theme.glow, width: 320 }}
      className="rounded-[20px] overflow-hidden flex flex-col">
      {/* Header */}
      <div style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}
        className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div style={{ border: `1px solid ${theme.border}`, background: theme.msgBg }}
            className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            <img src={theme.avatarSrc} alt="TIA" className="w-full h-full object-contain p-0.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ color: theme.textColor }} className="text-sm font-semibold">TIA</span>
            <span style={{ background: theme.accentDot }} className="w-1.5 h-1.5 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2.5 items-center opacity-30">
          <div style={{ background: theme.textColor }} className="w-3 h-0.5 rounded-full" />
          <div style={{ border: `1px solid ${theme.textColor}` }} className="w-3 h-3 rounded-sm" />
        </div>
      </div>
      {/* Messages */}
      <div className="flex flex-col gap-3 p-4" style={{ background: isLight ? '#ececee' : 'transparent' }}>
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.from === 'bot' && (
              <div style={{ border: `1px solid ${theme.border}`, background: theme.msgBg }}
                className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                <img src={theme.avatarSrc} alt="T" className="w-full h-full object-contain p-0.5" />
              </div>
            )}
            <div style={{
              background: msg.from === 'bot' ? theme.msgBg : theme.userMsgBg,
              border: `1px solid ${theme.border}`,
              color: msg.from === 'user' ? theme.userTextColor : theme.textColor,
              borderRadius: msg.from === 'bot' ? '3px 14px 14px 14px' : '14px 14px 3px 14px',
            }} className="max-w-[200px] px-3 py-2 text-[11px] leading-relaxed">{msg.text}</div>
          </motion.div>
        ))}
        {/* Typing dots */}
        <div className="flex gap-2">
          <div style={{ border: `1px solid ${theme.border}`, background: theme.msgBg }}
            className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
            <img src={theme.avatarSrc} alt="T" className="w-full h-full object-contain p-0.5" />
          </div>
          <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}`, borderRadius: '3px 14px 14px 14px' }}
            className="flex items-center gap-1 px-3 py-2.5">
            {[0, 1, 2].map(d => (
              <motion.div key={d} style={{ background: theme.subtleText }} className="w-1 h-1 rounded-full"
                animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2 }} />
            ))}
          </div>
        </div>
      </div>
      {/* Chips */}
      <div style={{ background: isLight ? '#ececee' : 'transparent' }} className="flex gap-1.5 flex-wrap px-4 pb-2">
        {['AI deployment', 'Pricing', 'Free trial'].map(chip => (
          <span key={chip}
            style={{ color: theme.chipColor, border: `1px solid ${theme.border}`, background: theme.chipBg }}
            className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap">{chip}</span>
        ))}
      </div>
      {/* Input */}
      <div style={{ background: theme.headerBg, borderTop: `1px solid ${theme.border}` }} className="px-3 py-2.5 flex-shrink-0">
        <div style={{ background: theme.inputBg, border: `1px solid ${theme.border}` }}
          className="flex items-center gap-2 rounded-xl px-3 py-2">
          <span style={{ color: theme.subtleText }} className="text-[11px] flex-1">Send a message…</span>
          <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
            className="w-6 h-6 rounded-lg flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 10 16" fill="none">
              <polyline points="2,1 9,8 2,15" stroke={theme.sendArrow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div style={{ background: theme.headerBg }} className="flex items-center gap-1 py-2 pl-[105px]">
        <span style={{ color: theme.subtleText, fontSize: '9px', letterSpacing: '0.04em' }}>Powered by</span>
        <img src="https://i.ibb.co/WWGrHnHy/asd3.png" alt="TIA" className="h-2.5"
          style={{ opacity: 0.5, filter: isLight ? 'brightness(0)' : 'brightness(2)' }} />
      </div>
    </div>
  );
}

function ChatStack({ activeTheme }) {
  return (
    <div className="relative" style={{ width: 380, height: 540 }}>
      <motion.div initial={{ opacity: 0, x: 20, y: -10, filter: 'brightness(0.88)' }} animate={{ opacity: 1, x: 0, y: 0, filter: 'brightness(0.88)' }}
        transition={{ duration: 0.9, delay: 0.8 }}
        style={{ position: 'absolute', top: 0, right: -10, zIndex: 10, transform: 'rotate(5deg) translateX(10px) translateY(-10px)', pointerEvents: 'none' }}>
        <MiniChat theme={activeTheme === 'dark' ? CHAT_THEMES.light : CHAT_THEMES.dark} />
      </motion.div>
      <motion.div initial={{ opacity: 0, x: -10, y: 15 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 20, transform: 'rotate(-2deg)' }}>
        <MiniChat theme={activeTheme === 'dark' ? CHAT_THEMES.dark : CHAT_THEMES.light} />
      </motion.div>
    </div>
  );
}

/* ─── ANIMATED CHAT LOOP ──────────────────────────────────────── */
const CHAT_MSG_HEIGHT_DEFAULT = 200;
const CHAT_MSG_HEIGHT_WITH_CTA = 148;

// inputTyping: text shown animating in the input bar before the message appears
const CONVERSATION = [
  { from: 'bot',  text: "Hey! I'm TIA. Tell me what you're looking for, and I'll point you in the right direction.", delay: 800 },
  { from: 'user', text: "How much does installation cost?", delay: 4000, inputTyping: "How much does installation cost?" },
  { from: 'bot',  text: "Plans start at 149/mo and go up to 699/mo depending on chat volume. How many customer chats do you estimate per day?", delay: 5800 },
  { from: 'user', text: "Maybe around 10 max", delay: 9000, inputTyping: "Maybe around 10 max" },
  { from: 'bot',  text: "That fits our Pro plan perfectly, up to 10 chats/day with full lead capture and analytics.", delay: 11300 },
  { from: 'bot',  text: "Would you like to send a contact request yourself, or should I collect your details right here?", delay: 15200 },
];

// Auto-demo extra messages shown after "Send my details" in the loop
const AUTO_DETAILS_FLOW = [
  { from: 'user', text: 'Send my details', delay: 0 },
  { from: 'bot',  text: "I'll pass your details to our team. What is your email address?", delay: 1100 },
  { from: 'user', text: 'hello@mycompany.com', delay: 3200, inputTyping: 'hello@mycompany.com' },
  { from: 'bot',  text: "Got it. And your company name and website URL?", delay: 4600 },
  { from: 'user', text: 'MyCompany, mycompany.com', delay: 7000, inputTyping: 'MyCompany, mycompany.com' },
  { from: 'bot',  text: "All set. Our team will review your site and reach out within 24 hours with a tailored plan.", delay: 8400 },
  { from: 'bot',  text: "Have a great rest of your day. Is there anything else I can help you with?", delay: 11000 },
  { from: 'user', text: 'No, thank you!', delay: 13500, inputTyping: 'No, thank you!' },
  { from: 'bot',  text: "You're welcome. Take care!", delay: 15000 },
];

/* Smooth character-by-character reveal for a single message */
function TypedText({ text, color, onDone, onChar }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const iRef = useRef(0);

  useEffect(() => {
    iRef.current = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      iRef.current += 1;
      setDisplayed(text.slice(0, iRef.current));
      onChar?.();
      if (iRef.current >= text.length) {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span style={{ color }}>
      {displayed}
      {!done && <span style={{ opacity: 0.5, color }}>▍</span>}
    </span>
  );
}

function AnimatedChatLoop({ theme, onGetStarted }) {
  // phase: 'bubble' | 'chat'
  const [phase, setPhase] = useState('bubble');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [typingIdx, setTypingIdx] = useState(-1); // which bot msg is currently "typing"
  const [showCTA, setShowCTA] = useState(false);
  const [inputTypingText, setInputTypingText] = useState('');
  const [detailsMode, setDetailsMode] = useState<null | 'email' | 'company' | 'thanks' | 'done' | 'auto'>(null);
  const [extraMessages, setExtraMessages] = useState<{from:string,text:string}[]>([]);
  const timersRef = useRef([]);
  const scrollRef = useRef(null);
  const rafRef = useRef(null);
  const userEngagedRef = useRef(false);
  const isLight = theme.name === 'Pearl White';

  const ctaRef = useRef(null);

  // Scroll chat to bottom when CTA appears
  useEffect(() => {
    if (showCTA) scrollToBottom();
  }, [showCTA]);

  const scrollToBottom = useCallback(() => {
    if (rafRef.current) return; // already scheduled
    rafRef.current = requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      rafRef.current = null;
    });
  }, []);

  const addTimer = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };
  const clearAll = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

  const inputIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runLoop = useCallback(() => {
    clearAll();
    if (inputIntervalRef.current) { clearInterval(inputIntervalRef.current); inputIntervalRef.current = null; }
    setPhase('bubble');
    setVisibleMessages(0);
    setTypingIdx(-1);
    setShowCTA(false);
    setInputTypingText('');
    setDetailsMode(null);
    setExtraMessages([]);

    addTimer(() => setPhase('chat'), 1400);

    CONVERSATION.forEach((msg, i) => {
      const t = 1400 + msg.delay;
      if (msg.from === 'bot') {
        addTimer(() => setTypingIdx(i), t - 900);
        addTimer(() => {
          setTypingIdx(-1);
          setVisibleMessages(v => v + 1);
        }, t);
      } else {
        if (msg.inputTyping) {
          const typingStart = t - 1200;
          const typingText = msg.inputTyping;
          addTimer(() => {
            setInputTypingText('');
            let charIdx = 0;
            if (inputIntervalRef.current) clearInterval(inputIntervalRef.current);
            inputIntervalRef.current = setInterval(() => {
              charIdx++;
              setInputTypingText(typingText.slice(0, charIdx));
              if (charIdx >= typingText.length) {
                clearInterval(inputIntervalRef.current!);
                inputIntervalRef.current = null;
              }
            }, 38);
          }, typingStart > 1400 ? typingStart : 1400 + 200);
        }
        addTimer(() => {
          if (inputIntervalRef.current) { clearInterval(inputIntervalRef.current); inputIntervalRef.current = null; }
          setInputTypingText('');
          setVisibleMessages(v => v + 1);
        }, t);
      }
    });

    const lastMsgDelay = 1400 + CONVERSATION[CONVERSATION.length - 1].delay;

    // Show CTA after last bot message finishes typing
    addTimer(() => { if (!userEngagedRef.current) setShowCTA(true); }, lastMsgDelay + 1800);

    // Auto-run the "Send my details" demo flow
    const autoStart = lastMsgDelay + 1800;
    let autoVisibleCount = 0;
    AUTO_DETAILS_FLOW.forEach((msg, i) => {
      const t = autoStart + msg.delay + 3500; // +3500 pause so CTA buttons are visible long enough to read
      if (msg.from === 'bot') {
        addTimer(() => {
          if (userEngagedRef.current) return;
          setTypingIdx(1000 + i);
        }, t - 900);
        addTimer(() => {
          if (userEngagedRef.current) return;
          setTypingIdx(-1);
          setExtraMessages(m => [...m, { from: 'bot', text: msg.text }]);
        }, t);
      } else {
        if (msg.inputTyping) {
          const typingStart = t - 1200;
          addTimer(() => {
            if (userEngagedRef.current) return;
            setInputTypingText('');
            let charIdx = 0;
            if (inputIntervalRef.current) clearInterval(inputIntervalRef.current);
            inputIntervalRef.current = setInterval(() => {
              charIdx++;
              setInputTypingText(msg.inputTyping!.slice(0, charIdx));
              if (charIdx >= msg.inputTyping!.length) {
                clearInterval(inputIntervalRef.current!);
                inputIntervalRef.current = null;
              }
            }, 38);
          }, typingStart > autoStart ? typingStart : autoStart + 200);
        }
        addTimer(() => {
          if (userEngagedRef.current) return;
          if (inputIntervalRef.current) { clearInterval(inputIntervalRef.current); inputIntervalRef.current = null; }
          setInputTypingText('');
          // First auto user msg ("Send my details") hides the CTA buttons
          if (i === 0) setDetailsMode('auto');
          setExtraMessages(m => [...m, { from: 'user', text: msg.text }]);
        }, t);
      }
    });

    const autoLastDelay = autoStart + AUTO_DETAILS_FLOW[AUTO_DETAILS_FLOW.length - 1].delay + 3500;
    const loopEnd = autoLastDelay + 4000;

    addTimer(() => { if (!userEngagedRef.current) setPhase('bubble'); }, loopEnd);
    addTimer(() => {
      if (userEngagedRef.current) return;
      setVisibleMessages(0);
      setTypingIdx(-1);
      setShowCTA(false);
      setInputTypingText('');
      setDetailsMode(null);
      setExtraMessages([]);
      runLoop();
    }, loopEnd + 650);
  }, []);

  useEffect(() => { runLoop(); return clearAll; }, []);
  useEffect(() => {
    if (extraMessages.length > 0) scrollToBottom();
  }, [extraMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages, typingIdx]);

  // Fixed outer dimensions match the hero MiniChat (width:320)
  // Chat panel height is fixed so it never grows
  const CHAT_PANEL_HEIGHT = 420;

  return (
    /* Outer wrapper — fixed size so layout never shifts */
    <div style={{ width: 320, position: 'relative', height: CHAT_PANEL_HEIGHT }}>

      {/* Bubble — always anchored bottom-right, hidden when chat is open */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 10 }}>
        <AnimatePresence>
          {phase === 'bubble' && (
            <motion.div key="bubble"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            >
              <div style={{
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                width: 52, height: 52,
              }} className="rounded-full flex items-center justify-center relative cursor-pointer">
                <MessageSquare
                  style={{ color: isLight ? '#18181b' : 'rgba(232,232,232,0.9)' }}
                  className="size-6" strokeWidth={1.5}
                />
                <span style={{ background: theme.accentDot }}
                  className="absolute w-3 h-3 rounded-full top-0 right-0 border-2 border-white animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat widget — anchored bottom-right, fixed height */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 20 }}>
        <AnimatePresence>
          {phase === 'chat' && (
            <motion.div key="chat"
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              style={{ transformOrigin: 'bottom right' }}
            >
              <div style={{
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
                width: 320,
                height: CHAT_PANEL_HEIGHT,
                display: 'flex',
                flexDirection: 'column',
              }} className="rounded-[20px] overflow-hidden">

                {/* Header — matches MiniChat hero exactly */}
                <div style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}
                  className="flex items-center justify-between px-4 py-3 flex-shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div style={{ border: `1px solid ${theme.border}`, background: theme.msgBg }}
                      className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      <img src={theme.avatarSrc} alt="TIA" className="w-full h-full object-contain p-0.5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: theme.textColor }} className="text-sm font-semibold">TIA</span>
                      <span style={{ background: theme.accentDot }} className="w-1.5 h-1.5 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-center opacity-30">
                    <div style={{ background: theme.textColor }} className="w-3 h-0.5 rounded-full" />
                    <div style={{ border: `1px solid ${theme.textColor}` }} className="w-3 h-3 rounded-sm" />
                  </div>
                </div>

                {/* Messages — scrollable, fixed height, CTA is OUTSIDE scroll area */}
                <div
                  ref={scrollRef}
                  className="flex flex-col gap-2.5 px-3 pt-3 pb-0 overflow-y-auto flex-1"
                  style={{
                    background: isLight ? '#ececee' : 'transparent',
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${theme.scrollThumb} ${theme.scrollTrack}`,
                  }}
                >
                  <AnimatePresence initial={false}>
                    {CONVERSATION.slice(0, visibleMessages).map((msg, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className={`flex gap-1.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        {msg.from === 'bot' && (
                          <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                            className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                            <img src={theme.avatarSrc} alt="" className="w-full h-full object-contain p-0.5" />
                          </div>
                        )}
                        <div style={{
                          background: theme.msgBg,
                          border: `1px solid ${theme.border}`,
                          borderRadius: msg.from === 'bot' ? '2px 10px 10px 10px' : '10px 10px 2px 10px',
                          maxWidth: '82%',
                        }} className="px-2.5 py-1.5 text-[10px] leading-relaxed">
                          {msg.from === 'bot' && i === visibleMessages - 1 ? (
                            <TypedText text={msg.text} color={theme.textColor} onChar={scrollToBottom} />
                          ) : (
                            <span style={{ color: msg.from === 'user' ? theme.userTextColor : theme.textColor }}>{msg.text}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator for main conversation */}
                    {typingIdx >= 0 && typingIdx < 1000 && (
                      <motion.div key={typingIdx}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className="flex gap-1.5">
                        <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                          className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                          <img src={theme.avatarSrc} alt="" className="w-full h-full object-contain p-0.5" />
                        </div>
                        <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}`, borderRadius: '2px 10px 10px 10px' }}
                          className="flex items-center gap-1 px-2.5 py-2">
                          {[0, 1, 2].map(d => (
                            <motion.div key={d} style={{ background: theme.subtleText }} className="w-1 h-1 rounded-full"
                              animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 1, delay: d * 0.18, repeat: Infinity }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Extra messages from auto/details flow */}
                  {extraMessages.map((msg, i) => (
                    <motion.div key={'extra-'+i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28 }}
                      className={`flex gap-1.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {msg.from === 'bot' && (
                        <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                          className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                          <img src={theme.avatarSrc} alt="" className="w-full h-full object-contain p-0.5" />
                        </div>
                      )}
                      <div style={{
                        background: theme.msgBg,
                        border: `1px solid ${theme.border}`,
                        borderRadius: msg.from === 'bot' ? '2px 10px 10px 10px' : '10px 10px 2px 10px',
                        maxWidth: '82%',
                      }} className="px-2.5 py-1.5 text-[10px] leading-relaxed">
                        <span style={{ color: msg.from === 'user' ? theme.userTextColor : theme.textColor }}>{msg.text}</span>
                      </div>
                    </motion.div>
                  ))}
                  {/* Typing indicator for auto-flow bot messages */}
                  {typingIdx >= 1000 && (
                    <motion.div key={'auto-typing'}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex gap-1.5">
                      <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                        className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                        <img src={theme.avatarSrc} alt="" className="w-full h-full object-contain p-0.5" />
                      </div>
                      <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}`, borderRadius: '2px 10px 10px 10px' }}
                        className="flex items-center gap-1 px-2.5 py-2">
                        {[0, 1, 2].map(d => (
                          <motion.div key={d} style={{ background: theme.subtleText }} className="w-1 h-1 rounded-full"
                            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, delay: d * 0.18, repeat: Infinity }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {/* Bottom spacer — keeps last message off the very bottom, collapses when CTA appears */}
                  <div style={{
                    height: showCTA ? 0 : 32,
                    flexShrink: 0,
                    overflow: 'hidden',
                  }} />
                </div>

                {/* CTA */}
                <AnimatePresence>
                  {showCTA && detailsMode !== 'auto' && (
                    <motion.div
                      ref={ctaRef}
                      key="cta"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ background: isLight ? '#ececee' : 'transparent' }}
                      className="px-3 pt-2.5 pb-2.5 flex-shrink-0"
                    >
                      <div className="flex flex-col gap-1.5">
                        {detailsMode === null && (
                          <>
                            <p style={{ color: theme.subtleText }} className="text-[9px] text-center">How would you like to proceed?</p>
                            <div className="flex gap-2">
                              <div onClick={onGetStarted} className="flex-1 py-1.5 bg-emerald-500 text-white text-[9px] font-semibold rounded-lg text-center cursor-pointer hover:bg-emerald-400 transition-colors">
                                Get Started
                              </div>
                              <div onClick={() => {
                                userEngagedRef.current = true;
                                clearAll();
                                if (inputIntervalRef.current) { clearInterval(inputIntervalRef.current); inputIntervalRef.current = null; }
                                setInputTypingText('');
                                setDetailsMode('email');
                                setExtraMessages(m => [...m, { from: 'user', text: 'Send my details' }]);
                                setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: "I'll pass your details to our team. What is your email address?" }]), 900);
                              }} style={{ background: theme.msgBg, border: `1px solid ${theme.border}`, color: theme.textColor }} className="flex-1 py-1.5 text-[9px] font-semibold rounded-lg text-center cursor-pointer hover:opacity-80 transition-opacity">
                                Send my details
                              </div>
                            </div>
                          </>
                        )}
                        {detailsMode === 'email' && (
                          <div className="flex gap-1.5">
                            <input
                              autoFocus
                              type="email"
                              placeholder="your@email.com"
                              style={{ background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.textColor, fontSize: 10 }}
                              className="flex-1 rounded-lg px-2 py-1.5 outline-none"
                              onKeyDown={e => {
                                if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                                  const val = (e.target as HTMLInputElement).value;
                                  (e.target as HTMLInputElement).value = '';
                                  setExtraMessages(m => [...m, { from: 'user', text: val }]);
                                  setDetailsMode('company');
                                  setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: "Got it. And your company name and website URL?" }]), 800);
                                }
                              }}
                            />
                            <div style={{ background: '#00BC7D' }} className="px-2.5 py-1.5 rounded-lg text-[9px] text-white font-semibold cursor-pointer flex items-center">Send</div>
                          </div>
                        )}
                        {detailsMode === 'company' && (
                          <div className="flex gap-1.5">
                            <input
                              autoFocus
                              type="text"
                              placeholder="Company name and website"
                              style={{ background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.textColor, fontSize: 10 }}
                              className="flex-1 rounded-lg px-2 py-1.5 outline-none"
                              onKeyDown={e => {
                                if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                                  const val = (e.target as HTMLInputElement).value;
                                  (e.target as HTMLInputElement).value = '';
                                  setExtraMessages(m => [...m, { from: 'user', text: val }]);
                                  setDetailsMode('thanks');
                                  setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: "Our team will review your site and reach out within 24 hours with a tailored plan." }]), 800);
                                  setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: "Have a great rest of your day. Is there anything else I can help you with?" }]), 2200);
                                }
                              }}
                            />
                            <div style={{ background: '#00BC7D' }} className="px-2.5 py-1.5 rounded-lg text-[9px] text-white font-semibold cursor-pointer flex items-center">Send</div>
                          </div>
                        )}
                        {detailsMode === 'thanks' && (
                          <div className="flex gap-1.5">
                            <input
                              autoFocus
                              type="text"
                              placeholder="Anything else?"
                              style={{ background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.textColor, fontSize: 10 }}
                              className="flex-1 rounded-lg px-2 py-1.5 outline-none"
                              onKeyDown={e => {
                                const val = (e.target as HTMLInputElement).value.trim();
                                if (e.key === 'Enter') {
                                  (e.target as HTMLInputElement).value = '';
                                  if (val) {
                                    setExtraMessages(m => [...m, { from: 'user', text: val }]);
                                    setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: "Our team will take note. Wishing you a great day ahead!" }]), 700);
                                  } else {
                                    setExtraMessages(m => [...m, { from: 'user', text: 'No, thank you!' }]);
                                    setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: "You're welcome. Take care!" }]), 700);
                                  }
                                  setDetailsMode('done');
                                }
                              }}
                            />
                            <div style={{ background: '#00BC7D' }} className="px-2.5 py-1.5 rounded-lg text-[9px] text-white font-semibold cursor-pointer flex items-center">Send</div>
                          </div>
                        )}
                        {detailsMode === 'done' && (
                          <p style={{ color: theme.accentDot }} className="text-[9px] text-center font-medium py-1">All set. We'll be in touch within 24h!</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chips — always visible */}
                <div style={{ background: isLight ? '#ececee' : 'transparent' }} className="flex gap-1.5 flex-wrap px-3 pb-2 flex-shrink-0">
                  {['AI deployment', 'Pricing', 'Free trial'].map(chip => (
                    <span key={chip}
                      style={{ color: theme.chipColor, border: `1px solid ${theme.border}`, background: theme.chipBg }}
                      className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap">{chip}</span>
                  ))}
                </div>

                {/* Input — always visible */}
                <div style={{ background: theme.headerBg, borderTop: `1px solid ${theme.border}` }} className="px-3 py-2.5 flex-shrink-0">
                  <div style={{ background: theme.inputBg, border: `1px solid ${theme.border}` }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2">
                    <span style={{ color: inputTypingText ? theme.textColor : theme.subtleText }} className="text-[11px] flex-1 truncate">
                      {inputTypingText || 'Send a message...'}
                      {inputTypingText && <span style={{ opacity: 0.5, color: theme.textColor }}>|</span>}
                    </span>
                    <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 10 16" fill="none">
                        <polyline points="2,1 9,8 2,15" stroke={theme.sendArrow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ background: theme.headerBg }} className="flex items-center gap-1 py-2 justify-center flex-shrink-0">
                  <span style={{ color: theme.subtleText, fontSize: '9px', letterSpacing: '0.04em' }}>Powered by</span>
                  <img src="https://i.ibb.co/WWGrHnHy/asd3.png" alt="" className="h-2.5 opacity-50"
                    style={{ filter: isLight ? 'brightness(0)' : 'brightness(2)' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── THEME DOT PULSE ─────────────────────────────────────────── */
// (placeholder removed)

/* ─── REF LOGOS CYCLER ────────────────────────────────────────── */
const REF_LOGOS = [
  { name: 'Ref 2', src: '/r2.avif', invert: true },
  { name: 'Ref 3', src: '/r3.avif', invert: false },
  { name: 'Ref 4', src: '/r4.avif', invert: true },
  { name: 'Ref 1', src: '/r1.avif', invert: false, opacity: 0.30, height: 28 },
];

function RefLogosCycler({ isDark }) {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<'visible' | 'blurout'>('visible');

  useEffect(() => {
    const t = setTimeout(() => setPhase('blurout'), 2800);
    return () => clearTimeout(t);
  }, [current]);

  useEffect(() => {
    if (phase !== 'blurout') return;
    const t = setTimeout(() => {
      setCurrent(c => (c + 1) % REF_LOGOS.length);
      setPhase('visible');
    }, 700);
    return () => clearTimeout(t);
  }, [phase]);

  const logo = REF_LOGOS[current];
  const targetOpacity = logo.opacity ?? 1;

  return (
    <div className="flex items-center justify-center" style={{ height: 48, minWidth: 120 }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={logo.src}
          alt={logo.name}
          className="w-auto object-contain"
          style={{ height: logo.height ?? 36, maxWidth: 160 }}
          initial={{ opacity: 0, filter: logo.invert ? 'blur(14px) invert(1)' : 'blur(14px)' }}
          animate={phase === 'visible'
            ? { opacity: targetOpacity, filter: logo.invert ? 'blur(0px) invert(1)' : 'blur(0px)' }
            : { opacity: 0, filter: logo.invert ? 'blur(14px) invert(1)' : 'blur(14px)' }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
        />
      </AnimatePresence>
    </div>
  );
}

/* ─── ANIMATED STAR REVIEW ────────────────────────────────────── */
function AnimatedStarReview({ isDark }) {
  const [starsVisible, setStarsVisible] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '0px' });

  useEffect(() => {
    if (!inView) { setStarsVisible(0); return; }
    setStarsVisible(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setStarsVisible(i);
      if (i >= 5) clearInterval(interval);
    }, 1500 / 5);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center gap-2 mt-2 w-full" style={{ maxWidth: 320 }}>
      <div className="flex gap-0.5 mb-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={starsVisible > i ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <Star className='size-4' style={{ color: '#00BC7D', fill: '#00BC7D' }} />
          </motion.div>
        ))}
      </div>
      <p className={`text-base font-semibold italic leading-snug ${isDark ? 'text-white' : 'text-zinc-900'}`}>
        "Best hire we never made."
      </p>
      <span className={`text-sm font-light ${isDark ? 'text-white/50' : 'text-zinc-400'}`}>— Verkkopantteri.fi</span>
    </div>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function HeroSlide({ activeTheme, setActiveTheme, onGetStarted }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const isDark = activeTheme === 'dark';

  return (
    <motion.section ref={ref} style={{ opacity, scale }}
      className={`h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
      {/* AI head image — right side, bottom-anchored */}
      <img
        src="/br-bb.avif"
        alt=""
        className="absolute pointer-events-none select-none"
        style={{
          right: '-2%',
          bottom: 0,
          height: '88%',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom right',
          opacity: isDark ? 0.82 : 0.55,
          maskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 80%, transparent 100%), linear-gradient(to top, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 80%, transparent 100%), linear-gradient(to top, black 60%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'destination-in',
          zIndex: 1,
        }}
      />
      {/* Overlay */}
      {isDark && <div className="absolute inset-0 bg-zinc-950/30" />}
      {!isDark && <div className="absolute inset-0 bg-white/15" />}
      <ParticleField count={isDark ? 24 : 0} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* LEFT */}
        <motion.div style={{ y }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center flex-shrink-0 max-w-xl">

          <h1 className="text-7xl md:text-8xl font-light mb-6 leading-tight text-white">
            Never Miss<br />a Lead
          </h1>
          <p className={`text-xl font-light mb-4 max-w-lg mx-auto ${isDark ? 'text-white/90' : 'text-zinc-600'}`}>
            AI Chatbot trained on your business knowledge.
          </p>

          {/* Testimonial under tagline */}
          <div className="flex flex-col items-center gap-1 mb-6">
            <div className="flex gap-0.5 mb-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-3.5" style={{ color: '#00BC7D', fill: '#00BC7D' }} />
              ))}
            </div>
            <p className={`text-sm italic ${isDark ? 'text-white/70' : 'text-zinc-600'}`}>
              "Best hire we never made."
            </p>
            <span className={`text-xs ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>— Verkkopantteri.fi</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <button onClick={onGetStarted}
              className={`group px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-2 transition-colors ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>
              Get Started
            </button>
            <a href="#tia-in-action"
              className="px-8 py-4 rounded-full text-base font-semibold transition-colors bg-white text-zinc-950 hover:bg-zinc-100">
              See Example
            </a>
          </div>

          {/* Trust bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex items-center gap-0 flex-wrap justify-center mb-8">
            {['Setup in 48h', 'No code', '100+ Languages', 'Cancel anytime'].map((item, i) => (
              <span key={item} className={`flex items-center text-xs font-medium ${isDark ? 'text-white/70' : 'text-zinc-600'}`}>
                {i > 0 && <span className={`mx-2.5 ${isDark ? 'text-white/30' : 'text-zinc-400'}`}>·</span>}
                {item}
              </span>
            ))}
          </motion.div>

          {/* GDPR badge + Shopify + WordPress */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-6">
            <img src="/gdpr_certification.avif" alt="GDPR Certified" className="object-contain" style={{ height: 48, width: 'auto' }} />
            <img src="/icon_shopify.avif" alt="Shopify" className="object-contain rounded-lg" style={{ height: 48, width: 'auto' }} />
            <img src="/icon_wordpress.avif" alt="WordPress" className="object-contain rounded-lg" style={{ height: 48, width: 'auto' }} />
          </motion.div>

          <RefLogosCycler isDark={isDark} />

        </motion.div>

        {/* RIGHT — chat stack */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex-shrink-0 hidden lg:flex flex-col items-center gap-4" style={{ width: 380 }}>
          <ChatStack activeTheme={activeTheme} />
        </motion.div>
      </div>


    </motion.section>
  );
}

/* ─── SHOWCASE SLIDE (poistettu) ─────────────────────────────── */
function ShowcaseSlide({ activeTheme }) { return null; }

/* ─── TIA IN ACTION ───────────────────────────────────────────── */
function TiaInActionSlide({ activeTheme, onGetStarted }) {
  const [chatTheme, setChatTheme] = useState('dark');
  const isDark = chatTheme === 'dark';
  const theme = CHAT_THEMES[chatTheme];
  const wrapRef = useRef(null);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start 0.85', 'end end'] });

  const brightness = useTransform(scrollYProgress, [0, 0.7], [1.5, 1]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);
  const clipProgress = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const clipPath = useTransform(clipProgress, (p) => `inset(0 ${Math.max(0, 100 - p)}% 0 0)`);
  const x = useTransform(scrollYProgress, [0, 0.6], [30, 0]);

  return (
    <div id="tia-in-action" ref={wrapRef} className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Background — matches header: white bg with hero image overlay */}
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://6a1d4cd40bc623d413b1bf9a.imgix.net/theme-bl.avif)' }} />
      <div className="absolute inset-0 bg-zinc-950/75" />
      <ParticleField count={18} />

      {/* Content layer — exact 100vh, everything visible at once */}
      <motion.section ref={ref} style={{ filter, clipPath, x, minHeight: '100vh' }}
        className="relative flex flex-col px-6 pt-20 pb-4">

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col flex-1">

          {/* Main row: text left, chat right — takes all available space */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 flex-1 py-4">

            {/* LEFT — wider, more text space */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-left">

              <motion.h2 className="text-5xl md:text-6xl font-light leading-[1.05] mb-4"
                style={{ color: '#ffffff' }}>
                Next-gen live chat support —<br /><span style={{ color: '#ffffff' }}>powered by the world's<br />smartest AI Agent.</span>
              </motion.h2>

              <p className="text-base font-light mb-6 leading-relaxed max-w-xl text-white/80">
                TIA delivers instant, human-like support through live chat. The AI Agent resolves complex customer inquiries, learns from every conversation, and continuously adapts to your business. Working around the clock, TIA helps increase conversions, reduce support workload, and deliver exceptional customer experiences.
              </p>

              {/* CTA buttons */}
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-5">
                <button onClick={onGetStarted}
                  className="px-7 py-3 rounded-full text-sm font-semibold transition-colors bg-white text-zinc-950 hover:bg-zinc-100">
                  Get Started
                </button>
                <a href="#features"
                  className="px-7 py-3 rounded-full text-sm font-semibold border transition-colors border-zinc-700 text-white hover:bg-zinc-800">
                  See features
                </a>
              </div>

              {/* Bullet points */}
              <div className="flex items-center gap-0 flex-wrap justify-center lg:justify-start mb-5">
                {['Setup in minutes', '100+ Languages', 'Cancel anytime'].map((item, i) => (
                  <span key={item} className="flex items-center text-xs font-medium text-white">
                    {i > 0 && <span className="mx-2 text-white/30">·</span>}
                    {item}
                  </span>
                ))}
              </div>

              {/* Theme switcher */}
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-5">
                <motion.button onClick={() => setChatTheme('dark')}
                  animate={chatTheme !== 'dark' ? { borderColor: ['#d4d4d8', '#09090b', '#d4d4d8'] } : { borderColor: '#71717a' }}
                  transition={chatTheme !== 'dark' ? { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' } : { duration: 0.4 }}
                  style={{ borderWidth: 2, borderStyle: 'solid' }}
                  className={`w-6 h-6 rounded-full transition-transform bg-zinc-900 ${chatTheme === 'dark' ? 'scale-110 shadow-lg shadow-white/10' : ''}`} />
                <motion.button onClick={() => setChatTheme('light')}
                  animate={chatTheme !== 'light' ? { borderColor: ['#e4e4e7', '#52525b', '#e4e4e7'] } : { borderColor: '#a1a1aa' }}
                  transition={chatTheme !== 'light' ? { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' } : { duration: 0.4 }}
                  style={{ borderWidth: 2, borderStyle: 'solid' }}
                  className={`w-6 h-6 rounded-full transition-transform bg-white ${chatTheme === 'light' ? 'scale-110 shadow-md' : ''}`} />
              </div>

              {/* Review — moved here from bottom strip */}
              <div className="flex flex-col items-center lg:items-start gap-0.5">
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4" style={{ color: '#00BC7D', fill: '#00BC7D' }} />
                  ))}
                </div>
                <p className="text-sm font-semibold italic text-white">"Best hire we never made."</p>
                <span className="text-xs text-white/40">— Verkkopantteri.fi</span>
              </div>
            </motion.div>

            {/* RIGHT — chat + icons below */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }}
              className="flex-shrink-0 flex flex-col items-center justify-center gap-3"
              style={{ marginLeft: '-50px' }}>
              <AnimatedChatLoop theme={theme} onGetStarted={onGetStarted} />
              {/* GDPR icon + Compatible + platform icons */}
              <div className="flex items-center gap-3 flex-wrap justify-center" style={{ width: 320 }}>
                <img src="/gdpr_certification.avif" alt="GDPR" className="object-contain flex-shrink-0 transition-all duration-200 hover:scale-110 hover:brightness-110" style={{ height: 36, width: 'auto' }} />
                <span className="text-xs font-medium text-zinc-400">Compatible</span>
                <img src="/icon_shopify.avif" alt="Shopify" className="object-contain rounded flex-shrink-0 transition-all duration-200 hover:scale-110 hover:brightness-110" style={{ height: 36, width: 'auto' }} />
                <img src="/icon_wordpress.avif" alt="WordPress" className="object-contain rounded flex-shrink-0 transition-all duration-200 hover:scale-110 hover:brightness-110" style={{ height: 36, width: 'auto', filter: 'invert(1)' }} />
                <img src="/icon_wix.avif" alt="Wix" className="object-contain rounded flex-shrink-0 transition-all duration-200 hover:scale-110 hover:brightness-110" style={{ height: 40, width: 'auto', filter: 'invert(1)' }} />
              </div>
            </motion.div>
          </div>

        </div>
      </motion.section>
    </div>
  );
}


/* ─── PAPER SLIDESHOW ─────────────────────────────────────────── */
const SLIDES = [
  { src: '/pg-4.avif', label: 'Page 4' },
  { src: '/pg-3.avif', label: 'Page 3' },
  { src: '/pg-2.avif', label: 'Page 2' },
  { src: '/pg-1.avif', label: 'Page 1' },
];

function LightboxModal({ slide, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
          <X className="size-5" />
        </button>

        {/* Label */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-white/10 text-white/70 border border-white/15">
          {slide.label} · {SLIDES.indexOf(slide) + 1} / {SLIDES.length}
        </div>

        {/* Prev */}
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <polyline points="8,1 3,6 8,11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Next */}
        <button onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <polyline points="4,1 9,6 4,11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Image */}
        <motion.div
          key={slide.src}
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '85vw', maxHeight: '85vh',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)',
            borderRadius: 16, overflow: 'hidden',
          }}
        >
          <img
            src={slide.src}
            alt={slide.label}
            style={{ maxWidth: '85vw', maxHeight: '85vh', display: 'block', borderRadius: 16 }}
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const PaperStack = React.forwardRef(function PaperStack({ isDark }, ref) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Expose closeLightbox to parent via ref
  React.useImperativeHandle(ref, () => ({
    closeLightbox: () => setLightboxOpen(false),
  }));

  const closeLightbox = () => setLightboxOpen(false);
  const prevLightbox = () => { setDirection(-1); setActiveIdx(i => (i - 1 + SLIDES.length) % SLIDES.length); };
  const nextLightbox = () => { setDirection(1); setActiveIdx(i => (i + 1) % SLIDES.length); };

  // Auto-advance — pauses while lightbox is open
  useEffect(() => {
    if (lightboxOpen) return;
    const t = setInterval(() => {
      setDirection(1);
      setActiveIdx(i => (i + 1) % SLIDES.length);
    }, 3200);
    return () => clearInterval(t);
  }, [lightboxOpen]);

  const goTo = (idx) => {
    if (idx === activeIdx || isAnimating) return;
    setDirection(idx > activeIdx ? 1 : -1);
    setActiveIdx(idx);
  };

  const prev = () => {
    setDirection(-1);
    setActiveIdx(i => (i - 1 + SLIDES.length) % SLIDES.length);
  };

  const next = () => {
    setDirection(1);
    setActiveIdx(i => (i + 1) % SLIDES.length);
  };

  // Stack offsets for the background cards (not the active one)
  const getStackStyle = (offset) => ({
    position: 'absolute',
    inset: 0,
    transform: `translateY(${offset * 8}px) translateX(${offset * 5}px) scale(${1 - offset * 0.03})`,
    zIndex: 10 - offset,
  });

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* Stack container */}
      <div style={{ position: 'relative', width: 300, height: 400 }}>
        {/* Background stacked cards (peek effect) */}
        {[3, 2, 1].map((offset) => {
          const stackIdx = (activeIdx + offset) % SLIDES.length;
          return (
            <div key={stackIdx} style={getStackStyle(offset)}>
              <div
                className="w-full h-full rounded-2xl overflow-hidden"
                style={{
                  boxShadow: isDark
                    ? `0 ${8 + offset * 4}px ${24 + offset * 8}px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)`
                    : `0 ${8 + offset * 4}px ${24 + offset * 8}px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8)`,
                  border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
                  background: isDark ? '#27272a' : '#f4f4f5',
                  filter: `brightness(${1 - offset * 0.12})`,
                }}
              >
                <img
                  src={SLIDES[stackIdx].src}
                  alt={SLIDES[stackIdx].label}
                  className="w-full h-full object-cover"
                  style={{ opacity: 1 - offset * 0.15 }}
                />
              </div>
            </div>
          );
        })}

        {/* Active (front) card */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, x: direction * 40, scale: 0.97, rotateY: direction * 8 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, x: -direction * 40, scale: 0.96, rotateY: -direction * 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            style={{ position: 'absolute', inset: 0, zIndex: 20 }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
          >
            <div
              className="w-full h-full rounded-2xl overflow-hidden cursor-zoom-in group/card relative"
              style={{
                boxShadow: isDark
                  ? '0 24px 60px rgba(0,0,0,0.75), 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
                  : '0 24px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              }}
              onClick={() => setLightboxOpen(true)}
            >
              {/* Zoom hint */}
              <div className="absolute top-3 right-3 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </div>
              </div>
              {/* Glossy reflection overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, transparent 55%)',
                  borderRadius: 'inherit',
                }}
              />
              {/* Floor reflection */}
              <div
                className="absolute -bottom-px left-4 right-4 pointer-events-none"
                style={{
                  height: 40,
                  background: isDark
                    ? 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
                    : 'linear-gradient(to top, rgba(255,255,255,0.35), transparent)',
                  filter: 'blur(6px)',
                  transform: 'scaleY(-1) translateY(-4px)',
                  borderRadius: '0 0 16px 16px',
                  opacity: 0.7,
                }}
              />
              <img
                src={SLIDES[activeIdx].src}
                alt={SLIDES[activeIdx].label}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 z-30 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700' : 'bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-200 shadow-md'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <polyline points="8,1 3,6 8,11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={next}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 z-30 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700' : 'bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-200 shadow-md'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <polyline points="4,1 9,6 4,11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === activeIdx ? 20 : 6,
              height: 6,
              background: i === activeIdx
                ? (isDark ? '#fff' : '#09090b')
                : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
            }}
          />
        ))}
      </div>

      <p className={`text-xs font-light tracking-widest uppercase ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
        {SLIDES[activeIdx].label} · {activeIdx + 1} / {SLIDES.length}
      </p>

      {/* Lightbox */}
      {lightboxOpen && (
        <LightboxModal
          slide={SLIDES[activeIdx]}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </div>
  );
});

/* ─── FEATURES ────────────────────────────────────────────────── */
function FeaturesSlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center center'] });
  const { scrollYProgress: scrollFull } = useScroll({ target: ref, offset: ['start end', 'end start'] });


  // 3D tilt: tilted away at bottom of viewport, flattens to 0 as it scrolls in
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  // Close lightbox automatically when scrolled away from section
  const paperStackRef = useRef<{ closeLightbox: () => void }>(null);
  useEffect(() => {
    return scrollFull.on('change', (v) => {
      if (v <= 0.05 || v >= 0.95) {
        paperStackRef.current?.closeLightbox();
      }
    });
  }, [scrollFull]);

  const [chatTheme, setChatTheme] = useState('dark');
  const theme = CHAT_THEMES[chatTheme];

  const features = [
    { icon: MessageSquare, title: 'Any website', desc: 'WordPress, Shopify, custom — one snippet.' },
    { icon: Brain, title: 'Trained on you', desc: 'Knows your products, FAQs, pricing.' },
    { icon: Clock, title: '24/7 availability', desc: 'Always available, even at 3am.' },
    { icon: TrendingUp, title: 'Converts leads', desc: 'Guides visitors to book, buy, contact.' },
    { icon: Zap, title: 'Progressive learning', desc: 'Gets smarter over time with data.' },
    { icon: Users, title: 'Analytics', desc: 'Turn conversations into real-time decisions.' },
  ];

  return (
    <div style={{ perspective: '1200px', overflow: 'hidden' }}>
      <motion.section
        ref={ref}
        id="features"
        style={{ rotateX, scale, opacity, y }}
        className="min-h-screen flex items-center justify-center bg-zinc-950 py-20 px-6 relative overflow-hidden"
      >
      <video src="/dots.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-zinc-950/20" />
      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }} className="mb-14">
          <h2 className="text-5xl md:text-6xl font-light mb-3 text-white">The AI team</h2>
          <p className="text-lg font-light text-zinc-400">Turn data into smarter decisions.</p>
        </motion.div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-20">

          {/* LEFT — Paper slideshow with title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }}
            className="flex-shrink-0 flex flex-col gap-3"
          >
            <h3 className="text-lg font-semibold text-white tracking-tight">Analytics dashboard</h3>
            <PaperStack isDark={isDark} ref={paperStackRef} />
          </motion.div>

          {/* RIGHT — TIA Widget with theme buttons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }}
            className="flex flex-col gap-3 items-start"
          >
            <h3 className="text-lg font-semibold text-white tracking-tight">TIA Widget</h3>
            <AnimatedChatLoop theme={theme} onGetStarted={() => {}} />
            {/* Theme switcher */}
            <div className="flex items-center gap-2 mt-1">
              <motion.button onClick={() => setChatTheme('dark')}
                animate={chatTheme !== 'dark' ? { borderColor: ['#d4d4d8', '#09090b', '#d4d4d8'] } : { borderColor: '#71717a' }}
                transition={chatTheme !== 'dark' ? { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' } : { duration: 0.4 }}
                style={{ borderWidth: 2, borderStyle: 'solid' }}
                className={`w-6 h-6 rounded-full transition-transform bg-zinc-900 ${chatTheme === 'dark' ? 'scale-110 shadow-lg shadow-white/10' : ''}`} />
              <motion.button onClick={() => setChatTheme('light')}
                animate={chatTheme !== 'light' ? { borderColor: ['#e4e4e7', '#52525b', '#e4e4e7'] } : { borderColor: '#a1a1aa' }}
                transition={chatTheme !== 'light' ? { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' } : { duration: 0.4 }}
                style={{ borderWidth: 2, borderStyle: 'solid' }}
                className={`w-6 h-6 rounded-full transition-transform bg-white ${chatTheme === 'light' ? 'scale-110 shadow-md' : ''}`} />
            </div>
          </motion.div>
        </div>
      </div>
      </motion.section>
    </div>
  );
}

/* ─── PRICING ─────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'M',
    name: 'S',
    label: 'Core',
    tagline: '',
    price: '149€',
    priceNum: 149,
    period: '/month',
    volume: '',
    chatsPerDay: '3–5 chats a day',
    messagesLimit: '1,000 messages / month',
    additionalUsage: '€0.02 / message',
    features: [
      'Trained on your content',
      'AI evolves weekly with new data',
      'Analytics dashboard',
      'Email support',
      '48h setup',
    ],
    support: 'Email support',
    highlight: false,
  },
  {
    id: 'L',
    name: 'M',
    label: 'Pro',
    tagline: '',
    price: '299€',
    priceNum: 299,
    period: '/month',
    volume: '',
    chatsPerDay: '6–10 chats a day',
    messagesLimit: '2,500 messages / month',
    additionalUsage: '€0.01 / message',
    features: [
      'Trained on your content',
      'AI evolves weekly with new data',
      'Analytics dashboard',
      'Auto-detected and alert hot leads',
      'Lead capture integration',
      'Priority support',
    ],
    support: 'Priority support',
    highlight: true,
  },
  {
    id: 'XL',
    name: 'L',
    label: 'Enterprise',
    tagline: '',
    price: '699€',
    priceNum: 699,
    period: '/month',
    volume: '',
    chatsPerDay: '20–40 chats a day',
    messagesLimit: '10,000 messages / month',
    additionalUsage: '€0.01 / message',
    features: [
      'Trained on your content',
      'AI evolves weekly with new data',
      'Analytics dashboard',
      'Auto-detected and alert hot leads',
      'Lead capture integration',
      'Priority support',
    ],
    support: 'Priority support',
    highlight: false,
  },
];

const ADDONS = [
  { id: 'template_bot', label: "Use TIA's Template Bot (Black or White)", desc: 'Permanently -20% off your plan', discount: 0.20 },
  { id: 'custom_brand', label: 'Custom Branded & Styled Bot', desc: 'Fully tailored to your brand identity', discount: 0 },
];

function PricingSlide({ activeTheme, onGetStarted }) {
  const isDark = activeTheme === 'dark';
  const [planIdx, setPlanIdx] = useState(0);
  const [addonBotSetup, setAddonBotSetup] = useState(''); // 'tia' | 'custom' | ''
  const plan = PLANS[planIdx];
  const discountedPrice = addonBotSetup === 'tia' ? Math.round(plan.priceNum * 0.80) : plan.priceNum;
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 0.9', 'center center'] });

  // Implosion from blur + slight scale — content materialises from nothing
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const blurVal = useTransform(scrollYProgress, [0, 0.6], [10, 0]);
  const sectionFilter = useTransform(blurVal, (b) => `blur(${b}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const trackBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const fillColor = isDark ? '#ffffff' : '#09090b';
  const fillPct = (planIdx / (PLANS.length - 1)) * 100;

  const getPctFromEvent = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const snapToNearest = (pct) => {
    const raw = pct * (PLANS.length - 1);
    setPlanIdx(Math.round(raw));
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    e.preventDefault();
    const move = (e) => {
      if (!isDragging.current) return;
      snapToNearest(getPctFromEvent(e.clientX));
    };
    const up = () => { isDragging.current = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    const move = (e) => {
      if (!isDragging.current) return;
      snapToNearest(getPctFromEvent(e.touches[0].clientX));
    };
    const end = () => { isDragging.current = false; window.removeEventListener('touchmove', move); window.removeEventListener('touchend', end); };
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);
  };

  return (
    <div style={{ overflow: 'hidden' }}>
    <motion.section
      ref={sectionRef}
      id="pricing"
      style={{ scale, filter: sectionFilter, opacity }}
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'} py-16 px-6 relative overflow-hidden`}
    >
      <ParticleField count={isDark ? 10 : 0} />
      <div className="max-w-2xl mx-auto w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }} className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-light mb-3 text-white">Hire Your <span style={{ color: '#ffffff' }}>AI Agent</span></h2>
          <p className="text-lg font-light text-zinc-500">Save thousands every month by automating customer support.</p>
        </motion.div>

        {/* Main plan card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.88 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.1 }}
          className={`rounded-2xl p-8 relative border transition-colors duration-300 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}
        >
            {/* Plan selector — inside card */}
            <div className={`mb-6 pb-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <div className="flex justify-between mb-3">
                {PLANS.map((p, i) => (
                  <button key={p.id} onClick={() => setPlanIdx(i)}
                    className={`flex flex-col items-center gap-0.5 transition-colors ${i === planIdx ? (isDark ? 'text-white' : 'text-zinc-950') : (isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600')}`}>
                    <span className="text-xs font-semibold">{p.name}</span>
                  </button>
                ))}
              </div>
              <div
                ref={trackRef}
                className="relative h-4 rounded-full cursor-pointer select-none"
                style={{ background: trackBg }}
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setPlanIdx(Math.round(pct * (PLANS.length - 1)));
                }}
              >
                <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200"
                  style={{ width: `${fillPct}%`, background: fillColor }} />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-3 shadow-xl cursor-grab active:cursor-grabbing"
                  style={{
                    left: `${fillPct}%`,
                    background: fillColor,
                    borderColor: isDark ? '#3f3f46' : '#e4e4e7',
                    border: `3px solid ${isDark ? '#3f3f46' : '#e4e4e7'}`,
                    boxShadow: isDark ? '0 0 0 2px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.5)' : '0 0 0 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.2)',
                    transition: 'left 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 1.15 }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                />
              </div>
            </div>

            {/* Bot Setup — single choice */}
            <div className={`mb-6 pb-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <p className={`text-xs font-semibold mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Bot Setup</p>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'tia', title: 'TIA Theme', subtitle: 'White or Black', badge: '−20% forever', badgeColor: 'text-emerald-400' },
                  { id: 'custom', title: 'Custom Theme', subtitle: 'Fully personalized', badge: null, badgeColor: '' },
                ].map(opt => {
                  const active = addonBotSetup === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setAddonBotSetup(v => v === opt.id ? '' : opt.id)}
                      className={`flex items-start gap-3 w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                        active
                          ? isDark ? 'border-white bg-white/10' : 'border-zinc-950 bg-zinc-950'
                          : isDark ? 'border-zinc-700 hover:border-zinc-500' : 'border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${
                        active ? 'bg-white border-white' : isDark ? 'border-zinc-600' : 'border-zinc-300'
                      }`}>
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-xs font-semibold ${active ? 'text-white' : isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {opt.title}
                          <span className={`ml-1.5 font-normal ${active ? 'opacity-70' : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{opt.subtitle}</span>
                        </p>
                        {opt.badge && (
                          <span className={`text-xs font-medium ${active ? opt.badgeColor : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{opt.badge}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>{plan.name}</span>
                <span className={`text-2xl font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.label}</span>
                {plan.highlight && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-200 text-zinc-700'}`}>
                    Most popular
                  </span>
                )}
              </div>
              <div className="text-right">
                {addonBotSetup === 'tia' ? (
                  <div className="flex flex-col items-end">
                    <div className={`text-sm line-through ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{plan.price}</div>
                    <div className={`text-4xl font-light ${isDark ? 'text-white' : 'text-zinc-950'}`}>{discountedPrice}€</div>
                  </div>
                ) : (
                  <div className={`text-4xl font-light ${isDark ? 'text-white' : 'text-zinc-950'}`}>{plan.price}</div>
                )}
                <div className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{plan.period}</div>
              </div>
            </div>

            {/* Messages count + additional usage */}
            <div className="mb-1 flex flex-col gap-0">
              <div className="flex items-baseline gap-0">
                <span style={{ color: '#00BC7D' }} className="text-xs font-bold">≈ </span>
                <span className="text-xs font-bold" style={{ color: '#00BC7D' }}>{plan.chatsPerDay}</span>
              </div>
              <p className={`text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.messagesLimit}</p>
            </div>
            <p className={`text-xs mb-6 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Additional usage: {plan.additionalUsage}</p>

            <ul className="mb-8" style={{ height: 180, overflow: "hidden" }}>
              {plan.features.map(f => (
                <li key={f} className={`flex items-center gap-3 text-sm mb-2.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  <Check className="size-4 shrink-0" style={{ color: '#00BC7D' }} />
                  {f}
                </li>
              ))}
            </ul>

            <button onClick={() => onGetStarted(plan.id)}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>
              Get Started
            </button>
            <p className={`text-xs text-center mt-2 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Cancel anytime</p>

        </motion.div>

        {/* GDPR text items + icon on same row */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }} transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-5 mt-5 flex-wrap">
          {['GDPR-ready', 'Encrypted cloud storage', 'Data encrypted in transit and at rest', 'Data deletion on request'].map(item => (
            <span key={item} className={`flex items-center gap-1.5 text-xs font-light whitespace-nowrap ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <Check className="size-3 shrink-0" style={{ color: '#00BC7D' }} />
              {item}
            </span>
          ))}
        </motion.div>

      </div>
    </motion.section>
    </div>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTASlide({ activeTheme, onGetStarted }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 0.6], [80, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.88, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.6], [12, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div style={{ perspective: '1400px', overflow: 'hidden' }}>
      <motion.section ref={ref} style={{ y, scale, rotateX, opacity }}
        className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950" />
        <ParticleField count={20} />
        <div className="relative z-10 text-center px-6">
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.7 }}
            className="text-7xl md:text-8xl font-light mb-4 text-white leading-tight">
            Try It Free<br />for 14 Days
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.7, delay: 0.15 }}
            className="text-xl font-light mb-10 text-white/70 max-w-lg mx-auto">
            Try next-gen AI support in minutes and decide later.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onGetStarted}
              className="group inline-flex items-center gap-3 px-12 py-5 rounded-full text-lg font-semibold transition-all bg-white text-zinc-950 hover:bg-zinc-100">
              Start Trial <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-8 flex-wrap">
            {['No credit card required', 'Setup in 48 hours', 'Cancel anytime'].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-sm text-white/40">
                <Check className="size-3.5" style={{ color: '#00BC7D' }} />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
function Footer({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  return (
    <footer id="contact" className={`py-12 px-6 border-t transition-colors duration-700 ${isDark ? 'bg-zinc-950 text-zinc-400 border-zinc-800' : 'bg-white text-zinc-500 border-zinc-200'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={isDark ? '/logo.png' : '/logo-black.png'} alt="TIA AI" className="size-6 object-contain" />
              <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-zinc-950'}`}>TIA AI</span>
            </div>
            <p className="text-sm font-light leading-relaxed">Your website's smartest employee.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Case studies'] },
            { title: 'Company', links: ['About', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Terms', 'Privacy', 'Refund policy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>{col.title}</h4>
              <ul className="space-y-1.5">
                {col.links.map(link => (
                  <li key={link}><a href="#" className={`text-sm transition-colors ${isDark ? 'hover:text-white' : 'hover:text-zinc-950'}`}>{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={`border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <p className="text-xs">© 2025 TIA AI. All rights reserved.</p>
          <p className={`text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Powered by Anthropic's Claude API.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN ────────────────────────────────────────────────────── */
export function LandingPage() {
  const activeTheme = 'dark';
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadService, setLeadService] = useState('');

  const openLead = (service = '') => {
    setLeadService(service);
    setLeadOpen(true);
  };

  return (
    <>
      <style>{`html, body { background: #09090b !important; margin: 0; padding: 0; }`}</style>
    <div className="overflow-x-hidden bg-zinc-950" style={{ zoom: '1.0909', minHeight: '100vh', backgroundColor: '#09090b' }}>
      {leadOpen && <LeadFormModal isDark={true} onClose={() => setLeadOpen(false)} initialService={leadService} />}
      <Header isDark={true} onGetStarted={() => openLead()} />
      <HeroAISlide onGetStarted={() => openLead()} />
      <StatsStrip />
      <HowItWorksSlide />
      <ShowcaseSlide activeTheme={activeTheme} />
      <FeaturesSlide activeTheme={activeTheme} />
      <PricingSlide activeTheme={activeTheme} onGetStarted={(id) => openLead(id)} />
      <FAQSlide />
      <CTASlide activeTheme={activeTheme} onGetStarted={() => openLead()} />
      <Footer activeTheme={activeTheme} />
    </div>
    </>
  );
}

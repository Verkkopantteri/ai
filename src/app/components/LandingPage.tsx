import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowRight, Check, Menu, X, Star, ChevronRight,
  Zap, Brain, Shield, TrendingUp, Clock, Users, MessageSquare, Globe
} from 'lucide-react';

/* ─── PRICING CONSTANTS ───────────────────────────────────────── */
const MSG_PACKAGES = [
  { id: 'S', label: 'S', name: 'Starter', messages: 500, price: 49, avgChats: '~3–4 chats/day', hint: 'Great for small sites with occasional visitors' },
  { id: 'M', label: 'M', name: 'Medium', messages: 1000, price: 99, avgChats: '~8–15 chats/day', hint: 'For growing businesses with steady traffic' },
  { id: 'L', label: 'L', name: 'Large', messages: 2500, price: 199, avgChats: '~20–40 chats/day', hint: 'For busy sites with active customer conversations' },
  { id: 'XL', label: 'XL', name: 'Enterprise', messages: 10000, price: 499, avgChats: '~80–150 chats/day', hint: 'For high-traffic platforms with non-stop engagement' },
];

const THEMES_OPT = [
  { id: 'obsidian', label: 'Obsidian Black', dot: '#09090b', border: '#3f3f46', oneTime: 0 },
  { id: 'pearl', label: 'Pearl White', dot: '#fafafa', border: '#d4d4d8', oneTime: 0 },
  { id: 'custom', label: 'Custom', dot: 'linear-gradient(135deg,#6366f1,#ec4899)', border: '#6366f1', oneTime: 100 },
];

const ADDONS = [
  {
    id: 'training',
    label: 'Advanced Training, Updates & Security',
    sub: 'AI evolves with new data',
    options: [
      { id: 'monthly', label: 'Monthly updates', price: 20 },
      { id: 'weekly', label: 'Weekly updates', price: 50 },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics Dashboard',
    sub: 'Track conversations & conversions',
    options: [
      { id: 'basic', label: 'Basic', price: 0 },
      { id: 'advanced', label: 'Advanced', price: 50 },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    sub: 'How we help you',
    options: [
      { id: 'email', label: 'Email support', price: 0 },
      { id: 'priority', label: 'Priority (phone)', price: 40 },
    ],
  },
  {
    id: 'hotleads',
    label: 'Hot Lead Alerts',
    sub: 'Customer mentions something specific → chatlog sent to your email',
    options: [
      { id: 'off', label: 'Off', price: 0 },
      { id: 'on', label: 'Active', price: 50 },
    ],
  },
  {
    id: 'leadcapture',
    label: 'Lead Capture Integration',
    sub: 'Bot collects potential client info → sends to your email',
    options: [
      { id: 'off', label: 'Off', price: 0 },
      { id: 'on', label: 'Active', price: 50 },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery Speed',
    sub: 'How fast your bot goes live',
    options: [
      { id: 'standard', label: '1–5 days', price: 0 },
      { id: 'express', label: 'Within 48h', price: 20, oneTime: true },
    ],
  },
];

/* helper: compute total monthly + one-time */
function computeTotal(config) {
  const pkg = MSG_PACKAGES.find(p => p.id === config.pkg) || MSG_PACKAGES[0];
  const theme = THEMES_OPT.find(t => t.id === config.theme) || THEMES_OPT[0];
  let monthly = pkg.price;
  let oneTime = theme.oneTime || 0;
  for (const addon of ADDONS) {
    const sel = config.addons[addon.id];
    if (!sel) continue;
    const opt = addon.options.find(o => o.id === sel);
    if (!opt) continue;
    if (opt.oneTime) oneTime += opt.price;
    else monthly += opt.price;
  }
  return { monthly, oneTime };
}

/* ─── LEAD FORM MODAL ─────────────────────────────────────────── */
function LeadFormModal({ isDark, onClose, config }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: '', website: '', email: '' });
  const pkg = MSG_PACKAGES.find(p => p.id === config.pkg) || MSG_PACKAGES[0];
  const theme = THEMES_OPT.find(t => t.id === config.theme) || THEMES_OPT[0];
  const { monthly, oneTime } = computeTotal(config);

  const handleSubmit = () => {
    if (!form.company || !form.website || !form.email) return;
    setSubmitted(true);
  };

  const Row = ({ label, value }) => (
    <div className={`flex justify-between text-xs py-1.5 border-b ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-100 text-zinc-500'}`}>
      <span>{label}</span>
      <span className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>{value}</span>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className={`w-full max-w-lg rounded-2xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'}`}
        >
          <button onClick={onClose} className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${isDark ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'}`}>
            <X className="size-4" />
          </button>

          {!submitted ? (
            <>
              <h3 className={`text-2xl font-light mb-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Your Order Summary</h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Ongoing subscription · Cancel anytime</p>

              {/* Summary card */}
              <div className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-zinc-800/60 border border-zinc-700' : 'bg-zinc-50 border border-zinc-200'}`}>
                <Row label={`Package — ${pkg.label} (${pkg.messages.toLocaleString()} msg/mo)`} value={`${pkg.price}€/mo`} />
                <Row label={`Theme — ${theme.label}`} value={theme.oneTime ? `${theme.oneTime}€ one-time` : 'Included'} />
                {ADDONS.map(addon => {
                  const selId = config.addons[addon.id];
                  if (!selId) return null;
                  const opt = addon.options.find(o => o.id === selId);
                  if (!opt || opt.price === 0) return null;
                  return <Row key={addon.id} label={`${addon.label} — ${opt.label}`} value={opt.oneTime ? `${opt.price}€ one-time` : `+${opt.price}€/mo`} />;
                })}
                <div className={`flex justify-between text-sm pt-3 mt-1 font-semibold ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  <span>Total</span>
                  <span>{monthly}€/mo{oneTime > 0 ? ` + ${oneTime}€ one-time` : ''}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  { key: 'company', label: 'Company Name', placeholder: 'Acme Inc.' },
                  { key: 'website', label: 'Website URL', placeholder: 'https://yourcompany.com' },
                  { key: 'email', label: 'Email Address', placeholder: 'you@yourcompany.com' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{label}</label>
                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-600 focus:border-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 placeholder-zinc-400 focus:border-zinc-400'}`}
                    />
                  </div>
                ))}
                <button
                  onClick={handleSubmit}
                  className={`mt-1 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}
                >
                  Get Started →
                </button>
                <p className={`text-center text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>No commitment · Cancel anytime</p>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="size-6 text-emerald-400" />
              </div>
              <h3 className={`text-xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>You're all set!</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Thanks! We'll review your website and reach out within 24 hours with your custom AI chatbot setup.
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
  const [termsOpen, setTermsOpen] = useState(false);
  const termsRef = useRef(null);
  useEffect(() => {
    const h = (e) => { if (termsRef.current && !termsRef.current.contains(e.target)) setTermsOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

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
                  className={`px-3.5 py-2 text-base transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'}`}
                >{item.label}</motion.a>
              ))}
              <motion.div ref={termsRef} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.38 }}
                className="relative" onMouseEnter={() => setTermsOpen(true)} onMouseLeave={() => setTermsOpen(false)}>
                <button className={`flex items-center gap-1 px-3.5 py-2 text-base transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'}`}>
                  Terms
                  <motion.span animate={{ rotate: termsOpen ? 90 : 0 }} transition={{ duration: 0.2 }} className="inline-flex">
                    <ChevronRight className="size-3.5 opacity-70" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {termsOpen && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-[calc(100%+4px)] left-0 w-44 rounded-xl bg-white shadow-xl shadow-black/20 border border-zinc-100 overflow-hidden z-50 py-1">
                      {[{ label: 'Terms of Service', href: '#' }, { label: 'Privacy Policy', href: '#' }, { label: 'Refund Policy', href: '#' }].map(item => (
                        <a key={item.label} href={item.href}
                          className="block px-4 py-2.5 text-sm text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
                          onClick={() => setTermsOpen(false)}>{item.label}</a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </nav>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden md:flex items-center gap-3">
            <a href="#contact" className={`text-base transition-colors px-3 py-2 ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'}`}>Sign in</a>
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
        {['AI deployment', 'Pricing', 'Book a demo'].map(chip => (
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
      <motion.div initial={{ opacity: 0, x: 20, y: -10 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8 }}
        style={{ position: 'absolute', top: 0, right: -10, zIndex: 10, transform: 'rotate(5deg) translateX(10px) translateY(-10px)', filter: 'brightness(0.88)', pointerEvents: 'none' }}>
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

const CONVERSATION = [
  { from: 'bot',  text: "Hi! I'm TIA. How can I help you today?",                           delay: 600  },
  { from: 'user', text: "Hey, we just launched a new product. Can you help visitors find the right option?", delay: 1800 },
  { from: 'bot',  text: "Absolutely. I can guide visitors through your product range, ask qualifying questions, and recommend the right fit based on their needs.", delay: 3200 },
  { from: 'user', text: "What if someone wants to book a call instead?",                     delay: 5400 },
  { from: 'bot',  text: "No problem. I capture their details and schedule the call directly. Your team gets a notification right away.", delay: 7000 },
  { from: 'user', text: "How long does setup take?",                                         delay: 8800 },
  { from: 'bot',  text: "Usually 48 hours. We train TIA on your content and you're live. Check below 👇", delay: 10000 },
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

function AnimatedChatLoop({ theme }) {
  // phase: 'bubble' | 'chat'
  const [phase, setPhase] = useState('bubble');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [typingIdx, setTypingIdx] = useState(-1); // which bot msg is currently "typing"
  const [showCTA, setShowCTA] = useState(false);
  const timersRef = useRef([]);
  const scrollRef = useRef(null);
  const rafRef = useRef(null);
  const isLight = theme.name === 'Pearl White';
  const isLastMessage = (i) => i === CONVERSATION.length - 1;

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

  const runLoop = useCallback(() => {
    clearAll();
    setPhase('bubble');
    setVisibleMessages(0);
    setTypingIdx(-1);
    setShowCTA(false);

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
        addTimer(() => setVisibleMessages(v => v + 1), t);
      }
    });

    const lastDelay = 1400 + CONVERSATION[CONVERSATION.length - 1].delay;
    // First fade out the panel (keep content intact during exit anim)
    addTimer(() => setPhase('bubble'), lastDelay + 5500);
    // After exit animation (~650ms), reset content and restart
    addTimer(() => {
      setVisibleMessages(0);
      setTypingIdx(-1);
      setShowCTA(false);
      runLoop();
    }, lastDelay + 5500 + 650);
  }, []);

  useEffect(() => { runLoop(); return clearAll; }, []);

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
                            <TypedText text={msg.text} color={theme.textColor} onDone={isLastMessage(i) ? () => setTimeout(() => setShowCTA(true), 300) : undefined} onChar={scrollToBottom} />
                          ) : (
                            <span style={{ color: msg.from === 'user' ? theme.userTextColor : theme.textColor }}>{msg.text}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator — uses same key as the upcoming message so React REUSES the DOM node instead of unmount+mount */}
                    {typingIdx >= 0 && visibleMessages <= typingIdx && (
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
                  {/* Bottom spacer — keeps last message off the very bottom, collapses when CTA appears */}
                  <div style={{
                    height: showCTA ? 0 : 32,
                    flexShrink: 0,
                    overflow: 'hidden',
                  }} />
                </div>

                {/* CTA — OUTSIDE scroll area, always visible at bottom, never hidden */}
                <AnimatePresence>
                  {showCTA && (
                    <motion.div
                      key="cta"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ background: isLight ? '#ececee' : 'transparent' }}
                      className="px-3 pt-2.5 pb-2.5 flex-shrink-0"
                    >
                      <div className="w-full py-1.5 bg-emerald-500 text-white text-[10px] font-semibold rounded-lg text-center cursor-pointer hover:bg-emerald-400 transition-colors">
                        Get Started
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chips */}
                <div style={{ background: isLight ? '#ececee' : 'transparent' }} className="flex gap-1.5 flex-wrap px-3 pb-2 flex-shrink-0">
                  {['AI deployment', 'Pricing', 'Book a demo'].map(chip => (
                    <span key={chip}
                      style={{ color: theme.chipColor, border: `1px solid ${theme.border}`, background: theme.chipBg }}
                      className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap">{chip}</span>
                  ))}
                </div>

                {/* Input — matches MiniChat hero exactly */}
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

/* ─── THEME ARC HINT ──────────────────────────────────────────── */
function ThemeArcHint() {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // First show after 2.5s, then repeat every 6s
    const show = () => {
      setVisible(true);
      setKey(k => k + 1);
      setTimeout(() => setVisible(false), 2200);
    };
    const t0 = setTimeout(() => {
      show();
      const interval = setInterval(show, 6000);
      return () => clearInterval(interval);
    }, 2500);
    return () => clearTimeout(t0);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      left: 0, top: 0,
      width: '100%',
      pointerEvents: 'none',
      overflow: 'visible',
      zIndex: 50,
    }}>
      <AnimatePresence>
        {visible && (
          <motion.svg
            key={key}
            style={{ position: 'absolute', top: -70, left: 10, overflow: 'visible' }}
            width="220" height="80" viewBox="0 0 220 80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Arc path: starts near Obsidian button top, curves up and lands near Pearl White button */}
            <motion.path
              d="M 55 72 C 55 20, 165 20, 165 72"
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="1 0"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.6, ease: 'easeInOut', times: [0, 0.1, 0.8, 1] }}
            />
            {/* Travelling dot */}
            <motion.circle r="3" fill="white" opacity="0.9"
              initial={{ offsetDistance: '0%', opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.6, ease: 'easeInOut', times: [0, 0.05, 0.85, 1] }}
            >
              <animateMotion dur="1.6s" fill="freeze"
                path="M 55 72 C 55 20, 165 20, 165 72" />
            </motion.circle>
            {/* Small arrow tip at end */}
            <motion.path
              d="M 160 68 L 165 72 L 170 68"
              fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ duration: 1.6, times: [0, 0.7, 0.85, 1] }}
            />
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.9" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.85)" />
              </linearGradient>
            </defs>
          </motion.svg>
        )}
      </AnimatePresence>
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
      {/* Light/dark background — clean, no image */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-100 bg-zinc-950' : 'opacity-100 bg-white'}`} />
      <ParticleField count={isDark ? 24 : 0} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* LEFT */}
        <motion.div style={{ y }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center lg:text-left flex-shrink-0 max-w-xl">

          <h1 className={`text-7xl md:text-8xl font-light mb-6 leading-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            HIRE AI<br />STAY OPEN 24/7
          </h1>
          <p className={`text-xl font-light mb-6 max-w-lg ${isDark ? 'text-white/80' : 'text-zinc-600'}`}>
            TIA AI chatbots for your website — installed in minutes.
          </p>

          {/* Quote / review */}
          <div className={`flex items-start gap-3 mb-8 max-w-sm ${isDark ? '' : ''}`}>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`size-3.5 ${isDark ? 'text-white fill-white' : 'text-zinc-800 fill-zinc-800'}`} />
                ))}
              </div>
              <p className={`text-sm font-light italic leading-relaxed ${isDark ? 'text-white/70' : 'text-zinc-600'}`}>
                "Finally a fair price, and a nice spike in leads."
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/35' : 'text-zinc-400'}`}>— Early user</p>
            </div>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start relative">
            <ThemeArcHint />
            <button onClick={() => setActiveTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeTheme === 'dark'
                  ? 'bg-zinc-950 text-white border-zinc-700 shadow-lg'
                  : isDark ? 'border-white/20 text-white/50 hover:text-white/80' : 'border-zinc-300 text-zinc-500 hover:text-zinc-800'
              }`}>
              <span className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-600 flex-shrink-0" />
              Obsidian Black
            </button>
            <button onClick={() => setActiveTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeTheme === 'light'
                  ? 'bg-white text-zinc-950 border-zinc-300 shadow-md'
                  : isDark ? 'border-white/20 text-white/50 hover:text-white/80' : 'border-zinc-300 text-zinc-500 hover:text-zinc-800'
              }`}>
              <span className="w-3 h-3 rounded-full bg-white border border-zinc-300 flex-shrink-0" />
              Pearl White
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
            <button onClick={onGetStarted}
              className={`group px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-2 transition-colors ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>
              Get Started
            </button>
            <a href="#features"
              className={`px-8 py-4 border rounded-full text-base font-light transition-colors ${isDark ? 'border-white/30 text-white hover:border-white/60' : 'border-zinc-400 text-zinc-700 hover:border-zinc-700'}`}>
              See how it works
            </a>
          </div>

          {/* Languages tag */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8 flex items-center gap-2 justify-center lg:justify-start">
            <Globe className={`size-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <span className={`text-sm font-light ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Supports 100+ Languages
            </span>
          </motion.div>
        </motion.div>

        {/* RIGHT — chat stack */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex-shrink-0 hidden lg:block">
          <ChatStack activeTheme={activeTheme} />
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className={`w-px h-10 bg-gradient-to-b ${isDark ? 'from-white/30' : 'from-zinc-400/50'} to-transparent`} />
      </motion.div>
    </motion.section>
  );
}

/* ─── TIA IN ACTION ───────────────────────────────────────────── */
function TiaInActionSlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  const theme = CHAT_THEMES[activeTheme];

  return (
    <section className={`h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
      <ParticleField count={isDark ? 10 : 0} />
      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Title */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }} transition={{ duration: 0.7 }}
            className="flex-shrink-0 lg:w-72 text-center lg:text-left">
            <h2 className={`text-6xl md:text-7xl font-light leading-tight mb-4 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              TIA in<br /><span className="text-emerald-400">action</span>
            </h2>
            <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Watch how TIA handles a real customer conversation on your website.
            </p>


          </motion.div>

          {/* Browser */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }}
            className="flex-1 rounded-2xl overflow-hidden border shadow-2xl"
            style={{ borderColor: isDark ? '#27272a' : '#e4e4e7', boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.6)' : '0 32px 80px rgba(0,0,0,0.12)' }}>

            {/* Browser chrome */}
            <div className={`flex items-center gap-3 px-5 py-3 border-b ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
              <div className="flex gap-1.5">
                {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
              </div>
              <div className={`flex-1 mx-4 rounded-md px-4 py-1.5 text-xs ${isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-zinc-400 border border-zinc-200'}`}>
                yourcompany.com/products
              </div>
            </div>

            {/* Fake website — fixed height so chat never resizes the panel */}
            <div className="relative bg-white overflow-hidden" style={{ height: 460 }}>
              <div className="p-8 pb-0">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-24 h-5 bg-zinc-200 rounded" />
                  <div className="flex gap-4">{[60, 50, 70].map((w, i) => <div key={i} className="h-3 bg-zinc-100 rounded" style={{ width: w }} />)}</div>
                  <div className="w-20 h-7 bg-zinc-900 rounded-lg" />
                </div>
                <div className="mb-6">
                  <div className="w-2/3 h-7 bg-zinc-200 rounded mb-3" />
                  <div className="w-1/2 h-7 bg-zinc-200 rounded mb-5" />
                  <div className="w-full h-3 bg-zinc-100 rounded mb-2" />
                  <div className="w-5/6 h-3 bg-zinc-100 rounded mb-2" />
                  <div className="w-4/6 h-3 bg-zinc-100 rounded mb-6" />
                  <div className="flex gap-3">
                    <div className="w-28 h-9 bg-zinc-900 rounded-lg" />
                    <div className="w-28 h-9 bg-zinc-100 rounded-lg border border-zinc-200" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8 opacity-60">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="p-4 border border-zinc-100 rounded-xl">
                      <div className="w-8 h-8 bg-zinc-200 rounded-lg mb-3" />
                      <div className="w-3/4 h-3 bg-zinc-200 rounded mb-2" />
                      <div className="w-full h-2 bg-zinc-100 rounded mb-1" />
                      <div className="w-5/6 h-2 bg-zinc-100 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Animated chat overlay */}
              <div className="absolute bottom-5 right-5">
                <AnimatedChatLoop theme={theme} key={activeTheme} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ────────────────────────────────────────────────── */
function FeaturesSlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  const features = [
    { icon: MessageSquare, title: 'Any website', desc: 'WordPress, Shopify, custom — one snippet.' },
    { icon: Brain, title: 'Trained on you', desc: 'Knows your products, FAQs, pricing.' },
    { icon: Clock, title: '24/7 availability', desc: 'Always available, even at 3am.' },
    { icon: TrendingUp, title: 'Converts leads', desc: 'Guides visitors to book, buy, contact.' },
    { icon: Zap, title: 'Progressive learning', desc: 'Gets smarter over time with data.' },
    { icon: Users, title: 'Analytics', desc: 'Turn conversations into real-time decisions.' },
  ];

  return (
    <section id="features" className={`h-screen flex items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'} py-12 px-6`}>
      <div className="max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }} className="text-center mb-12">
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>The AI team</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>And analytics</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-600' : 'bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-xl'}`}>
              <div className={`size-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${isDark ? 'bg-zinc-700' : 'bg-zinc-950'}`}>
                <f.icon className="size-5 text-white" strokeWidth={1.5} />
              </div>
              <h3 className={`text-base font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-zinc-950'}`}>{f.title}</h3>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ─────────────────────────────────────────────────── */
function PricingSlide({ activeTheme, onGetStarted }) {
  const isDark = activeTheme === 'dark';

  const defaultConfig = {
    pkg: 'M',
    theme: 'obsidian',
    addons: {
      training: null,
      analytics: 'basic',
      support: 'email',
      hotleads: 'off',
      leadcapture: 'off',
      delivery: 'standard',
    },
  };

  const [config, setConfig] = useState(defaultConfig);
  const setPkg = (id) => setConfig(c => ({ ...c, pkg: id }));
  const setTheme = (id) => setConfig(c => ({ ...c, theme: id }));
  const setAddon = (addonId, optId) => setConfig(c => ({ ...c, addons: { ...c.addons, [addonId]: optId } }));

  const { monthly, oneTime } = computeTotal(config);
  const pkg = MSG_PACKAGES.find(p => p.id === config.pkg);
  const thm = THEMES_OPT.find(t => t.id === config.theme);

  const SectionLabel = ({ children }) => (
    <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{children}</p>
  );

  const Divider = () => <div className={`my-6 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`} />;

  return (
    <section id="pricing" className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'} py-20 px-6`}>
      <ParticleField count={isDark ? 10 : 0} />
      <div className="max-w-xl mx-auto w-full relative z-10">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }} className="text-center mb-10">
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Simple pricing</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Cancel anytime.</p>
        </motion.div>

        {/* Builder card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.6 }}
          className={`rounded-2xl border p-8 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}
        >
          {/* Card title */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className={`text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Build your robot</h3>
              <p className={`text-sm font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Ongoing subscription · unsubscribe anytime</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-light ${isDark ? 'text-white' : 'text-zinc-950'}`}>{monthly}€<span className={`text-base font-light ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>/mo</span></div>
              {oneTime > 0 && <div className={`text-xs mt-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>+ {oneTime}€ one-time</div>}
            </div>
          </div>

          {/* STEP 1 — Message package */}
          <SectionLabel>1 — Choose message package</SectionLabel>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {MSG_PACKAGES.map(p => {
              const active = config.pkg === p.id;
              return (
                <button key={p.id} onClick={() => setPkg(p.id)}
                  className={`text-left px-4 py-3.5 rounded-xl border transition-all ${active
                    ? isDark ? 'border-white bg-white/10' : 'border-zinc-950 bg-zinc-950'
                    : isDark ? 'border-zinc-700 hover:border-zinc-600' : 'border-zinc-200 hover:border-zinc-400'
                  }`}>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className={`text-sm font-bold ${active ? (isDark ? 'text-white' : 'text-white') : (isDark ? 'text-white' : 'text-zinc-900')}`}>{p.label}</span>
                    <span className={`text-lg font-light ${active ? (isDark ? 'text-white' : 'text-white') : (isDark ? 'text-zinc-200' : 'text-zinc-800')}`}>{p.price}€</span>
                    <span className={`text-[10px] ${active ? 'opacity-60 text-white' : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>/mo</span>
                  </div>
                  <div className={`text-[10px] font-medium ${active ? 'text-emerald-300' : isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>{p.messages.toLocaleString()} msg · {p.avgChats}</div>
                  <div className={`text-[10px] mt-0.5 leading-tight ${active ? 'opacity-50 text-white' : isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{p.hint}</div>
                </button>
              );
            })}
          </div>

          <Divider />

          {/* STEP 2 — Theme */}
          <SectionLabel>2 — Choose theme</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {THEMES_OPT.map(t => {
              const active = config.theme === t.id;
              return (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${active
                    ? isDark ? 'border-white bg-white/10' : 'border-zinc-950 bg-zinc-950'
                    : isDark ? 'border-zinc-700 hover:border-zinc-600' : 'border-zinc-200 hover:border-zinc-400'
                  }`}>
                  <span className="w-3.5 h-3.5 rounded-full border border-zinc-400 flex-shrink-0"
                    style={{ background: t.dot, borderColor: t.border }} />
                  <span className={active ? (isDark ? 'text-white' : 'text-white') : (isDark ? 'text-zinc-300' : 'text-zinc-700')}>{t.label}</span>
                  {t.oneTime > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${active ? (isDark ? 'bg-white/20 text-white' : 'bg-white/20 text-white') : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500')}`}>
                      +{t.oneTime}€ one-time
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <Divider />

          {/* STEP 3 — Add-ons */}
          <SectionLabel>3 — Customize (optional)</SectionLabel>
          <div className="flex flex-col gap-4">
            {ADDONS.map(addon => (
              <div key={addon.id}>
                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{addon.label}</p>
                <p className={`text-[10px] mb-2 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{addon.sub}</p>
                <div className="flex gap-2 flex-wrap">
                  {addon.options.map(opt => {
                    const active = config.addons[addon.id] === opt.id;
                    return (
                      <button key={opt.id} onClick={() => setAddon(addon.id, opt.id)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${active
                          ? isDark ? 'border-white bg-white/10 text-white' : 'border-zinc-950 bg-zinc-950 text-white'
                          : isDark ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                        }`}>
                        {opt.label}
                        {opt.price > 0 && (
                          <span className={`ml-1.5 ${active ? 'opacity-70' : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            +{opt.price}€{opt.oneTime ? ' once' : '/mo'}
                          </span>
                        )}
                        {opt.price === 0 && opt.id !== 'off' && (
                          <span className={`ml-1.5 ${active ? 'opacity-70' : isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>free</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Divider />

          {/* CTA */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className={`text-2xl font-light ${isDark ? 'text-white' : 'text-zinc-950'}`}>{monthly}€<span className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>/mo</span></div>
              {oneTime > 0 && <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>+ {oneTime}€ one-time</div>}
            </div>
          </div>
          <button
            onClick={() => onGetStarted(config)}
            className={`w-full py-4 rounded-xl text-base font-semibold transition-all hover:shadow-xl ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}
          >
            Get Started →
          </button>
          <p className={`text-center text-xs mt-3 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>No commitment · Cancel anytime</p>
        </motion.div>

        {/* Powered by Anthropic */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }} transition={{ delay: 0.2 }}
          className={`text-center rounded-2xl py-5 px-6 border mt-5 ${isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-100 bg-zinc-50'}`}>
          <p className={`text-sm font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Powered by{' '}
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-950'}`}>Anthropic's Claude</span>
            {' '}— world's smartest AI.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTASlide({ activeTheme, onGetStarted }) {
  const isDark = activeTheme === 'dark';
  return (
    <section className={`h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
      <video src="/dots.mp4" autoPlay loop muted playsInline
        className={`absolute inset-0 w-full h-full object-cover ${isDark ? 'opacity-40' : 'opacity-10'}`} />
      <ParticleField count={isDark ? 20 : 0} />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        className="relative z-10 text-center px-6">
        <h2 className={`text-7xl md:text-8xl font-light mb-6 leading-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          Ready to<br />transform?
        </h2>
        <p className={`text-xl font-light mb-10 max-w-xl mx-auto ${isDark ? 'text-white/70' : 'text-zinc-600'}`}>
          Get an AI chatbot on your website within 48 hours.
        </p>
        <button onClick={onGetStarted}
          className={`group inline-flex items-center gap-3 px-12 py-5 rounded-full text-lg font-semibold hover:shadow-2xl transition-all ${isDark ? 'bg-white text-zinc-950 hover:shadow-white/10' : 'bg-zinc-950 text-white hover:shadow-black/20'}`}>
          Let's talk
        </button>
        <p className={`mt-5 text-sm ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>No commitment</p>
      </motion.div>
    </section>
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
  const [activeTheme, setActiveTheme] = useState('dark');
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadConfig, setLeadConfig] = useState(null);

  const openLead = (config = null) => {
    setLeadConfig(config);
    setLeadOpen(true);
  };

  const defaultConfig = {
    pkg: 'M',
    theme: 'obsidian',
    addons: { training: null, analytics: 'basic', support: 'email', hotleads: 'off', leadcapture: 'off', delivery: 'standard' },
  };

  return (
    <div className={`transition-colors duration-700 ${activeTheme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}>
      {leadOpen && <LeadFormModal isDark={activeTheme === 'dark'} onClose={() => setLeadOpen(false)} config={leadConfig || defaultConfig} />}
      <Header isDark={activeTheme === 'dark'} onGetStarted={() => openLead()} />
      <HeroSlide activeTheme={activeTheme} setActiveTheme={setActiveTheme} onGetStarted={() => openLead()} />
      <TiaInActionSlide activeTheme={activeTheme} />
      <FeaturesSlide activeTheme={activeTheme} />
      <PricingSlide activeTheme={activeTheme} onGetStarted={(config) => openLead(config)} />
      <CTASlide activeTheme={activeTheme} onGetStarted={() => openLead()} />
      <Footer activeTheme={activeTheme} />
    </div>
  );
}

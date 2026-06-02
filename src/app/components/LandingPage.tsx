import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowRight, Check, Menu, X, Star, ChevronRight,
  Zap, Brain, Shield, TrendingUp, Clock, Users, MessageSquare, Globe
} from 'lucide-react';

/* ─── LEAD FORM MODAL ─────────────────────────────────────────── */
const SERVICES = [
  { id: 'M', label: 'S', desc: '99€/mo · 1,000 messages / month' },
  { id: 'L', label: 'M', desc: '199€/mo · 2,500 messages / month' },
  { id: 'XL', label: 'L', desc: '499€/mo · 10,000 messages / month' },
];

const SERVICE_PRICES = { M: 99, L: 199, XL: 499 };

function LeadFormModal({ isDark, onClose, initialService = '' }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    service: initialService,
    company: '',
    website: '',
    email: '',
    analytics: 'basic',
  });

  const basePrice = SERVICE_PRICES[form.service] || 0;
  const analyticsPrice = form.analytics === 'advanced' ? 50 : 0;
  const total = basePrice + analyticsPrice;

  const handleSubmit = () => {
    if (!form.service || !form.company || !form.website || !form.email) return;
    setSubmitted(true);
  };

  const ToggleAddon = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`flex items-start gap-3 w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
        active
          ? isDark ? 'border-white bg-white/10' : 'border-zinc-950 bg-zinc-950'
          : isDark ? 'border-zinc-700 hover:border-zinc-500' : 'border-zinc-200 hover:border-zinc-400'
      }`}
    >
      <div className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
        active
          ? 'bg-white border-white'
          : isDark ? 'border-zinc-600' : 'border-zinc-300'
      }`}>
        {active && <Check className="size-3 text-zinc-950" />}
      </div>
      {children}
    </button>
  );

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
                  <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Which plan interests you?</label>
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

                {/* Analytics Dashboard */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Analytics Dashboard</label>
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
                      <span>{basePrice}€/mo</span>
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
                <p className={`text-xs text-center ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>We'll get back to you shortly.</p>
                <button
                  onClick={handleSubmit}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}
                >
                  Send Message
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
  const [termsOpen, setTermsOpen] = useState(false);
  const termsRef = useRef(null);
  const termsTimeout = useRef(null);
  const openTerms = () => { clearTimeout(termsTimeout.current); setTermsOpen(true); };
  const closeTerms = () => { termsTimeout.current = setTimeout(() => setTermsOpen(false), 120); };
  useEffect(() => {
    const h = (e) => { if (termsRef.current && !termsRef.current.contains(e.target)) setTermsOpen(false); };
    document.addEventListener('mousedown', h);
    return () => { document.removeEventListener('mousedown', h); clearTimeout(termsTimeout.current); };
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
                className="relative" onMouseEnter={openTerms} onMouseLeave={closeTerms}>
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
      {/* Background image — dark mode */}
      {isDark && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://6a1d4cd40bc623d413b1bf9a.imgix.net/images/bg-bl.jpg)' }}
        />
      )}
      {/* Background image — light mode */}
      {!isDark && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://6a1d4cd40bc623d413b1bf9a.imgix.net/bg-wa.png)' }}
        />
      )}
      {/* Overlay */}
      {isDark && <div className="absolute inset-0 bg-zinc-950/35" />}
      {!isDark && <div className="absolute inset-0 bg-white/15" />}
      <ParticleField count={isDark ? 24 : 0} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* LEFT */}
        <motion.div style={{ y }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center lg:text-left flex-shrink-0 max-w-xl">

          <h1 className={`text-7xl md:text-8xl font-light mb-6 leading-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            Never Miss<br />a Lead
          </h1>
          <p className={`text-xl font-light mb-6 max-w-lg ${isDark ? 'text-white/80' : 'text-zinc-600'}`}>
            Answers visitors instantly with AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8">
            <button onClick={onGetStarted}
              className={`group px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-2 transition-colors ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>
              Get Started
            </button>
            <a href="#features"
              className={`px-8 py-4 border rounded-full text-base font-light transition-colors ${isDark ? 'border-white/30 text-white hover:border-white/60' : 'border-zinc-400 text-zinc-700 hover:border-zinc-700'}`}>
              See TIA in Action
            </a>
          </div>

          {/* Quote / review */}
          <div className="mb-6">
            <div className="flex gap-0.5 mb-1.5 justify-center lg:justify-start">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`size-3.5 ${isDark ? 'text-white fill-white' : 'text-zinc-800 fill-zinc-800'}`} />
              ))}
            </div>
            <p className={`text-sm font-light italic leading-relaxed ${isDark ? 'text-white/70' : 'text-zinc-600'}`}>
              "Best hire we never made."
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-white/35' : 'text-zinc-400'}`}>— Verkkopantteri.fi</p>
          </div>

          {/* Trust bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex items-center gap-0 flex-wrap justify-center lg:justify-start">
            {['Setup in 48h', 'No code', '100+ Languages', 'Cancel anytime'].map((item, i) => (
              <span key={item} className={`flex items-center text-xs font-light ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>
                {i > 0 && <span className={`mx-2.5 ${isDark ? 'text-white/20' : 'text-zinc-300'}`}>·</span>}
                {item}
              </span>
            ))}
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
  const isDark = false; // page always stays light
  const [chatTheme, setChatTheme] = useState('light');
  const theme = CHAT_THEMES[chatTheme];
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end end'] });

  // Brightness: overexposed → normal
  const brightness = useTransform(scrollYProgress, [0, 0.7], [1.5, 1]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  // Clip-path horizontal scan wipe: reveal from left edge across
  const clipProgress = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const clipPath = useTransform(clipProgress, (p) => `inset(0 ${Math.max(0, 100 - p)}% 0 0)`);

  // Subtle x drift into place
  const x = useTransform(scrollYProgress, [0, 0.6], [30, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ filter, clipPath, x }}
      className={`h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}
    >
      <ParticleField count={isDark ? 10 : 0} />
      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Title */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }} transition={{ duration: 0.7 }}
            className="flex-shrink-0 lg:w-72 text-center lg:text-left">
            <h2 className={`text-6xl md:text-7xl font-light leading-tight mb-4 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              TIA in<br /><span style={{ color: '#63AFC7' }}>action</span>
            </h2>
            <p className={`text-lg font-light mb-6 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Watch how TIA handles a real customer conversation on your website.
            </p>

            {/* Theme switcher — dots only */}
            <div className="flex items-center gap-2 justify-center lg:justify-start relative">
              <ThemeArcHint />
              <button onClick={() => setChatTheme('light')}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  chatTheme === 'light'
                    ? 'border-zinc-400 scale-110 shadow-md'
                    : 'border-zinc-200 hover:border-zinc-300'
                } bg-white`} />
              <button onClick={() => setChatTheme('dark')}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  chatTheme === 'dark'
                    ? 'border-zinc-600 scale-110 shadow-md'
                    : 'border-zinc-300 hover:border-zinc-500'
                } bg-zinc-900`} />
            </div>

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
    </motion.section>
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
        className={`min-h-screen flex items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'} py-20 px-6 relative overflow-hidden`}
      >
      <video src="/dots.mp4" autoPlay loop muted playsInline
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${isDark ? 'opacity-40' : 'opacity-10'}`} />
      <div className="max-w-6xl mx-auto w-full">
        {/* Section header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }} className="mb-14">
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>The AI team</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>And analytics</p>
        </motion.div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* LEFT — Paper slideshow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }}
            className="flex-shrink-0"
          >
            <PaperStack isDark={isDark} ref={paperStackRef} />
          </motion.div>

          {/* RIGHT — Feature cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 50, scale: 0.9, rotateZ: i % 2 === 0 ? -1.5 : 1.5 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateZ: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, delay: i * 0.06 }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                className={`group p-6 rounded-2xl border transition-colors duration-300 ${isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-600' : 'bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-xl'}`}>
                <div className={`size-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${isDark ? 'bg-zinc-700' : 'bg-zinc-950'}`}>
                  <f.icon className="size-5 text-white" strokeWidth={1.5} />
                </div>
                <h3 className={`text-base font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-zinc-950'}`}>{f.title}</h3>
                <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
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
    tagline: 'For small size business',
    price: '99€',
    priceNum: 99,
    period: '/month',
    volume: '',
    messages: 'Limit 1,000 messages / month',
    features: [
      'Trained on your content',
      'AI evolves monthly with new data',
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
    tagline: 'For medium size business',
    price: '199€',
    priceNum: 199,
    period: '/month',
    volume: '',
    messages: 'Limit 2,500 messages / month',
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
    tagline: 'For large size business',
    price: '499€',
    priceNum: 499,
    period: '/month',
    volume: '',
    messages: 'Limit 10,000 messages / month',
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

function PricingSlide({ activeTheme, onGetStarted }) {
  const isDark = activeTheme === 'dark';
  const [planIdx, setPlanIdx] = useState(0);
  const plan = PLANS[planIdx];
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
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Simple pricing</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Cancel anytime.</p>
        </motion.div>

        {/* Main plan card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.88 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.1 }}
          className={`rounded-2xl p-8 relative border transition-colors duration-300 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}
        >
            {/* Size badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-2xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>{plan.name}</span>
                <span className={`text-base font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.label}</span>
                {plan.highlight && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-200 text-zinc-700'}`}>
                    Most popular
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className={`text-4xl font-light ${isDark ? 'text-white' : 'text-zinc-950'}`}>{plan.price}</div>
                <div className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{plan.period}</div>
              </div>
            </div>

            {/* Fixed-height text rows so all plans align */}
            <p className={`text-sm h-5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{plan.tagline}</p>
            <p className={`text-xs mb-6 font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{plan.messages}</p>

            <ul className="mb-8" style={{ height: 180, overflow: "hidden" }}>
              {plan.features.map(f => (
                <li key={f} className={`flex items-center gap-3 text-sm mb-2.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  <Check className="size-4 shrink-0" style={{ color: '#63AFC7' }} />
                  {f}
                </li>
              ))}
            </ul>

            <button onClick={() => onGetStarted(plan.id)}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all mb-6 ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>
              Get Started
            </button>

            {/* Slider */}
            <div>
              <div className="flex justify-between mb-3">
                {PLANS.map((p, i) => (
                  <button key={p.id} onClick={() => setPlanIdx(i)}
                    className={`flex flex-col items-center gap-0.5 transition-colors ${i === planIdx ? (isDark ? 'text-white' : 'text-zinc-950') : (isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600')}`}>
                    <span className="text-xs font-semibold">{p.name}</span>
                  </button>
                ))}
            </div>
            {/* Track */}
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
              {/* Fill */}
              <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200"
                style={{ width: `${fillPct}%`, background: fillColor }} />
              {/* Thumb */}
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
    </motion.section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTASlide({ activeTheme, onGetStarted }) {
  const isDark = activeTheme === 'dark';
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // Horizon zoom: tilts up from below like a road stretching to horizon
  const y = useTransform(scrollYProgress, [0, 0.6], [80, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.88, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.6], [12, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div style={{ perspective: '1400px', overflow: 'hidden' }}>
    <motion.section
      ref={ref}
      style={{ y, scale, rotateX, opacity }}
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background video — theme dependent */}
      <video
        key={activeTheme}
        src={isDark
          ? 'https://6a1d4cd40bc623d413b1bf9a.imgix.net/bg-bl.mp4'
          : 'https://6a1d4cd40bc623d413b1bf9a.imgix.net/bg-rv.mp4'}
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-85"
      />
      <div className="relative z-10 text-center px-6">
        <button onClick={onGetStarted}
          className={`group inline-flex items-center gap-3 px-12 py-5 rounded-full text-lg font-semibold transition-all hover:shadow-2xl ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100 hover:shadow-white/10' : 'bg-white text-zinc-950 hover:bg-zinc-100 hover:shadow-black/20'}`}>
          Start Today
        </button>
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
  const activeTheme = 'light';
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadService, setLeadService] = useState('');

  const openLead = (service = '') => {
    setLeadService(service);
    setLeadOpen(true);
  };

  return (
    <div className="overflow-x-hidden bg-white">
      {leadOpen && <LeadFormModal isDark={false} onClose={() => setLeadOpen(false)} initialService={leadService} />}
      <Header isDark={false} onGetStarted={() => openLead()} />
      <HeroSlide activeTheme={activeTheme} setActiveTheme={() => {}} onGetStarted={() => openLead()} />
      <TiaInActionSlide activeTheme={activeTheme} />
      <FeaturesSlide activeTheme={activeTheme} />
      <PricingSlide activeTheme={activeTheme} onGetStarted={(id) => openLead(id)} />
      <CTASlide activeTheme={activeTheme} onGetStarted={() => openLead()} />
      <Footer activeTheme={activeTheme} />
    </div>
  );
}

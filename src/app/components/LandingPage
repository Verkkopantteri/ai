import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowRight, Check, Menu, X, Star, ChevronRight,
  Zap, Brain, Shield, TrendingUp, Clock, Users, MessageSquare
} from 'lucide-react';

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

/* ─── ANIMATED COUNTER ────────────────────────────────────────── */
function AnimatedNumber({ target, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── HEADER ──────────────────────────────────────────────────── */
function Header({ isDark }) {
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
    { label: 'Reliable', href: '#why-pantteri' },
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

  const lightHeader = !isDark;

  return (
    <motion.header
      animate={{ y: hidden ? '-120%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className={`pointer-events-auto transition-all duration-500 ease-in-out ${
        scrolled
          ? `mx-4 mt-3 rounded-2xl backdrop-blur-xl border shadow-2xl ${
              lightHeader
                ? 'bg-white/80 border-zinc-200 shadow-black/10'
                : 'bg-zinc-900/20 border-white/5 shadow-black/40'
            }`
          : 'mx-0 mt-0 rounded-none bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center">
              <img src={lightHeader ? '/logo-black.png' : '/logo.png'} alt="TIA AI" className="h-12 w-auto object-contain" />
            </motion.div>
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item, i) => (
                <motion.a key={item.label} href={item.href}
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  className={`px-3.5 py-2 text-base transition-colors ${lightHeader ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
                >{item.label}</motion.a>
              ))}
              <motion.div ref={termsRef} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + navItems.length * 0.07 }}
                className="relative" onMouseEnter={() => setTermsOpen(true)} onMouseLeave={() => setTermsOpen(false)}>
                <button className={`flex items-center gap-1 px-3.5 py-2 text-base transition-colors ${lightHeader ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}>
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
            <a href="#contact" className={`text-base transition-colors px-3 py-2 ${lightHeader ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'}`}>Sign in</a>
            <a href="#pricing" className={`px-4 py-2 text-base rounded-lg font-semibold transition-all hover:shadow-lg ${lightHeader ? 'bg-zinc-950 text-white hover:bg-zinc-800' : 'bg-white text-zinc-950 hover:bg-zinc-100'}`}>Get a demo</a>
          </motion.div>
          <button onClick={() => setOpen(!open)} className={`md:hidden p-2 ${lightHeader ? 'text-zinc-950' : 'text-white'}`}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t px-6 py-4 flex flex-col gap-2 overflow-hidden rounded-b-2xl ${lightHeader ? 'border-zinc-200 bg-white/95' : 'border-zinc-800 bg-zinc-900/95'}`}>
              {navItems.map(item => (
                <a key={item.label} href={item.href} onClick={() => setOpen(false)}
                  className={`py-2 transition-colors ${lightHeader ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-300 hover:text-white'}`}>{item.label}</a>
              ))}
              <a href="#pricing" className={`mt-2 py-3 text-sm rounded-lg text-center font-semibold ${lightHeader ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-950'}`}>Get a demo</a>
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
    labelColor: '#fff',
    dotBg: '#09090b',
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
    labelColor: '#18181b',
    dotBg: '#f4f4f5',
  },
};

/* ─── FULL CHAT WIDGET (replicates MiniChat exactly, with full interaction) */
function FullChatWidget({ theme, loopPhase, showTyping, visibleMessages, conversation, showCTA }) {
  const chatBottomRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages, showTyping]);

  const chips = ['AI deployment', 'Pricing', 'Book a demo'];

  return (
    <div
      style={{
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.glow,
        width: 320,
      }}
      className="rounded-[20px] overflow-hidden flex flex-col"
    >
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
      <div
        ref={scrollRef}
        className="flex flex-col gap-3 p-4 overflow-y-auto"
        style={{
          background: theme.msgAreaBg,
          maxHeight: 260,
          minHeight: 80,
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.scrollThumb} ${theme.scrollTrack}`,
        }}
      >
        <style>{`
          .tia-chat-scroll::-webkit-scrollbar { width: 4px; }
          .tia-chat-scroll::-webkit-scrollbar-track { background: ${theme.scrollTrack}; border-radius: 2px; }
          .tia-chat-scroll::-webkit-scrollbar-thumb { background: ${theme.scrollThumb}; border-radius: 2px; }
          .tia-chat-scroll::-webkit-scrollbar-thumb:hover { background: ${theme.scrollThumbHover}; }
        `}</style>
        <AnimatePresence initial={false}>
          {conversation.slice(0, visibleMessages).map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
            >
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
              }}
                className="max-w-[200px] px-3 py-2 text-[11px] leading-relaxed">
                {msg.text}
              </div>
            </motion.div>
          ))}
          {showTyping && (
            <motion.div key="typing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex gap-2">
              <div style={{ border: `1px solid ${theme.border}`, background: theme.msgBg }}
                className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                <img src={theme.avatarSrc} alt="T" className="w-full h-full object-contain p-0.5" />
              </div>
              <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}`, borderRadius: '3px 14px 14px 14px' }}
                className="flex items-center gap-1 px-3 py-2.5">
                {[0, 1, 2].map(d => (
                  <motion.div key={d} style={{ background: theme.subtleText }}
                    className="w-1 h-1 rounded-full"
                    animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatBottomRef} />
      </div>

      {/* CTA button */}
      <AnimatePresence>
        {showCTA && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            style={{ background: theme.msgAreaBg }}
            className="px-4 pb-2">
            <motion.div
              animate={showCTA ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="w-full py-2 bg-emerald-500 text-white text-[11px] font-semibold rounded-xl text-center cursor-pointer hover:bg-emerald-400 transition-colors">
              Book a free demo →
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chips */}
      <div style={{ background: theme.msgAreaBg }} className="flex gap-1.5 flex-wrap px-4 pb-2">
        {chips.map(chip => (
          <span key={chip}
            style={{ color: theme.chipColor, border: `1px solid ${theme.border}`, background: theme.chipBg }}
            className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap">
            {chip}
          </span>
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
        <img src="https://i.ibb.co/WWGrHnHy/asd3.png" alt="TIA"
          className="h-2.5"
          style={{ opacity: 0.5, filter: theme.name === 'Pearl White' ? 'brightness(0)' : 'brightness(2)' }} />
      </div>
    </div>
  );
}

/* ─── MINI CHAT (for hero stack) ──────────────────────────────── */
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
      <div className="flex flex-col gap-3 p-4" style={{ background: isLight ? '#ececee' : 'transparent' }}>
        {messages.map((msg, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
          >
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
            }}
              className="max-w-[200px] px-3 py-2 text-[11px] leading-relaxed">
              {msg.text}
            </div>
          </motion.div>
        ))}
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
      <div style={{ background: isLight ? '#ececee' : 'transparent' }} className="flex gap-1.5 flex-wrap px-4 pb-2">
        {['AI deployment', 'Pricing', 'Book a demo'].map(chip => (
          <span key={chip}
            style={{ color: theme.chipColor, border: `1px solid ${theme.border}`, background: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(20,20,24,0.85)' }}
            className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap">{chip}</span>
        ))}
      </div>
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
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8 }}
        style={{ position: 'absolute', top: 0, right: -10, zIndex: 10, transform: 'rotate(5deg) translateX(10px) translateY(-10px)', filter: 'brightness(0.88)', pointerEvents: 'none' }}
      >
        <MiniChat theme={activeTheme === 'dark' ? CHAT_THEMES.light : CHAT_THEMES.dark} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -10, y: 15 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 20, transform: 'rotate(-2deg)' }}
      >
        <MiniChat theme={activeTheme === 'dark' ? CHAT_THEMES.dark : CHAT_THEMES.light} />
      </motion.div>
    </div>
  );
}

/* ─── ANIMATED CHAT LOOP (for TIA in Action section) ──────────── */
/*
 * Loop phases:
 * 0 = bubble visible, chat closed
 * 1 = chat opening animation
 * 2 = messages appearing
 * 3 = CTA visible (flash + blur)
 * 4 = blurring out, then restart
 */
function AnimatedChatLoop({ theme }) {
  const CONVERSATION = [
    { from: 'bot',  text: "Hi! I'm TIA. How can I help you today?",                         delay: 600  },
    { from: 'user', text: "What's included in the Growth plan?",                              delay: 1800 },
    { from: 'bot',  text: "The Growth plan (€499/mo) includes chatbots on 3 websites, up to 5 000 chats/month, lead capture, analytics, and priority support 🚀", delay: 3200 },
    { from: 'user', text: "How quickly can we go live?",                                      delay: 5000 },
    { from: 'bot',  text: "Within 48 hours! We handle training, setup, and launch. You just share your content ✅", delay: 6400 },
    { from: 'user', text: "Perfect. Can I book a demo?",                                      delay: 8000 },
    { from: 'bot',  text: "Absolutely! Click below and we'll schedule a free 20-min call 👇",  delay: 9200 },
  ];

  const [loopPhase, setLoopPhase] = useState(0); // 0=bubble, 1=opening, 2=chat, 3=cta, 4=blurring
  const [chatOpen, setChatOpen] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [blurring, setBlurring] = useState(false);
  const timersRef = useRef([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };
  const addTimer = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };

  const runLoop = useCallback(() => {
    clearAllTimers();
    setLoopPhase(0);
    setChatOpen(false);
    setVisibleMessages(0);
    setShowTyping(false);
    setShowCTA(false);
    setBlurring(false);

    // After 1.2s, open chat
    addTimer(() => {
      setLoopPhase(1);
      setChatOpen(true);
    }, 1200);

    // Show messages with delays
    CONVERSATION.forEach((msg, i) => {
      if (msg.from === 'bot') {
        addTimer(() => setShowTyping(true), 1200 + msg.delay - 900);
        addTimer(() => setShowTyping(false), 1200 + msg.delay);
      }
      addTimer(() => setVisibleMessages(v => v + 1), 1200 + msg.delay);
    });

    const lastDelay = 1200 + CONVERSATION[CONVERSATION.length - 1].delay;

    // Show CTA
    addTimer(() => setShowCTA(true), lastDelay + 500);

    // Blur out
    addTimer(() => {
      setBlurring(true);
    }, lastDelay + 2200);

    // Restart
    addTimer(() => {
      runLoop();
    }, lastDelay + 3400);
  }, []);

  useEffect(() => {
    runLoop();
    return () => clearAllTimers();
  }, []);

  const bubbleVisible = loopPhase === 0;
  const isLight = theme.name === 'Pearl White';

  return (
    <div className="relative" style={{ width: 300 }}>
      {/* Blur overlay */}
      <AnimatePresence>
        {blurring && (
          <motion.div
            key="blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, zIndex: 30, backdropFilter: 'blur(8px)', borderRadius: 18, background: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
          />
        )}
      </AnimatePresence>

      {/* Bubble button */}
      <AnimatePresence>
        {bubbleVisible && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex justify-end mb-2"
          >
            <div
              style={{ background: theme.bg, border: `1px solid ${theme.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', cursor: 'pointer' }}
              className="w-14 h-14 rounded-full flex items-center justify-center"
            >
              <div style={{ background: theme.msgBg }} className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden">
                <img src={theme.avatarSrc} alt="TIA" className="w-full h-full object-contain p-1" />
              </div>
              <span style={{ background: theme.accentDot }} className="absolute w-3 h-3 rounded-full top-0 right-0 border-2 border-white animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat widget */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.85, y: 20, originY: 1, originX: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <FullChatWidget
              theme={theme}
              visibleMessages={visibleMessages}
              showTyping={showTyping}
              conversation={CONVERSATION}
              showCTA={showCTA}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function HeroSlide({ activeTheme, setActiveTheme }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const isDark = activeTheme === 'dark';
  const theme = CHAT_THEMES[activeTheme];

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className={`h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-zinc-100'}`}
    >
      {isDark && (
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNoYXRib3QlMjByb2JvdCUyMGludGVyZmFjZSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzgwMjI1MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="AI Robot"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-zinc-950" />
        </div>
      )}
      {!isDark && <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-zinc-100" />}
      <ParticleField count={isDark ? 24 : 0} />

      {/* Title left + demo right */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* LEFT text */}
        <motion.div style={{ y }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center lg:text-left flex-shrink-0 max-w-xl"
        >
          {/* Title in two lines */}
          <h1 className={`text-7xl md:text-8xl font-light mb-6 leading-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            The Future<br />is here
          </h1>
          <p className={`text-xl font-light mb-10 max-w-lg ${isDark ? 'text-white/80' : 'text-zinc-600'}`}>
            TIA AI chatbots for your website — installed in minutes.
          </p>

          {/* Theme switcher */}
          <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
            <button
              onClick={() => setActiveTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeTheme === 'dark'
                  ? 'bg-zinc-950 text-white border-zinc-700'
                  : isDark ? 'border-white/20 text-white/50 hover:text-white/80' : 'border-zinc-300 text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-600 flex-shrink-0" />
              Obsidian Black
            </button>
            <button
              onClick={() => setActiveTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeTheme === 'light'
                  ? 'bg-white text-zinc-950 border-zinc-300 shadow-md'
                  : isDark ? 'border-white/20 text-white/50 hover:text-white/80' : 'border-zinc-300 text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-white border border-zinc-200 flex-shrink-0" />
              Pearl White
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
            <a href="#pricing"
              className={`group px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-2 transition-colors ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>
              Get a free demo
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
                <ArrowRight className="size-4" />
              </motion.span>
            </a>
            <a href="#features"
              className={`px-8 py-4 border rounded-full text-base font-light transition-colors ${isDark ? 'border-white/30 text-white hover:border-white/60' : 'border-zinc-400 text-zinc-700 hover:border-zinc-700'}`}>
              See how it works
            </a>
          </div>
        </motion.div>

        {/* RIGHT — chat stack */}
        <motion.div
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex-shrink-0 hidden lg:block"
        >
          <ChatStack activeTheme={activeTheme} />
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
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
          {/* Left: Title */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="flex-shrink-0 lg:w-80 text-center lg:text-left">
            <h2 className={`text-6xl md:text-7xl font-light leading-tight mb-4 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              TIA in<br /><span className="text-emerald-400">action</span>
            </h2>
            <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Watch how TIA handles a real customer conversation on your website.
            </p>
          </motion.div>

          {/* Right: Animated fake browser */}
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

            {/* Fake website */}
            <div className="relative bg-white" style={{ minHeight: 440 }}>
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

              {/* Chat overlay bottom-right */}
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

/* ─── COMPACT FEATURES ────────────────────────────────────────── */
function FeaturesSlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  const features = [
    { icon: MessageSquare, title: 'Any website', desc: 'WordPress, Shopify, custom — one snippet.' },
    { icon: Brain, title: 'Trained on you', desc: 'Knows your products, FAQs, pricing.' },
    { icon: Clock, title: '24/7 availability', desc: 'Answers at 3am. Zero overtime.' },
    { icon: TrendingUp, title: 'Converts leads', desc: 'Guides visitors to book, buy, contact.' },
    { icon: Users, title: 'Unlimited chats', desc: 'Thousands of conversations, zero load.' },
    { icon: Zap, title: 'Live in 48h', desc: 'We handle everything. You share content.' },
  ];

  return (
    <section id="features" className={`h-screen flex items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'} py-12 px-6`}>
      <div className="max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }}
          className="text-center mb-12">
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>The AI team</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Focus on your business. We'll handle the AI.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group p-6 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-600' : 'border-zinc-100 hover:border-zinc-200 hover:shadow-xl'}`}>
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

/* ─── STATS / PROBLEM (compact) ──────────────────────────────── */
function StatsSlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  const stats = [
    { animated: true, target: 73, suffix: '%', label: 'of customers leave if they don\'t get an instant answer.' },
    { animated: false, display: '24/7', label: 'availability your team cannot provide. Your chatbot can.' },
    { animated: true, target: 3, suffix: '×', label: 'more leads converted with instant chat support.' },
  ];
  return (
    <section className={`h-screen flex items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'} px-6`}>
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.5 }}
          className={`text-5xl md:text-6xl font-light mb-4 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          Your customers are<br /><span className="text-red-400">waiting</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }}
          className={`text-lg font-light mb-16 max-w-xl mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Every unanswered question on your website is a lost customer.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} transition={{ delay: i * 0.2 }}>
              <div className="text-5xl font-light text-red-400 mb-3 tabular-nums">
                {stat.animated ? <AnimatedNumber target={stat.target} suffix={stat.suffix} duration={2.2} /> : stat.display}
              </div>
              <p className={`text-base font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WHY TIA (compact) ───────────────────────────────────────── */
function WhyTiaSlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  const reasons = [
    { icon: Brain, title: 'Powered by Claude', desc: 'Ranks #1 in reasoning and accuracy. Genuinely intelligent.' },
    { icon: Shield, title: 'Brand-safe', desc: 'Honest, refuses harmful requests. Your brand is protected.' },
    { icon: TrendingUp, title: 'We manage everything', desc: 'Training, updates, monitoring. Zero technical headache.' },
  ];
  return (
    <section id="why-pantteri" className={`h-screen flex items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'} py-16 px-6`}>
      <div className="max-w-5xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }}
          className="text-center mb-14">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }} transition={{ duration: 0.6 }} className="flex justify-center mb-6">
            <img src={isDark ? '/logo.png' : '/logo-black.png'} alt="TIA AI" className="w-16 h-16 object-contain" />
          </motion.div>
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Reliable</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Not all AI chatbots are created equal.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {reasons.map((r, i) => (
            <motion.div key={r.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} transition={{ delay: i * 0.15 }}
              className={`rounded-2xl p-7 border backdrop-blur-sm transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-600' : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'}`}>
              <div className={`size-12 rounded-xl flex items-center justify-center mb-5 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                <r.icon className={`size-6 ${isDark ? 'text-white' : 'text-zinc-950'}`} strokeWidth={1.5} />
              </div>
              <h3 className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-zinc-950'}`}>{r.title}</h3>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{r.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
          className={`rounded-2xl p-7 text-center border ${isDark ? 'bg-zinc-900/40 border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'}`}>
          <p className={`text-xs uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Powered by</p>
          <h3 className={`text-2xl font-light mb-2 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Anthropic's Claude</h3>
          <div className={`flex justify-center gap-10 mt-5`}>
            {[{ value: '#1', label: 'Reasoning' }, { value: '200K', label: 'Token context' }, { value: '100+', label: 'Languages' }].map(stat => (
              <div key={stat.label} className="text-center">
                <div className={`text-xl font-light ${isDark ? 'text-white' : 'text-zinc-950'}`}>{stat.value}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── REVIEWS (compact) ───────────────────────────────────────── */
function ReviewsSlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  const reviews = [
    { stars: 5, text: 'Our chatbot now handles 80% of inquiries automatically. Our team focuses on real work.', name: 'Matti K.', role: 'CEO, Verkkokauppa Oy' },
    { stars: 5, text: 'Leads went up 40% in the first month. It books viewings automatically. Incredible.', name: 'Laura V.', role: 'Founder, Nordic Properties' },
    { stars: 5, text: 'Setup done in 48 hours. TIA AI handled everything. We just shared our content.', name: 'Sanna M.', role: 'Marketing Director, Klinikka Pro' },
  ];
  return (
    <section className={`h-screen flex items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'} py-16 px-6`}>
      <div className="max-w-5xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }}
          className="text-center mb-12">
          <h2 className={`text-5xl md:text-6xl font-light mb-4 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Early results</h2>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => <Star key={i} className={`size-4 ${isDark ? 'text-white fill-white' : 'text-zinc-950 fill-zinc-950'}`} />)}
            <span className={`text-sm ml-2 ${isDark ? 'text-zinc-400' : 'text-zinc-400'}`}>5.0 · Verified business reviews</span>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div key={r.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} transition={{ delay: i * 0.15 }}
              className={`rounded-2xl p-7 border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' : 'bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-md'}`}>
              <div className="flex gap-0.5 mb-4">
                {[...Array(r.stars)].map((_, j) => <Star key={j} className={`size-4 ${isDark ? 'text-white fill-white' : 'text-zinc-800 fill-zinc-800'}`} />)}
              </div>
              <p className={`font-light leading-relaxed mb-5 text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>"{r.text}"</p>
              <div>
                <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-zinc-950'}`}>{r.name}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{r.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ─────────────────────────────────────────────────── */
function PricingSlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  const plans = [
    {
      name: 'Lite', price: '€199', period: '/month',
      desc: 'For small businesses getting started.',
      features: ['Chatbot on 1 website', 'Trained on your content', 'Up to 1 000 chats/mo', 'Email support', '48h setup'],
      cta: 'Get started', highlight: false,
    },
    {
      name: 'Growth', price: '€499', period: '/month',
      desc: 'For growing businesses.',
      features: ['Chatbot on 3 websites', 'Advanced training & updates', 'Up to 5 000 chats/mo', 'Lead capture integration', 'Analytics dashboard', 'Priority support'],
      cta: 'Get a demo', highlight: true,
    },
  ];

  return (
    <section id="pricing" className={`h-screen flex items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'} py-16 px-6`}>
      <ParticleField count={isDark ? 10 : 0} />
      <div className="max-w-3xl mx-auto w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }}
          className="text-center mb-12">
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Simple pricing</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>No hidden fees. Cancel anytime.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {plans.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-8 relative transition-all duration-300 ${
                plan.highlight
                  ? isDark ? 'bg-zinc-100 text-zinc-950 shadow-2xl shadow-white/5 scale-105' : 'bg-zinc-950 text-white shadow-2xl scale-105'
                  : isDark ? 'bg-zinc-900/70 border border-zinc-800 hover:border-zinc-600' : 'bg-zinc-50 border border-zinc-200 hover:border-zinc-300'
              }`}>
              {plan.highlight && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold border ${isDark ? 'bg-zinc-950 text-white border-zinc-700' : 'bg-white text-zinc-950 border-zinc-200 shadow-sm'}`}>
                  Most popular
                </div>
              )}
              <div className={`text-xs uppercase tracking-widest mb-3 ${plan.highlight ? (isDark ? 'text-zinc-500' : 'text-zinc-400') : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {plan.name}
              </div>
              <div className={`text-5xl font-light mb-1 ${plan.highlight ? (isDark ? 'text-zinc-950' : 'text-white') : isDark ? 'text-white' : 'text-zinc-950'}`}>
                {plan.price}
              </div>
              <div className={`text-sm mb-2 ${plan.highlight ? (isDark ? 'text-zinc-400' : 'text-zinc-400') : isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{plan.period}</div>
              <p className={`text-sm font-light mb-6 ${plan.highlight ? (isDark ? 'text-zinc-500' : 'text-zinc-300') : isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{plan.desc}</p>
              <ul className="space-y-2.5 mb-7">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlight ? (isDark ? 'text-zinc-700' : 'text-zinc-300') : isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    <Check className={`size-4 shrink-0 ${plan.highlight ? (isDark ? 'text-zinc-950' : 'text-white') : isDark ? 'text-zinc-400' : 'text-zinc-400'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                plan.highlight
                  ? isDark ? 'bg-zinc-950 text-white hover:bg-zinc-800' : 'bg-white text-zinc-950 hover:bg-zinc-100'
                  : isDark ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700' : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTASlide({ activeTheme }) {
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
          Get an AI chatbot on your website within 48 hours. Free demo — no commitment.
        </p>
        <a href="#contact"
          className={`group inline-flex items-center gap-3 px-12 py-5 rounded-full text-lg font-semibold hover:shadow-2xl transition-all ${isDark ? 'bg-white text-zinc-950 hover:shadow-white/10' : 'bg-zinc-950 text-white hover:shadow-black/20'}`}>
          Book a free demo
          <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}>
            <ArrowRight className="size-5" />
          </motion.span>
        </a>
        <p className={`mt-5 text-sm ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>No credit card required · Live in 48 hours</p>
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
            <p className="text-sm font-light leading-relaxed">AI chatbots for businesses, powered by Claude.</p>
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

  return (
    <div className={`transition-colors duration-700 ${activeTheme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}>
      <Header isDark={activeTheme === 'dark'} />
      <HeroSlide activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
      <TiaInActionSlide activeTheme={activeTheme} />
      <FeaturesSlide activeTheme={activeTheme} />
      <StatsSlide activeTheme={activeTheme} />
      <WhyTiaSlide activeTheme={activeTheme} />
      <ReviewsSlide activeTheme={activeTheme} />
      <PricingSlide activeTheme={activeTheme} />
      <CTASlide activeTheme={activeTheme} />
      <Footer activeTheme={activeTheme} />
    </div>
  );
}

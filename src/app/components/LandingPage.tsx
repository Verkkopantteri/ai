import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowRight, Check, Menu, X, Star, ChevronRight,
  Zap, Brain, Shield, TrendingUp, Clock, Users, MessageSquare, Globe
} from 'lucide-react';

/* ─── NOISE TEXTURE SVG ────────────────────────────────────────── */
function NoiseTexture({ opacity = 0.035 }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

/* ─── MESH GRADIENT ────────────────────────────────────────────── */
function MeshGradient({ isDark }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {isDark ? (
        <>
          <div className="absolute w-[900px] h-[900px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)', top: '-20%', left: '-10%' }} />
          <div className="absolute w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', bottom: '-10%', right: '-5%' }} />
          <div className="absolute w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)', top: '40%', left: '50%' }} />
        </>
      ) : (
        <>
          <div className="absolute w-[900px] h-[900px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)', top: '-20%', left: '-10%' }} />
          <div className="absolute w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', bottom: '-10%', right: '-5%' }} />
        </>
      )}
    </div>
  );
}

/* ─── PARTICLES ───────────────────────────────────────────────── */
function FloatingParticle({ delay, duration, x, size }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, bottom: 0, width: size, height: size, background: 'rgba(52,211,153,0.12)' }}
      animate={{ y: [0, -900], opacity: [0, 0.8, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}
function ParticleField({ count = 18 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i, delay: (i * 0.7) % 8, duration: 6 + (i * 1.3) % 6, x: (i * 7.3) % 100, size: 2 + (i * 3.1) % 5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => <FloatingParticle key={p.id} {...p} />)}
    </div>
  );
}

/* ─── GRID LINES ───────────────────────────────────────────────── */
function GridLines({ isDark }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity: isDark ? 0.03 : 0.04 }}>
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'} 1px, transparent 1px),
          linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'} 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />
    </div>
  );
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
          ? `mx-4 mt-3 rounded-2xl backdrop-blur-2xl border shadow-2xl ${isDark
              ? 'bg-zinc-950/70 border-white/8 shadow-black/60'
              : 'bg-white/85 border-zinc-200/80 shadow-black/10'}`
          : 'mx-0 mt-0 rounded-none bg-transparent border-transparent'
      }`}>
        {/* Subtle inner glow on scroll */}
        {scrolled && isDark && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }} />
        )}
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
                  className={`px-3.5 py-2 text-sm font-medium transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'}`}
                >{item.label}</motion.a>
              ))}
              <motion.div ref={termsRef} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.38 }}
                className="relative" onMouseEnter={() => setTermsOpen(true)} onMouseLeave={() => setTermsOpen(false)}>
                <button className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'}`}>
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
            <a href="#contact" className={`text-sm font-medium transition-colors px-3 py-2 ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'}`}>Sign in</a>
            <a href="#pricing" className={`px-5 py-2.5 text-sm rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-[1.02] ${
              isDark
                ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/25 hover:shadow-emerald-500/40'
                : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-black/10'
            }`}>Get a demo</a>
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
              <a href="#pricing" className={`mt-2 py-3 text-sm rounded-xl text-center font-semibold ${isDark ? 'bg-emerald-500 text-white' : 'bg-zinc-950 text-white'}`}>Get a demo</a>
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
            style={{ color: theme.chipColor, border: `1px solid ${theme.border}`, background: theme.chipBg }}
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
const CHAT_HEIGHT = 380;
const CHAT_MSG_HEIGHT_DEFAULT = 200;
const CHAT_MSG_HEIGHT_WITH_CTA = 148;

const CONVERSATION = [
  { from: 'bot',  text: "Hi! I'm TIA. How can I help you today?",                         delay: 600  },
  { from: 'user', text: "What's included in the Growth plan?",                              delay: 1800 },
  { from: 'bot',  text: "The Growth plan (€499/mo) includes chatbots on 3 websites, up to 5 000 chats/month, lead capture, analytics, and priority support 🚀", delay: 3200 },
  { from: 'user', text: "How quickly can we go live?",                                      delay: 5000 },
  { from: 'bot',  text: "Within 48 hours! We handle training, setup, and launch. You just share your content ✅", delay: 6400 },
  { from: 'user', text: "Perfect. Can I book a demo?",                                      delay: 8000 },
  { from: 'bot',  text: "Absolutely! Click below and we'll schedule a free 20-min call 👇",  delay: 9200 },
];

function AnimatedChatLoop({ theme }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const timersRef = useRef([]);
  const scrollRef = useRef(null);
  const isLight = theme.name === 'Pearl White';

  const addTimer = (fn, ms) => { const t = setTimeout(fn, ms); timersRef.current.push(t); };
  const clearAll = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

  const runLoop = useCallback(() => {
    clearAll();
    setChatOpen(false);
    setVisibleMessages(0);
    setShowTyping(false);
    setShowCTA(false);
    addTimer(() => setChatOpen(true), 1200);
    CONVERSATION.forEach((msg, i) => {
      if (msg.from === 'bot') {
        addTimer(() => setShowTyping(true),  1200 + msg.delay - 900);
        addTimer(() => setShowTyping(false), 1200 + msg.delay);
      }
      addTimer(() => setVisibleMessages(v => v + 1), 1200 + msg.delay);
    });
    const lastDelay = 1200 + CONVERSATION[CONVERSATION.length - 1].delay;
    addTimer(() => setShowCTA(true), lastDelay + 500);
    addTimer(() => runLoop(), lastDelay + 3200);
  }, []);

  useEffect(() => { runLoop(); return clearAll; }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [visibleMessages, showTyping]);

  const msgAreaHeight = showCTA ? CHAT_MSG_HEIGHT_WITH_CTA : CHAT_MSG_HEIGHT_DEFAULT;

  return (
    <div style={{ width: 300, position: 'relative' }}>
      <AnimatePresence>
        {!chatOpen && (
          <motion.div key="bubble"
            initial={{ opacity: 0, scale: 0.5, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="flex justify-end mb-2">
            <div style={{
              background: theme.bg, border: `1px solid ${theme.border}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)', width: 52, height: 52,
            }} className="rounded-full flex items-center justify-center relative cursor-pointer">
              <MessageSquare style={{ color: isLight ? '#18181b' : 'rgba(232,232,232,0.9)' }} className="size-6" strokeWidth={1.5} />
              <span style={{ background: theme.accentDot }}
                className="absolute w-3 h-3 rounded-full top-0 right-0 border-2 border-white animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {chatOpen && (
          <motion.div key="chat"
            initial={{ opacity: 0, scale: 0.88, y: 16, originY: 1, originX: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.88, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
            <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.45)', width: 300 }}
              className="rounded-[18px] overflow-hidden flex flex-col">
              <div style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}
                className="flex items-center justify-between px-3.5 py-2.5 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                    className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden">
                    <img src={theme.avatarSrc} alt="TIA" className="w-full h-full object-contain p-0.5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: theme.textColor }} className="text-xs font-semibold">TIA</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
                <X className="size-3.5 opacity-30" style={{ color: theme.textColor }} />
              </div>
              <motion.div ref={scrollRef} animate={{ height: msgAreaHeight }} transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="flex flex-col gap-2.5 p-3 overflow-y-auto"
                style={{ background: isLight ? '#ececee' : 'transparent', scrollbarWidth: 'thin', scrollbarColor: `${theme.scrollThumb} ${theme.scrollTrack}` }}>
                <AnimatePresence initial={false}>
                  {CONVERSATION.slice(0, visibleMessages).map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex gap-1.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.from === 'bot' && (
                        <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                          className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                          <img src={theme.avatarSrc} alt="" className="w-full h-full object-contain p-0.5" />
                        </div>
                      )}
                      <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}`, color: theme.textColor, borderRadius: msg.from === 'bot' ? '2px 10px 10px 10px' : '10px 10px 2px 10px', maxWidth: '82%' }}
                        className="px-2.5 py-1.5 text-[10px] leading-relaxed">{msg.text}</div>
                    </motion.div>
                  ))}
                  {showTyping && (
                    <motion.div key="typing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-1.5">
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
                <div />
              </motion.div>
              <AnimatePresence>
                {showCTA && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }} style={{ background: isLight ? '#ececee' : 'transparent' }}
                    className="px-3 pb-2 overflow-hidden flex-shrink-0">
                    <div className="w-full py-2 bg-emerald-500 text-white text-[10px] font-semibold rounded-lg text-center cursor-pointer hover:bg-emerald-400 transition-colors">
                      Book a free demo →
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ background: isLight ? '#ececee' : 'transparent' }} className="flex gap-1.5 flex-wrap px-3 pb-2 flex-shrink-0">
                {['AI deployment', 'Pricing', 'Book a demo'].map(chip => (
                  <span key={chip} style={{ color: theme.chipColor, border: `1px solid ${theme.border}`, background: theme.chipBg }}
                    className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap">{chip}</span>
                ))}
              </div>
              <div style={{ background: theme.headerBg, borderTop: `1px solid ${theme.border}` }} className="px-2.5 py-2 flex-shrink-0">
                <div style={{ background: theme.inputBg, border: `1px solid ${theme.border}` }}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5">
                  <span style={{ color: theme.subtleText }} className="text-[10px] flex-1">Reply…</span>
                  <div style={{ background: theme.msgBg }} className="w-5 h-5 rounded-md flex items-center justify-center">
                    <svg width="6" height="6" viewBox="0 0 10 16" fill="none">
                      <polyline points="2,1 9,8 2,15" stroke={theme.sendArrow} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
              <div style={{ background: theme.headerBg }} className="flex items-center gap-1 py-1.5 justify-center flex-shrink-0">
                <span style={{ color: theme.subtleText, fontSize: '8px' }}>Powered by</span>
                <img src="https://i.ibb.co/WWGrHnHy/asd3.png" alt="" className="h-2 opacity-50"
                  style={{ filter: isLight ? 'brightness(0)' : 'brightness(2)' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── TIA IN ACTION ────────────────────────────────────────────── */
function TiaInActionSlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  const theme = CHAT_THEMES[activeTheme];
  return (
    <section className={`h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
      <MeshGradient isDark={isDark} />
      <GridLines isDark={isDark} />
      <ParticleField count={isDark ? 10 : 0} />
      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }} transition={{ duration: 0.7 }}
            className="flex-shrink-0 lg:w-72 text-center lg:text-left">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5 ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live demo
            </div>
            <h2 className={`text-6xl md:text-7xl font-light leading-tight mb-4 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              TIA in<br /><span className="text-emerald-400">action</span>
            </h2>
            <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Watch how TIA handles a real customer conversation on your website.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.7 }}
            className="flex-1 rounded-2xl overflow-hidden border shadow-2xl"
            style={{ borderColor: isDark ? '#27272a' : '#e4e4e7', boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)' : '0 32px 80px rgba(0,0,0,0.12)' }}>
            <div className={`flex items-center gap-3 px-5 py-3 border-b ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
              <div className="flex gap-1.5">
                {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
              </div>
              <div className={`flex-1 mx-4 rounded-md px-4 py-1.5 text-xs ${isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-zinc-400 border border-zinc-200'}`}>
                yourcompany.com/products
              </div>
            </div>
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

/* ─── HERO ────────────────────────────────────────────────────── */
function HeroSlide({ activeTheme, setActiveTheme }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const isDark = activeTheme === 'dark';

  return (
    <motion.section ref={ref} style={{ opacity, scale }}
      className={`h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>

      {/* Background image layer */}
      {isDark && (
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNoYXRib3QlMjByb2JvdCUyMGludGVyZmFjZSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzgwMjI1MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="AI Robot" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0.5) 0%, rgba(9,9,11,0.4) 40%, rgba(9,9,11,1) 100%)' }} />
        </div>
      )}

      {/* Mesh + Grid */}
      <MeshGradient isDark={isDark} />
      <GridLines isDark={isDark} />
      <NoiseTexture opacity={isDark ? 0.04 : 0.025} />
      <ParticleField count={isDark ? 24 : 0} />

      {/* Glow orb behind chat */}
      {isDark && (
        <div className="absolute right-1/4 top-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* LEFT */}
        <motion.div style={{ y }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center lg:text-left flex-shrink-0 max-w-xl">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-6 border ${
              isDark
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Anthropic Claude
          </motion.div>

          <h1 className={`text-7xl md:text-8xl font-light mb-6 leading-[1.05] tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            The Future<br />
            <span className={isDark
              ? 'bg-clip-text text-transparent'
              : ''
            } style={isDark ? {
              backgroundImage: 'linear-gradient(135deg, #fff 30%, rgba(52,211,153,0.9) 100%)',
            } : {}}>
              is here
            </span>
          </h1>

          <p className={`text-xl font-light mb-6 max-w-lg leading-relaxed ${isDark ? 'text-white/75' : 'text-zinc-600'}`}>
            TIA AI chatbots for your website — installed in minutes, converting visitors around the clock.
          </p>

          {/* Review */}
          <div className={`flex items-start gap-3 mb-8 max-w-sm p-4 rounded-2xl border ${isDark ? 'bg-white/3 border-white/6' : 'bg-white border-zinc-200 shadow-sm'}`}>
            <div>
              <div className="flex gap-0.5 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`size-3.5 ${isDark ? 'text-amber-400 fill-amber-400' : 'text-amber-500 fill-amber-500'}`} />
                ))}
              </div>
              <p className={`text-sm font-light italic leading-relaxed ${isDark ? 'text-white/70' : 'text-zinc-600'}`}>
                "Set up in 48 hours. Our leads doubled in the first month."
              </p>
              <p className={`text-xs mt-1.5 font-medium ${isDark ? 'text-white/35' : 'text-zinc-400'}`}>— Early user</p>
            </div>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
            <button onClick={() => setActiveTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeTheme === 'dark'
                  ? 'bg-zinc-950 text-white border-zinc-700 shadow-lg shadow-black/30'
                  : isDark ? 'border-white/15 text-white/45 hover:text-white/80' : 'border-zinc-300 text-zinc-400 hover:text-zinc-700'
              }`}>
              <span className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-600 flex-shrink-0" />
              Obsidian Black
            </button>
            <button onClick={() => setActiveTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeTheme === 'light'
                  ? 'bg-white text-zinc-950 border-zinc-300 shadow-md'
                  : isDark ? 'border-white/15 text-white/45 hover:text-white/80' : 'border-zinc-300 text-zinc-400 hover:text-zinc-700'
              }`}>
              <span className="w-3 h-3 rounded-full bg-white border border-zinc-300 flex-shrink-0" />
              Pearl White
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
            <a href="#pricing"
              className={`group px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] ${
                isDark
                  ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/25 hover:shadow-emerald-500/35'
                  : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-black/15'
              }`}>
              Get a free demo
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
                <ArrowRight className="size-4" />
              </motion.span>
            </a>
            <a href="#features"
              className={`px-8 py-4 border rounded-full text-base font-light transition-all hover:scale-[1.01] ${
                isDark
                  ? 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                  : 'border-zinc-300 text-zinc-600 hover:border-zinc-500 hover:text-zinc-950'
              }`}>
              See how it works
            </a>
          </div>

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
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${isDark ? 'text-white/30' : 'text-zinc-400'}`}>
        <ChevronRight className="rotate-90 size-6" />
      </motion.div>
    </motion.section>
  );
}

/* ─── FEATURES ────────────────────────────────────────────────── */
function FeaturesSlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  const features = [
    { icon: MessageSquare, title: 'Any website', desc: 'WordPress, Shopify, custom — one snippet.', accent: 'emerald' },
    { icon: Brain, title: 'Trained on you', desc: 'Knows your products, FAQs, pricing.', accent: 'violet' },
    { icon: Clock, title: '24/7 availability', desc: 'Answers at 3am. Zero overtime.', accent: 'blue' },
    { icon: TrendingUp, title: 'Converts leads', desc: 'Guides visitors to book, buy, contact.', accent: 'emerald' },
    { icon: Users, title: 'Unlimited chats', desc: 'Thousands of conversations, zero load.', accent: 'violet' },
    { icon: Zap, title: 'Live in 48h', desc: 'We handle everything. You share content.', accent: 'amber' },
  ];

  const accentMap = {
    emerald: isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
    violet: isDark ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-100 text-violet-700',
    blue: isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-100 text-blue-700',
    amber: isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-700',
  };

  return (
    <section id="features" className={`h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'} py-12 px-6`}>
      <MeshGradient isDark={isDark} />
      <GridLines isDark={isDark} />
      <NoiseTexture />
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }} className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-4 border ${
            isDark ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-violet-50 text-violet-700 border-violet-200'
          }`}>
            Everything you need
          </div>
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>The AI team</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Focus on your business. We'll handle the AI.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }} transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`group p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                isDark
                  ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80'
                  : 'bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-100'
              }`}>
              {/* Subtle corner glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: f.accent === 'emerald' ? 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)' : f.accent === 'violet' ? 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' : f.accent === 'blue' ? 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
              <div className={`size-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${accentMap[f.accent]}`}>
                <f.icon className="size-5" strokeWidth={1.5} />
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
      desc: 'For growing businesses ready to scale.',
      features: ['Chatbot on 3 websites', 'Advanced training & updates', 'Up to 5 000 chats/mo', 'Lead capture integration', 'Analytics dashboard', 'Priority support'],
      cta: 'Get a demo', highlight: true,
    },
  ];

  return (
    <section id="pricing" className={`h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'} py-16 px-6`}>
      <MeshGradient isDark={isDark} />
      <GridLines isDark={isDark} />
      <NoiseTexture />
      <ParticleField count={isDark ? 10 : 0} />
      <div className="max-w-3xl mx-auto w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }} className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-4 border ${
            isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            Simple, transparent pricing
          </div>
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Simple pricing</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>No hidden fees. Cancel anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start mb-10">
          {plans.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-8 relative transition-all duration-300 overflow-hidden ${
                plan.highlight
                  ? isDark
                    ? 'bg-zinc-100 text-zinc-950 shadow-2xl shadow-white/5 scale-105'
                    : 'bg-zinc-950 text-white shadow-2xl scale-105'
                  : isDark
                    ? 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
                    : 'bg-zinc-50 border border-zinc-200 hover:border-zinc-300'
              }`}>
              {/* Highlight plan accent */}
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: 'linear-gradient(90deg, #34d399, #3b82f6)' }} />
              )}
              {plan.highlight && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold border ${isDark ? 'bg-zinc-950 text-white border-zinc-700' : 'bg-white text-zinc-950 border-zinc-200 shadow-sm'}`}>
                  Most popular
                </div>
              )}
              <div className={`text-xs uppercase tracking-widest mb-3 font-medium ${plan.highlight ? (isDark ? 'text-zinc-500' : 'text-zinc-400') : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{plan.name}</div>
              <div className={`text-5xl font-light mb-1 ${plan.highlight ? (isDark ? 'text-zinc-950' : 'text-white') : isDark ? 'text-white' : 'text-zinc-950'}`}>{plan.price}</div>
              <div className={`text-sm mb-2 ${plan.highlight ? (isDark ? 'text-zinc-400' : 'text-zinc-400') : isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{plan.period}</div>
              <p className={`text-sm font-light mb-6 ${plan.highlight ? (isDark ? 'text-zinc-500' : 'text-zinc-300') : isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{plan.desc}</p>
              <ul className="space-y-2.5 mb-7">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlight ? (isDark ? 'text-zinc-700' : 'text-zinc-300') : isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    <div className={`size-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlight
                        ? isDark ? 'bg-emerald-500/20 text-emerald-600' : 'bg-emerald-500/20 text-emerald-300'
                        : isDark ? 'bg-zinc-800' : 'bg-zinc-200'
                    }`}>
                      <Check className="size-3" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] ${
                plan.highlight
                  ? isDark
                    ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                    : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/25'
                  : isDark
                    ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
              }`}>{plan.cta}</button>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }} transition={{ delay: 0.2 }}
          className={`text-center rounded-2xl py-5 px-6 border ${isDark ? 'border-zinc-800/80 bg-zinc-900/40' : 'border-zinc-100 bg-zinc-50'}`}>
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
function CTASlide({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  return (
    <section className={`h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      <video src="/dots.mp4" autoPlay loop muted playsInline
        className={`absolute inset-0 w-full h-full object-cover ${isDark ? 'opacity-40' : 'opacity-10'}`} />
      <MeshGradient isDark={isDark} />
      <NoiseTexture opacity={isDark ? 0.05 : 0.03} />
      <ParticleField count={isDark ? 20 : 0} />

      {/* Centered glow */}
      {isDark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        className="relative z-10 text-center px-6">

        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }} transition={{ delay: 0.1 }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-6 border ${
            isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Free setup · No commitment
        </motion.div>

        <h2 className={`text-7xl md:text-8xl font-light mb-6 leading-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
          Ready to<br />
          <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>transform?</span>
        </h2>
        <p className={`text-xl font-light mb-10 max-w-xl mx-auto ${isDark ? 'text-white/65' : 'text-zinc-600'}`}>
          Get an AI chatbot on your website within 48 hours. Free demo — no commitment.
        </p>
        <a href="#contact"
          className={`group inline-flex items-center gap-3 px-12 py-5 rounded-full text-lg font-semibold transition-all hover:scale-[1.03] ${
            isDark
              ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40'
              : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xl shadow-black/15'
          }`}>
          Book a free demo
          <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}>
            <ArrowRight className="size-5" />
          </motion.span>
        </a>
        <p className={`mt-5 text-sm ${isDark ? 'text-white/35' : 'text-zinc-400'}`}>No credit card required · Live in 48 hours</p>
      </motion.div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
function Footer({ activeTheme }) {
  const isDark = activeTheme === 'dark';
  return (
    <footer id="contact" className={`py-16 px-6 border-t relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-950 text-zinc-400 border-zinc-900' : 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}>
      <GridLines isDark={isDark} />
      <NoiseTexture opacity={0.02} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={isDark ? '/logo.png' : '/logo-black.png'} alt="TIA AI" className="size-7 object-contain" />
              <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-zinc-950'}`}>TIA AI</span>
            </div>
            <p className="text-sm font-light leading-relaxed mb-4">AI chatbots for businesses, powered by Claude.</p>
            {/* Emerald dot status */}
            <div className={`inline-flex items-center gap-1.5 text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </div>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Case studies'] },
            { title: 'Company', links: ['About', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Terms', 'Privacy', 'Refund policy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${isDark ? 'text-white' : 'text-zinc-950'}`}>{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}><a href="#" className={`text-sm transition-colors ${isDark ? 'hover:text-white' : 'hover:text-zinc-950'}`}>{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={`border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 ${isDark ? 'border-zinc-900' : 'border-zinc-200'}`}>
          <p className="text-xs">© 2025 TIA AI. All rights reserved.</p>
          <p className={`text-xs ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>Powered by Anthropic's Claude API.</p>
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
      <PricingSlide activeTheme={activeTheme} />
      <CTASlide activeTheme={activeTheme} />
      <Footer activeTheme={activeTheme} />
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowRight, Check, Menu, X, Star, ChevronRight,
  Zap, Brain, Shield, TrendingUp, Clock, Users, MessageSquare, Globe
} from 'lucide-react';

/* ─── LEAD FORM MODAL ─────────────────────────────────────────── */
function LeadFormModal({ isDark, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: '', website: '', email: '' });

  const handleSubmit = () => {
    if (!form.company || !form.website || !form.email) return;
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
          className={`w-full max-w-md rounded-2xl p-8 relative shadow-2xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'}`}
        >
          <button onClick={onClose} className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${isDark ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'}`}>
            <X className="size-4" />
          </button>

          {!submitted ? (
            <>
              <h3 className={`text-2xl font-light mb-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Get Started</h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>We'll review your website and build a custom AI chatbot plan for you.</p>
              <div className="flex flex-col gap-3">
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
                  className={`mt-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}
                >
                  Get Started →
                </button>
                <p className={`text-center text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>No commitment · We'll review your website and get back to you within 24 hours.</p>
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
  { from: 'bot',  text: "Hi! I'm TIA. How can I help you today?",                         delay: 600  },
  { from: 'user', text: "What's included in the Growth plan?",                              delay: 1800 },
  { from: 'bot',  text: "The Growth plan (€499/mo) includes chatbots on 3 websites, up to 5 000 chats/month, lead capture, analytics, and priority support 🚀", delay: 3200 },
  { from: 'user', text: "How quickly can we go live?",                                      delay: 5000 },
  { from: 'bot',  text: "Within 48 hours! We handle training, setup, and launch. You just share your content ✅", delay: 6400 },
  { from: 'user', text: "Perfect. Can I book a demo?",                                      delay: 8000 },
  { from: 'bot',  text: "Absolutely! Click below and we'll schedule a free 20-min call 👇",  delay: 9200 },
];

/* Smooth character-by-character reveal for a single message */
function TypedText({ text, color }) {
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
      if (iRef.current >= text.length) {
        clearInterval(interval);
        setDone(true);
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
  const isLight = theme.name === 'Pearl White';

  const addTimer = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };
  const clearAll = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

  const runLoop = useCallback(() => {
    clearAll();
    // Reset all state synchronously before next paint
    setPhase('bubble');
    setVisibleMessages(0);
    setTypingIdx(-1);
    setShowCTA(false);

    // Bubble shows, then chat opens after a beat
    addTimer(() => setPhase('chat'), 1400);

    CONVERSATION.forEach((msg, i) => {
      const t = 1400 + msg.delay;
      if (msg.from === 'bot') {
        // Show typing indicator ~900ms before message appears
        addTimer(() => setTypingIdx(i), t - 900);
        // Hide typing & reveal message (TypedText takes over)
        addTimer(() => {
          setTypingIdx(-1);
          setVisibleMessages(v => v + 1);
        }, t);
      } else {
        // User messages slide in immediately
        addTimer(() => setVisibleMessages(v => v + 1), t);
      }
    });

    const lastDelay = 1400 + CONVERSATION[CONVERSATION.length - 1].delay;
    addTimer(() => setShowCTA(true), lastDelay + 500);
    addTimer(() => runLoop(), lastDelay + 3400);
  }, []);

  useEffect(() => { runLoop(); return clearAll; }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [visibleMessages, typingIdx]);

  const msgAreaHeight = showCTA ? CHAT_MSG_HEIGHT_WITH_CTA : CHAT_MSG_HEIGHT_DEFAULT;

  return (
    /* Outer wrapper — fixed size so layout never shifts */
    <div style={{ width: 300, position: 'relative', height: 390 }}>

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

      {/* Chat widget — anchored bottom-right, grows upward */}
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
                width: 300,
              }} className="rounded-[18px] overflow-hidden flex flex-col">

                {/* Header */}
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

                {/* Messages */}
                <motion.div
                  ref={scrollRef}
                  animate={{ height: msgAreaHeight }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="flex flex-col gap-2.5 p-3 overflow-y-auto"
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
                          {/* Most recent bot message types in; older ones are static */}
                          {msg.from === 'bot' && i === visibleMessages - 1 ? (
                            <TypedText text={msg.text} color={theme.textColor} />
                          ) : (
                            <span style={{ color: msg.from === 'user' ? theme.userTextColor : theme.textColor }}>{msg.text}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator while bot is "thinking" */}
                    {typingIdx >= 0 && (
                      <motion.div key="typing"
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
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
                  <div />
                </motion.div>

                {/* CTA */}
                <AnimatePresence>
                  {showCTA && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }}
                      style={{ background: isLight ? '#ececee' : 'transparent' }}
                      className="px-3 pb-2 overflow-hidden flex-shrink-0">
                      <div className="w-full py-2 bg-emerald-500 text-white text-[10px] font-semibold rounded-lg text-center cursor-pointer hover:bg-emerald-400 transition-colors">
                        Get Started →
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

                {/* Input */}
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

                {/* Footer */}
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
      {/* Dark hero background */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <img src="https://6a1d4cd40bc623d413b1bf9a.imgix.net/images/bg-bl.jpg"
          alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-zinc-950/80" />
      </div>
      {/* Light hero background — clean, no image */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${!isDark ? 'opacity-100' : 'opacity-0'} bg-white`} />
      <ParticleField count={isDark ? 24 : 0} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* LEFT */}
        <motion.div style={{ y }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center lg:text-left flex-shrink-0 max-w-xl">

          <h1 className={`text-7xl md:text-8xl font-light mb-6 leading-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            The Future<br />is here
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
                "Set up in 48 hours. Our leads doubled in the first month."
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/35' : 'text-zinc-400'}`}>— Early user</p>
            </div>
          </div>

          {/* Theme switcher */}
          <div className="flex flex-col items-center lg:items-start gap-2 mb-8">
            <p className={`text-xs font-medium tracking-widest uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Choose theme</p>
            <div className="flex items-center gap-2 relative">
              <ThemeArcHint />
              <button onClick={() => setActiveTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeTheme === 'dark'
                    ? 'bg-zinc-950 text-white border-zinc-700 shadow-lg'
                    : isDark ? 'border-white/20 text-white/50 hover:text-white/80' : 'border-zinc-300 text-zinc-500 hover:text-zinc-800'
                }`}>
                <span className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-600 flex-shrink-0" />
                Black
              </button>
              <button onClick={() => setActiveTheme('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeTheme === 'light'
                    ? 'bg-white text-zinc-950 border-zinc-300 shadow-md'
                    : isDark ? 'border-white/20 text-white/50 hover:text-white/80' : 'border-zinc-300 text-zinc-500 hover:text-zinc-800'
                }`}>
                <span className="w-3 h-3 rounded-full bg-white border border-zinc-300 flex-shrink-0" />
                White
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
            <button onClick={onGetStarted}
              className={`group px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-2 transition-colors ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>
              Get Started
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
                <ArrowRight className="size-4" />
              </motion.span>
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
    { icon: Clock, title: '24/7 availability', desc: 'Answers at 3am. Zero overtime.' },
    { icon: TrendingUp, title: 'Converts leads', desc: 'Guides visitors to book, buy, contact.' },
    { icon: Users, title: 'Unlimited chats', desc: 'Thousands of conversations, zero load.' },
    { icon: Zap, title: 'Live in 48h', desc: 'We handle everything. You share content.' },
  ];

  return (
    <section id="features" className={`h-screen flex items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'} py-12 px-6`}>
      <div className="max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }} className="text-center mb-12">
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>The AI team</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Focus on your business. We'll handle the AI.</p>
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
      cta: 'Get Started', highlight: true,
    },
  ];

  return (
    <section id="pricing" className={`h-screen flex flex-col items-center justify-center transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'} py-16 px-6`}>
      <ParticleField count={isDark ? 10 : 0} />
      <div className="max-w-3xl mx-auto w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }} className="text-center mb-12">
          <h2 className={`text-5xl md:text-6xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>Simple pricing</h2>
          <p className={`text-lg font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>No hidden fees. Cancel anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start mb-10">
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
              <div className={`text-xs uppercase tracking-widest mb-3 ${plan.highlight ? (isDark ? 'text-zinc-500' : 'text-zinc-400') : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{plan.name}</div>
              <div className={`text-5xl font-light mb-1 ${plan.highlight ? (isDark ? 'text-zinc-950' : 'text-white') : isDark ? 'text-white' : 'text-zinc-950'}`}>{plan.price}</div>
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
              <button onClick={onGetStarted} className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                plan.highlight
                  ? isDark ? 'bg-zinc-950 text-white hover:bg-zinc-800' : 'bg-white text-zinc-950 hover:bg-zinc-100'
                  : isDark ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700' : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
              }`}>{plan.cta}</button>
            </motion.div>
          ))}
        </div>

        {/* Powered by Anthropic */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }} transition={{ delay: 0.2 }}
          className={`text-center rounded-2xl py-5 px-6 border ${isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-100 bg-zinc-50'}`}>
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
          Get Started
          <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}>
            <ArrowRight className="size-5" />
          </motion.span>
        </button>
        <p className={`mt-5 text-sm ${isDark ? 'text-white/40' : 'text-zinc-400'}`}>No commitment · We'll review your website and get back to you within 24 hours.</p>
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
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <div className={`transition-colors duration-700 ${activeTheme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}>
      {leadOpen && <LeadFormModal isDark={activeTheme === 'dark'} onClose={() => setLeadOpen(false)} />}
      <Header isDark={activeTheme === 'dark'} onGetStarted={() => setLeadOpen(true)} />
      <HeroSlide activeTheme={activeTheme} setActiveTheme={setActiveTheme} onGetStarted={() => setLeadOpen(true)} />
      <TiaInActionSlide activeTheme={activeTheme} />
      <FeaturesSlide activeTheme={activeTheme} />
      <PricingSlide activeTheme={activeTheme} onGetStarted={() => setLeadOpen(true)} />
      <CTASlide activeTheme={activeTheme} onGetStarted={() => setLeadOpen(true)} />
      <Footer activeTheme={activeTheme} />
    </div>
  );
}

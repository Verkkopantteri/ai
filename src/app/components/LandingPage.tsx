import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowRight, Check, Menu, X, Star, ChevronRight,
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
  const [scrollingDown, setScrollingDown] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const isDown = y > lastY.current;
      setScrolled(y > 40);
      setScrollingDown(isDown);
      if (y > 80) setHidden(isDown);
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
  const termsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (termsRef.current && !termsRef.current.contains(e.target as Node)) {
        setTermsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <motion.header
      animate={{ y: hidden ? '-120%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className={`pointer-events-auto transition-all duration-500 ease-in-out ${
        scrolled
          ? `mx-4 mt-3 rounded-2xl backdrop-blur-xl border shadow-2xl shadow-black/40 ${
              scrollingDown
                ? 'bg-zinc-900/70 border-white/5'
                : 'bg-zinc-900/20 border-white/5'
            }`
          : 'mx-0 mt-0 rounded-none bg-transparent border-transparent'
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
              <img src="/logo.png" alt="TIA AI" className="h-12 w-auto object-contain" />
              
            </motion.div>

            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  className="px-3.5 py-2 text-base text-zinc-400 hover:text-white transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}

              {/* Terms dropdown */}
              <motion.div
                ref={termsRef}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + navItems.length * 0.07 }}
                className="relative"
                onMouseEnter={() => setTermsOpen(true)}
                onMouseLeave={() => setTermsOpen(false)}
              >
                <button
                  className="flex items-center gap-1 px-3.5 py-2 text-base text-zinc-400 hover:text-white transition-colors"
                >
                  Terms
                  <motion.span
                    animate={{ rotate: termsOpen ? 90 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="inline-flex"
                  >
                    <ChevronRight className="size-3.5 opacity-70" />
                  </motion.span>
                </button>

                {/* invisible bridge fills the gap so hover doesn't flicker */}
                {termsOpen && <div className="absolute top-full left-0 w-full h-2" />}

                <AnimatePresence>
                  {termsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-[calc(100%+4px)] left-0 w-44 rounded-xl bg-white shadow-xl shadow-black/20 border border-zinc-100 overflow-hidden z-50 py-1"
                    >
                      {[
                        { label: 'Terms of Service', href: '#' },
                        { label: 'Privacy Policy', href: '#' },
                        { label: 'Refund Policy', href: '#' },
                      ].map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="block px-4 py-2.5 text-sm text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
                          onClick={() => setTermsOpen(false)}
                        >
                          {item.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </nav>
          </div>

          {/* Right: Sign in + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-3"
          >
            <a href="#contact" className="text-base text-zinc-400 hover:text-white transition-colors px-3 py-2">
              Sign in
            </a>
            <a
              href="#pricing"
              className="px-4 py-2 bg-white text-zinc-950 text-base rounded-lg font-semibold hover:bg-zinc-100 transition-all hover:shadow-lg hover:shadow-white/10"
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
              <div className="border-t border-zinc-800 pt-2 mt-1 flex flex-col gap-1">
                <span className="text-xs text-zinc-600 uppercase tracking-widest py-1">Terms</span>
                {['Terms of Service', 'Privacy Policy', 'Refund Policy'].map(label => (
                  <a key={label} href="#" onClick={() => setOpen(false)} className="py-2 text-zinc-400 hover:text-white transition-colors text-sm pl-2">
                    {label}
                  </a>
                ))}
              </div>
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

/* ─── CHAT THEMES ─────────────────────────────────────────────── */
const CHAT_THEMES = [
  {
    name: 'Obsidian',
    accent: '#ffffff',
    accentDim: 'rgba(255,255,255,0.55)',
    bg: '#09090b',
    headerBg: 'rgba(13,13,15,0.97)',
    msgBg: '#232325',
    userMsgBg: '#2c2c30',
    border: 'rgba(255,255,255,0.09)',
    inputBg: '#1e1e22',
    chipBg: 'rgba(20,20,24,0.85)',
    glowColor: 'rgba(255,255,255,0.06)',
    label: 'Classic Dark',
  },
  {
    name: 'Ember',
    accent: '#f97316',
    accentDim: 'rgba(249,115,22,0.6)',
    bg: '#0d0a08',
    headerBg: 'rgba(15,10,8,0.97)',
    msgBg: '#1f1410',
    userMsgBg: '#2a1a0f',
    border: 'rgba(249,115,22,0.15)',
    inputBg: '#1a1008',
    chipBg: 'rgba(20,12,6,0.85)',
    glowColor: 'rgba(249,115,22,0.08)',
    label: 'Ember Orange',
  },
  {
    name: 'Aurora',
    accent: '#22d3ee',
    accentDim: 'rgba(34,211,238,0.55)',
    bg: '#060d10',
    headerBg: 'rgba(6,12,16,0.97)',
    msgBg: '#0d1f26',
    userMsgBg: '#102530',
    border: 'rgba(34,211,238,0.12)',
    inputBg: '#0a1a20',
    chipBg: 'rgba(6,16,22,0.85)',
    glowColor: 'rgba(34,211,238,0.07)',
    label: 'Aurora Cyan',
  },
];

/* ─── MINI CHAT WIDGET ────────────────────────────────────────── */
function MiniChat({ theme, index, isActive }: { theme: typeof CHAT_THEMES[0]; index: number; isActive: boolean }) {
  const messages = [
    { from: 'bot', text: "Hey! I'm TIA, your AI assistant. How can I help?" },
    { from: 'user', text: 'Can you set up a demo for us?' },
    { from: 'bot', text: "Absolutely! I'll connect you with our team. Leave your email and we'll schedule within 24h." },
  ];

  return (
    <div
      style={{
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        boxShadow: `0 0 60px ${theme.glowColor}, 0 40px 80px rgba(0,0,0,0.6)`,
      }}
      className="w-[340px] rounded-[20px] overflow-hidden flex flex-col"
      aria-hidden={!isActive}
    >
      {/* Header */}
      <div style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}
        className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div style={{ border: `1px solid ${theme.border}`, background: theme.msgBg }}
            className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            <img src="https://i.ibb.co/WWGrHnHy/asd3.png" alt="TIA" className="w-full h-full object-contain p-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'rgba(255,255,255,0.92)' }} className="text-sm font-semibold">TIA</span>
              <span style={{ background: theme.accent }} className="w-1.5 h-1.5 rounded-full opacity-90 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div style={{ background: theme.accent, opacity: 0.15 }} className="w-4 h-0.5 rounded-full" />
          <div style={{ border: `1px solid ${theme.border}` }} className="w-3.5 h-3.5 rounded-sm opacity-40" />
        </div>
      </div>

      {/* Messages */}
      <div style={{ background: 'transparent' }} className="flex flex-col gap-3 p-4 flex-1">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: isActive ? 1 : 0.7, y: 0 }}
            transition={{ delay: index * 0.15 + i * 0.12, duration: 0.4 }}
            className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {msg.from === 'bot' && (
              <div style={{ border: `1px solid ${theme.border}`, background: theme.msgBg }}
                className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-1">
                <img src="https://i.ibb.co/WWGrHnHy/asd3.png" alt="T" className="w-full h-full object-contain p-0.5" />
              </div>
            )}
            <div
              style={{
                background: msg.from === 'bot' ? theme.msgBg : theme.userMsgBg,
                border: `1px solid ${msg.from === 'bot' ? theme.border : (theme.accent + '30')}`,
                color: 'rgba(232,232,232,0.95)',
                borderRadius: msg.from === 'bot' ? '3px 14px 14px 14px' : '14px 14px 3px 14px',
                boxShadow: msg.from === 'user' ? `0 0 12px ${theme.accent}15` : 'none',
              }}
              className="max-w-[210px] px-3 py-2 text-xs leading-relaxed"
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.5 }}
          transition={{ delay: index * 0.15 + 0.5 }}
          className="flex gap-2"
        >
          <div style={{ border: `1px solid ${theme.border}`, background: theme.msgBg }}
            className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-1">
            <img src="https://i.ibb.co/WWGrHnHy/asd3.png" alt="T" className="w-full h-full object-contain p-0.5" />
          </div>
          <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}`, borderRadius: '3px 14px 14px 14px' }}
            className="flex items-center gap-1 px-3 py-2">
            {[0, 1, 2].map(d => (
              <motion.div
                key={d}
                style={{ background: theme.accent }}
                className="w-1 h-1 rounded-full opacity-60"
                animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Chips */}
      <div style={{ background: 'transparent' }} className="flex gap-1.5 flex-wrap px-4 pb-2">
        {['AI deployment', 'Pricing', 'Book a demo'].map(chip => (
          <span
            key={chip}
            style={{
              color: theme.accentDim,
              border: `1px solid ${theme.accent}25`,
              background: theme.chipBg,
            }}
            className="text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm whitespace-nowrap"
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Input */}
      <div style={{ background: theme.headerBg, borderTop: `1px solid ${theme.border}` }} className="px-3 py-2.5 flex-shrink-0">
        <div style={{ background: theme.inputBg, border: `1px solid ${theme.border}` }}
          className="flex items-center gap-2 rounded-xl px-3 py-2">
          <span style={{ color: 'rgba(255,255,255,0.22)' }} className="text-xs flex-1">Send a message…</span>
          <div style={{ background: theme.msgBg, border: `1px solid ${theme.accent}30` }}
            className="w-6 h-6 rounded-lg flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 10 16" fill="none">
              <polyline points="2,1 9,8 2,15" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: theme.headerBg }}
        className="flex items-center justify-center gap-1.5 py-2 pb-2.5">
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', letterSpacing: '0.04em' }}>Powered by</span>
        <img src="https://i.ibb.co/WWGrHnHy/asd3.png" alt="TIA" className="h-2.5 opacity-50 brightness-200" />
      </div>
    </div>
  );
}

/* ─── CHAT CAROUSEL ───────────────────────────────────────────── */
function ChatCarousel() {
  const [active, setActive] = useState(0);

  const prev = () => setActive(a => (a - 1 + CHAT_THEMES.length) % CHAT_THEMES.length);
  const next = () => setActive(a => (a + 1) % CHAT_THEMES.length);

  // Stack positions: active=front, others behind offset diagonally
  const getTransform = (idx: number) => {
    const rel = ((idx - active) + CHAT_THEMES.length) % CHAT_THEMES.length;
    if (rel === 0) return { x: 0, y: 0, z: 0, rotateY: 0, rotateX: 0, scale: 1, opacity: 1, zIndex: 30 };
    if (rel === 1) return { x: 52, y: -36, z: -1, rotateY: -10, rotateX: 4, scale: 0.88, opacity: 0.65, zIndex: 20 };
    return { x: 96, y: -66, z: -2, rotateY: -18, rotateX: 7, scale: 0.78, opacity: 0.35, zIndex: 10 };
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* 3D stack container */}
      <div className="relative" style={{ width: 340, height: 540, perspective: '1200px' }}>
        {CHAT_THEMES.map((theme, i) => {
          const pos = getTransform(i);
          return (
            <motion.div
              key={theme.name}
              animate={{
                x: pos.x,
                y: pos.y,
                rotateY: pos.rotateY,
                rotateX: pos.rotateX,
                scale: pos.scale,
                opacity: pos.opacity,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: pos.zIndex,
                transformStyle: 'preserve-3d',
                cursor: i !== active ? 'pointer' : 'default',
              }}
              onClick={() => i !== active && setActive(i)}
            >
              <MiniChat theme={theme} index={i} isActive={i === active} />
            </motion.div>
          );
        })}
      </div>

      {/* Theme label */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex items-center gap-2"
      >
        <span
          style={{ background: CHAT_THEMES[active].accent, boxShadow: `0 0 8px ${CHAT_THEMES[active].accent}80` }}
          className="w-2 h-2 rounded-full"
        />
        <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs tracking-widest uppercase">
          {CHAT_THEMES[active].label}
        </span>
      </motion.div>

      {/* Glass arrow buttons */}
      <div className="flex gap-3 mt-4">
        {[
          { fn: prev, dir: 'left', label: '←' },
          { fn: next, dir: 'right', label: '→' },
        ].map(({ fn, dir, label }) => (
          <motion.button
            key={dir}
            onClick={fn}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.14)' }}
            whileTap={{ scale: 0.93 }}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(12px)',
              color: 'rgba(255,255,255,0.75)',
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors"
          >
            {dir === 'left' ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <polyline points="10,2 4,8 10,14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <polyline points="6,2 12,8 6,14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </motion.button>
        ))}
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-3">
        {CHAT_THEMES.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActive(i)}
            style={{
              background: i === active ? CHAT_THEMES[active].accent : 'rgba(255,255,255,0.2)',
              boxShadow: i === active ? `0 0 8px ${CHAT_THEMES[active].accent}70` : 'none',
              width: i === active ? 20 : 6,
            }}
            className="h-1.5 rounded-full transition-all duration-300"
          />
        ))}
      </div>
    </div>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function HeroSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);
  const chatY = useTransform(scrollYProgress, [0, 0.5], [0, -20]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNoYXRib3QlMjByb2JvdCUyMGludGVyZmFjZSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzgwMjI1MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI Robot"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-zinc-950" />
        {/* Subtle right vignette to blend chat cards */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40" />
      </div>

      <ParticleField count={24} />

      {/* Split layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-12 py-28 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">

        {/* LEFT — text content */}
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex-1 max-w-xl"
        >
          {/* Eyebrow tag */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/60 tracking-widest uppercase">AI Chat for your website</span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-[1.05]">
            The Future<br />
            <span className="italic text-white/70">is here</span>
          </h1>

          <p className="text-xl text-white/65 font-light mb-10 leading-relaxed max-w-md">
            TIA AI chatbots for your website — trained on your content, live in 48 hours.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href="#pricing"
              className="group px-7 py-3.5 bg-white text-zinc-950 rounded-full text-sm font-semibold inline-flex items-center gap-2 hover:bg-zinc-100 transition-colors"
            >
              Get a free demo
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <ArrowRight className="size-4" />
              </motion.span>
            </a>
            <a href="#features"
              className="px-7 py-3.5 border border-white/25 text-white/80 rounded-full text-sm font-light hover:border-white/50 hover:text-white transition-colors"
              style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.04)' }}>
              See how it works
            </a>
          </div>

          {/* Social proof tickers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-6 mt-10"
          >
            {[
              { val: '48h', label: 'setup time' },
              { val: '24/7', label: 'availability' },
              { val: '3×', label: 'more leads' },
            ].map(stat => (
              <div key={stat.val} className="text-center">
                <div className="text-2xl font-light text-white">{stat.val}</div>
                <div className="text-xs text-white/35 mt-0.5 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — chat carousel */}
        <motion.div
          style={{ y: chatY }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex-shrink-0"
        >
          {/* Section label above carousel */}
          <div className="mb-5 flex items-center gap-2 opacity-50">
            <div className="h-px flex-1 bg-white/15 max-w-[60px]" />
            <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase">Live preview</span>
            <div className="h-px flex-1 bg-white/15 max-w-[60px]" />
          </div>
          <ChatCarousel />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
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
    { animated: true, target: 73, suffix: '%', label: 'of customers leave if they don\'t get an instant answer.' },
    { animated: false, display: '24/7', label: 'availability your team cannot provide. Your chatbot can.' },
    { animated: true, target: 3, suffix: '×', label: 'more leads converted with instant chat support.' },
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
          Every unanswered question on your website is a lost customer.
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
            The AI team
          </h2>
          <p className="text-xl text-zinc-500 font-light max-w-xl mx-auto">
            Focus on your business. We'll handle the AI.
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
            Reliable
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

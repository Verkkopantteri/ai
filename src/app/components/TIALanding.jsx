import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView, useMotionValue, useSpring } from 'motion/react';
import {
  ArrowRight, Check, Menu, X, Star, ChevronRight,
  Zap, Brain, Shield, TrendingUp, Clock, Users, MessageSquare
} from 'lucide-react';

/* ─── FONTS ─────────────────────────────────────────────────── */
const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  * { font-family: 'DM Sans', sans-serif; }
  .font-display { font-family: 'Playfair Display', serif; }
`;

/* ─── CURSOR GLOW ─────────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <motion.div
      style={{ left: sx, top: sy, translateX: '-50%', translateY: '-50%' }}
      className="fixed pointer-events-none z-0 w-[600px] h-[600px] rounded-full"
      style={{
        left: sx, top: sy,
        translateX: '-50%', translateY: '-50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        position: 'fixed',
        zIndex: 0,
        width: 600, height: 600,
        borderRadius: '50%',
      }}
    />
  );
}

/* ─── HEADER ─────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 40); lastY.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Reliable', href: '#why-pantteri' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className={`transition-all duration-500 ${scrolled ? 'mx-4 mt-3 rounded-2xl bg-[#080810]/90 backdrop-blur-2xl border border-white/8 shadow-2xl shadow-black/60' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="TIA AI" className="h-9 w-auto object-contain" />
            </div>
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => (
                <a key={item.label} href={item.href}
                  className="px-4 py-2 text-sm text-white/50 hover:text-white/90 transition-colors rounded-lg hover:bg-white/5">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="#contact" className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2">
              Sign in
            </a>
            <a href="#pricing"
              className="px-5 py-2.5 bg-white text-black text-sm rounded-xl font-medium hover:bg-white/90 transition-all shadow-lg shadow-white/10">
              Get a demo →
            </a>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
    </motion.header>
  );
}

/* ─── LIVE CHAT WIDGET ────────────────────────────────────────── */
function LiveChatWidget() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hey! I'm TIA, your AI assistant. How can I help today?", ts: '09:41' },
  ]);
  const [typing, setTyping] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [step, setStep] = useState(0);
  const bottomRef = useRef(null);

  const demoFlow = [
    { user: 'Can you show me your pricing?', bot: "Absolutely! We have three plans starting at €199/month. All include setup, training, and 24/7 operation. The Growth plan at €499 is most popular 🚀" },
    { user: 'How fast can you go live?', bot: "Within 48 hours! We handle everything — training, integration, launch. You just share your content and we do the rest ✅" },
    { user: 'Do you support Finnish?', bot: "Yes, TIA speaks 100+ languages including Finnish, Swedish, and English — simultaneously if needed 🇫🇮" },
  ];

  const sendMessage = (text) => {
    const msg = text || inputVal;
    if (!msg.trim()) return;
    setInputVal('');
    setMessages(m => [...m, { from: 'user', text: msg, ts: '09:4' + (2 + messages.length) }]);
    setTyping(true);

    const response = demoFlow[step % demoFlow.length];
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: 'bot', text: response.bot, ts: '09:4' + (3 + messages.length) }]);
      setStep(s => s + 1);
    }, 1400);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const suggestions = demoFlow.map(d => d.user).filter((_, i) => i >= step % 3);

  return (
    <div className="flex flex-col h-full bg-[#0e0e18] rounded-[24px] overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
      style={{ background: 'linear-gradient(145deg, #0e0e1c 0%, #080812 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <img src="/logo.png" alt="TIA" className="w-6 h-6 object-contain" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0e0e1c] animate-pulse" />
        </div>
        <div>
          <div className="text-white text-sm font-medium">TIA</div>
          <div className="text-emerald-400 text-xs">Online now</div>
        </div>
        <div className="ml-auto flex gap-2 opacity-30">
          {['#FF5F57','#FEBC2E','#28C840'].map(c => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-hide" style={{ minHeight: 0 }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
              className={`flex gap-2.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.from === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-violet-500/20">
                  <img src="/logo.png" alt="" className="w-4 h-4 object-contain" />
                </div>
              )}
              <div style={{
                background: msg.from === 'bot'
                  ? 'rgba(255,255,255,0.07)'
                  : 'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(99,102,241,0.35))',
                border: `1px solid ${msg.from === 'bot' ? 'rgba(255,255,255,0.08)' : 'rgba(139,92,246,0.3)'}`,
                borderRadius: msg.from === 'bot' ? '4px 16px 16px 16px' : '16px 16px 4px 16px',
              }}
                className="max-w-[75%] px-4 py-2.5 text-white/90 text-sm leading-relaxed">
                {msg.text}
              </div>
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20">
                <img src="/logo.png" alt="" className="w-4 h-4 object-contain" />
              </div>
              <div className="px-4 py-3 rounded-[4px_16px_16px_16px] border border-white/8 flex gap-1.5 items-center"
                style={{ background: 'rgba(255,255,255,0.07)' }}>
                {[0,1,2].map(d => (
                  <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-white/40"
                    animate={{ y: [0,-4,0], opacity:[0.4,1,0.4] }}
                    transition={{ duration: 0.9, delay: d*0.15, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {step < 3 && !typing && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {demoFlow.slice(step, step+2).map((d, i) => (
            <motion.button key={i}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => sendMessage(d.user)}
              className="text-xs px-3 py-1.5 rounded-full border border-violet-500/30 text-violet-300 hover:bg-violet-500/15 transition-colors"
            >
              {d.user}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Send a message…"
            className="flex-1 bg-transparent text-white/80 text-sm outline-none placeholder:text-white/25"
          />
          <button onClick={() => sendMessage()}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity shadow-md shadow-violet-500/30">
            <ArrowRight className="size-3.5 text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 mt-2 opacity-30">
          <span className="text-white/50 text-[10px]">Powered by</span>
          <img src="https://i.ibb.co/WWGrHnHy/asd3.png" alt="" className="h-2.5 brightness-200" />
        </div>
      </div>
    </div>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function HeroSlide() {
  return (
    <section className="min-h-screen flex items-center pt-24 pb-16 px-6 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(109,40,217,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 20% 80%, rgba(49,46,129,0.12) 0%, transparent 60%), #060610'
      }} />
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-[1fr_440px] gap-12 xl:gap-20 items-center">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-violet-300 text-xs font-medium tracking-wide">Powered by Anthropic Claude</span>
          </motion.div>

          <h1 className="font-display text-white leading-[1.05] mb-6">
            <span className="block text-6xl lg:text-7xl xl:text-8xl font-normal">The Future</span>
            <span className="block text-6xl lg:text-7xl xl:text-8xl font-normal italic text-violet-300"> is here</span>
          </h1>

          <p className="text-white/55 text-xl lg:text-2xl font-light mb-10 max-w-lg leading-relaxed">
            TIA AI chatbots for your website —<br />installed in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#pricing"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-black rounded-2xl text-base font-medium hover:bg-violet-50 transition-all shadow-2xl shadow-white/10">
              Get a free demo
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ArrowRight className="size-4" />
              </motion.span>
            </a>
            <a href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 text-white/70 rounded-2xl text-base font-light hover:border-white/30 hover:text-white transition-all">
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 mt-10 pt-10 border-t border-white/8">
            <div className="flex -space-x-2">
              {['#8B5CF6','#6366F1','#4F46E5','#7C3AED'].map((c,i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#060610] flex items-center justify-center text-xs text-white font-medium"
                  style={{ background: c }}>
                  {['M','L','S','J'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">{[...Array(5)].map((_,i) => <Star key={i} className="size-3 text-yellow-400 fill-yellow-400" />)}</div>
              <div className="text-white/40 text-xs mt-0.5">50+ Finnish businesses trust TIA</div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — LIVE CHAT */}
        <motion.div
          initial={{ opacity: 0, x: 40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16,1,0.3,1] }}
          className="h-[580px] relative"
        >
          {/* Glow behind */}
          <div className="absolute inset-0 -m-8 rounded-full blur-3xl opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)' }} />
          <LiveChatWidget />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PROBLEM STATS ──────────────────────────────────────────── */
function AnimatedNumber({ target, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 2200, 1);
      setV(Math.floor((1 - Math.pow(1-p,3)) * target));
      if (p < 1) requestAnimationFrame(step); else setV(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span ref={ref}>{v}{suffix}</span>;
}

function ProblemSlide() {
  const stats = [
    { target: 73, suffix: '%', label: 'of customers leave if they don\'t get an instant answer.' },
    { display: '24/7', label: 'availability your team cannot provide. Your chatbot can.' },
    { target: 3, suffix: '×', label: 'more leads converted with instant chat support.' },
  ];
  return (
    <section className="py-32 px-6 relative overflow-hidden" style={{ background: '#060610' }}>
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-20">
          <h2 className="font-display text-6xl lg:text-7xl text-white font-normal mb-4">
            Your customers are <span className="italic text-red-400">waiting</span>
          </h2>
          <p className="text-white/40 text-xl font-light">Every unanswered question is a lost customer.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="text-center p-8 rounded-3xl border border-white/6"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="font-display text-7xl font-normal text-red-400 mb-4">
                {s.target !== undefined ? <AnimatedNumber target={s.target} suffix={s.suffix} /> : s.display}
              </div>
              <p className="text-white/45 font-light text-base">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ────────────────────────────────────────────────── */
function FeaturesSlide() {
  const features = [
    { icon: MessageSquare, title: 'Installed on your website', desc: 'A small code snippet. Works on WordPress, Shopify, or any custom site.' },
    { icon: Brain, title: 'Trained on your content', desc: 'Knows your products, FAQs, and pricing. Answers like a real team member.' },
    { icon: Clock, title: 'Available 24/7', desc: 'Answers at 3am on Sunday. No overtime, no missed opportunities.' },
    { icon: TrendingUp, title: 'Converts visitors to leads', desc: 'Guides users toward booking, buying, or contacting you. Intelligently.' },
    { icon: Users, title: 'Unlimited simultaneous chats', desc: 'One chatbot, thousands of conversations. Your team handles none of them.' },
    { icon: Zap, title: 'Live in 48 hours', desc: 'We handle everything: training, setup, launch. You just share your content.' },
  ];
  return (
    <section id="features" className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-20">
          <h2 className="font-display text-6xl lg:text-7xl text-zinc-950 mb-4">The AI team</h2>
          <p className="text-zinc-400 text-xl font-light">Focus on your business. We'll handle the AI.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.5 }}
              className="group p-8 rounded-3xl border border-zinc-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-400">
              <div className="size-12 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-violet-600 transition-all duration-300">
                <f.icon className="size-5 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-950 mb-3">{f.title}</h3>
              <p className="text-zinc-500 font-light leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ANIMATED DEMO CONVERSATION ─────────────────────────────── */
function DemoConversationSlide() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [visible, setVisible] = useState(0);

  const conversation = [
    { from: 'user', text: 'Hi! We just launched a SaaS startup. Do you handle technical products?', delay: 0 },
    { from: 'bot', text: 'Absolutely! I can be trained on your entire documentation, pricing pages, and technical specs. I\'ll answer questions as accurately as your best support agent.', delay: 1200 },
    { from: 'user', text: 'What happens when a question is too complex for you?', delay: 2600 },
    { from: 'bot', text: 'I\'ll let your visitor know I\'m connecting them with a human expert — and capture their contact info so your team can follow up. No lead lost. ✅', delay: 3900 },
    { from: 'user', text: 'How do I see what people are asking?', delay: 5200 },
    { from: 'bot', text: 'You get a live analytics dashboard showing all conversations, top questions, and conversion rates. We send you weekly digest emails too 📊', delay: 6500 },
    { from: 'user', text: 'Ok, I\'m interested. How do we get started?', delay: 7800 },
    { from: 'bot', text: 'Great! Book a free demo and we\'ll have your chatbot live within 48 hours. No credit card needed. Want me to schedule that for you right now? 🚀', delay: 9000 },
  ];

  useEffect(() => {
    if (!inView) return;
    conversation.forEach((msg, i) => {
      setTimeout(() => setVisible(i + 1), msg.delay);
    });
  }, [inView]);

  return (
    <section ref={ref} className="py-32 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060610 0%, #0a0820 50%, #060610 100%)' }}>
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/8 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-violet-300 text-xs font-medium">Live demo</span>
          </div>
          <h2 className="font-display text-6xl text-white font-normal mb-4">Watch TIA in action</h2>
          <p className="text-white/40 text-lg font-light">A real conversation with a SaaS startup founder</p>
        </motion.div>

        {/* Fake browser chrome */}
        <div className="rounded-[24px] overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/20"
          style={{ background: '#0c0c1e' }}>
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex gap-1.5">
              {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
            </div>
            <div className="flex-1 mx-4 px-4 py-1.5 rounded-lg text-white/20 text-xs"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              yourwebsite.com
            </div>
          </div>

          {/* Chat area */}
          <div className="p-6 space-y-4 min-h-[480px]">
            <AnimatePresence>
              {conversation.slice(0, visible).map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
                  className={`flex gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.from === 'bot' && (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 shadow-lg shadow-violet-500/25"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}>
                      <img src="/logo.png" alt="" className="w-5 h-5 object-contain" />
                    </div>
                  )}
                  {msg.from === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-zinc-600 flex-shrink-0 flex items-center justify-center text-xs text-white font-medium mt-0.5">
                      A
                    </div>
                  )}
                  <div style={{
                    background: msg.from === 'bot' ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${msg.from === 'bot' ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: msg.from === 'bot' ? '4px 18px 18px 18px' : '18px 18px 4px 18px',
                  }}
                    className="max-w-[80%] px-4 py-3 text-white/85 text-sm leading-relaxed">
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator if next message is from bot and not yet visible */}
              {visible < conversation.length && conversation[visible]?.from === 'bot' && (
                <motion.div key="typing-demo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/25"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}>
                    <img src="/logo.png" alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <div className="px-4 py-3 rounded-[4px_18px_18px_18px] flex gap-1.5 items-center"
                    style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
                    {[0,1,2].map(d => (
                      <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-violet-400"
                        animate={{ y:[0,-4,0], opacity:[0.4,1,0.4] }}
                        transition={{ duration: 0.9, delay: d*0.15, repeat: Infinity }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10">
          <a href="#pricing"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-black rounded-2xl text-base font-medium hover:bg-violet-50 transition-all shadow-2xl shadow-white/10">
            Get your own TIA
            <ArrowRight className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── WHY TIA ─────────────────────────────────────────────────── */
function WhyPantteriSlide() {
  const reasons = [
    { icon: Brain, title: 'Powered by Claude', desc: 'Ranks #1 in reasoning and accuracy. Your chatbot is not just fast. It is genuinely intelligent.' },
    { icon: Shield, title: 'Safe, brand-safe responses', desc: 'Claude is designed to be honest and refuse harmful requests. Your brand is protected.' },
    { icon: TrendingUp, title: 'We manage everything', desc: 'Training, updates, monitoring. TIA AI handles the full AI stack. Zero technical headache.' },
  ];
  return (
    <section id="why-pantteri" className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent)', transform: 'translate(30%, -30%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-20">
          <h2 className="font-display text-6xl lg:text-7xl text-zinc-950 mb-4">Reliable</h2>
          <p className="text-zinc-400 text-xl font-light">Not all AI chatbots are created equal.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reasons.map((r, i) => (
            <motion.div key={r.title}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.13 }}
              className="p-8 rounded-3xl border border-zinc-100 hover:border-violet-100 hover:shadow-xl hover:shadow-violet-50 transition-all duration-400">
              <div className="size-14 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6">
                <r.icon className="size-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-950 mb-3">{r.title}</h3>
              <p className="text-zinc-400 font-light leading-relaxed text-sm">{r.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-zinc-100 p-10 text-center bg-zinc-50">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3">Powered by</p>
          <h3 className="font-display text-3xl text-zinc-950 mb-3">Anthropic's Claude</h3>
          <p className="text-zinc-500 font-light max-w-xl mx-auto text-sm">
            Trusted by Fortune 500 companies and millions of professionals worldwide. 200K token context. Ranked #1 in reasoning. 100+ languages.
          </p>
          <div className="flex justify-center gap-12 mt-8">
            {[{ value: '#1', label: 'Reasoning' }, { value: '200K', label: 'Token context' }, { value: '100+', label: 'Languages' }].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl text-zinc-950">{s.value}</div>
                <div className="text-zinc-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── REVIEWS ─────────────────────────────────────────────────── */
function ReviewsSlide() {
  const reviews = [
    { stars: 5, text: 'Our chatbot now handles 80% of inquiries automatically. Our team focuses on real work.', name: 'Matti K.', role: 'CEO, Verkkokauppa Oy' },
    { stars: 5, text: 'Leads went up 40% in the first month. It books viewings automatically. Incredible.', name: 'Laura V.', role: 'Founder, Nordic Properties' },
    { stars: 5, text: 'Setup done in 48 hours. TIA AI handled everything. We just shared our content.', name: 'Sanna M.', role: 'Marketing Director, Klinikka Pro' },
  ];
  return (
    <section className="py-32 px-6 relative overflow-hidden" style={{ background: '#060610' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="font-display text-6xl text-white mb-4">Early results</h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="size-4 text-yellow-400 fill-yellow-400" />)}
            <span className="text-white/30 text-sm ml-2">5.0 · Verified business reviews</span>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div key={r.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.13 }}
              className="p-8 rounded-3xl border border-white/8 hover:border-violet-500/30 transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex gap-0.5 mb-5">
                {[...Array(r.stars)].map((_, j) => <Star key={j} className="size-3.5 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-white/60 font-light leading-relaxed mb-6 text-sm">"{r.text}"</p>
              <div>
                <div className="font-medium text-white text-sm">{r.name}</div>
                <div className="text-white/30 text-xs">{r.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ─────────────────────────────────────────────────── */
function PricingSlide() {
  const plans = [
    {
      name: 'Starter', price: '€199', period: '/month',
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
    {
      name: 'Enterprise', price: 'Custom', period: '',
      desc: 'For large organisations.',
      features: ['Unlimited websites', 'Unlimited chats', 'Custom integrations (CRM, etc.)', 'White-label option', 'Dedicated account manager', 'SLA guarantee'],
      cta: 'Contact us', highlight: false,
    },
  ];
  return (
    <section id="pricing" className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent)', transform: 'translate(-30%, 30%)' }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="font-display text-6xl lg:text-7xl text-zinc-950 mb-4">Simple pricing</h2>
          <p className="text-zinc-400 text-lg font-light">No hidden fees. Cancel anytime.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`rounded-3xl p-8 relative transition-all ${plan.highlight
                ? 'bg-zinc-950 text-white shadow-2xl shadow-zinc-950/20 md:scale-105 border border-violet-500/20'
                : 'border border-zinc-100 hover:border-zinc-200'}`}>
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 text-white rounded-full text-xs font-medium">
                  Most popular
                </div>
              )}
              <div className={`text-xs uppercase tracking-widest mb-3 ${plan.highlight ? 'text-white/40' : 'text-zinc-400'}`}>
                {plan.name}
              </div>
              <div className={`font-display text-5xl font-normal mb-1 ${plan.highlight ? 'text-white' : 'text-zinc-950'}`}>
                {plan.price}
              </div>
              <div className={`text-sm mb-2 ${plan.highlight ? 'text-white/40' : 'text-zinc-400'}`}>{plan.period}</div>
              <p className={`text-sm font-light mb-8 ${plan.highlight ? 'text-white/50' : 'text-zinc-500'}`}>{plan.desc}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlight ? 'text-white/70' : 'text-zinc-600'}`}>
                    <Check className={`size-4 shrink-0 ${plan.highlight ? 'text-violet-400' : 'text-zinc-400'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3.5 rounded-2xl text-sm font-medium transition-all ${plan.highlight
                ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25'
                : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>
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
function CTASlide() {
  return (
    <section className="py-40 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0c0020 0%, #060610 50%, #0a0818 100%)' }}>
      <div className="absolute inset-0 opacity-[0.08]"
        style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)' }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="font-display text-7xl lg:text-8xl text-white font-normal mb-6 leading-[1.05]">
          Ready to<br /><span className="italic text-violet-300">transform?</span>
        </h2>
        <p className="text-white/50 text-xl font-light mb-10 max-w-xl mx-auto">
          Get an AI chatbot on your website within 48 hours. Free demo — no commitment.
        </p>
        <a href="#contact"
          className="group inline-flex items-center gap-3 px-12 py-5 bg-white text-black rounded-2xl text-lg font-medium hover:bg-violet-50 transition-all shadow-2xl shadow-white/10">
          Book a free demo
          <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
            <ArrowRight className="size-5" />
          </motion.span>
        </a>
        <p className="text-white/25 mt-5 text-sm">No credit card required · Live in 48 hours</p>
      </motion.div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer id="contact" className="bg-[#040408] text-white/40 py-16 px-6 border-t border-white/6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="TIA AI" className="size-7 object-contain" />
              <span className="text-white font-medium text-sm">TIA AI</span>
            </div>
            <p className="text-sm font-light leading-relaxed">AI chatbots for businesses, powered by Claude.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Case studies'] },
            { title: 'Company', links: ['About', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Terms', 'Privacy', 'Refund policy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-medium mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/6 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2025 TIA AI. All rights reserved.</p>
          <p className="text-xs text-white/20">Powered by Anthropic's Claude API.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="bg-[#060610] min-h-screen">
      <style>{FONT_STYLE}</style>
      <CursorGlow />
      <Header />
      <HeroSlide />
      <ProblemSlide />
      <FeaturesSlide />
      <DemoConversationSlide />
      <WhyPantteriSlide />
      <ReviewsSlide />
      <PricingSlide />
      <CTASlide />
      <Footer />
    </div>
  );
}

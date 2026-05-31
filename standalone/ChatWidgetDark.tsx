import { motion } from 'motion/react';

const theme = {
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
  footerLogoSrc: 'https://i.ibb.co/WWGrHnHy/asd3.png',
  footerLogoFilter: 'brightness(2)',
};

const messages = [
  { from: 'bot', text: "Hey! I'm TIA, your AI assistant. How can I help?" },
  { from: 'user', text: 'Can you set up a demo for us?' },
  { from: 'bot', text: "Absolutely! I'll connect you with our team. Leave your email and we'll schedule within 24h." },
];

export function ChatWidgetDark() {
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
      <div className="flex flex-col gap-3 p-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {msg.from === 'bot' && (
              <div style={{ border: `1px solid ${theme.border}`, background: theme.msgBg }}
                className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                <img src={theme.avatarSrc} alt="T" className="w-full h-full object-contain p-0.5" />
              </div>
            )}
            <div
              style={{
                background: msg.from === 'bot' ? theme.msgBg : theme.userMsgBg,
                border: `1px solid ${theme.border}`,
                color: msg.from === 'user' ? theme.userTextColor : theme.textColor,
                borderRadius: msg.from === 'bot' ? '3px 14px 14px 14px' : '14px 14px 3px 14px',
              }}
              className="max-w-[200px] px-3 py-2 text-[11px] leading-relaxed"
            >
              {msg.text}
            </div>
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
              <motion.div key={d}
                style={{ background: theme.subtleText }}
                className="w-1 h-1 rounded-full"
                animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chips */}
      <div className="flex gap-1.5 flex-wrap px-4 pb-2">
        {['AI deployment', 'Pricing', 'Book a demo'].map(chip => (
          <span key={chip}
            style={{ color: theme.chipColor, border: `1px solid ${theme.border}`, background: 'rgba(20,20,24,0.85)' }}
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
        <img src={theme.footerLogoSrc} alt="TIA"
          className="h-2.5"
          style={{ opacity: 0.5, filter: theme.footerLogoFilter }} />
      </div>
    </div>
  );
}

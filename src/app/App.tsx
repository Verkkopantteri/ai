import { useState } from 'react';
import { ModernExample } from './components/ModernExample';
import { FuturisticExample } from './components/FuturisticExample';
import { MinimalExample } from './components/MinimalExample';
import { Sparkles, Zap, Circle } from 'lucide-react';

export default function App() {
  const [activeExample, setActiveExample] = useState<'modern' | 'futuristic' | 'minimal'>('modern');

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            <span className="font-semibold text-white">AI ChatBots</span>
          </div>

          <nav className="flex">
            <button
              onClick={() => setActiveExample('modern')}
              className={`px-4 py-2 rounded-md transition-all flex items-center ${activeExample === 'modern' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              Modern
            </button>
            <button
              onClick={() => setActiveExample('futuristic')}
              className={`px-4 py-2 rounded-md transition-all flex items-center ${activeExample === 'futuristic' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              Futuristic
            </button>
            <button
              onClick={() => setActiveExample('minimal')}
              className={`px-4 py-2 rounded-md transition-all flex items-center ${activeExample === 'minimal' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              Minimal
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        {activeExample === 'modern' && <ModernExample />}
        {activeExample === 'futuristic' && <FuturisticExample />}
        {activeExample === 'minimal' && <MinimalExample />}
      </main>
    </div>
  );
}

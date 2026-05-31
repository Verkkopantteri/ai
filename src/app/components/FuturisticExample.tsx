import { motion } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { Cpu, Sparkles, Globe, Rocket, TrendingUp, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '< 100ms', label: 'Response Time' },
  { value: '50K+', label: 'Active Bots' },
  { value: '24/7', label: 'Support' },
];

const capabilities = [
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Communicate in 95+ languages',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Cpu,
    title: 'Neural Processing',
    description: 'Advanced AI understanding',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Learning',
    description: 'Gets smarter over time',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamless human handoff',
    color: 'from-emerald-500 to-teal-500',
  },
];

export function FuturisticExample() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-zinc-950 to-cyan-900/30" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-6xl mx-auto px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 backdrop-blur-sm">
              <Sparkles className="size-5" />
              <span>Powered by Advanced Neural Networks</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-8xl font-black mb-8"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              The Future of
            </span>
            <br />
            <span className="text-white">Customer Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Next-generation AI chatbots that understand context, emotion, and
            intent with unprecedented accuracy
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-6 justify-center items-center mb-16"
          >
            <MagneticButton className="px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center gap-3">
              <Rocket className="size-5" />
              Launch Your Bot
            </MagneticButton>
            <button className="px-10 py-5 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-full text-lg font-bold hover:bg-white/10 transition-all">
              Explore Features
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-zinc-500 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-purple-950/20 to-zinc-950" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-black text-white mb-6">
              Superhuman Capabilities
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Engineered to exceed expectations in every interaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="group relative p-8 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl hover:border-purple-500/50 transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${capability.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative z-10">
                  <div className={`size-16 bg-gradient-to-br ${capability.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <capability.icon className="size-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-lg text-zinc-400">
                    {capability.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black text-white mb-6">
              Enterprise Pricing
            </h2>
            <p className="text-xl text-zinc-400">
              Scale from startup to global enterprise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl"
            >
              <div className="text-zinc-400 mb-2">Starter</div>
              <div className="text-5xl font-bold text-white mb-4">€299</div>
              <div className="text-zinc-500 mb-6">/month</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-zinc-300">
                  <div className="size-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <div className="size-2 bg-white rounded-full" />
                  </div>
                  Up to 10,000 conversations
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <div className="size-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <div className="size-2 bg-white rounded-full" />
                  </div>
                  Basic analytics
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <div className="size-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <div className="size-2 bg-white rounded-full" />
                  </div>
                  Email support
                </li>
              </ul>
              <button className="w-full py-4 bg-zinc-800 text-white rounded-full font-bold hover:bg-zinc-700 transition-colors">
                Get Started
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-bold">
                Popular
              </div>
              <div className="text-purple-100 mb-2">Professional</div>
              <div className="text-5xl font-bold text-white mb-4">€999</div>
              <div className="text-purple-100 mb-6">/month</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white">
                  <div className="size-5 bg-white rounded-full flex items-center justify-center">
                    <div className="size-2 bg-purple-600 rounded-full" />
                  </div>
                  Unlimited conversations
                </li>
                <li className="flex items-center gap-2 text-white">
                  <div className="size-5 bg-white rounded-full flex items-center justify-center">
                    <div className="size-2 bg-purple-600 rounded-full" />
                  </div>
                  Advanced AI features
                </li>
                <li className="flex items-center gap-2 text-white">
                  <div className="size-5 bg-white rounded-full flex items-center justify-center">
                    <div className="size-2 bg-purple-600 rounded-full" />
                  </div>
                  Priority support
                </li>
              </ul>
              <MagneticButton className="w-full py-4 bg-white text-purple-600 rounded-full font-bold hover:shadow-xl transition-shadow">
                Start Free Trial
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl"
            >
              <div className="text-zinc-400 mb-2">Enterprise</div>
              <div className="text-5xl font-bold text-white mb-4">€50,000</div>
              <div className="text-zinc-500 mb-6">/year</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-zinc-300">
                  <div className="size-5 bg-cyan-600 rounded-full flex items-center justify-center">
                    <div className="size-2 bg-white rounded-full" />
                  </div>
                  Custom deployment
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <div className="size-5 bg-cyan-600 rounded-full flex items-center justify-center">
                    <div className="size-2 bg-white rounded-full" />
                  </div>
                  Dedicated support team
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <div className="size-5 bg-cyan-600 rounded-full flex items-center justify-center">
                    <div className="size-2 bg-white rounded-full" />
                  </div>
                  SLA guarantees
                </li>
              </ul>
              <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full font-bold hover:shadow-xl hover:shadow-purple-500/30 transition-shadow">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-purple-500/10 rounded-full"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-purple-500/30 rounded-[3rem] p-16"
          >
            <h2 className="text-6xl font-black text-white mb-6">
              Ready to Deploy?
            </h2>
            <p className="text-2xl text-zinc-400 mb-10">
              Start building the future of customer engagement today
            </p>
            <MagneticButton className="px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white rounded-full text-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all">
              Initialize Your AI Bot
            </MagneticButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

import { motion } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { MessageSquare, Zap, Shield, BarChart3, ArrowRight, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const features = [
  {
    icon: MessageSquare,
    title: '24/7 Automated Support',
    description: 'Never miss a customer query with AI-powered responses',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant responses that keep customers engaged',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade security for your data',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance and optimize conversations',
  },
];

const chatbotExamples = [
  {
    name: 'SupportBot Pro',
    description: 'Perfect for customer service teams',
    image: 'https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBkaWdpdGFsJTIwY29tbXVuaWNhdGlvbnxlbnwxfHx8fDE3ODAyMjUzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€199/mo',
  },
  {
    name: 'LeadGen AI',
    description: 'Convert visitors into qualified leads',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx0ZWNobm9sb2d5JTIwYXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZSUyMG1vZGVybnxlbnwxfHx8fDE3ODAyMjUzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€299/mo',
  },
  {
    name: 'Enterprise Suite',
    description: 'Full-scale AI automation',
    image: 'https://images.unsplash.com/photo-1694903089438-bf28d4697d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx0ZWNobm9sb2d5JTIwYXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZSUyMG1vZGVybnxlbnwxfHx8fDE3ODAyMjUzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: '€50,000/yr',
  },
];

export function ModernExample() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzRhNWI2ZCIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-5xl mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400"
          >
            Next-Generation AI Technology
          </motion.div>

          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Transform Customer
            <br />
            Conversations with AI
          </h1>

          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Automate support, boost engagement, and scale your business with
            intelligent chatbots that understand your customers.
          </p>

          <div className="flex gap-4 justify-center items-center">
            <MagneticButton
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-shadow flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="size-5" />
            </MagneticButton>

            <button className="px-8 py-4 border border-zinc-700 text-white rounded-full font-semibold hover:bg-zinc-800 transition-colors">
              View Demo
            </button>
          </div>
        </motion.div>
      </section>

      <section className="py-24 px-6 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-zinc-400">
              Everything you need to deliver exceptional customer experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-2xl hover:border-blue-500/50 transition-all"
              >
                <div className="size-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="size-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Choose Your Perfect Bot
            </h2>
            <p className="text-xl text-zinc-400">
              From startups to enterprises, we have a solution for everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {chatbotExamples.map((bot, index) => (
              <motion.div
                key={bot.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={bot.image}
                    alt={bot.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">{bot.name}</h3>
                    <span className="text-blue-400 font-semibold">{bot.price}</span>
                  </div>
                  <p className="text-zinc-400 mb-4">{bot.description}</p>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center"
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join thousands of businesses automating their conversations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-shadow">
                Get Started Now
              </MagneticButton>
              <button className="px-10 py-5 border-2 border-zinc-700 text-white rounded-full text-lg font-semibold hover:bg-zinc-800 transition-colors">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

import { motion, useScroll, useTransform } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { ArrowRight, Check, MessageSquare, BarChart3, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRef } from 'react';

export function MinimalExample() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="bg-white">
      <HeroSlide />
      <ProblemSlide />
      <SolutionSlide />
      <FeaturesSlide />
      <TransformSlide />
      <StatsSlide />
      <PricingSlide />
      <CTASlide />
    </div>
  );
}

function HeroSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGNoYXRib3QlMjByb2JvdCUyMGludGVyZmFjZSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzgwMjI1MzE2fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI Technology"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 text-center px-6"
      >
        <h1 className="text-8xl md:text-9xl font-light text-white mb-6 leading-tight">
          The Future
          <br />
          <span className="font-bold">is here</span>
        </h1>
        <p className="text-2xl text-white/80 font-light">
          AI that understands your customers
        </p>
      </motion.div>
    </motion.section>
  );
}

function ProblemSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y }}
      className="h-screen flex items-center justify-center bg-zinc-950 text-white px-6"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-7xl font-light mb-8">
          Customer support is
          <br />
          <span className="font-bold text-red-500">broken</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          <div>
            <div className="text-6xl font-bold text-red-500 mb-4">73%</div>
            <p className="text-xl text-zinc-400">of customers expect instant responses</p>
          </div>
          <div>
            <div className="text-6xl font-bold text-red-500 mb-4">24/7</div>
            <p className="text-xl text-zinc-400">availability expected</p>
          </div>
          <div>
            <div className="text-6xl font-bold text-red-500 mb-4">€50K+</div>
            <p className="text-xl text-zinc-400">average cost per support agent yearly</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function SolutionSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1694903089438-bf28d4697d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx0ZWNobm9sb2d5JTIwYXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZSUyMG1vZGVybnxlbnwxfHx8fDE3ODAyMjUzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI Solution"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/90" />
      </div>

      <motion.div
        style={{ scale, opacity }}
        className="relative z-10 text-center px-6"
      >
        <h2 className="text-8xl font-light text-white mb-6">
          Meet your
          <br />
          <span className="font-bold">AI assistant</span>
        </h2>
        <p className="text-3xl text-white/90 font-light max-w-3xl mx-auto">
          Intelligent chatbots that work 24/7, understand context,
          and deliver perfect customer experiences
        </p>
      </motion.div>
    </motion.section>
  );
}

function FeaturesSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const features = [
    { icon: MessageSquare, title: 'Instant Responses', desc: 'Answer every question in milliseconds' },
    { icon: Zap, title: 'Smart Learning', desc: 'Gets better with every conversation' },
    { icon: BarChart3, title: 'Deep Analytics', desc: 'Understand your customers better' },
  ];

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center bg-white py-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-7xl font-light text-zinc-950 mb-20 text-center">
          Built for <span className="font-bold">performance</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="size-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <feature.icon className="size-12 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-semibold text-zinc-950 mb-4">
                {feature.title}
              </h3>
              <p className="text-xl text-zinc-600 font-light">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function TransformSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.2, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      <motion.div
        style={{ scale: imageScale }}
        className="absolute inset-0"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx0ZWNobm9sb2d5JTIwYXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZSUyMG1vZGVybnxlbnwxfHx8fDE3ODAyMjUzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Transform Business"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        <h2 className="text-8xl font-light text-white mb-8 leading-tight">
          Transform every
          <br />
          <span className="font-bold">conversation</span>
        </h2>
        <p className="text-3xl text-white/90 font-light">
          From first contact to loyal customer
        </p>
      </motion.div>
    </motion.section>
  );
}

function StatsSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-6"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-7xl font-light text-zinc-950 mb-20">
          Results that <span className="font-bold">speak</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-8xl font-bold text-emerald-600 mb-4">80%</div>
            <p className="text-2xl text-zinc-700">Cost reduction</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-8xl font-bold text-emerald-600 mb-4">3x</div>
            <p className="text-2xl text-zinc-700">Faster response times</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-8xl font-bold text-emerald-600 mb-4">95%</div>
            <p className="text-2xl text-zinc-700">Customer satisfaction</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-8xl font-bold text-emerald-600 mb-4">24/7</div>
            <p className="text-2xl text-zinc-700">Always available</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function PricingSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center bg-zinc-950 text-white py-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-7xl font-light text-center mb-20">
          Simple <span className="font-bold">pricing</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            style={{ scale }}
            className="bg-zinc-900 rounded-3xl p-10 border border-zinc-800"
          >
            <div className="text-zinc-400 mb-3 text-sm uppercase tracking-wider">Starter</div>
            <div className="text-6xl font-light mb-2">€49</div>
            <div className="text-zinc-500 mb-8">/month</div>
            <ul className="space-y-4 text-zinc-300 mb-8">
              <li className="flex items-center gap-3">
                <Check className="size-5 text-emerald-500" />
                5,000 messages
              </li>
              <li className="flex items-center gap-3">
                <Check className="size-5 text-emerald-500" />
                1 chatbot
              </li>
              <li className="flex items-center gap-3">
                <Check className="size-5 text-emerald-500" />
                Email support
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white text-zinc-950 rounded-3xl p-10 relative transform scale-105"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white rounded-full text-sm font-semibold">
              Popular
            </div>
            <div className="text-zinc-600 mb-3 text-sm uppercase tracking-wider">Professional</div>
            <div className="text-6xl font-light mb-2">€199</div>
            <div className="text-zinc-500 mb-8">/month</div>
            <ul className="space-y-4 text-zinc-700 mb-8">
              <li className="flex items-center gap-3">
                <Check className="size-5 text-emerald-500" />
                50,000 messages
              </li>
              <li className="flex items-center gap-3">
                <Check className="size-5 text-emerald-500" />
                Unlimited bots
              </li>
              <li className="flex items-center gap-3">
                <Check className="size-5 text-emerald-500" />
                Priority support
              </li>
            </ul>
            <button className="w-full py-4 bg-zinc-950 text-white rounded-full font-semibold hover:bg-zinc-800 transition-colors">
              Start Free Trial
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 rounded-3xl p-10 border border-zinc-800"
          >
            <div className="text-zinc-400 mb-3 text-sm uppercase tracking-wider">Enterprise</div>
            <div className="text-6xl font-light mb-2">€50K</div>
            <div className="text-zinc-500 mb-8">/year</div>
            <ul className="space-y-4 text-zinc-300 mb-8">
              <li className="flex items-center gap-3">
                <Check className="size-5 text-emerald-500" />
                Unlimited everything
              </li>
              <li className="flex items-center gap-3">
                <Check className="size-5 text-emerald-500" />
                Custom deployment
              </li>
              <li className="flex items-center gap-3">
                <Check className="size-5 text-emerald-500" />
                Dedicated support
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function CTASlide() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1674027444485-cec3da58eef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZSUyMG1vZGVybnxlbnwxfHx8fDE3ODAyMjUzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Start Now"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 to-teal-900/95" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6"
      >
        <h2 className="text-8xl md:text-9xl font-light text-white mb-8 leading-tight">
          Ready to
          <br />
          <span className="font-bold">transform?</span>
        </h2>
        <p className="text-3xl text-white/90 font-light mb-12 max-w-3xl mx-auto">
          Join thousands of businesses already using AI
        </p>
        <MagneticButton className="px-16 py-6 bg-white text-zinc-950 rounded-full text-xl font-semibold hover:shadow-2xl transition-shadow inline-flex items-center gap-3">
          Start Free Trial
          <ArrowRight className="size-6" />
        </MagneticButton>
        <p className="text-white/60 mt-6">No credit card required</p>
      </motion.div>
    </motion.section>
  );
}

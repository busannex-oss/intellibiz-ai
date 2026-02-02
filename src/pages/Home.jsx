import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Zap as LogoIcon, 
  FileBarChart, 
  Wand2, 
  Globe2, 
  Megaphone, 
  Headphones, 
  Mail,
  ChevronRight,
  Rocket,
  Zap,
  Shield,
  ArrowRight,
  Radar,
  Target,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Radar,
    title: 'Market Research',
    description: 'AI analyzes competitors, market gaps, and opportunities to position you for success',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: FileBarChart,
    title: 'Strategic Business Plan',
    description: 'Competition-beating plans that exploit competitor weaknesses',
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: Wand2,
    title: 'Differentiated Brand',
    description: 'Logos and colors strategically designed to stand out from competitors',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Globe2,
    title: 'Conversion Website',
    description: 'SEO-optimized content targeting keywords your competitors miss',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Megaphone,
    title: 'Social Media',
    description: 'Branded assets designed to capture market attention',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: Headphones,
    title: 'Business Resources',
    description: 'AI phone services and directories for rapid market presence',
    color: 'from-emerald-500 to-green-500'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              AI-Powered Business Builder
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-[-0.03em]">
              Build a Brand That
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent"> Outperforms </span>
              Competitors
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-[1.7] tracking-[-0.011em] font-medium">
              AI-powered market research analyzes your competition, finds gaps, and builds 
              a complete brand strategically designed to win market share.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Onboarding')}>
                <Button className="h-16 px-10 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xl shadow-amber-500/25 transition-all duration-300 hover:scale-105 font-semibold">
                  <Rocket className="w-5 h-5 mr-2" />
                  For best results follow the Steps
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="outline" className="h-16 px-10 text-lg border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                  View My Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-[-0.02em]">
            Everything You Need to Launch
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-[1.6] tracking-[-0.011em]">
            From business planning to marketing—we've got you covered
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm h-full overflow-hidden hover:border-slate-600 transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 tracking-[-0.02em]">{feature.title}</h3>
                  <p className="text-slate-400 leading-[1.6] tracking-[-0.011em]">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-[-0.02em]">How It Works</h2>
            <p className="text-lg text-slate-400 leading-[1.6] tracking-[-0.011em]">Four simple steps to your complete business</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Describe Your Idea', desc: 'Tell us about your business' },
              { step: '02', title: 'AI Researches Market', desc: 'Analyzes competitors & gaps' },
              { step: '03', title: 'Strategic Creation', desc: 'Brand built to outperform' },
              { step: '04', title: 'Launch & Dominate', desc: 'Enter market with advantage' }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="text-7xl font-extrabold bg-gradient-to-b from-amber-500/30 to-transparent bg-clip-text text-transparent mb-4 tracking-[-0.03em]">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2 tracking-[-0.02em]">{item.title}</h3>
                <p className="text-slate-400 leading-[1.6] tracking-[-0.011em]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-[-0.02em]">
              Why Choose Our Platform?
            </h2>
            <div className="space-y-6">
              {[
                { icon: Target, title: 'Competitor Intelligence', desc: 'AI analyzes real competitors to find exploitable weaknesses' },
                { icon: Zap, title: 'Strategic Differentiation', desc: 'Every asset designed to fill market gaps' },
                { icon: Shield, title: 'Data-Driven Decisions', desc: 'Brand colors, messaging, and positioning backed by research' },
                { icon: LogoIcon, title: 'Conversion Optimized', desc: 'Content targets keywords and pain points competitors miss' }
              ].map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 tracking-[-0.02em]">{benefit.title}</h3>
                    <p className="text-slate-400 leading-[1.6] tracking-[-0.011em]">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-3xl border border-slate-700/50 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
              <div className="text-center p-8 relative z-10">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30">
                  <Rocket className="w-14 h-14 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">Ready to Launch?</p>
                <p className="text-slate-400 mt-2">Your business awaits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 py-24">
        <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-800/50 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
          <CardContent className="p-14 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-[-0.02em]">
              Start Building Your Business Today
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-[1.6] tracking-[-0.011em]">
              Join thousands of entrepreneurs who launched their businesses with our AI-powered platform
            </p>
            <Link to={createPageUrl('CreateBusiness')}>
              <Button className="h-16 px-12 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xl shadow-amber-500/25 font-semibold">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <div className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                <Zap className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 text-white" />
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex items-center gap-5">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
              <p className="text-slate-500 text-sm">© {new Date().getFullYear()} BrandForge. Premium AI Business Builder.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
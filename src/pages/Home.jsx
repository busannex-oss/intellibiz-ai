import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Sparkles, 
  FileText, 
  Palette, 
  Globe, 
  Share2, 
  Phone, 
  Mail,
  ChevronRight,
  Rocket,
  Zap,
  Shield,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: FileText,
    title: 'AI Business Plan',
    description: 'Generate comprehensive business plans with market analysis and strategies',
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: Palette,
    title: 'Brand Logo',
    description: 'Create professional logos tailored to your business identity',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Globe,
    title: 'Website Content',
    description: 'Build conversion-focused website copy and structure',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Share2,
    title: 'Social Media',
    description: 'Generate branded headers and profiles for all platforms',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: Phone,
    title: 'Business Resources',
    description: 'Access AI phone services and essential directories',
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: Mail,
    title: 'Newsletter System',
    description: 'Build compliant email lists with opt-in management',
    color: 'from-indigo-500 to-violet-500'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-200/40 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Business Builder
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Launch Your
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> Dream Business </span>
              in Minutes
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              The all-in-one platform that creates your business plan, logo, website, 
              social media presence, and marketing tools—all powered by AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('CreateBusiness')}>
                <Button className="h-14 px-8 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-violet-200 transition-all duration-300 hover:scale-105">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Building Now
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="outline" className="h-14 px-8 text-lg border-slate-200 hover:bg-slate-50">
                  View My Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything You Need to Launch
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
              <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg opacity-90">Three simple steps to your complete business</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Describe Your Vision', desc: 'Tell us about your business idea' },
              { step: '02', title: 'AI Creates Everything', desc: 'Watch as AI builds your brand' },
              { step: '03', title: 'Launch & Grow', desc: 'Download assets and go live' }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-white/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <div className="space-y-6">
              {[
                { icon: Zap, title: 'Lightning Fast', desc: 'Complete business setup in under 10 minutes' },
                { icon: Shield, title: 'Professional Quality', desc: 'Enterprise-grade content and designs' },
                { icon: Sparkles, title: 'AI-Powered', desc: 'Cutting-edge AI creates unique content' }
              ].map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{benefit.title}</h3>
                    <p className="text-slate-600">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-violet-100 to-indigo-100 rounded-3xl flex items-center justify-center">
              <div className="text-center p-8">
                <Rocket className="w-24 h-24 text-violet-600 mx-auto mb-6" />
                <p className="text-2xl font-bold text-slate-800">Ready to Launch?</p>
                <p className="text-slate-600 mt-2">Your business awaits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Building Your Business Today
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
              Join thousands of entrepreneurs who launched their businesses with our AI-powered platform
            </p>
            <Link to={createPageUrl('CreateBusiness')}>
              <Button className="h-14 px-10 text-lg bg-white text-slate-900 hover:bg-slate-100">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
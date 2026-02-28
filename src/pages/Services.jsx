import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Radar,
  FileBarChart,
  Wand2,
  Globe2,
  Megaphone,
  Headphones,
  Phone,
  Mail,
  BarChart3,
  MessageSquare,
  Palette,
  Video,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const services = [
  {
    icon: Radar,
    color: 'from-cyan-500 to-blue-500',
    title: 'AI Market Research',
    tagline: 'Know your market before you enter it',
    description: 'Our AI dives deep into your industry, analyzing competitors, identifying market gaps, and uncovering opportunities that others miss. You get a clear picture of where your business can win.',
    benefits: [
      'Competitor strength & weakness analysis',
      'Market gap identification',
      'Target audience demographics & psychographics',
      'Unique Value Proposition generation',
    ]
  },
  {
    icon: FileBarChart,
    color: 'from-violet-500 to-purple-500',
    title: 'Strategic Business Plan',
    tagline: 'A roadmap built to outperform',
    description: 'Get a comprehensive 30-year business plan powered by real market intelligence. Every section is crafted to exploit competitor weaknesses and position your brand for sustained growth.',
    benefits: [
      '30-year financial projections',
      'Operations & risk analysis',
      'Go-to-market strategy',
      'Investor-ready PDF export',
    ]
  },
  {
    icon: Wand2,
    color: 'from-pink-500 to-rose-500',
    title: 'Brand Identity & Logo',
    tagline: 'Stand out from day one',
    description: 'AI-generated logos and brand color palettes strategically designed based on competitor analysis and color psychology — so your brand occupies a distinct and memorable position in the market.',
    benefits: [
      'AI logo generation with unlimited variations',
      'Brand color palette with psychology insights',
      'Brand personality framework',
      'Downloadable brand guidelines',
    ]
  },
  {
    icon: Globe2,
    color: 'from-blue-500 to-cyan-500',
    title: 'Conversion Website',
    tagline: 'Your 24/7 digital sales machine',
    description: 'A fully generated website with SEO-optimized content targeting keywords your competitors are missing. Every section is designed to convert visitors into customers.',
    benefits: [
      'SEO-optimized copy & structure',
      'Competitor keyword gap targeting',
      'Hero, services, testimonials & contact sections',
      'Ready-to-publish content',
    ]
  },
  {
    icon: Megaphone,
    color: 'from-orange-500 to-amber-500',
    title: 'Social Media Assets',
    tagline: 'Show up consistently and professionally',
    description: 'Branded social media content, templates, and strategy built to capture market attention. Your brand will look polished and cohesive across every platform.',
    benefits: [
      'Platform-specific content strategy',
      'AI-generated branded visuals',
      'Posting schedules & caption templates',
      'Multi-platform campaign planning',
    ]
  },
  {
    icon: Video,
    color: 'from-red-500 to-pink-500',
    title: 'Commercial Videos',
    tagline: 'Motion content that converts',
    description: 'AI-generated commercial videos in multiple styles and durations — ready to embed on your website or post across social media to grab attention and build trust fast.',
    benefits: [
      'Multiple video styles & durations',
      'Brand-aligned visuals and messaging',
      'Website-ready embed support',
      'Social media optimized formats',
    ]
  },
  {
    icon: Phone,
    color: 'from-emerald-500 to-green-500',
    title: 'AI Phone System',
    tagline: 'Never miss a customer call',
    description: 'A full AI-powered phone infrastructure with smart IVR, call routing, voicemail, SMS, and an AI receptionist that handles inquiries 24/7 — so your business always sounds professional.',
    benefits: [
      'AI receptionist & smart IVR',
      'Call recording, transcription & sentiment analysis',
      'SMS auto-reply & AI messaging',
      'Multi-department extensions & routing',
    ]
  },
  {
    icon: MessageSquare,
    color: 'from-teal-500 to-cyan-500',
    title: 'Omnichannel Inbox',
    tagline: 'Every customer, every channel, one place',
    description: 'Manage conversations from website chat, WhatsApp, Facebook Messenger, Instagram, email, and SMS all from a single unified inbox — with AI routing and auto-translate.',
    benefits: [
      'Unified inbox for all channels',
      'AI-powered message routing',
      'Auto-translate for multilingual support',
      'Canned responses & chatbot automation',
    ]
  },
  {
    icon: BarChart3,
    color: 'from-indigo-500 to-violet-500',
    title: 'Analytics & Reporting',
    tagline: 'Data-driven decisions, always',
    description: 'Track performance across your website, social channels, and customer interactions. AI surfaces insights and anomalies so you can optimize continuously.',
    benefits: [
      'Website traffic & conversion tracking',
      'AI-generated business insights',
      'Monthly & quarterly performance reports',
      'Anomaly detection & alerts',
    ]
  },
  {
    icon: Mail,
    color: 'from-amber-500 to-yellow-500',
    title: 'Newsletter & Email Marketing',
    tagline: 'Stay top-of-mind with your audience',
    description: 'Build and manage your email subscriber list, create beautifully branded newsletters, and automate campaigns that nurture leads and retain customers.',
    benefits: [
      'Branded newsletter templates',
      'Subscriber list management',
      'AI-generated email content',
      'Gmail integration for seamless sending',
    ]
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
              Everything in one platform
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-[-0.03em]">
              Services That
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent"> Enrich, Enable & Empower </span>
              Your Business
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-[1.7]">
              BrandForge gives you every tool, service, and AI capability you need to build, launch, and scale a thriving business — from day one to year thirty.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}>
              <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-800/40 h-full hover:border-slate-600 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-5 mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-[-0.02em]">{service.title}</h3>
                      <p className="text-amber-400 text-sm font-medium mt-0.5">{service.tagline}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 leading-[1.7] mb-5">{service.description}</p>
                  <ul className="space-y-2">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to put all of this to work?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Start your business project today and let AI build every layer of your brand — strategically designed to win.</p>
          <Link to={createPageUrl('CreateBusiness')}>
            <Button className="h-14 px-10 text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xl shadow-amber-500/25 font-semibold">
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
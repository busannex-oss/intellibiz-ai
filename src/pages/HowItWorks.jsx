import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Brain, Palette, Globe, Rocket, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Brain,
      title: "1. Share Your Vision",
      description: "Tell us about your business idea, target market, and goals. Our AI analyzes your inputs and performs comprehensive market research.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Palette,
      title: "2. AI-Powered Design",
      description: "Our AI generates your complete brand identity including logo, color palette, typography, and brand guidelines tailored to your industry.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Globe,
      title: "3. Website & Content",
      description: "Get a professional website with AI-generated content, SEO optimization, and social media assets ready to launch.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Rocket,
      title: "4. Launch & Grow",
      description: "Deploy your complete business infrastructure with phone systems, omnichannel support, and analytics - all managed from one dashboard.",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const features = [
    "30-year financial projections",
    "Market research & competitor analysis",
    "Professional logo & brand assets",
    "SEO-optimized website content",
    "Social media strategy & content",
    "Business plan documentation",
    "Phone system integration",
    "Omnichannel customer support",
    "Performance analytics",
    "AI-powered chatbots"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">AI-Powered Business Builder</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            How BrandForge Works
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your business idea into a complete, professional brand in minutes with the power of AI
          </p>
          <Link to={createPageUrl('CreateBusiness')}>
            <Button className="h-14 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/20 text-lg font-semibold">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Building
            </Button>
          </Link>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-slate-600 transition-all">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-xl`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-sm border border-slate-700">
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Everything You Need to Launch</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Your Business?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of entrepreneurs launching their dreams with AI
          </p>
          <Link to={createPageUrl('CreateBusiness')}>
            <Button className="h-14 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/20 text-lg font-semibold">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Sparkles, LayoutGrid, Palette, Globe, Phone, MessageSquare, 
  BarChart3, ArrowRight, ArrowLeft, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TOUR_STEPS = [
  {
    icon: Sparkles,
    title: 'Welcome to BrandForge!',
    description: 'Your AI-powered platform to build, launch, and scale your business from idea to success. Let\'s take a quick tour of what you can do.',
    color: 'from-purple-500 to-indigo-600',
    features: ['AI Market Research', 'Business Plan Generation', 'Brand Identity Creation', 'Website & Marketing Assets']
  },
  {
    icon: LayoutGrid,
    title: 'Dashboard Hub',
    description: 'Your central command center. View all projects, track progress, access tools, and monitor business performance from one place.',
    color: 'from-blue-500 to-cyan-600',
    features: ['Project Overview', 'Quick Actions', 'Analytics Summary', 'Recent Activities']
  },
  {
    icon: Palette,
    title: 'Brand Identity Studio',
    description: 'Create professional logos, color palettes, and complete brand guidelines powered by AI. Download assets ready for any platform.',
    color: 'from-pink-500 to-rose-600',
    features: ['AI Logo Generation', 'Brand Colors', 'Style Guidelines', 'Asset Downloads']
  },
  {
    icon: Globe,
    title: 'Website Builder',
    description: 'Generate complete, professional websites with AI-written content, SEO optimization, and mobile-responsive design.',
    color: 'from-emerald-500 to-teal-600',
    features: ['AI Content Writing', 'SEO Optimization', 'Mobile Responsive', 'One-Click Deploy']
  },
  {
    icon: Phone,
    title: 'AI Phone System',
    description: 'Professional phone system with AI receptionist, call routing, voicemail, SMS, and intelligent call handling.',
    color: 'from-violet-500 to-purple-600',
    features: ['AI Receptionist', 'Call Routing', 'SMS Management', 'Call Analytics']
  },
  {
    icon: MessageSquare,
    title: 'Omnichannel Inbox',
    description: 'Manage all customer conversations from WhatsApp, Facebook, Instagram, email, and chat in one unified inbox.',
    color: 'from-orange-500 to-amber-600',
    features: ['Unified Inbox', 'Multi-Channel Support', 'AI Auto-Replies', 'Team Collaboration']
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Track performance, understand customers, and make data-driven decisions with AI-powered business analytics.',
    color: 'from-indigo-500 to-blue-600',
    features: ['Performance Metrics', 'Customer Insights', 'Financial Reports', 'Growth Tracking']
  }
];

export default function WelcomeTour({ open, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Platform Tour</DialogTitle>
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentStep ? 'bg-purple-600' : i < currentStep ? 'bg-purple-300' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 py-4"
          >
            {/* Icon & Title */}
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>

            {/* Features */}
            <Card className="p-6 bg-slate-50">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Key Features
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {step.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-slate-500"
          >
            Skip Tour
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="bg-gradient-to-r from-purple-600 to-indigo-600">
              {currentStep === TOUR_STEPS.length - 1 ? (
                <>Get Started <Sparkles className="w-4 h-4 ml-2" /></>
              ) : (
                <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
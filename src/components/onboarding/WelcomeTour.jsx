import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, LayoutGrid, Palette, Globe, Phone, MessageSquare,
  BarChart3, ArrowRight, ArrowLeft, CheckCircle, Shield, Users,
  Settings, Zap, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Role-specific tour steps
const TOUR_STEPS = {
  super_admin: [
    {
      icon: Crown,
      title: 'Welcome, Super Admin!',
      description: 'You have complete, unrestricted control over this BrandForge instance. Your account is permanent and protected — the constitutional authority of the platform.',
      color: 'from-purple-600 to-indigo-700',
      features: ['Full Platform Control', 'User Management', 'Theme & Branding', 'Agent Oversight'],
      badge: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700' }
    },
    {
      icon: Settings,
      title: 'Admin Dashboard',
      description: 'Your control center. Manage users, configure platform settings, run brand audits, and oversee all AI agent activity from one place.',
      color: 'from-slate-700 to-slate-900',
      features: ['User Invite & Role Management', 'Platform Theme Control', 'Brand Audit Dashboard', 'Error Logs & Monitoring'],
    },
    {
      icon: Users,
      title: 'Team & User Management',
      description: 'Only you can invite, assign roles, and manage other users. Invite admins to help manage the platform, or users to build their own business projects.',
      color: 'from-blue-600 to-cyan-700',
      features: ['Invite Users via Email', 'Assign Admin or User Roles', 'Manage Permissions', 'Security Sentinel Enforcement'],
    },
    {
      icon: Palette,
      title: 'Theme & Branding',
      description: 'Customize the entire platform — change the name, logo, colors, and hero content. The Theme Coordinator AI agent assists with brand-aligned changes.',
      color: 'from-violet-600 to-pink-600',
      features: ['7 Color Themes', 'Custom Logo & Favicon', 'Site Name Replacement', 'Hero Content Editor'],
    },
    {
      icon: Shield,
      title: 'AI Agent Fleet',
      description: 'You oversee a fleet of specialized AI agents. The Project Manager monitors them all and submits Daily Agent Activity Reports. You can deploy any agent.',
      color: 'from-amber-500 to-orange-600',
      features: ['15+ Specialized AI Agents', 'Daily Activity Reports', 'Brand Sentinel Enforcement', 'Security Sentinel Governance'],
    },
  ],
  admin: [
    {
      icon: Zap,
      title: 'Welcome, Admin!',
      description: 'You have administrative access to manage platform content, run brand audits, and support users. The Super Admin has granted you elevated privileges.',
      color: 'from-blue-600 to-indigo-700',
      features: ['Platform Content Management', 'Brand Audit Access', 'User Support Tools', 'Agent Documentation'],
      badge: { label: 'Admin', color: 'bg-blue-100 text-blue-700' }
    },
    {
      icon: LayoutGrid,
      title: 'Admin Dashboard',
      description: 'Your hub for platform management. Run brand audits, review error logs, manage the hero content, and monitor platform health.',
      color: 'from-slate-600 to-slate-800',
      features: ['Brand Audit Scoring', 'Error Log Review', 'Platform Settings', 'Theme Preview'],
    },
    {
      icon: Shield,
      title: 'AI Agents',
      description: 'Access specialized admin agents like Brand Sentinel, Graphic Artist, and Logo Standards Guardian to enforce quality across all business projects.',
      color: 'from-violet-600 to-purple-700',
      features: ['Brand Compliance Scoring', 'Visual Quality Reports', 'Logo Standards Audit', 'Agent Documentation'],
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Monitor platform performance, user activity, and business project metrics. Generate reports and identify trends.',
      color: 'from-emerald-600 to-teal-700',
      features: ['Traffic Analytics', 'Conversion Metrics', 'Anomaly Detection', 'Performance Reports'],
    },
  ],
  user: [
    {
      icon: Sparkles,
      title: 'Welcome to BrandForge!',
      description: 'Your AI-powered platform to build, launch, and scale your business from idea to success. Let\'s take a quick tour of what you can do.',
      color: 'from-amber-500 to-orange-600',
      features: ['AI Market Research', 'Business Plan Generation', 'Brand Identity Creation', 'Website & Marketing Assets'],
      badge: { label: 'Getting Started', color: 'bg-amber-100 text-amber-700' }
    },
    {
      icon: LayoutGrid,
      title: 'Dashboard Hub',
      description: 'Your central command center. View all projects, track progress, access tools, and monitor business performance from one place.',
      color: 'from-blue-500 to-cyan-600',
      features: ['Project Overview', 'Quick Actions', 'Analytics Summary', 'Recent Activities'],
    },
    {
      icon: Palette,
      title: 'Brand Identity Studio',
      description: 'Create professional logos, color palettes, and complete brand guidelines powered by AI. Every color choice complements your logo automatically.',
      color: 'from-pink-500 to-rose-600',
      features: ['AI Logo Generation', 'Brand Colors', 'Style Guidelines', 'Asset Downloads'],
    },
    {
      icon: Globe,
      title: 'Website & Online Presence',
      description: 'Generate complete, professional websites with AI-written content, SEO optimization, and mobile-responsive design — no coding needed.',
      color: 'from-emerald-500 to-teal-600',
      features: ['AI Content Writing', 'SEO Optimization', 'Mobile Responsive', 'Social Media Assets'],
    },
    {
      icon: MessageSquare,
      title: 'Customer Communication',
      description: 'Manage all customer conversations from WhatsApp, Facebook, Instagram, email, and SMS in one unified inbox. AI handles replies automatically.',
      color: 'from-orange-500 to-amber-600',
      features: ['Unified Inbox', 'AI Auto-Replies', 'Phone System', 'Newsletter Campaigns'],
    },
    {
      icon: BarChart3,
      title: 'Analytics & Growth',
      description: 'Track performance, understand customers, and make data-driven decisions with AI-powered business analytics and 30-year financial projections.',
      color: 'from-indigo-500 to-blue-600',
      features: ['Performance Metrics', 'Customer Insights', 'Financial Reports', 'Growth Tracking'],
    },
  ],
};

export default function WelcomeTour({ open, onClose, onComplete, userRole = 'user' }) {
  const [currentStep, setCurrentStep] = useState(0);

  const role = ['super_admin', 'admin', 'user'].includes(userRole) ? userRole : 'user';
  const steps = TOUR_STEPS[role];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const step = steps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-900">Platform Tour</DialogTitle>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`rounded-full transition-all ${
                    i === currentStep
                      ? 'w-4 h-2 bg-violet-600'
                      : i < currentStep
                      ? 'w-2 h-2 bg-violet-300'
                      : 'w-2 h-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5 py-3"
          >
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              {step.badge && (
                <Badge className={`${step.badge.color} mb-3 text-xs`}>{step.badge.label}</Badge>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">{step.description}</p>
            </div>

            <Card className="p-5 bg-slate-50 border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                What's included
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {step.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </Card>

            <p className="text-center text-xs text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-3 border-t">
          <Button variant="ghost" onClick={onComplete} className="text-slate-400 text-sm">
            Skip Tour
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
            >
              {currentStep === steps.length - 1 ? (
                <>Get Started <Sparkles className="w-4 h-4 ml-1.5" /></>
              ) : (
                <>Next <ArrowRight className="w-4 h-4 ml-1.5" /></>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
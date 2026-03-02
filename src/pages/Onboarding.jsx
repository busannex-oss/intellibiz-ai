import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, ArrowRight, ArrowLeft, TrendingUp,
  Palette, Globe, DollarSign, CheckCircle, Loader2,
  Lightbulb, Crown, Shield, Users, Zap
} from 'lucide-react';
import { toast } from "sonner";
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeTour from '@/components/onboarding/WelcomeTour';
import OnboardingAssistant from '@/components/onboarding/OnboardingAssistant';

const INDUSTRIES = [
  'Technology', 'E-commerce', 'Food & Beverage', 'Healthcare',
  'Education', 'Real Estate', 'Consulting', 'Creative Services',
  'Finance', 'Retail', 'Fitness & Wellness', 'Other'
];

const BUSINESS_STEPS = [
  { step: 1, label: 'Research & Business Plan', desc: 'Market research, competitor analysis, and a 30-year business plan.', icon: TrendingUp, features: ['Market Research', 'Competitor Analysis', 'Business Plan', 'Financial Projections'] },
  { step: 2, label: 'Brand Identity', desc: 'Logo, colors, and style guide — powered by AI.', icon: Palette, features: ['Logo Design', 'Brand Colors', 'Style Guide', 'Brand Kit'] },
  { step: 3, label: 'Online Presence', desc: 'Website, social assets, omnichannel, and SEO.', icon: Globe, features: ['Website Design', 'Social Media Assets', 'Omnichannel Setup', 'SEO Strategy'] },
  { step: 4, label: 'Growth & Marketing', desc: 'Newsletters, ads, analytics, and performance reports.', icon: DollarSign, features: ['Newsletter Campaigns', 'Advertising', 'Analytics', 'Performance Reports'] },
];

const ROLE_INFO = {
  super_admin: { icon: Crown, label: 'Super Admin', color: 'from-purple-600 to-indigo-700', badge: 'bg-purple-100 text-purple-700', desc: 'You have complete platform control. You can manage users, customize branding, and oversee all AI agents.' },
  admin:       { icon: Shield, label: 'Admin',       color: 'from-blue-600 to-indigo-600', badge: 'bg-blue-100 text-blue-700',   desc: 'You have administrative access to manage platform content, run audits, and support users.' },
  user:        { icon: Zap,    label: 'User',         color: 'from-amber-500 to-orange-500', badge: 'bg-amber-100 text-amber-700', desc: 'Build, launch, and grow your business with AI-powered tools.' },
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = role intro, 1 = path overview, 2 = business details, 3 = suggestions
  const [userRole, setUserRole] = useState('user');
  const [user, setUser] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const [userData, setUserData] = useState({ business_name: '', industry: '', description: '', target_audience: '', location: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        // Determine role
        const role = u?.role === 'admin' ? 'admin' : 'user';
        // Check if first admin (Super Admin heuristic: role=admin and no prior completed onboarding)
        const users = await base44.entities.User.list();
        const isSuperAdmin = u?.role === 'admin' && users.length <= 2;
        setUserRole(isSuperAdmin ? 'super_admin' : role);
      } catch {
        setUserRole('user');
      }
    };
    init();
  }, []);

  const generateSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Business: "${userData.business_name}" in ${userData.industry}. Target: ${userData.target_audience || 'general'}. Give 4 concise, actionable platform feature recommendations for this specific business.`,
        response_json_schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  priority: { type: 'string', enum: ['high', 'medium', 'low'] }
                }
              }
            }
          }
        }
      });
      setSuggestions(res.suggestions || []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const createProjectMutation = useMutation({
    mutationFn: () => base44.entities.BusinessProject.create({ ...userData, status: 'in_progress', current_step: 1 }),
    onSuccess: (project) => {
      toast.success('Project created!');
      // Mark onboarding done on user profile
      base44.auth.updateMe({ onboarding_completed: true }).catch(() => {});
      setTimeout(() => navigate(createPageUrl(`CreateBusiness?projectId=${project.id}`)), 800);
    }
  });

  const handleAdminContinue = () => {
    navigate(createPageUrl('AdminDashboard'));
    base44.auth.updateMe({ onboarding_completed: true }).catch(() => {});
  };

  const roleInfo = ROLE_INFO[userRole] || ROLE_INFO.user;
  const RoleIcon = roleInfo.icon;

  const cardClass = "border border-slate-700 bg-slate-800/60 backdrop-blur-sm";
  const inputClass = "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500";
  const labelClass = "text-slate-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <WelcomeTour
        open={showTour}
        onClose={() => setShowTour(false)}
        onComplete={() => setShowTour(false)}
        userRole={userRole}
      />

      {user && (
        <OnboardingAssistant
          userRole={userRole}
          userName={user?.full_name || ''}
          context={step >= 2 ? `User setting up: ${userData.business_name} in ${userData.industry}` : 'Onboarding flow'}
        />
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            <Sparkles className="w-8 h-8 text-amber-400 inline mr-2" />
            Welcome to BrandForge
          </h1>
          <p className="text-slate-400">Let's get you set up in minutes</p>
        </div>

        {/* Step progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {(userRole === 'user' ? [0,1,2,3] : [0]).map(s => (
            <div key={s} className={`rounded-full transition-all duration-300 ${
              s === step ? 'w-6 h-2 bg-amber-500' : s < step ? 'w-2 h-2 bg-amber-300' : 'w-2 h-2 bg-slate-700'
            }`} />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 0: Role Introduction */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className={cardClass}>
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleInfo.color} flex items-center justify-center mb-4 shadow-lg shadow-black/20`}>
                    <RoleIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-white text-2xl">
                      {user?.full_name ? `Hello, ${user.full_name.split(' ')[0]}!` : 'Hello!'}
                    </CardTitle>
                    <Badge className={roleInfo.badge}>{roleInfo.label}</Badge>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{roleInfo.desc}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Role-specific capabilities */}
                  {userRole === 'super_admin' && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Users, label: 'Full User Management', desc: 'Invite & control all users' },
                        { icon: Palette, label: 'Platform Theming', desc: 'Brand the entire app' },
                        { icon: Shield, label: 'AI Agent Fleet', desc: '15+ agents at your command' },
                        { icon: TrendingUp, label: 'Business Projects', desc: 'Build any business with AI' },
                      ].map(({ icon: I, label, desc }) => (
                        <div key={label} className="p-3 rounded-xl border border-slate-700 bg-slate-900/40">
                          <I className="w-4 h-4 text-purple-400 mb-1.5" />
                          <p className="text-white text-sm font-semibold">{label}</p>
                          <p className="text-slate-400 text-xs">{desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {userRole === 'admin' && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Shield, label: 'Brand Audit', desc: 'Score platform compliance' },
                        { icon: TrendingUp, label: 'Analytics', desc: 'Monitor platform metrics' },
                        { icon: Users, label: 'User Support', desc: 'Help users succeed' },
                        { icon: Sparkles, label: 'AI Agents', desc: 'Admin-level agents' },
                      ].map(({ icon: I, label, desc }) => (
                        <div key={label} className="p-3 rounded-xl border border-slate-700 bg-slate-900/40">
                          <I className="w-4 h-4 text-blue-400 mb-1.5" />
                          <p className="text-white text-sm font-semibold">{label}</p>
                          <p className="text-slate-400 text-xs">{desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      onClick={() => setShowTour(true)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      Take a Tour
                    </Button>
                    {userRole === 'user' ? (
                      <Button
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                      >
                        Start Setup <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAdminContinue}
                        className={`flex-1 bg-gradient-to-r ${roleInfo.color} text-white font-semibold`}
                      >
                        Go to Admin Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 1: Path Overview (users only) */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Your 4-Step Path to Success</CardTitle>
                  <p className="text-sm text-slate-400 mt-1">Follow these steps in order — each one builds on the last.</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    {BUSINESS_STEPS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.step} className="p-4 rounded-xl border border-slate-700 bg-slate-900/40">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-amber-400">{item.step}</span>
                            </div>
                            <Icon className="w-4 h-4 text-amber-400" />
                            <h3 className="font-semibold text-white text-sm">{item.label}</h3>
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.features.map((f, i) => (
                              <Badge key={i} className="text-[10px] bg-slate-700/60 text-slate-300 border border-slate-600">{f}</Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => setStep(0)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent">
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <Button onClick={() => setStep(2)} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold">
                      Set Up My Business <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: Business Details (users only) */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className="text-white">Tell us about your business</CardTitle>
                  <p className="text-sm text-slate-400">This helps the AI personalize everything for you</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className={labelClass}>Business Name *</Label>
                    <Input className={inputClass} value={userData.business_name} onChange={e => setUserData(d => ({ ...d, business_name: e.target.value }))} placeholder="e.g., TechStart Solutions" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={labelClass}>Industry *</Label>
                    <Select value={userData.industry} onValueChange={v => setUserData(d => ({ ...d, industry: v }))}>
                      <SelectTrigger className={inputClass}><SelectValue placeholder="Select your industry" /></SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {INDUSTRIES.map(v => <SelectItem key={v} value={v} className="text-slate-200 focus:bg-slate-700">{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className={labelClass}>What does your business do? *</Label>
                    <Textarea className={inputClass} value={userData.description} onChange={e => setUserData(d => ({ ...d, description: e.target.value }))} placeholder="Brief description..." rows={3} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className={labelClass}>Target Audience</Label>
                      <Input className={inputClass} value={userData.target_audience} onChange={e => setUserData(d => ({ ...d, target_audience: e.target.value }))} placeholder="e.g., Small business owners" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={labelClass}>Location</Label>
                      <Input className={inputClass} value={userData.location} onChange={e => setUserData(d => ({ ...d, location: e.target.value }))} placeholder="e.g., Chicago, IL" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setStep(1)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent">
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <Button
                      onClick={() => { setStep(3); generateSuggestions(); }}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold"
                      disabled={!userData.business_name || !userData.industry || !userData.description}
                    >
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: AI Suggestions + Launch (users only) */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    AI Recommendations for {userData.business_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingSuggestions ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-7 h-7 animate-spin mx-auto text-amber-400 mb-2" />
                      <p className="text-slate-400 text-sm">Analyzing your business...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul className="space-y-2">
                      {suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-white text-sm">{s.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>
                            <Badge className={`mt-1.5 text-[10px] border ${s.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                              {s.priority} priority
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-4">Ready to start building your business!</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={() => setStep(2)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={() => createProjectMutation.mutate()}
                  disabled={createProjectMutation.isPending}
                  className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/20"
                  size="lg"
                >
                  {createProjectMutation.isPending
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Project...</>
                    : <><Sparkles className="w-4 h-4 mr-2" />Launch My Business</>
                  }
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
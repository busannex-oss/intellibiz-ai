import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  Sparkles, 
  Building2, 
  Palette, 
  Globe, 
  Mail,
  Shield,
  Users,
  Zap,
  Crown,
  Upload,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small agencies getting started',
    monthlyPrice: 49,
    yearlyPrice: 470,
    features: [
      { text: 'Remove "Powered by BrandForge"', included: true },
      { text: 'Custom logo & colors', included: true },
      { text: '3 team seats', included: true },
      { text: 'Email support', included: true },
      { text: 'Custom domain', included: false },
      { text: 'White-label emails', included: false },
      { text: 'API access', included: false },
      { text: 'Priority support', included: false },
    ],
    teamSeats: 3,
    highlight: false
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing agencies and consultants',
    monthlyPrice: 149,
    yearlyPrice: 1430,
    features: [
      { text: 'Remove "Powered by BrandForge"', included: true },
      { text: 'Custom logo & colors', included: true },
      { text: '10 team seats', included: true },
      { text: 'Email support', included: true },
      { text: 'Custom domain', included: true },
      { text: 'White-label emails', included: true },
      { text: 'API access', included: false },
      { text: 'Priority support', included: true },
    ],
    teamSeats: 10,
    highlight: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full customization for large organizations',
    monthlyPrice: 399,
    yearlyPrice: 3830,
    features: [
      { text: 'Remove "Powered by BrandForge"', included: true },
      { text: 'Custom logo & colors', included: true },
      { text: 'Unlimited team seats', included: true },
      { text: 'Email support', included: true },
      { text: 'Custom domain', included: true },
      { text: 'White-label emails', included: true },
      { text: 'Full API access', included: true },
      { text: 'Priority 24/7 support', included: true },
    ],
    teamSeats: -1,
    highlight: false
  }
];

export default function WhiteLabel() {
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['whiteLabelSubscription'],
    queryFn: async () => {
      const subs = await base44.entities.WhiteLabelSubscription.list();
      return subs[0];
    }
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: (data) => base44.entities.WhiteLabelSubscription.create(data),
    onSuccess: () => queryClient.invalidateQueries(['whiteLabelSubscription'])
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: (data) => base44.entities.WhiteLabelSubscription.update(subscription.id, data),
    onSuccess: () => queryClient.invalidateQueries(['whiteLabelSubscription'])
  });

  const handleSelectPlan = (planId) => {
    const plan = PLANS.find(p => p.id === planId);
    const data = {
      plan: planId,
      billing_cycle: billingCycle,
      status: 'trialing',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      features: {
        remove_branding: true,
        custom_domain: planId !== 'starter',
        white_label_emails: planId !== 'starter',
        api_access: planId === 'enterprise',
        priority_support: planId !== 'starter',
        team_seats: plan.teamSeats
      },
      branding: {}
    };
    
    if (subscription?.id) {
      updateSubscriptionMutation.mutate(data);
    } else {
      createSubscriptionMutation.mutate(data);
    }
  };

  const handleBrandingUpdate = (field, value) => {
    updateSubscriptionMutation.mutate({
      branding: { ...subscription?.branding, [field]: value }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user has an active subscription, show branding settings
  if (subscription?.status === 'active' || subscription?.status === 'trialing') {
    return <BrandingSettings subscription={subscription} onUpdate={updateSubscriptionMutation.mutate} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
            <Crown className="w-4 h-4 text-amber-400" />
            White Label Solution
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Make It Yours
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Remove our branding and customize everything with your own logo, colors, and domain. 
            Perfect for agencies and resellers.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex items-center">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-slate-900' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly' 
                  ? 'bg-white text-slate-900' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              Yearly
              <Badge className="bg-emerald-500 text-white text-xs">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`relative h-full ${
                plan.highlight 
                  ? 'border-2 border-violet-400 bg-white shadow-2xl shadow-violet-500/20' 
                  : 'bg-white/10 backdrop-blur-sm border-white/20'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className={`text-2xl ${plan.highlight ? 'text-slate-900' : 'text-white'}`}>
                    {plan.name}
                  </CardTitle>
                  <CardDescription className={plan.highlight ? 'text-slate-600' : 'text-slate-300'}>
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-4xl font-bold ${plan.highlight ? 'text-slate-900' : 'text-white'}`}>
                        ${billingCycle === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                      </span>
                      <span className={plan.highlight ? 'text-slate-500' : 'text-slate-400'}>/mo</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className={`text-sm mt-1 ${plan.highlight ? 'text-slate-500' : 'text-slate-400'}`}>
                        ${plan.yearlyPrice} billed annually
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={`text-sm ${
                          plan.highlight 
                            ? (feature.included ? 'text-slate-700' : 'text-slate-400') 
                            : (feature.included ? 'text-white' : 'text-slate-500')
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${
                      plan.highlight 
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700' 
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    Start 14-Day Free Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Building2, title: 'Your Brand', desc: 'Custom logo, colors & favicon' },
            { icon: Globe, title: 'Custom Domain', desc: 'Use your own domain name' },
            { icon: Mail, title: 'Branded Emails', desc: 'Send emails as your brand' },
            { icon: Shield, title: 'Full Control', desc: 'Complete white-label experience' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
            >
              <feature.icon className="w-8 h-8 text-violet-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandingSettings({ subscription, onUpdate }) {
  const [branding, setBranding] = useState(subscription?.branding || {});
  const plan = PLANS.find(p => p.id === subscription?.plan);

  const handleSave = () => {
    onUpdate({ branding });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setBranding({ ...branding, logo_url: file_url });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">White Label Settings</h1>
            <p className="text-slate-600">Customize your branding and appearance</p>
          </div>
          <Badge className="bg-violet-100 text-violet-700 px-4 py-2">
            <Crown className="w-4 h-4 mr-2" />
            {plan?.name} Plan
          </Badge>
        </div>

        {/* Subscription Status */}
        {subscription?.status === 'trialing' && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Trial Period Active</p>
                  <p className="text-sm text-amber-600">
                    Your trial ends on {new Date(subscription.trial_ends_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="branding">
          <TabsList className="mb-6">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="domain">Domain</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Brand Customization</CardTitle>
                <CardDescription>Upload your logo and set your brand colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-3">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden">
                      {branding.logo_url ? (
                        <img src={branding.logo_url} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Upload className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload">
                        <Button variant="outline" asChild>
                          <span>Upload Logo</span>
                        </Button>
                      </label>
                      <p className="text-xs text-slate-500 mt-1">PNG, SVG or JPG (max 2MB)</p>
                    </div>
                  </div>
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={branding.company_name || ''}
                    onChange={(e) => setBranding({ ...branding, company_name: e.target.value })}
                    placeholder="Your Company Name"
                  />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={branding.primary_color || '#7c3aed'}
                        onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                        className="w-12 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={branding.primary_color || '#7c3aed'}
                        onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                        placeholder="#7c3aed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={branding.secondary_color || '#4f46e5'}
                        onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                        className="w-12 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={branding.secondary_color || '#4f46e5'}
                        onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                        placeholder="#4f46e5"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
                  Save Branding
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domain">
            <Card>
              <CardHeader>
                <CardTitle>Custom Domain</CardTitle>
                <CardDescription>Connect your own domain to the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {subscription?.features?.custom_domain ? (
                  <>
                    <div className="space-y-2">
                      <Label>Your Domain</Label>
                      <Input
                        value={branding.custom_domain || ''}
                        onChange={(e) => setBranding({ ...branding, custom_domain: e.target.value })}
                        placeholder="app.yourdomain.com"
                      />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-700 mb-2">DNS Configuration</p>
                      <p className="text-sm text-slate-600 mb-3">Add the following CNAME record:</p>
                      <code className="block p-3 bg-slate-800 text-emerald-400 rounded text-sm">
                        CNAME app.yourdomain.com → custom.brandforge.app
                      </code>
                    </div>
                    <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
                      Save Domain
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">Custom domains are available on Professional and Enterprise plans</p>
                    <Button>Upgrade Plan</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">{plan?.name} Plan</p>
                    <p className="text-sm text-slate-500">
                      ${subscription?.billing_cycle === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice * 12}/year
                    </p>
                  </div>
                  <Badge className={subscription?.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                    {subscription?.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline" className="text-red-600 hover:bg-red-50">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Map, Search, ShoppingCart, Heart, Users, Megaphone, 
  MessageSquare, Mail, Phone, Globe, Eye, AlertTriangle,
  Lightbulb, TrendingUp, Target, Sparkles, ArrowRight
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

const JOURNEY_STAGES = [
  {
    id: 'awareness',
    name: 'Awareness',
    icon: Eye,
    color: 'from-blue-500 to-blue-600',
    description: 'Customer discovers your brand',
    channels: ['SEO', 'Paid Ads', 'Social Media', 'Content Marketing', 'PR'],
    touchpoints: ['Search Results', 'Social Posts', 'Blog Articles', 'Video Content', 'Display Ads']
  },
  {
    id: 'consideration',
    name: 'Consideration',
    icon: Search,
    color: 'from-purple-500 to-purple-600',
    description: 'Customer evaluates options',
    channels: ['Website', 'Email', 'Social Media', 'Reviews', 'Webinars'],
    touchpoints: ['Product Pages', 'Comparison Guides', 'Case Studies', 'Testimonials', 'Live Chat']
  },
  {
    id: 'decision',
    name: 'Decision',
    icon: ShoppingCart,
    color: 'from-emerald-500 to-emerald-600',
    description: 'Customer makes purchase',
    channels: ['Website', 'Sales Team', 'Chat', 'Email', 'Phone'],
    touchpoints: ['Checkout', 'Sales Call', 'Demo', 'Proposal', 'Contract']
  },
  {
    id: 'retention',
    name: 'Retention',
    icon: Heart,
    color: 'from-amber-500 to-amber-600',
    description: 'Customer continues using',
    channels: ['Email', 'SMS', 'In-App', 'Support', 'Account Management'],
    touchpoints: ['Onboarding', 'Product Usage', 'Support Tickets', 'Check-ins', 'Renewals']
  },
  {
    id: 'advocacy',
    name: 'Advocacy',
    icon: Megaphone,
    color: 'from-pink-500 to-pink-600',
    description: 'Customer promotes brand',
    channels: ['Referrals', 'Reviews', 'Social Media', 'Community', 'Events'],
    touchpoints: ['Referral Program', 'Reviews', 'Social Shares', 'Testimonials', 'User Stories']
  }
];

export default function CustomerJourney() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedStage, setSelectedStage] = useState('awareness');

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.BusinessProject.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  const { data: omnichannelConfig } = useQuery({
    queryKey: ['omnichannelConfig', projectId],
    queryFn: async () => {
      const configs = await base44.entities.OmnichannelConfig.filter({ project_id: projectId });
      return configs[0];
    },
    enabled: !!projectId
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics', projectId],
    queryFn: () => base44.entities.Analytics.filter({ project_id: projectId }),
    enabled: !!projectId
  });

  // Get pain points and opportunities from market research
  const getPainPointsForStage = (stageId) => {
    const painPoints = project?.market_research?.customer_pain_points || [];
    const allPainPoints = [
      ...painPoints,
      'Lack of personalized communication',
      'Slow response times',
      'Inconsistent brand experience',
      'Limited payment options',
      'Poor mobile experience'
    ];

    // Map pain points to stages
    const stagePainPoints = {
      awareness: allPainPoints.filter(p => 
        p.toLowerCase().includes('discover') || 
        p.toLowerCase().includes('find') || 
        p.toLowerCase().includes('search') ||
        p.toLowerCase().includes('aware')
      ),
      consideration: allPainPoints.filter(p => 
        p.toLowerCase().includes('compare') || 
        p.toLowerCase().includes('evaluate') || 
        p.toLowerCase().includes('information') ||
        p.toLowerCase().includes('understand')
      ),
      decision: allPainPoints.filter(p => 
        p.toLowerCase().includes('price') || 
        p.toLowerCase().includes('payment') || 
        p.toLowerCase().includes('purchase') ||
        p.toLowerCase().includes('trust')
      ),
      retention: allPainPoints.filter(p => 
        p.toLowerCase().includes('support') || 
        p.toLowerCase().includes('service') || 
        p.toLowerCase().includes('experience') ||
        p.toLowerCase().includes('onboard')
      ),
      advocacy: allPainPoints.filter(p => 
        p.toLowerCase().includes('referral') || 
        p.toLowerCase().includes('review') || 
        p.toLowerCase().includes('recommend')
      )
    };

    return stagePainPoints[stageId]?.slice(0, 3) || painPoints.slice(0, 3);
  };

  const getOpportunitiesForStage = (stageId) => {
    const opportunities = project?.market_research?.opportunities || [];
    const marketGaps = project?.market_research?.market_gaps || [];
    const allOpportunities = [...opportunities, ...marketGaps];

    // Map opportunities to stages
    const stageOpportunities = {
      awareness: [
        'Leverage SEO for organic visibility',
        'Create viral social content',
        'Partner with influencers',
        ...allOpportunities.slice(0, 2)
      ],
      consideration: [
        'Provide detailed product comparisons',
        'Offer free trials or demos',
        'Showcase customer testimonials',
        ...allOpportunities.slice(0, 2)
      ],
      decision: [
        'Simplify checkout process',
        'Offer multiple payment methods',
        'Provide purchase guarantees',
        ...allOpportunities.slice(0, 2)
      ],
      retention: [
        'Implement loyalty program',
        'Provide proactive support',
        'Regular product updates',
        ...allOpportunities.slice(0, 2)
      ],
      advocacy: [
        'Create referral incentives',
        'Build community platform',
        'Feature customer success stories',
        ...allOpportunities.slice(0, 2)
      ]
    };

    return stageOpportunities[stageId]?.slice(0, 4) || allOpportunities.slice(0, 4);
  };

  const getActiveChannels = () => {
    if (!omnichannelConfig?.channels) return [];
    return Object.keys(omnichannelConfig.channels)
      .filter(ch => omnichannelConfig.channels[ch]?.enabled)
      .map(ch => ch.replace('_', ' '));
  };

  const getMetricsForStage = (stageId) => {
    if (!analytics || analytics.length === 0) return null;

    const stageMetrics = {
      awareness: {
        label: 'Page Views',
        value: analytics.filter(a => a.metric_type === 'page_view').length,
        trend: '+12%'
      },
      consideration: {
        label: 'Engagement Rate',
        value: `${Math.round(analytics.filter(a => a.metric_type === 'scroll_depth').length / analytics.length * 100)}%`,
        trend: '+8%'
      },
      decision: {
        label: 'Conversions',
        value: analytics.filter(a => a.metric_type === 'conversion').length,
        trend: '+15%'
      },
      retention: {
        label: 'Return Rate',
        value: '68%',
        trend: '+5%'
      },
      advocacy: {
        label: 'Referrals',
        value: '24',
        trend: '+20%'
      }
    };

    return stageMetrics[stageId];
  };

  const currentStage = JOURNEY_STAGES.find(s => s.id === selectedStage);
  const painPoints = getPainPointsForStage(selectedStage);
  const opportunities = getOpportunitiesForStage(selectedStage);
  const metrics = getMetricsForStage(selectedStage);
  const activeChannels = getActiveChannels();

  if (!projectId || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-6">
        <Card className="max-w-md border-slate-700 bg-slate-800">
          <CardContent className="p-6 text-center">
            <Map className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400">Please select a project to view customer journey</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium">
            <Map className="w-4 h-4" />
            Customer Journey Mapping
          </div>
          <h1 className="text-4xl font-bold text-white">
            {project.business_name} Customer Journey
          </h1>
          <p className="text-slate-400 text-lg">Visualize and optimize every touchpoint in the customer lifecycle</p>
        </div>

        {/* Journey Stages - Visual Flow */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-emerald-500 via-amber-500 to-pink-500 opacity-20 -translate-y-1/2" />
          
          <div className="grid grid-cols-5 gap-4 relative">
            {JOURNEY_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === stage.id;
              const isCompleted = JOURNEY_STAGES.findIndex(s => s.id === selectedStage) > index;

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    onClick={() => setSelectedStage(stage.id)}
                    className={`cursor-pointer transition-all border-2 ${
                      isSelected
                        ? `border-transparent bg-gradient-to-br ${stage.color} text-white shadow-2xl scale-105`
                        : isCompleted
                        ? 'border-emerald-500/30 bg-slate-800/50 hover:border-emerald-500/50'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                        isSelected
                          ? 'bg-white/20'
                          : isCompleted
                          ? 'bg-emerald-500/20'
                          : 'bg-slate-700/50'
                      }`}>
                        <Icon className={`w-8 h-8 ${
                          isSelected ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-400'
                        }`} />
                      </div>
                      <h3 className={`font-semibold mb-1 ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}>
                        {stage.name}
                      </h3>
                      <p className={`text-xs ${
                        isSelected ? 'text-white/80' : 'text-slate-500'
                      }`}>
                        {stage.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stage Details */}
        {currentStage && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Touchpoints & Channels */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-violet-400" />
                  Touchpoints & Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-2 font-medium">Marketing Channels</p>
                  <div className="flex flex-wrap gap-2">
                    {currentStage.channels.map((channel, i) => (
                      <Badge key={i} variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-500/30">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2 font-medium">Active Touchpoints</p>
                  <div className="space-y-2">
                    {currentStage.touchpoints.map((touchpoint, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentStage.color}`} />
                        <span className="text-sm text-slate-300">{touchpoint}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {activeChannels.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2 font-medium">Your Omnichannel Setup</p>
                    <div className="flex flex-wrap gap-2">
                      {activeChannels.map((channel, i) => (
                        <Badge key={i} className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {metrics && (
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-slate-400 mb-1">{metrics.label}</p>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold text-white">{metrics.value}</p>
                      <Badge className="bg-emerald-500/20 text-emerald-300">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {metrics.trend}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pain Points */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Pain Points
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Issues affecting this stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {painPoints.length > 0 ? painPoints.map((pain, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{pain}</p>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="p-8 text-center">
                      <p className="text-slate-500 text-sm">No major pain points identified</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-emerald-400" />
                  Opportunities
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Ways to improve this stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {opportunities.map((opportunity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Lightbulb className="w-3 h-3 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-300 leading-relaxed">{opportunity}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-emerald-400 hover:text-emerald-300 p-0 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Implement <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Engagement by Stage */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Website Content Strategy by Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {JOURNEY_STAGES.map((stage) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.id} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stage.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-2">{stage.name}</h4>
                    <ul className="space-y-1 text-xs text-slate-400">
                      {stage.id === 'awareness' && (
                        <>
                          <li>• SEO Blog Posts</li>
                          <li>• Social Media</li>
                          <li>• Display Ads</li>
                        </>
                      )}
                      {stage.id === 'consideration' && (
                        <>
                          <li>• Product Pages</li>
                          <li>• Case Studies</li>
                          <li>• Comparison Guides</li>
                        </>
                      )}
                      {stage.id === 'decision' && (
                        <>
                          <li>• Pricing Page</li>
                          <li>• Checkout Flow</li>
                          <li>• Live Demos</li>
                        </>
                      )}
                      {stage.id === 'retention' && (
                        <>
                          <li>• Onboarding</li>
                          <li>• Help Center</li>
                          <li>• Email Support</li>
                        </>
                      )}
                      {stage.id === 'advocacy' && (
                        <>
                          <li>• Referral Program</li>
                          <li>• Community Forum</li>
                          <li>• Review Platform</li>
                        </>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
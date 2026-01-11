import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, ExternalLink, Phone, Globe, Star, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const PHONE_SERVICES = [
  {
    name: 'Google Voice',
    url: 'https://voice.google.com',
    description: 'Free phone number with voicemail and text, integrates with Google Workspace',
    pricing: 'Free (personal) / $10-30/mo (business)',
    features: ['Free personal use', 'Call forwarding', 'Voicemail transcription'],
    rating: 4.5
  },
  {
    name: 'OpenPhone',
    url: 'https://www.openphone.com',
    description: 'Modern business phone system with AI-powered features',
    pricing: 'From $15/user/mo',
    features: ['AI call summaries', 'Team inbox', 'CRM integration'],
    rating: 4.8
  },
  {
    name: 'Grasshopper',
    url: 'https://grasshopper.com',
    description: 'Virtual phone system designed for small businesses',
    pricing: 'From $26/mo',
    features: ['Professional greetings', 'Extensions', 'Mobile app'],
    rating: 4.3
  },
  {
    name: 'RingCentral',
    url: 'https://www.ringcentral.com',
    description: 'Enterprise-grade communication platform with AI',
    pricing: 'From $20/user/mo',
    features: ['Video meetings', 'Team messaging', 'Analytics'],
    rating: 4.4
  },
  {
    name: 'Dialpad',
    url: 'https://www.dialpad.com',
    description: 'AI-powered cloud communications',
    pricing: 'From $15/user/mo',
    features: ['Real-time transcription', 'AI coaching', 'Integrations'],
    rating: 4.6
  },
  {
    name: 'Sideline',
    url: 'https://www.sideline.com',
    description: 'Second phone number app for separating work and personal calls',
    pricing: '$9.99/mo',
    features: ['Separate number', 'Auto-reply', 'Team features'],
    rating: 4.2
  }
];

const DIRECTORIES = [
  {
    name: 'Google Business Profile',
    url: 'https://business.google.com',
    description: 'Essential for local SEO and appearing in Google Maps',
    category: 'essential',
    impact: 'High',
    free: true
  },
  {
    name: 'Bing Places',
    url: 'https://www.bingplaces.com',
    description: 'Get found on Bing and Microsoft search products',
    category: 'essential',
    impact: 'Medium',
    free: true
  },
  {
    name: 'Yelp for Business',
    url: 'https://business.yelp.com',
    description: 'Critical for service businesses, restaurants, and local shops',
    category: 'essential',
    impact: 'High',
    free: true
  },
  {
    name: 'Apple Maps Connect',
    url: 'https://mapsconnect.apple.com',
    description: 'Appear in Apple Maps and Siri searches',
    category: 'essential',
    impact: 'Medium',
    free: true
  },
  {
    name: 'Facebook Business',
    url: 'https://business.facebook.com',
    description: 'Create a business page for social presence and ads',
    category: 'social',
    impact: 'High',
    free: true
  },
  {
    name: 'LinkedIn Company Page',
    url: 'https://www.linkedin.com/company/setup',
    description: 'Professional network presence for B2B businesses',
    category: 'social',
    impact: 'High',
    free: true
  },
  {
    name: 'Crunchbase',
    url: 'https://www.crunchbase.com',
    description: 'Platform for startups and tech companies',
    category: 'startup',
    impact: 'Medium',
    free: true
  },
  {
    name: 'AngelList',
    url: 'https://angel.co',
    description: 'Connect with investors and talent',
    category: 'startup',
    impact: 'Medium',
    free: true
  },
  {
    name: 'Product Hunt',
    url: 'https://www.producthunt.com',
    description: 'Launch platform for new products and services',
    category: 'startup',
    impact: 'High',
    free: true
  },
  {
    name: 'Better Business Bureau',
    url: 'https://www.bbb.org',
    description: 'Build trust with BBB accreditation',
    category: 'trust',
    impact: 'Medium',
    free: false
  },
  {
    name: 'Trustpilot',
    url: 'https://business.trustpilot.com',
    description: 'Collect and showcase customer reviews',
    category: 'trust',
    impact: 'High',
    free: true
  },
  {
    name: 'Clutch.co',
    url: 'https://clutch.co',
    description: 'B2B ratings and reviews platform',
    category: 'b2b',
    impact: 'High',
    free: true
  },
  {
    name: 'G2',
    url: 'https://www.g2.com',
    description: 'Software and service reviews platform',
    category: 'b2b',
    impact: 'High',
    free: true
  },
  {
    name: 'Capterra',
    url: 'https://www.capterra.com',
    description: 'Software discovery and reviews',
    category: 'b2b',
    impact: 'Medium',
    free: true
  },
  {
    name: 'Manta',
    url: 'https://www.manta.com',
    description: 'Small business directory',
    category: 'general',
    impact: 'Low',
    free: true
  },
  {
    name: 'Yellow Pages',
    url: 'https://www.yellowpages.com',
    description: 'Traditional business directory with online presence',
    category: 'general',
    impact: 'Low',
    free: true
  }
];

export default function ResourcesStep({ project, onNext, onPrev }) {
  const [activeTab, setActiveTab] = useState('phone');

  const categoryLabels = {
    essential: 'Essential',
    social: 'Social',
    startup: 'Startup',
    trust: 'Trust & Reviews',
    b2b: 'B2B',
    general: 'General'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
          Business Resources
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Essential tools and directories to establish your business presence
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-100 rounded-xl p-1">
          <TabsTrigger value="phone" className="rounded-lg h-12 data-[state=active]:bg-white data-[state=active]:shadow">
            <Phone className="w-4 h-4 mr-2" />
            AI Phone Services
          </TabsTrigger>
          <TabsTrigger value="directories" className="rounded-lg h-12 data-[state=active]:bg-white data-[state=active]:shadow">
            <Globe className="w-4 h-4 mr-2" />
            Business Directories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phone" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHONE_SERVICES.map((service) => (
              <Card key={service.name} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                        <span className="text-sm text-slate-500 ml-1">{service.rating}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                      {service.pricing.includes('Free') ? 'Free Option' : 'Paid'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{service.description}</p>
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">Pricing:</span>
                    <span className="text-slate-600 ml-1">{service.pricing}</span>
                  </div>
                  <ul className="space-y-1">
                    {service.features.map((feature, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-violet-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href={service.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full mt-2">
                      Visit Website
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="directories" className="mt-6">
          <div className="grid gap-4">
            {Object.keys(categoryLabels).map((category) => {
              const categoryDirs = DIRECTORIES.filter(d => d.category === category);
              if (categoryDirs.length === 0) return null;
              
              return (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    {categoryLabels[category]}
                    <Badge variant="secondary" className="text-xs">
                      {categoryDirs.length} directories
                    </Badge>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categoryDirs.map((dir) => (
                      <Card key={dir.name} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white/80">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-slate-800">{dir.name}</h4>
                                {dir.free && (
                                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">Free</Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-500 mt-1">{dir.description}</p>
                            </div>
                            <div className="flex items-center gap-1 ml-4">
                              <TrendingUp className={`w-4 h-4 ${
                                dir.impact === 'High' ? 'text-emerald-500' :
                                dir.impact === 'Medium' ? 'text-amber-500' : 'text-slate-400'
                              }`} />
                              <span className="text-xs text-slate-500">{dir.impact}</span>
                            </div>
                          </div>
                          <a href={dir.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block">
                            <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">
                              Submit Listing
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="h-12 px-6">
          <ChevronLeft className="w-5 h-5 mr-2" /> Back
        </Button>
        <Button
          onClick={onNext}
          className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
        >
          Continue to Newsletter
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
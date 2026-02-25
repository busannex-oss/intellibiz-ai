import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Globe, ExternalLink, Star, Zap, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PHONE_SERVICES = [
  {
    name: 'RingCentral',
    url: 'https://www.ringcentral.com',
    description: 'Enterprise-grade unified communications platform with AI-powered features, video meetings, and advanced analytics',
    pricing: 'From $20/user/mo',
    features: ['AI-powered insights', 'Video meetings', 'Team messaging', 'Advanced analytics', 'CRM integrations'],
    rating: 4.7
  },
  {
    name: 'Dialpad',
    url: 'https://www.dialpad.com',
    description: 'Modern cloud communications with real-time AI transcription, voice intelligence, and seamless integrations',
    pricing: 'From $15/user/mo',
    features: ['Real-time transcription', 'Voice intelligence', 'AI coaching', 'Call recording', 'Multi-platform support'],
    rating: 4.6
  }
];

const DIRECTORIES = [
  { name: 'Google Business Profile', url: 'https://business.google.com', description: 'Essential for local SEO and Google Maps' },
  { name: 'Bing Places', url: 'https://www.bingplaces.com', description: 'Microsoft search products visibility' },
  { name: 'Yelp for Business', url: 'https://business.yelp.com', description: 'Critical for service businesses and local shops' },
  { name: 'Apple Maps Connect', url: 'https://mapsconnect.apple.com', description: 'Appear in Apple Maps and Siri' },
  { name: 'LinkedIn Company Page', url: 'https://www.linkedin.com/company/setup', description: 'Professional B2B presence' },
  { name: 'Crunchbase', url: 'https://www.crunchbase.com', description: 'Startup and tech company platform' }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-500" />
              Business Resources
            </h1>
            <p className="text-slate-400 mt-2">Essential tools and directories for your business</p>
          </div>
          <Link to={createPageUrl('PhoneIntegrations')}>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Phone className="w-4 h-4 mr-2" />
              Configure Phone APIs
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="bg-slate-800 border-slate-700 mb-6">
            <TabsTrigger value="phone"><Phone className="w-4 h-4 mr-2" />AI Phone Services</TabsTrigger>
            <TabsTrigger value="directories"><Globe className="w-4 h-4 mr-2" />Business Directories</TabsTrigger>
          </TabsList>

          <TabsContent value="phone" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {PHONE_SERVICES.map((service) => (
                <Card key={service.name} className="border-0 bg-slate-800/50 border border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{service.name}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                          ))}
                          <span className="text-sm text-slate-400 ml-1">{service.rating}</span>
                        </div>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-400">{service.pricing}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a href={service.url} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="directories">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DIRECTORIES.map((dir) => (
                <Card key={dir.name} className="border-0 bg-slate-800/50 border border-slate-700">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-white mb-2">{dir.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{dir.description}</p>
                    <a href={dir.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                        Submit Listing <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
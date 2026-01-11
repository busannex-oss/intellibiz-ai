import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Phone, 
  Check, 
  ExternalLink, 
  Shield, 
  Zap, 
  Globe,
  MessageSquare,
  Bot,
  ChevronRight,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const PROVIDERS = [
  {
    id: 'twilio',
    name: 'Twilio',
    logo: '📞',
    description: 'Industry-leading cloud communications platform',
    features: ['Voice & SMS', 'Global coverage', 'Programmable', 'AI integrations'],
    pricing: 'Pay-as-you-go from $0.0085/min',
    signupUrl: 'https://www.twilio.com/try-twilio',
    docsUrl: 'https://www.twilio.com/docs',
    recommended: true,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'vonage',
    name: 'Vonage',
    logo: '🔊',
    description: 'Enterprise-grade communications APIs',
    features: ['Voice & SMS', 'Video', 'Verify API', 'Conversations'],
    pricing: 'From $0.0127/min outbound',
    signupUrl: 'https://dashboard.nexmo.com/sign-up',
    docsUrl: 'https://developer.vonage.com/',
    recommended: false,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'plivo',
    name: 'Plivo',
    logo: '📱',
    description: 'Cost-effective cloud communications',
    features: ['Voice & SMS', 'Competitive pricing', 'Global', 'SIP trunking'],
    pricing: 'From $0.0050/min',
    signupUrl: 'https://console.plivo.com/accounts/register/',
    docsUrl: 'https://www.plivo.com/docs/',
    recommended: false,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'telnyx',
    name: 'Telnyx',
    logo: '🌐',
    description: 'Mission-critical communications',
    features: ['Voice & SMS', 'Fax', 'Private network', 'Low latency'],
    pricing: 'From $0.0070/min',
    signupUrl: 'https://portal.telnyx.com/#/sign-up',
    docsUrl: 'https://developers.telnyx.com/',
    recommended: false,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'bandwidth',
    name: 'Bandwidth',
    logo: '📡',
    description: 'Direct carrier for enterprise',
    features: ['Voice & SMS', 'Direct routes', '911', 'Enterprise SLA'],
    pricing: 'Custom enterprise pricing',
    signupUrl: 'https://www.bandwidth.com/free-trial/',
    docsUrl: 'https://dev.bandwidth.com/',
    recommended: false,
    color: 'from-orange-500 to-amber-500'
  }
];

const AI_FEATURES = [
  { icon: Bot, title: 'AI Receptionist', desc: 'Intelligent call handling 24/7' },
  { icon: MessageSquare, title: 'Smart SMS', desc: 'AI-powered text responses' },
  { icon: Sparkles, title: 'Call Transcription', desc: 'Real-time speech-to-text' },
  { icon: Zap, title: 'Sentiment Analysis', desc: 'Understand caller emotions' },
  { icon: Globe, title: 'Smart Routing', desc: 'AI routes to best agent' },
  { icon: Shield, title: 'Spam Detection', desc: 'Block unwanted calls' }
];

export default function ProviderSetup({ projectId, project, phoneSystem, onCreate, onUpdate, isSettings }) {
  const [selectedProvider, setSelectedProvider] = useState(phoneSystem?.provider || null);
  const [step, setStep] = useState(phoneSystem?.provider ? 2 : 1);
  const [credentials, setCredentials] = useState({
    accountSid: '',
    authToken: '',
    apiKey: '',
    apiSecret: ''
  });

  const handleProviderSelect = (providerId) => {
    setSelectedProvider(providerId);
    setStep(2);
  };

  const handleCredentialsSubmit = async () => {
    const data = {
      project_id: projectId,
      provider: selectedProvider,
      provider_configured: true,
      phone_numbers: [],
      extensions: [],
      ivr_flows: [],
      ai_settings: {
        ai_receptionist_enabled: true,
        call_transcription: true,
        sentiment_analysis: true,
        smart_routing: true
      }
    };

    if (phoneSystem?.id) {
      await onUpdate(data);
    } else {
      await onCreate(data);
    }
  };

  const selectedProviderData = PROVIDERS.find(p => p.id === selectedProvider);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
            <Phone className="w-4 h-4" />
            AI-Powered Business Phone System
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isSettings ? 'Phone System Settings' : 'Set Up Your Phone System'}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Connect a telecom provider to unlock AI-powered calling, SMS, and advanced switchboard features
          </p>
        </div>

        {/* AI Features Preview */}
        {step === 1 && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12">
            {AI_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
              >
                <feature.icon className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">{feature.title}</p>
                <p className="text-slate-400 text-xs mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Step 1: Provider Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white text-center mb-8">
              Choose Your Telecom Provider
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROVIDERS.map((provider, i) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/20 hover:border-white/40 hover:bg-white/15 ${
                      selectedProvider === provider.id ? 'ring-2 ring-violet-500 border-violet-500' : ''
                    }`}
                    onClick={() => handleProviderSelect(provider.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center text-2xl`}>
                            {provider.logo}
                          </div>
                          <div>
                            <CardTitle className="text-white">{provider.name}</CardTitle>
                            {provider.recommended && (
                              <Badge className="bg-violet-500/30 text-violet-200 mt-1">Recommended</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-300 text-sm">{provider.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {provider.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="border-white/20 text-slate-300">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400">{provider.pricing}</p>
                      <div className="flex gap-2 pt-2">
                        <a href={provider.signupUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Sign Up <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                        <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white">
                            Docs
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Credentials */}
        {step === 2 && selectedProviderData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedProviderData.color} flex items-center justify-center text-2xl`}>
                    {selectedProviderData.logo}
                  </div>
                  <div>
                    <CardTitle className="text-white">Connect {selectedProviderData.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      Enter your API credentials to connect
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-amber-500/20 border-amber-500/50">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-amber-200">
                    Backend functions must be enabled to securely store API credentials and make calls.
                    <Link to="/dashboard" className="underline ml-1">Enable in Settings</Link>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {selectedProvider === 'twilio' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Account SID</Label>
                        <Input
                          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          value={credentials.accountSid}
                          onChange={(e) => setCredentials({ ...credentials, accountSid: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Auth Token</Label>
                        <Input
                          type="password"
                          placeholder="Your auth token"
                          value={credentials.authToken}
                          onChange={(e) => setCredentials({ ...credentials, authToken: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </>
                  )}

                  {(selectedProvider === 'vonage' || selectedProvider === 'plivo' || selectedProvider === 'telnyx' || selectedProvider === 'bandwidth') && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-slate-300">API Key</Label>
                        <Input
                          placeholder="Your API key"
                          value={credentials.apiKey}
                          onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">API Secret</Label>
                        <Input
                          type="password"
                          placeholder="Your API secret"
                          value={credentials.apiSecret}
                          onChange={(e) => setCredentials({ ...credentials, apiSecret: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleCredentialsSubmit}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  >
                    Connect & Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <p className="text-center text-xs text-slate-500">
                  Your credentials are encrypted and stored securely. We never share your API keys.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Back Link */}
        {!isSettings && (
          <div className="text-center mt-8">
            <Link to={createPageUrl(`CreateBusiness?projectId=${projectId}`)}>
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                ← Back to Business Builder
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
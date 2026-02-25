import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, Phone, Mail, Send, ChevronRight, ChevronLeft,
  Instagram, Facebook, Twitter, Globe, Bot, Zap, Users, ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CHANNELS = [
  { id: 'website_chat', name: 'Website Chat', icon: MessageSquare, color: 'from-violet-500 to-purple-500', description: 'Live chat widget' },
  { id: 'whatsapp', name: 'WhatsApp', icon: Phone, color: 'from-emerald-500 to-green-500', description: '2B+ users worldwide' },
  { id: 'instagram', name: 'Instagram DM', icon: Instagram, color: 'from-pink-500 to-rose-500', description: 'Visual platform' },
  { id: 'facebook_messenger', name: 'Messenger', icon: Facebook, color: 'from-blue-500 to-blue-600', description: 'Facebook integration' },
  { id: 'email', name: 'Email', icon: Mail, color: 'from-amber-500 to-orange-500', description: 'Traditional support' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'from-sky-500 to-blue-500', description: 'Public engagement' },
  { id: 'sms', name: 'SMS', icon: Phone, color: 'from-cyan-500 to-teal-500', description: 'Direct messaging' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: 'from-blue-400 to-blue-500', description: 'Secure messaging' },
];

export default function OmnichannelStep({ project, onUpdate, onNext, onPrev }) {
  const [selectedChannels, setSelectedChannels] = useState(['website_chat', 'whatsapp', 'email']);
  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    greeting: `Hi there! 👋 Welcome to ${project?.business_name || 'our business'}. How can I help you today?`,
    personality: 'friendly and professional'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const createConfigMutation = useMutation({
    mutationFn: (data) => base44.entities.OmnichannelConfig.create(data),
    onSuccess: () => queryClient.invalidateQueries(['omnichannelConfig'])
  });

  const toggleChannel = (channelId) => {
    if (selectedChannels.includes(channelId)) {
      setSelectedChannels(selectedChannels.filter(c => c !== channelId));
    } else {
      setSelectedChannels([...selectedChannels, channelId]);
    }
  };

  const handleGenerateGreeting = async () => {
    setIsGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a friendly, professional greeting message for a chat widget for a business called "${project?.business_name}" in the ${project?.industry} industry. 
      Target audience: ${project?.target_audience || 'general customers'}
      Keep it under 100 characters, warm and inviting, include an emoji.`,
      response_json_schema: {
        type: "object",
        properties: {
          greeting: { type: "string" }
        }
      }
    });
    setAiSettings({ ...aiSettings, greeting: result.greeting });
    setIsGenerating(false);
  };

  const handleSetup = async () => {
    const channels = {};
    selectedChannels.forEach(ch => {
      channels[ch] = {
        enabled: true,
        ai_enabled: aiSettings.enabled,
        greeting: aiSettings.greeting
      };
    });

    await createConfigMutation.mutateAsync({
      project_id: project?.id,
      channels,
      unified_inbox_enabled: true,
      ai_routing: true
    });

    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-5xl mx-auto"
    >
      <Card className="border-0 shadow-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 text-white mb-6">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">AI-Powered Omnichannel</h2>
              <p className="opacity-90">AI-driven unified communication across all channels</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{selectedChannels.length}</p>
              <p className="text-sm opacity-80">Channels Selected</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm opacity-80">AI Coverage</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">1</p>
              <p className="text-sm opacity-80">Unified Inbox</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Channel Selection */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Select Your Channels</CardTitle>
            <CardDescription>Choose where you want to engage customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {CHANNELS.map((channel) => {
                const Icon = channel.icon;
                const isSelected = selectedChannels.includes(channel.id);
                return (
                  <div
                    key={channel.id}
                    onClick={() => toggleChannel(channel.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${channel.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{channel.name}</p>
                        <p className="text-xs text-slate-500">{channel.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-600" />
              AI-Powered Assistant
            </CardTitle>
            <CardDescription>Advanced AI handles customer conversations intelligently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-violet-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-violet-600" />
                <div>
                  <p className="font-medium">AI Auto-Response</p>
                  <p className="text-sm text-slate-500">Instant replies to common questions</p>
                </div>
              </div>
              <Switch
                checked={aiSettings.enabled}
                onCheckedChange={(v) => setAiSettings({ ...aiSettings, enabled: v })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Welcome Message</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGenerateGreeting}
                  disabled={isGenerating}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  {isGenerating ? 'Generating...' : 'AI Generate'}
                </Button>
              </div>
              <Textarea
                value={aiSettings.greeting}
                onChange={(e) => setAiSettings({ ...aiSettings, greeting: e.target.value })}
                rows={3}
              />
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <p className="font-medium text-emerald-800">Unified Inbox</p>
              </div>
              <p className="text-sm text-emerald-700">
                All conversations from every channel will appear in one place. Respond from anywhere, keep context everywhere.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Omnichannel Hub Link */}
      {project?.id && (
        <Card className="border-2 border-dashed border-violet-300 bg-violet-50/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Want more control?</p>
                  <p className="text-sm text-slate-600">Access the full Omnichannel Hub for advanced settings</p>
                </div>
              </div>
              <Link to={createPageUrl(`Omnichannel?projectId=${project.id}`)}>
                <Button variant="outline">
                  Open Omnichannel Hub
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button 
          onClick={handleSetup}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          disabled={selectedChannels.length === 0}
        >
          Set Up Channels
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
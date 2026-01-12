import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  MessageSquare, Phone, Mail, Send, ExternalLink, Check, Settings,
  Instagram, Facebook, Twitter, Slack
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

const CHANNELS = [
  {
    id: 'website_chat',
    name: 'Website Chat',
    icon: MessageSquare,
    description: 'Live chat widget for your website',
    color: 'from-violet-500 to-purple-500',
    fields: ['greeting']
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    icon: Phone,
    description: 'Connect your WhatsApp Business account',
    color: 'from-emerald-500 to-green-500',
    fields: ['phone_number', 'business_id'],
    setupUrl: 'https://business.whatsapp.com/'
  },
  {
    id: 'facebook_messenger',
    name: 'Facebook Messenger',
    icon: Facebook,
    description: 'Respond to Facebook page messages',
    color: 'from-blue-500 to-blue-600',
    fields: ['page_id', 'page_name'],
    setupUrl: 'https://business.facebook.com/'
  },
  {
    id: 'instagram',
    name: 'Instagram DM',
    icon: Instagram,
    description: 'Manage Instagram direct messages',
    color: 'from-pink-500 to-rose-500',
    fields: ['account_id', 'username'],
    setupUrl: 'https://business.instagram.com/'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    description: 'Handle Twitter DMs and mentions',
    color: 'from-sky-500 to-blue-500',
    fields: ['handle'],
    setupUrl: 'https://developer.twitter.com/'
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    description: 'Unified email inbox with AI auto-reply',
    color: 'from-amber-500 to-orange-500',
    fields: ['support_email']
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: Phone,
    description: 'Text message communication',
    color: 'from-cyan-500 to-teal-500',
    fields: ['phone_number']
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: Send,
    description: 'Telegram bot messaging',
    color: 'from-blue-400 to-blue-500',
    fields: ['bot_username'],
    setupUrl: 'https://core.telegram.org/bots'
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: Slack,
    description: 'Internal team communication',
    color: 'from-purple-500 to-violet-500',
    fields: ['workspace'],
    setupUrl: 'https://api.slack.com/'
  }
];

export default function ChannelSetup({ config, onSave, project }) {
  const [channels, setChannels] = useState(config?.channels || {});
  const [selectedChannel, setSelectedChannel] = useState(null);

  const toggleChannel = (channelId) => {
    const current = channels[channelId] || {};
    setChannels({
      ...channels,
      [channelId]: { ...current, enabled: !current.enabled }
    });
  };

  const updateChannelField = (channelId, field, value) => {
    setChannels({
      ...channels,
      [channelId]: { ...channels[channelId], [field]: value }
    });
  };

  const handleSave = () => {
    onSave({ channels });
  };

  const enabledCount = Object.values(channels).filter(c => c?.enabled).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Omnichannel Communication</h2>
              <p className="opacity-90">
                Connect all your channels to manage conversations from one place
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{enabledCount}</p>
              <p className="text-sm opacity-80">channels connected</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Channel Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHANNELS.map((channel, i) => {
          const isEnabled = channels[channel.id]?.enabled;
          const Icon = channel.icon;
          
          return (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`border-2 transition-all ${isEnabled ? 'border-emerald-300 bg-emerald-50/50' : 'border-transparent'}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => toggleChannel(channel.id)}
                    />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{channel.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{channel.description}</p>
                  
                  {isEnabled && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-700">
                        <Check className="w-3 h-3 mr-1" /> Connected
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4 mr-1" /> Configure
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Icon className="w-5 h-5" />
                              Configure {channel.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            {channel.fields?.map(field => (
                              <div key={field} className="space-y-2">
                                <Label className="capitalize">{field.replace('_', ' ')}</Label>
                                <Input
                                  value={channels[channel.id]?.[field] || ''}
                                  onChange={(e) => updateChannelField(channel.id, field, e.target.value)}
                                  placeholder={`Enter ${field.replace('_', ' ')}`}
                                />
                              </div>
                            ))}
                            {channel.id !== 'website_chat' && channel.id !== 'email' && (
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm">AI Auto-Reply</span>
                                <Switch
                                  checked={channels[channel.id]?.ai_enabled}
                                  onCheckedChange={(v) => updateChannelField(channel.id, 'ai_enabled', v)}
                                />
                              </div>
                            )}
                            {channel.setupUrl && (
                              <a href={channel.setupUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Open {channel.name} Setup
                                </Button>
                              </a>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
          Save Channel Configuration
        </Button>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Bot, 
  Sparkles,
  Mic,
  Volume2,
  Brain,
  MessageSquare,
  Calendar,
  FileText,
  Shield,
  Zap,
  Plus,
  Trash2,
  Play
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AI_VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and professional' },
  { id: 'echo', name: 'Echo', description: 'Warm and friendly' },
  { id: 'fable', name: 'Fable', description: 'Expressive and dynamic' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', description: 'Soft and approachable' },
  { id: 'shimmer', name: 'Shimmer', description: 'Clear and energetic' },
];

export default function AISettings({ phoneSystem, project, onUpdate }) {
  const [settings, setSettings] = useState(phoneSystem?.ai_settings || {
    ai_receptionist_enabled: true,
    ai_voice: 'nova',
    ai_personality: '',
    business_hours_response: '',
    after_hours_response: '',
    faq_responses: [],
    appointment_booking: true,
    call_transcription: true,
    sentiment_analysis: true,
    smart_routing: true
  });

  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const addFaq = () => {
    if (!newFaq.question || !newFaq.answer) return;
    updateSetting('faq_responses', [...(settings.faq_responses || []), newFaq]);
    setNewFaq({ question: '', answer: '' });
  };

  const removeFaq = (index) => {
    updateSetting('faq_responses', settings.faq_responses.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onUpdate({ ai_settings: settings });
  };

  return (
    <div className="space-y-6">
      {/* AI Receptionist */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Receptionist</h2>
                <p className="opacity-90">Intelligent call handling powered by AI</p>
              </div>
            </div>
            <Switch
              checked={settings.ai_receptionist_enabled}
              onCheckedChange={(v) => updateSetting('ai_receptionist_enabled', v)}
              className="data-[state=checked]:bg-white data-[state=checked]:text-violet-600"
            />
          </div>
        </div>
        <CardContent className="p-6 space-y-6">
          {/* Voice Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">AI Voice</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AI_VOICES.map((voice) => (
                <div
                  key={voice.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    settings.ai_voice === voice.id
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => updateSetting('ai_voice', voice.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{voice.name}</p>
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">{voice.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Personality */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">AI Personality & Instructions</Label>
            <Textarea
              value={settings.ai_personality}
              onChange={(e) => updateSetting('ai_personality', e.target.value)}
              placeholder={`You are a professional and friendly receptionist for ${project?.business_name || 'our company'}. Be helpful, courteous, and efficient. Always try to understand the caller's needs and route them appropriately.`}
              className="min-h-[100px]"
            />
            <p className="text-xs text-slate-500">
              This defines how the AI will behave and respond to callers. Be specific about tone, style, and any business-specific instructions.
            </p>
          </div>

          {/* Responses */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Business Hours Greeting</Label>
              <Textarea
                value={settings.business_hours_response}
                onChange={(e) => updateSetting('business_hours_response', e.target.value)}
                placeholder="Thank you for calling! How can I help you today?"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-3">
              <Label>After Hours Message</Label>
              <Textarea
                value={settings.after_hours_response}
                onChange={(e) => updateSetting('after_hours_response', e.target.value)}
                placeholder="We're currently closed. Our business hours are Monday-Friday 9am-5pm. Please leave a message and we'll get back to you."
                className="min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Responses */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-600" />
            FAQ Responses
          </CardTitle>
          <CardDescription>
            Train the AI to answer common questions automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.faq_responses?.map((faq, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Q: {faq.question}</p>
                  <p className="text-sm text-slate-600 mt-1">A: {faq.answer}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFaq(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg space-y-3">
            <Input
              placeholder="Common question (e.g., What are your hours?)"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            />
            <Textarea
              placeholder="AI response"
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            />
            <Button onClick={addFaq} disabled={!newFaq.question || !newFaq.answer}>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            AI Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Call Transcription</p>
                  <p className="text-xs text-slate-500">Convert calls to text in real-time</p>
                </div>
              </div>
              <Switch
                checked={settings.call_transcription}
                onCheckedChange={(v) => updateSetting('call_transcription', v)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Sentiment Analysis</p>
                  <p className="text-xs text-slate-500">Detect caller emotions</p>
                </div>
              </div>
              <Switch
                checked={settings.sentiment_analysis}
                onCheckedChange={(v) => updateSetting('sentiment_analysis', v)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium">Smart Routing</p>
                  <p className="text-xs text-slate-500">AI routes to best available agent</p>
                </div>
              </div>
              <Switch
                checked={settings.smart_routing}
                onCheckedChange={(v) => updateSetting('smart_routing', v)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium">Appointment Booking</p>
                  <p className="text-xs text-slate-500">AI can schedule appointments</p>
                </div>
              </div>
              <Switch
                checked={settings.appointment_booking}
                onCheckedChange={(v) => updateSetting('appointment_booking', v)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium">Spam Detection</p>
                  <p className="text-xs text-slate-500">Automatically block spam calls</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="font-medium">AI SMS Responses</p>
                  <p className="text-xs text-slate-500">Auto-reply to text messages</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
          Save AI Settings
        </Button>
      </div>
    </div>
  );
}
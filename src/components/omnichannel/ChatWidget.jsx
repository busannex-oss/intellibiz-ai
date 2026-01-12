import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, Bot, Copy, Check, Palette, Code, Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ChatWidget({ config, project, onSave }) {
  const [settings, setSettings] = useState({
    enabled: config?.channels?.website_chat?.enabled || false,
    widget_color: config?.channels?.website_chat?.widget_color || '#7c3aed',
    greeting: config?.channels?.website_chat?.greeting || `Hi there! 👋 Welcome to ${project?.business_name || 'our store'}. How can we help you today?`,
    ai_enabled: config?.channels?.website_chat?.ai_enabled ?? true,
    position: 'bottom-right',
    show_agent_photo: true
  });
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    onSave({
      channels: {
        ...config?.channels,
        website_chat: settings
      }
    });
  };

  const embedCode = `<!-- ${project?.business_name || 'BrandForge'} Chat Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['BFChat']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','bfchat','https://widget.brandforge.app/chat.js'));
  bfchat('init', { projectId: '${project?.id || 'YOUR_PROJECT_ID'}', color: '${settings.widget_color}' });
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Chat Widget Settings</CardTitle>
          <CardDescription>Customize your website chat experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-violet-600" />
              <div>
                <p className="font-medium">Enable Chat Widget</p>
                <p className="text-sm text-slate-500">Show chat on your website</p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(v) => setSettings({ ...settings, enabled: v })}
            />
          </div>

          <div className="space-y-2">
            <Label>Welcome Message</Label>
            <Textarea
              value={settings.greeting}
              onChange={(e) => setSettings({ ...settings, greeting: e.target.value })}
              placeholder="Hi! How can we help?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Widget Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.widget_color}
                onChange={(e) => setSettings({ ...settings, widget_color: e.target.value })}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <Input
                value={settings.widget_color}
                onChange={(e) => setSettings({ ...settings, widget_color: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-violet-600" />
              <div>
                <p className="font-medium">AI Auto-Response</p>
                <p className="text-sm text-slate-500">Let AI handle initial queries</p>
              </div>
            </div>
            <Switch
              checked={settings.ai_enabled}
              onCheckedChange={(v) => setSettings({ ...settings, ai_enabled: v })}
            />
          </div>

          <Button onClick={handleSave} className="w-full bg-violet-600 hover:bg-violet-700">
            Save Widget Settings
          </Button>
        </CardContent>
      </Card>

      {/* Preview & Embed */}
      <div className="space-y-6">
        {/* Preview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-slate-100 rounded-xl p-6 min-h-[400px]">
              {/* Mock Website */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="h-20 bg-slate-200 rounded"></div>
              </div>
              
              {/* Chat Widget Preview */}
              <div className="absolute bottom-4 right-4">
                <div 
                  className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: settings.widget_color }}
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Open Chat Preview */}
              <div className="absolute bottom-20 right-4 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div 
                  className="p-4 text-white"
                  style={{ backgroundColor: settings.widget_color }}
                >
                  <p className="font-semibold">{project?.business_name || 'Chat with us'}</p>
                  <p className="text-sm opacity-90">We typically reply within minutes</p>
                </div>
                <div className="p-4">
                  <div className="bg-slate-100 rounded-xl p-3 text-sm">
                    {settings.greeting}
                  </div>
                </div>
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span>Type your message...</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Embed Code */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Embed Code
            </CardTitle>
            <CardDescription>Add this code before &lt;/body&gt; tag</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto">
                {embedCode}
              </pre>
              <Button
                onClick={copyCode}
                size="sm"
                className="absolute top-2 right-2"
                variant="secondary"
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
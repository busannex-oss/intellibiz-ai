import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Megaphone, TrendingUp, DollarSign, Target, ExternalLink, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Advertising() {
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const [adwizarConfig, setAdwizarConfig] = useState({
    enabled: user?.adwizar_enabled || false,
    api_key: user?.adwizar_api_key || '',
    account_id: user?.adwizar_account_id || ''
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      toast.success('Adwizar.ai integration updated');
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    }
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    await updateUserMutation.mutateAsync({
      adwizar_enabled: adwizarConfig.enabled,
      adwizar_api_key: adwizarConfig.api_key,
      adwizar_account_id: adwizarConfig.account_id
    });
    setIsConnecting(false);
  };

  const isConnected = user?.adwizar_enabled && user?.adwizar_api_key;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-purple-500" />
            Advertising Manager
          </h1>
          <p className="text-slate-400 mt-1">AI-powered advertising campaigns via Adwizar.ai</p>
        </div>

        {/* Integration Setup */}
        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Adwizar.ai Integration</CardTitle>
                  <p className="text-sm text-slate-400">Connect your advertising platform</p>
                </div>
              </div>
              <Badge className={isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                {isConnected ? 'Connected' : 'Not Connected'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">API Key</Label>
                <Input
                  type="password"
                  value={adwizarConfig.api_key}
                  onChange={(e) => setAdwizarConfig(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="Enter Adwizar API Key"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Account ID</Label>
                <Input
                  value={adwizarConfig.account_id}
                  onChange={(e) => setAdwizarConfig(prev => ({ ...prev, account_id: e.target.value }))}
                  placeholder="Enter Account ID"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <a href="https://adwizar.ai/api" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Get API Credentials <ExternalLink className="w-3 h-3" />
              </a>
              <Button onClick={handleConnect} disabled={isConnecting} className="bg-purple-600 hover:bg-purple-700">
                {isConnecting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</> : 'Connect Adwizar.ai'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Stats */}
        {isConnected && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-0 bg-slate-800/50 border border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Active Campaigns</p>
                    <p className="text-3xl font-bold text-white">5</p>
                  </div>
                  <Target className="w-10 h-10 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-slate-800/50 border border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Spend</p>
                    <p className="text-3xl font-bold text-white">$2,450</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-slate-800/50 border border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Conversions</p>
                    <p className="text-3xl font-bold text-white">347</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Agent Chat */}
        {isConnected && (
          <Card className="border-0 bg-slate-800/50 border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-400" />
                AI Advertising Agent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Chat with your AI advertising manager to create, optimize, and analyze campaigns.
              </p>
              <a href={base44.agents.getWhatsAppConnectURL('advertising_manager')} target="_blank" rel="noopener noreferrer">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Connect via WhatsApp
                </Button>
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
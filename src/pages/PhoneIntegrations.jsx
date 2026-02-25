import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle, XCircle, ExternalLink, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PhoneIntegrations() {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const [ringcentralConfig, setRingcentralConfig] = useState({
    enabled: user?.ringcentral_enabled || false,
    client_id: user?.ringcentral_client_id || '',
    client_secret: user?.ringcentral_client_secret || '',
    account_id: user?.ringcentral_account_id || '',
    server_url: user?.ringcentral_server_url || 'https://platform.ringcentral.com'
  });

  const [dialpadConfig, setDialpadConfig] = useState({
    enabled: user?.dialpad_enabled || false,
    api_key: user?.dialpad_api_key || '',
    workspace_id: user?.dialpad_workspace_id || ''
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      toast.success('Phone integrations updated');
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    }
  });

  const handleSaveRingCentral = async () => {
    setIsSaving(true);
    await updateUserMutation.mutateAsync({
      ringcentral_enabled: ringcentralConfig.enabled,
      ringcentral_client_id: ringcentralConfig.client_id,
      ringcentral_client_secret: ringcentralConfig.client_secret,
      ringcentral_account_id: ringcentralConfig.account_id,
      ringcentral_server_url: ringcentralConfig.server_url
    });
    setIsSaving(false);
  };

  const handleSaveDialpad = async () => {
    setIsSaving(true);
    await updateUserMutation.mutateAsync({
      dialpad_enabled: dialpadConfig.enabled,
      dialpad_api_key: dialpadConfig.api_key,
      dialpad_workspace_id: dialpadConfig.workspace_id
    });
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Phone className="w-8 h-8 text-purple-500" />
            Phone Service Integrations
          </h1>
          <p className="text-slate-400 mt-1">Connect RingCentral or Dialpad for advanced phone features</p>
        </div>

        {/* RingCentral */}
        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">RingCentral</CardTitle>
                  <p className="text-sm text-slate-400">Enterprise communications platform</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={ringcentralConfig.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                  {ringcentralConfig.enabled ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                  )}
                </Badge>
                <Switch
                  checked={ringcentralConfig.enabled}
                  onCheckedChange={(val) => setRingcentralConfig(prev => ({ ...prev, enabled: val }))}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Client ID</Label>
                <Input
                  value={ringcentralConfig.client_id}
                  onChange={(e) => setRingcentralConfig(prev => ({ ...prev, client_id: e.target.value }))}
                  placeholder="Enter Client ID"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Client Secret</Label>
                <Input
                  type="password"
                  value={ringcentralConfig.client_secret}
                  onChange={(e) => setRingcentralConfig(prev => ({ ...prev, client_secret: e.target.value }))}
                  placeholder="Enter Client Secret"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Account ID</Label>
                <Input
                  value={ringcentralConfig.account_id}
                  onChange={(e) => setRingcentralConfig(prev => ({ ...prev, account_id: e.target.value }))}
                  placeholder="Enter Account ID"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Server URL</Label>
                <Input
                  value={ringcentralConfig.server_url}
                  onChange={(e) => setRingcentralConfig(prev => ({ ...prev, server_url: e.target.value }))}
                  placeholder="https://platform.ringcentral.com"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <a href="https://developers.ringcentral.com/my-account.html" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Get API Credentials <ExternalLink className="w-3 h-3" />
              </a>
              <Button onClick={handleSaveRingCentral} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save RingCentral</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialpad */}
        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Dialpad</CardTitle>
                  <p className="text-sm text-slate-400">AI-powered communications</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={dialpadConfig.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                  {dialpadConfig.enabled ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                  )}
                </Badge>
                <Switch
                  checked={dialpadConfig.enabled}
                  onCheckedChange={(val) => setDialpadConfig(prev => ({ ...prev, enabled: val }))}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">API Key</Label>
                <Input
                  type="password"
                  value={dialpadConfig.api_key}
                  onChange={(e) => setDialpadConfig(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="Enter API Key"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Workspace ID</Label>
                <Input
                  value={dialpadConfig.workspace_id}
                  onChange={(e) => setDialpadConfig(prev => ({ ...prev, workspace_id: e.target.value }))}
                  placeholder="Enter Workspace ID"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <a href="https://developers.dialpad.com/docs/getting-started" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Get API Credentials <ExternalLink className="w-3 h-3" />
              </a>
              <Button onClick={handleSaveDialpad} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Dialpad</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
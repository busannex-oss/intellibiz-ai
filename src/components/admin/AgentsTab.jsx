import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AgentsTab() {
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({});
  const [isGeneratingHeadshot, setIsGeneratingHeadshot] = useState(false);
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: () => base44.entities.AIAgent.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AIAgent.create(data),
    onSuccess: () => {
      toast.success('Agent created');
      setFormData({});
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.AIAgent.update(editingAgent.id, data),
    onSuccess: () => {
      toast.success('Agent updated');
      setEditingAgent(null);
      setFormData({});
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AIAgent.delete(id),
    onSuccess: () => {
      toast.success('Agent deleted');
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleGenerateHeadshot = async () => {
    const { first_name, last_name, job_title, personality } = formData;
    if (!first_name) {
      toast.error('Enter agent name first');
      return;
    }
    setIsGeneratingHeadshot(true);
    const prompt = `Professional corporate headshot of ${first_name} ${last_name || ''}, ${job_title || 'Professional'}, personality: ${personality || 'professional'}. High quality, clean background, business attire.`;
    const res = await base44.integrations.Core.GenerateImage({ prompt });
    if (res?.url) {
      setFormData(p => ({ ...p, headshot_url: res.url }));
      toast.success('Headshot generated!');
    }
    setIsGeneratingHeadshot(false);
  };

  const handleSave = () => {
    if (!formData.first_name || !formData.agent_key) {
      toast.error('Name and Agent Key are required');
      return;
    }
    if (editingAgent) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate({ ...formData, is_active: formData.is_active !== false });
    }
  };

  const startEdit = (agent) => {
    setEditingAgent(agent);
    setFormData(agent);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="wizard-card border-0">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                AI Agents Management
              </CardTitle>
              <CardDescription>Create and manage AI agents on the platform</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingAgent(null); setFormData({}); }} className="bg-violet-600 hover:bg-violet-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingAgent ? 'Edit Agent' : 'Create New Agent'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {formData.headshot_url && <img src={formData.headshot_url} alt="Headshot" className="w-32 h-32 rounded-lg object-cover" />}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>First Name *</Label>
                      <Input value={formData.first_name || ''} onChange={e => setFormData(p => ({ ...p, first_name: e.target.value }))} placeholder="Alex" />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input value={formData.last_name || ''} onChange={e => setFormData(p => ({ ...p, last_name: e.target.value }))} placeholder="Rivera" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Age</Label>
                      <Input type="number" value={formData.age || ''} onChange={e => setFormData(p => ({ ...p, age: parseInt(e.target.value) || null }))} />
                    </div>
                    <div>
                      <Label>Agent Key *</Label>
                      <Input value={formData.agent_key || ''} onChange={e => setFormData(p => ({ ...p, agent_key: e.target.value }))} placeholder="brand_sentinel" />
                    </div>
                  </div>

                  <div>
                    <Label>Job Title</Label>
                    <Input value={formData.job_title || ''} onChange={e => setFormData(p => ({ ...p, job_title: e.target.value }))} placeholder="Chief Brand Intelligence Officer" />
                  </div>

                  <div>
                    <Label>Personality</Label>
                    <Textarea value={formData.personality || ''} onChange={e => setFormData(p => ({ ...p, personality: e.target.value }))} placeholder="Analytical, detail-oriented, creative..." className="h-16" />
                  </div>

                  <div>
                    <Label>Responsibilities</Label>
                    <Textarea value={formData.responsibilities || ''} onChange={e => setFormData(p => ({ ...p, responsibilities: e.target.value }))} placeholder="Line-separated responsibilities" className="h-20" />
                  </div>

                  <div>
                    <Label>Headshot URL</Label>
                    <Input value={formData.headshot_url || ''} onChange={e => setFormData(p => ({ ...p, headshot_url: e.target.value }))} placeholder="https://..." />
                    <Button onClick={handleGenerateHeadshot} disabled={isGeneratingHeadshot} className="w-full mt-2" variant="outline">
                      {isGeneratingHeadshot ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Headshot</>}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Active</Label>
                    <Switch checked={formData.is_active !== false} onCheckedChange={v => setFormData(p => ({ ...p, is_active: v }))} />
                  </div>

                  <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-violet-600 hover:bg-violet-700">
                    <Save className="w-4 h-4 mr-2" />{editingAgent ? 'Update Agent' : 'Create Agent'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-3">
            {agents.map(agent => (
              <div key={agent.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {agent.headshot_url && <img src={agent.headshot_url} alt={agent.first_name} className="w-16 h-16 rounded-lg object-cover" />}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{agent.first_name} {agent.last_name || ''}</h3>
                    <p className="text-sm text-slate-600">{agent.agent_key}</p>
                    <p className="text-sm text-slate-500">{agent.job_title || 'No title'}</p>
                    <div className="mt-2 flex gap-2">
                      {agent.is_active && <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>}
                      {!agent.is_active && <Badge className="bg-slate-100 text-slate-600">Inactive</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => startEdit(agent)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Agent</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {formData.headshot_url && <img src={formData.headshot_url} alt="Headshot" className="w-32 h-32 rounded-lg object-cover" />}
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>First Name *</Label>
                            <Input value={formData.first_name || ''} onChange={e => setFormData(p => ({ ...p, first_name: e.target.value }))} />
                          </div>
                          <div>
                            <Label>Last Name</Label>
                            <Input value={formData.last_name || ''} onChange={e => setFormData(p => ({ ...p, last_name: e.target.value }))} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Age</Label>
                            <Input type="number" value={formData.age || ''} onChange={e => setFormData(p => ({ ...p, age: parseInt(e.target.value) || null }))} />
                          </div>
                          <div>
                            <Label>Agent Key *</Label>
                            <Input value={formData.agent_key || ''} onChange={e => setFormData(p => ({ ...p, agent_key: e.target.value }))} />
                          </div>
                        </div>

                        <div>
                          <Label>Job Title</Label>
                          <Input value={formData.job_title || ''} onChange={e => setFormData(p => ({ ...p, job_title: e.target.value }))} />
                        </div>

                        <div>
                          <Label>Personality</Label>
                          <Textarea value={formData.personality || ''} onChange={e => setFormData(p => ({ ...p, personality: e.target.value }))} className="h-16" />
                        </div>

                        <div>
                          <Label>Responsibilities</Label>
                          <Textarea value={formData.responsibilities || ''} onChange={e => setFormData(p => ({ ...p, responsibilities: e.target.value }))} className="h-20" />
                        </div>

                        <div>
                          <Label>Headshot URL</Label>
                          <Input value={formData.headshot_url || ''} onChange={e => setFormData(p => ({ ...p, headshot_url: e.target.value }))} />
                          <Button onClick={handleGenerateHeadshot} disabled={isGeneratingHeadshot} className="w-full mt-2" variant="outline">
                            {isGeneratingHeadshot ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Headshot</>}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Active</Label>
                          <Switch checked={formData.is_active !== false} onCheckedChange={v => setFormData(p => ({ ...p, is_active: v }))} />
                        </div>

                        <Button onClick={handleSave} disabled={updateMutation.isPending} className="w-full bg-violet-600 hover:bg-violet-700">
                          <Save className="w-4 h-4 mr-2" />Update Agent
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="ghost" onClick={() => { if (confirm('Delete this agent?')) deleteMutation.mutate(agent.id); }} className="text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
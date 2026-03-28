import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brain, Edit2, Trash2, Save, X, Plus, Loader2, RefreshCw, Bot, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const AGENT_KEYS = [
  'brand_sentinel','business_assistant','project_manager','graphic_artist',
  'market_intelligence','competitive_intelligence','gap_opportunity',
  'brand_strategy_architect','go_to_market','strategy_auditor',
  'performance_monitor','business_plan_architect','seo_growth_engine',
  'board_advisor','cms_design_guardian','security_sentinel',
  'infrastructure_sentinel','logo_standards_guardian','brand_consistency_guardian',
  'commercial_video_architect','seasonal_newsletter_strategist','advertising_manager',
];

const EMPTY_PROFILE = {
  agent_key: '',
  first_name: '',
  last_name: '',
  age: '',
  job_title: '',
  personality: '',
  responsibilities: '',
  headshot_url: '',
  is_active: true,
};

function AgentCard({ agent, onSave, onDelete }) {
  const [editing, setEditing] = useState(!agent.id);
  const [form, setForm] = useState({ ...agent });
  const [generatingPhoto, setGeneratingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const generateHeadshot = async () => {
    setGeneratingPhoto(true);
    try {
      const prompt = `Professional corporate headshot portrait photograph of a ${form.age || 30}-year-old AI specialist named ${form.first_name || 'Alex'} ${form.last_name || ''}. Job title: ${form.job_title || 'AI Agent'}. Personality: ${form.personality || 'professional, confident'}. Studio lighting, neutral background, business attire, photorealistic, high quality.`;
      const res = await base44.integrations.Core.GenerateImage({ prompt });
      if (res?.url) set('headshot_url', res.url);
      else toast.error('Image generation failed');
    } catch (e) {
      toast.error('Failed to generate headshot');
    }
    setGeneratingPhoto(false);
  };

  const handleSave = async () => {
    if (!form.agent_key || !form.first_name) { toast.error('Agent key and first name are required'); return; }
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Delete agent ${form.first_name} ${form.last_name}?`)) onDelete(agent.id);
  };

  return (
    <Card className="wizard-card border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Headshot area */}
        <div className="relative bg-gradient-to-br from-indigo-100 to-violet-100 h-48 flex items-center justify-center">
          {form.headshot_url ? (
            <img src={form.headshot_url} alt={form.first_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-200 flex items-center justify-center">
              <Bot className="w-12 h-12 text-indigo-500" />
            </div>
          )}
          {editing && (
            <button
              onClick={generateHeadshot}
              disabled={generatingPhoto}
              className="absolute inset-0 w-full h-full bg-black/40 flex flex-col items-center justify-center text-white hover:bg-black/50 transition-all cursor-pointer"
            >
              {generatingPhoto
                ? <><Loader2 className="w-8 h-8 animate-spin mb-2" /><span className="text-sm">Generating...</span></>
                : <><RefreshCw className="w-8 h-8 mb-2" /><span className="text-sm font-medium">Click to Generate Photo</span></>
              }
            </button>
          )}
          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <Badge className={form.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}>
              {form.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {editing ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">First Name *</Label>
                  <Input value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="Alex" />
                </div>
                <div>
                  <Label className="text-xs">Last Name</Label>
                  <Input value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Rivera" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Age</Label>
                  <Input type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="32" min={18} max={99} />
                </div>
                <div>
                  <Label className="text-xs">Agent Key *</Label>
                  {agent.id ? (
                    <Input value={form.agent_key} disabled className="bg-slate-100 text-slate-500 text-xs" />
                  ) : (
                    <select
                      value={form.agent_key}
                      onChange={e => set('agent_key', e.target.value)}
                      className="w-full h-9 px-3 text-sm border border-slate-200 rounded-md bg-white"
                    >
                      <option value="">Select agent...</option>
                      {AGENT_KEYS.map(k => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
                    </select>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-xs">Job Title</Label>
                <Input value={form.job_title} onChange={e => set('job_title', e.target.value)} placeholder="Chief Brand Intelligence Officer" />
              </div>
              <div>
                <Label className="text-xs">Personality</Label>
                <Textarea value={form.personality} onChange={e => set('personality', e.target.value)} placeholder="Analytical, detail-oriented, creative thinker..." className="h-16 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Responsibilities</Label>
                <Textarea value={form.responsibilities} onChange={e => set('responsibilities', e.target.value)} placeholder="Monitors brand consistency, enforces visual standards..." className="h-16 text-sm" />
              </div>
              <div className="flex gap-2 pt-1">
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-violet-600 hover:bg-violet-700 text-sm">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}Save
                </Button>
                {agent.id && (
                  <Button variant="outline" onClick={() => { setForm({ ...agent }); setEditing(false); }} className="text-sm">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{form.first_name} {form.last_name}</h3>
                <p className="text-sm text-violet-600 font-medium">{form.job_title || '—'}</p>
                <p className="text-xs text-slate-400 mt-0.5">{form.agent_key.replace(/_/g, ' ')} · Age {form.age || '—'}</p>
              </div>
              {form.personality && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Personality</p>
                  <p className="text-sm text-slate-600">{form.personality}</p>
                </div>
              )}
              {form.responsibilities && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Responsibilities</p>
                  <p className="text-sm text-slate-600 line-clamp-3">{form.responsibilities}</p>
                </div>
              )}
              <div className="flex gap-2 pt-1 flex-wrap">
                <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="gap-1">
                  <Edit2 className="w-3 h-3" />Edit
                </Button>
                <Link to={`${createPageUrl('AgentMemoryLog')}?agent=${form.agent_key}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Brain className="w-3 h-3" />Memory Log
                  </Button>
                </Link>
                <Button onClick={handleDelete} variant="ghost" size="sm" className="gap-1 text-red-500 hover:bg-red-50 ml-auto">
                  <Trash2 className="w-3 h-3" />Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AgentProfiles() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['aiAgents'],
    queryFn: () => base44.entities.AIAgent.list('-created_date'),
  });

  const saveMutation = useMutation({
    mutationFn: async (form) => {
      const data = { ...form, age: form.age ? parseInt(form.age) : undefined };
      if (form.id) return base44.entities.AIAgent.update(form.id, data);
      return base44.entities.AIAgent.create(data);
    },
    onSuccess: () => { toast.success('Agent profile saved!'); queryClient.invalidateQueries({ queryKey: ['aiAgents'] }); setShowNewForm(false); },
    onError: (e) => toast.error('Save failed: ' + e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AIAgent.delete(id),
    onSuccess: () => { toast.success('Agent deleted'); queryClient.invalidateQueries({ queryKey: ['aiAgents'] }); },
    onError: (e) => toast.error('Delete failed: ' + e.message),
  });

  const isSuperAdmin = currentUser?.role === 'super_admin';

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>;
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md border-red-200">
          <CardContent className="p-12 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Super Admin Only</h2>
            <p className="text-slate-500">Agent Profiles are only accessible to Super Admins.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="w-8 h-8 text-white/80" />
              Agent Profiles
            </h1>
            <p className="text-violet-200 mt-1">Humanize and manage each AI agent's identity, personality & memory</p>
          </div>
          <Button onClick={() => setShowNewForm(true)} className="bg-white text-violet-700 hover:bg-violet-50 gap-2">
            <Plus className="w-4 h-4" />New Agent Profile
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {showNewForm && (
              <AgentCard
                agent={{ ...EMPTY_PROFILE }}
                onSave={(form) => saveMutation.mutateAsync(form).then(() => setShowNewForm(false))}
                onDelete={() => setShowNewForm(false)}
              />
            )}
            {agents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onSave={(form) => saveMutation.mutateAsync(form)}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
            {!showNewForm && agents.length === 0 && (
              <div className="col-span-full text-center py-20">
                <Bot className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-4">No agent profiles yet</p>
                <Button onClick={() => setShowNewForm(true)} className="bg-violet-600 hover:bg-violet-700 gap-2">
                  <Plus className="w-4 h-4" />Create First Agent Profile
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
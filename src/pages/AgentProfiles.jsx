import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit2, Trash2, Save, X, Plus, Loader2, RefreshCw, Bot, Shield, Brain } from 'lucide-react';
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

const EMPTY = {
  agent_key: '', first_name: '', last_name: '', age: '', gender: 'male',
  job_title: '', personality: '', tone: '', education: '', responsibilities: '', headshot_url: '', is_active: true,
};

function AgentCard({ agent, onSave, onDelete, isNew }) {
  const [editing, setEditing] = useState(!!isNew);
  const [form, setForm] = useState({ ...agent });
  const [generatingPhoto, setGeneratingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const generateHeadshot = async () => {
    if (generatingPhoto) return;
    setGeneratingPhoto(true);
    try {
      const genderDesc = form.gender === 'female' ? 'woman' : 'man';
      const age = form.age || 32;
      const name = [form.first_name, form.last_name].filter(Boolean).join(' ') || 'professional';
      const title = form.job_title || 'AI specialist';
      const personality = form.personality || 'professional and confident';
      const prompt = `Professional corporate headshot photograph of a ${age}-year-old ${genderDesc} named ${name}. Job title: ${title}. Personality traits: ${personality}. Crisp studio lighting, neutral grey background, business professional attire, sharp focus on face, photorealistic, LinkedIn-style portrait, high resolution.`;
      const res = await base44.integrations.Core.GenerateImage({ prompt });
      if (res?.url) set('headshot_url', res.url);
      else toast.error('Image generation failed, try again');
    } catch {
      toast.error('Failed to generate headshot');
    }
    setGeneratingPhoto(false);
  };

  const handleSave = async () => {
    if (!form.agent_key || !form.first_name) {
      toast.error('Agent key and first name are required');
      return;
    }
    setSaving(true);
    const data = { ...form, age: form.age ? parseInt(form.age) : undefined };
    await onSave(data);
    setSaving(false);
    if (!isNew) setEditing(false);
  };

  const cancel = () => {
    setForm({ ...agent });
    setEditing(false);
  };

  return (
    <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">

        {/* Headshot */}
        <div
          className="relative h-56 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center overflow-hidden"
          onClick={editing ? generateHeadshot : undefined}
          style={{ cursor: editing ? 'pointer' : 'default' }}
          title={editing ? 'Click to generate a new headshot' : ''}
        >
          {form.headshot_url ? (
            <img src={form.headshot_url} alt="headshot" className="w-full h-full object-cover object-top" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-violet-400">
              <Bot className="w-16 h-16" />
              {editing && <span className="text-xs font-medium text-violet-500">Click to generate headshot</span>}
            </div>
          )}

          {/* Overlay while generating */}
          {generatingPhoto && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
              <Loader2 className="w-10 h-10 animate-spin mb-2" />
              <span className="text-sm font-medium">Generating...</span>
            </div>
          )}

          {/* Click hint overlay when editing and has a photo */}
          {editing && form.headshot_url && !generatingPhoto && (
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <RefreshCw className="w-8 h-8 mb-1" />
              <span className="text-sm font-medium">Click for new photo</span>
            </div>
          )}

          {/* Active badge */}
          <div className="absolute top-3 right-3">
            <Badge className={form.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}>
              {form.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {editing ? (
            <>
              {/* Name row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-slate-500">First Name *</Label>
                  <Input value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="Alex" className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Last Name</Label>
                  <Input value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Rivera" className="h-8 text-sm" />
                </div>
              </div>

              {/* Age + Gender */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-slate-500">Age</Label>
                  <Input type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="32" min={18} max={99} className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Gender</Label>
                  <select
                    value={form.gender}
                    onChange={e => set('gender', e.target.value)}
                    className="w-full h-8 px-2 text-sm border border-slate-200 rounded-md bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                </div>
              </div>

              {/* Agent key */}
              <div>
                <Label className="text-xs text-slate-500">Agent Key *</Label>
                {agent.id ? (
                  <Input value={form.agent_key} disabled className="h-8 text-sm bg-slate-100 text-slate-400" />
                ) : (
                  <select
                    value={form.agent_key}
                    onChange={e => set('agent_key', e.target.value)}
                    className="w-full h-8 px-2 text-sm border border-slate-200 rounded-md bg-white"
                  >
                    <option value="">Select agent...</option>
                    {AGENT_KEYS.map(k => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
                  </select>
                )}
              </div>

              {/* Job title */}
              <div>
                <Label className="text-xs text-slate-500">Job Title</Label>
                <Input value={form.job_title} onChange={e => set('job_title', e.target.value)} placeholder="Chief Brand Intelligence Officer" className="h-8 text-sm" />
              </div>

              {/* Personality */}
              <div>
                <Label className="text-xs text-slate-500">Personality</Label>
                <Textarea value={form.personality} onChange={e => set('personality', e.target.value)} placeholder="Analytical, detail-oriented, creative..." className="h-16 text-sm resize-none" />
              </div>

              {/* Tone */}
              <div>
                <Label className="text-xs text-slate-500">Communication Tone</Label>
                <Textarea value={form.tone || ''} onChange={e => set('tone', e.target.value)} placeholder="Warm and advisory — approachable with actionable guidance" className="h-16 text-sm resize-none" />
              </div>

              {/* Education */}
              <div>
                <Label className="text-xs text-slate-500">Educational Background</Label>
                <Textarea value={form.education || ''} onChange={e => set('education', e.target.value)} placeholder="MBA, Harvard Business School; BA Economics, Duke University" className="h-16 text-sm resize-none" />
              </div>

              {/* Responsibilities */}
              <div>
                <Label className="text-xs text-slate-500">Responsibilities</Label>
                <Textarea value={form.responsibilities} onChange={e => set('responsibilities', e.target.value)} placeholder="Monitors brand consistency, enforces visual standards..." className="h-16 text-sm resize-none" />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-violet-600 hover:bg-violet-700 h-8 text-sm">
                  {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                  Save
                </Button>
                {!isNew && (
                  <Button variant="outline" onClick={cancel} size="sm" className="h-8">
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Name + Title */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{form.first_name} {form.last_name}</h3>
                <p className="text-sm text-violet-600 font-medium">{form.job_title || '—'}</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">
                  {form.agent_key.replace(/_/g, ' ')} · {form.gender} · Age {form.age || '—'}
                </p>
              </div>

              {/* Personality */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Personality</p>
                <p className="text-sm text-slate-600">{form.personality || '—'}</p>
              </div>

              {/* Tone */}
              {form.tone && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Tone</p>
                  <p className="text-sm text-slate-600">{form.tone}</p>
                </div>
              )}

              {/* Education */}
              {form.education && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Education</p>
                  <p className="text-sm text-slate-600">{form.education}</p>
                </div>
              )}

              {/* Responsibilities */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Responsibilities</p>
                <p className="text-sm text-slate-600">{form.responsibilities || '—'}</p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500">Active</span>
                <Switch
                  checked={!!form.is_active}
                  onCheckedChange={async (val) => {
                    const updated = { ...form, is_active: val };
                    setForm(updated);
                    await onSave({ ...agent, is_active: val });
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1 flex-wrap">
                <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="h-8 text-xs gap-1">
                  <Edit2 className="w-3 h-3" />Edit
                </Button>
                <Link to={`${createPageUrl('AgentMemoryLog')}?agent=${form.agent_key}`}>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                    <Brain className="w-3 h-3" />Memory
                  </Button>
                </Link>
                <Button onClick={handleSave} disabled={saving} variant="outline" size="sm" className="h-8 text-xs gap-1 text-violet-600 border-violet-300 hover:bg-violet-50">
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}Save
                </Button>
                <Button onClick={() => onDelete(agent.id)} variant="ghost" size="sm" className="h-8 text-xs gap-1 text-red-500 hover:bg-red-50 ml-auto">
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
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { base44.auth.me().then(setCurrentUser).catch(() => {}); }, []);

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['aiAgents'],
    queryFn: () => base44.entities.AIAgent.list('-created_date'),
  });

  const saveMutation = useMutation({
    mutationFn: async (form) => {
      const { id, ...data } = form;
      if (id) return base44.entities.AIAgent.update(id, data);
      return base44.entities.AIAgent.create(data);
    },
    onSuccess: () => {
      toast.success('Agent saved!');
      queryClient.invalidateQueries({ queryKey: ['aiAgents'] });
      setShowNew(false);
    },
    onError: (e) => toast.error('Save failed: ' + e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AIAgent.delete(id),
    onSuccess: () => { toast.success('Agent deleted'); queryClient.invalidateQueries({ queryKey: ['aiAgents'] }); },
    onError: (e) => toast.error('Delete failed: ' + e.message),
  });

  const isSuperAdmin = ['super_admin', 'admin'].includes(currentUser?.role);

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
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 px-6 py-10">
        <div className="max-w-7xl mx-auto flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">The Team</h1>
            <p className="text-violet-200 mt-1 text-sm">
              Meet your AI team — click a headshot to cycle through photos until you find the right look, then save.
            </p>
          </div>
          <Button onClick={() => setShowNew(true)} disabled={showNew} className="bg-white text-violet-700 hover:bg-violet-50 gap-2 font-semibold">
            <Plus className="w-4 h-4" />Add Team Member
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {showNew && (
              <AgentCard
                key="new"
                agent={{ ...EMPTY }}
                isNew
                onSave={(form) => saveMutation.mutateAsync(form)}
                onDelete={() => setShowNew(false)}
              />
            )}
            {agents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onSave={(form) => saveMutation.mutateAsync(form)}
                onDelete={(id) => {
                  if (confirm(`Delete ${agent.first_name} ${agent.last_name}?`)) deleteMutation.mutate(id);
                }}
              />
            ))}
            {!showNew && agents.length === 0 && (
              <div className="col-span-full text-center py-20">
                <Bot className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-4">No team members yet</p>
                <Button onClick={() => setShowNew(true)} className="bg-violet-600 hover:bg-violet-700 gap-2">
                  <Plus className="w-4 h-4" />Add First Team Member
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
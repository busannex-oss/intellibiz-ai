import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, Trash2, ImageIcon, Loader2, X } from 'lucide-react';

const AGENT_KEYS = [
  'graphic_artist','brand_sentinel','brand_consistency_guardian','cms_design_guardian',
  'logo_standards_guardian','business_assistant','market_intelligence','business_plan_architect',
  'commercial_video_architect','board_advisor','seo_growth_engine','advertising_manager',
  'seasonal_newsletter_strategist','performance_monitor','security_sentinel','project_manager',
  'infrastructure_sentinel','competitive_intelligence','gap_opportunity','brand_strategy_architect','go_to_market'
];

export default function AgentProfiles() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [generatingHeadshot, setGeneratingHeadshot] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    const data = await base44.entities.AIAgent.list('-created_date', 50);
    setAgents(data);
    setLoading(false);
  };

  const startEdit = (agent) => {
    setEditingId(agent.id);
    setEditData({
      first_name: agent.first_name || '',
      last_name: agent.last_name || '',
      job_title: agent.job_title || '',
      age: agent.age || '',
      gender: agent.gender || 'male',
      personality: agent.personality || '',
      tone: agent.tone || '',
      education: agent.education || '',
      responsibilities: agent.responsibilities || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveAgent = async (agent) => {
    setSavingId(agent.id);
    await base44.entities.AIAgent.update(agent.id, editData);
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, ...editData } : a));
    setEditingId(null);
    setEditData({});
    setSavingId(null);
  };

  const deleteAgent = async (agent) => {
    if (!confirm(`Delete ${agent.first_name} ${agent.last_name}? This cannot be undone.`)) return;
    setDeletingId(agent.id);
    await base44.entities.AIAgent.delete(agent.id);
    setAgents(prev => prev.filter(a => a.id !== agent.id));
    setDeletingId(null);
  };

  const generateHeadshot = async (agent) => {
    setGeneratingHeadshot(agent.id);
    const gender = agent.gender || 'male';
    const prompt = `Professional corporate headshot portrait of a ${agent.age || 35}-year-old ${gender} named ${agent.first_name} ${agent.last_name}, working as ${agent.job_title || 'professional'}. ${agent.personality ? `Personality: ${agent.personality}.` : ''} Clean studio background, business professional attire, warm confident smile, high-quality photography, sharp focus, LinkedIn profile style photo.`;
    const result = await base44.integrations.Core.GenerateImage({ prompt });
    await base44.entities.AIAgent.update(agent.id, { headshot_url: result.url });
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, headshot_url: result.url } : a));
    setGeneratingHeadshot(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Agent Team</h1>
          <p className="text-slate-500 mt-1">{agents.length} agents on the platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isEditing={editingId === agent.id}
              editData={editData}
              setEditData={setEditData}
              onEdit={() => startEdit(agent)}
              onSave={() => saveAgent(agent)}
              onCancel={cancelEdit}
              onDelete={() => deleteAgent(agent)}
              onGenerateHeadshot={() => generateHeadshot(agent)}
              isSaving={savingId === agent.id}
              isDeleting={deletingId === agent.id}
              isGenerating={generatingHeadshot === agent.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent, isEditing, editData, setEditData, onEdit, onSave, onCancel, onDelete, onGenerateHeadshot, isSaving, isDeleting, isGenerating }) {
  const field = (key) => isEditing ? editData[key] : agent[key];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Headshot */}
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 h-52 flex items-center justify-center">
        {agent.headshot_url ? (
          <img src={agent.headshot_url} alt={`${agent.first_name} ${agent.last_name}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {(agent.first_name || '?')[0]}{(agent.last_name || '')[0]}
            </span>
          </div>
        )}
        <button
          onClick={onGenerateHeadshot}
          disabled={isGenerating}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all"
        >
          {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
          {isGenerating ? 'Generating...' : agent.headshot_url ? 'Regenerate' : 'Generate Headshot'}
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {isEditing ? (
          <div className="space-y-3 flex-1">
            <div className="grid grid-cols-2 gap-2">
              <Input value={editData.first_name} onChange={e => setEditData(p => ({ ...p, first_name: e.target.value }))} placeholder="First name" className="text-sm" />
              <Input value={editData.last_name} onChange={e => setEditData(p => ({ ...p, last_name: e.target.value }))} placeholder="Last name" className="text-sm" />
            </div>
            <Input value={editData.job_title} onChange={e => setEditData(p => ({ ...p, job_title: e.target.value }))} placeholder="Job title" className="text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" value={editData.age} onChange={e => setEditData(p => ({ ...p, age: e.target.value }))} placeholder="Age" className="text-sm" />
              <select value={editData.gender} onChange={e => setEditData(p => ({ ...p, gender: e.target.value }))} className="text-sm border border-slate-200 rounded-md px-3 py-2 bg-white text-slate-700">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>
            <Textarea value={editData.tone} onChange={e => setEditData(p => ({ ...p, tone: e.target.value }))} placeholder="Tone & communication style" className="text-sm min-h-[60px]" />
            <Textarea value={editData.personality} onChange={e => setEditData(p => ({ ...p, personality: e.target.value }))} placeholder="Personality traits" className="text-sm min-h-[60px]" />
            <Input value={editData.education} onChange={e => setEditData(p => ({ ...p, education: e.target.value }))} placeholder="Education & credentials" className="text-sm" />
          </div>
        ) : (
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-lg leading-tight">
                {agent.first_name} {agent.last_name}
              </h3>
              {agent.is_active && <Badge className="bg-emerald-100 text-emerald-700 text-xs border-0 shrink-0 ml-2">Active</Badge>}
            </div>
            <p className="text-amber-600 font-medium text-sm mb-3">{agent.job_title || '—'}</p>

            {agent.tone && (
              <div className="mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tone</span>
                <p className="text-slate-700 text-sm mt-0.5">{agent.tone}</p>
              </div>
            )}
            {agent.personality && (
              <div className="mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Personality</span>
                <p className="text-slate-700 text-sm mt-0.5">{agent.personality}</p>
              </div>
            )}
            {agent.education && (
              <div className="mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Education</span>
                <p className="text-slate-600 text-xs mt-0.5">{agent.education}</p>
              </div>
            )}
            {agent.age && (
              <p className="text-xs text-slate-400 mt-2">Age {agent.age} · {agent.gender}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          {isEditing ? (
            <>
              <Button onClick={onSave} disabled={isSaving} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm h-9">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                Save
              </Button>
              <Button onClick={onCancel} variant="outline" className="h-9 px-3">
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onEdit} variant="outline" className="flex-1 h-9 text-sm border-slate-200 text-slate-700 hover:bg-slate-50">
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button onClick={onDelete} disabled={isDeleting} variant="outline" className="h-9 px-3 border-red-200 text-red-500 hover:bg-red-50">
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export default function AgentProfileForm({ agent, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...agent, [field]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const arr = [...(agent[field] || [])];
    arr[index] = value;
    onChange({ ...agent, [field]: arr });
  };

  const handleArrayAdd = (field, initialValue = '') => {
    onChange({ ...agent, [field]: [...(agent[field] || []), initialValue] });
  };

  const handleArrayRemove = (field, index) => {
    const arr = [...(agent[field] || [])];
    arr.splice(index, 1);
    onChange({ ...agent, [field]: arr });
  };

  const handleObjectArrayChange = (field, index, subfield, value) => {
    const arr = [...(agent[field] || [])];
    arr[index] = { ...arr[index], [subfield]: value };
    onChange({ ...agent, [field]: arr });
  };

  const handleObjectArrayAdd = (field) => {
    onChange({ ...agent, [field]: [...(agent[field] || []), {}] });
  };

  const handleObjectArrayRemove = (field, index) => {
    const arr = [...(agent[field] || [])];
    arr.splice(index, 1);
    onChange({ ...agent, [field]: arr });
  };

  return (
    <div className="space-y-6">
      {/* I. Agent Identity */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">I. Agent Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input value={agent.first_name || ''} onChange={(e) => handleChange('first_name', e.target.value)} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={agent.last_name || ''} onChange={(e) => handleChange('last_name', e.target.value)} />
            </div>
            <div>
              <Label>Age</Label>
              <Input type="number" value={agent.age || ''} onChange={(e) => handleChange('age', parseInt(e.target.value))} />
            </div>
            <div>
              <Label>Job Title</Label>
              <Input value={agent.job_title || ''} onChange={(e) => handleChange('job_title', e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Mission (1-sentence value statement)</Label>
            <Textarea value={agent.mission || ''} onChange={(e) => handleChange('mission', e.target.value)} placeholder="How does this agent help the business?" />
          </div>
          <div>
            <Label>Core Persona Prompt</Label>
            <Textarea value={agent.core_persona_prompt || ''} onChange={(e) => handleChange('core_persona_prompt', e.target.value)} placeholder="You are [Name], a [adjectives] [Job Title]..." className="h-24" />
          </div>
          <div>
            <Label>Personality</Label>
            <Input value={agent.personality || ''} onChange={(e) => handleChange('personality', e.target.value)} placeholder="e.g., strategic, creative, composed" />
          </div>
          <div>
            <Label>Tone</Label>
            <Input value={agent.tone || ''} onChange={(e) => handleChange('tone', e.target.value)} placeholder="e.g., Warm and advisory" />
          </div>
        </CardContent>
      </Card>

      {/* II. Conversation Flow */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">II. Conversation Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Initial Greeting</Label>
            <Textarea value={agent.initial_greeting || ''} onChange={(e) => handleChange('initial_greeting', e.target.value)} placeholder="Greet warmly, introduce role, ask what to work on" className="h-20" />
          </div>
          <div>
            <Label>Discovery Questions</Label>
            {(agent.discovery_questions || []).map((q, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input value={q} onChange={(e) => handleArrayChange('discovery_questions', idx, e.target.value)} placeholder={`Question ${idx + 1}`} />
                <Button size="sm" variant="ghost" onClick={() => handleArrayRemove('discovery_questions', idx)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => handleArrayAdd('discovery_questions')}>
              <Plus className="w-4 h-4 mr-2" /> Add Question
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* III. Work Instructions */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">III. Work Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Operational Guidelines</Label>
            <Textarea value={agent.operational_guidelines || ''} onChange={(e) => handleChange('operational_guidelines', e.target.value)} placeholder="Rules for processing information, breaking tasks into phases..." className="h-20" />
          </div>
          <div>
            <Label>Deliverables</Label>
            {(agent.deliverables || []).map((d, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input value={d} onChange={(e) => handleArrayChange('deliverables', idx, e.target.value)} placeholder="e.g., Scripts, layouts, plans" />
                <Button size="sm" variant="ghost" onClick={() => handleArrayRemove('deliverables', idx)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => handleArrayAdd('deliverables')}>
              <Plus className="w-4 h-4 mr-2" /> Add Deliverable
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* IV. Collaboration Rules */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">IV. Collaboration Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Primary Partners</Label>
            {(agent.primary_partners || []).map((p, idx) => (
              <div key={idx} className="mb-3 p-3 border rounded-lg">
                <div className="flex gap-2 mb-2">
                  <Input value={p.partner_name || ''} onChange={(e) => handleObjectArrayChange('primary_partners', idx, 'partner_name', e.target.value)} placeholder="Partner agent name" />
                  <Button size="sm" variant="ghost" onClick={() => handleObjectArrayRemove('primary_partners', idx)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea value={p.collaboration_details || ''} onChange={(e) => handleObjectArrayChange('primary_partners', idx, 'collaboration_details', e.target.value)} placeholder="How they work together" className="h-16 text-sm" />
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => handleObjectArrayAdd('primary_partners')}>
              <Plus className="w-4 h-4 mr-2" /> Add Partner
            </Button>
          </div>
          <div>
            <Label>Team Meeting Role</Label>
            <Textarea value={agent.team_meeting_role || ''} onChange={(e) => handleChange('team_meeting_role', e.target.value)} placeholder="Lens or POV this agent brings to planning" className="h-20" />
          </div>
        </CardContent>
      </Card>

      {/* V. Professional Boundaries & Confidentiality */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">V. Professional Boundaries & Confidentiality</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Non-Disclosure Rules</Label>
            <Textarea value={agent.non_disclosure_rules || ''} onChange={(e) => handleChange('non_disclosure_rules', e.target.value)} placeholder="Confidentiality rules and process guidelines..." className="h-20" />
          </div>
        </CardContent>
      </Card>

      {/* VI. Resume / Professional Profile */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">VI. Resume / Professional Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Expertise</Label>
            {(agent.expertise || []).map((e, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input value={e} onChange={(e) => handleArrayChange('expertise', idx, e.target.value)} placeholder="Core competency" />
                <Button size="sm" variant="ghost" onClick={() => handleArrayRemove('expertise', idx)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => handleArrayAdd('expertise')}>
              <Plus className="w-4 h-4 mr-2" /> Add Expertise
            </Button>
          </div>
          <div>
            <Label>Achievements</Label>
            <Textarea value={agent.achievements || ''} onChange={(e) => handleChange('achievements', e.target.value)} placeholder="Years of experience and notable projects" className="h-16" />
          </div>
          <div>
            <Label>Work History</Label>
            {(agent.work_history || []).map((w, idx) => (
              <div key={idx} className="mb-3 p-3 border rounded-lg">
                <div className="flex gap-2 mb-2">
                  <Input value={w.role || ''} onChange={(e) => handleObjectArrayChange('work_history', idx, 'role', e.target.value)} placeholder="Role title" />
                  <Input value={w.dates || ''} onChange={(e) => handleObjectArrayChange('work_history', idx, 'dates', e.target.value)} placeholder="2020-2023" className="w-24" />
                  <Button size="sm" variant="ghost" onClick={() => handleObjectArrayRemove('work_history', idx)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea value={w.responsibilities || ''} onChange={(e) => handleObjectArrayChange('work_history', idx, 'responsibilities', e.target.value)} placeholder="Key responsibilities" className="h-16 text-sm" />
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => handleObjectArrayAdd('work_history')}>
              <Plus className="w-4 h-4 mr-2" /> Add Role
            </Button>
          </div>
          <div>
            <Label>Education & Technical Skills</Label>
            <Textarea value={agent.education || ''} onChange={(e) => handleChange('education', e.target.value)} placeholder="Degree and educational background" className="h-16 mb-3" />
            {(agent.technical_skills || []).map((s, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input value={s} onChange={(e) => handleArrayChange('technical_skills', idx, e.target.value)} placeholder="Technical skill" />
                <Button size="sm" variant="ghost" onClick={() => handleArrayRemove('technical_skills', idx)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => handleArrayAdd('technical_skills')}>
              <Plus className="w-4 h-4 mr-2" /> Add Skill
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* VII. Success Metrics */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">VII. Success Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {(agent.success_metrics || []).map((m, idx) => (
              <div key={idx} className="mb-3 p-3 border rounded-lg">
                <div className="flex gap-2 mb-2">
                  <Input value={m.metric_name || ''} onChange={(e) => handleObjectArrayChange('success_metrics', idx, 'metric_name', e.target.value)} placeholder="Metric name" />
                  <Button size="sm" variant="ghost" onClick={() => handleObjectArrayRemove('success_metrics', idx)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea value={m.metric_description || ''} onChange={(e) => handleObjectArrayChange('success_metrics', idx, 'metric_description', e.target.value)} placeholder="Metric description" className="h-16 text-sm" />
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => handleObjectArrayAdd('success_metrics')}>
              <Plus className="w-4 h-4 mr-2" /> Add Metric
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
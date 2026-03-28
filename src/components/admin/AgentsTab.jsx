import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_AGENTS = [
  { agent_key: 'graphic_artist', first_name: 'Graphic', last_name: 'Artist', job_title: 'Senior Visual QA Director', personality: 'Detail-oriented, critical, constructive', responsibilities: 'Inspects all platform images for publication quality, transparency, composition, and brand alignment', is_active: true },
  { agent_key: 'brand_sentinel', first_name: 'Brand', last_name: 'Sentinel', job_title: 'Brand Consistency Enforcer', personality: 'Rigorous, systematic, authoritative', responsibilities: 'Enforces visual and verbal brand consistency across all touchpoints and outputs', is_active: true },
  { agent_key: 'brand_consistency_guardian', first_name: 'Reliability', last_name: 'Diagnostics', job_title: 'Diagnostic & Reliability Agent', personality: 'Analytical, methodical, user-invoked', responsibilities: 'Identifies errors, inconsistencies, and misconfigurations in the platform', is_active: true },
  { agent_key: 'cms_design_guardian', first_name: 'Theme', last_name: 'Coordinator', job_title: 'Platform Design System Authority', personality: 'Systematic, delegated, compliance-focused', responsibilities: 'Manages platform themes, branding, and design system compliance', is_active: true },
  { agent_key: 'logo_standards_guardian', first_name: 'Logo', last_name: 'Standards Guardian', job_title: 'Logo Asset Authority', personality: 'Precise, standards-driven, quality assurance', responsibilities: 'Ensures every logo meets agency-grade professional standards and transparency requirements', is_active: true },
  { agent_key: 'business_assistant', first_name: 'Business', last_name: 'Assistant', job_title: 'Business Advisor', personality: 'Helpful, strategic, user-focused', responsibilities: 'Provides business strategy, planning guidance, and market positioning advice', is_active: true },
  { agent_key: 'market_intelligence', first_name: 'Market', last_name: 'Intelligence', job_title: 'Research & Insights Analyst', personality: 'Data-driven, analytical, forward-thinking', responsibilities: 'Conducts market research, competitor analysis, and identifies growth opportunities', is_active: true },
  { agent_key: 'business_plan_architect', first_name: 'Business', last_name: 'Plan Architect', job_title: 'Financial Planning Specialist', personality: 'Comprehensive, detailed, investor-focused', responsibilities: 'Generates 30-year business plans with financial projections and strategy', is_active: true },
  { agent_key: 'commercial_video_architect', first_name: 'Commercial', last_name: 'Video Architect', job_title: 'Video Content Strategist', personality: 'Creative, strategic, platform-aware', responsibilities: 'Generates commercial video scripts and production briefs for multiple platforms', is_active: true },
  { agent_key: 'board_advisor', first_name: 'Board', last_name: 'Advisor', job_title: 'Executive Strategy Counselor', personality: 'Strategic, authoritative, experienced', responsibilities: 'Provides C-suite level strategic guidance and business decision analysis', is_active: true },
  { agent_key: 'seo_growth_engine', first_name: 'SEO', last_name: 'Growth Engine', job_title: 'Search Growth Strategist', personality: 'Data-driven, optimization-focused, competitive', responsibilities: 'Conducts keyword research and SEO strategy to outrank competitors', is_active: true },
  { agent_key: 'advertising_manager', first_name: 'Advertising', last_name: 'Manager', job_title: 'Multi-Channel Campaign Manager', personality: 'Strategic, creative, ROI-focused', responsibilities: 'Plans and optimizes advertising campaigns across Google, Meta, LinkedIn, and TikTok', is_active: true },
  { agent_key: 'seasonal_newsletter_strategist', first_name: 'Newsletter', last_name: 'Strategist', job_title: 'Email Content Strategist', personality: 'Creative, strategic, audience-aware', responsibilities: 'Plans and writes branded email newsletters aligned to seasonal campaigns', is_active: true },
  { agent_key: 'performance_monitor', first_name: 'Performance', last_name: 'Monitor', job_title: 'Analytics & Insights Engine', personality: 'Analytical, insightful, data-driven', responsibilities: 'Analyzes metrics to surface insights, detect anomalies, and predict trends', is_active: true },
  { agent_key: 'security_sentinel', first_name: 'Security', last_name: 'Sentinel', job_title: 'Constitutional Authority', personality: 'Vigilant, systematic, immutable', responsibilities: 'Enforces Super Admin policy and platform security protocols', is_active: true },
  { agent_key: 'project_manager', first_name: 'Project', last_name: 'Manager', job_title: 'Platform Command Center', personality: 'Organized, vigilant, compliance-focused', responsibilities: 'Monitors all AI agents and submits daily compliance reports', is_active: true },
];

export default function AgentsTab() {
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: () => base44.entities.AIAgent.list(),
  });



  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AIAgent.delete(id),
    onSuccess: () => {
      toast.success('Agent deleted');
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.AIAgent.bulkCreate(DEFAULT_AGENTS);
    },
    onSuccess: () => {
      toast.success('All agents loaded');
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
    },
    onError: (err) => toast.error('Failed to seed: ' + err.message),
  });



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
              <CardDescription>Team of AI agents on the platform</CardDescription>
            </div>
            {agents.length === 0 && (
              <Button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700">
                {seedMutation.isPending ? 'Loading...' : 'Load All Agents'}
              </Button>
            )}
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
                <Button size="sm" variant="ghost" onClick={() => { if (confirm('Delete this agent?')) deleteMutation.mutate(agent.id); }} className="text-red-500 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
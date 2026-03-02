import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ShieldCheck, AlertTriangle, AlertCircle, Info, CheckCircle2,
  RefreshCw, Loader2, Calendar, TrendingUp, Filter, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const SEVERITY_CONFIG = {
  critical: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle, dot: 'bg-red-500', label: 'Critical' },
  high:     { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle, dot: 'bg-orange-500', label: 'High' },
  medium:   { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Info, dot: 'bg-yellow-500', label: 'Medium' },
  low:      { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Info, dot: 'bg-slate-400', label: 'Low' },
};

const CATEGORY_LABELS = {
  branding: 'Branding',
  color_theme: 'Color Theme',
  typography: 'Typography',
  content: 'Content',
  consistency: 'Consistency',
  professionalism: 'Professionalism',
  audience_alignment: 'Audience Alignment',
  ux: 'UX / Mobile',
  seo: 'SEO',
  mobile: 'Mobile',
};

const CATEGORY_COLORS = {
  branding: 'bg-violet-500',
  color_theme: 'bg-amber-500',
  typography: 'bg-blue-500',
  content: 'bg-emerald-500',
  consistency: 'bg-indigo-500',
  professionalism: 'bg-rose-500',
  audience_alignment: 'bg-teal-500',
  ux: 'bg-orange-500',
  seo: 'bg-cyan-500',
  mobile: 'bg-pink-500',
};

const STATUS_CONFIG = {
  not_ready:    { color: 'bg-red-100 text-red-700', label: 'Not Market Ready', bg: 'from-red-50 to-red-50/50' },
  needs_work:   { color: 'bg-orange-100 text-orange-700', label: 'Needs Work', bg: 'from-orange-50 to-orange-50/50' },
  almost_ready: { color: 'bg-yellow-100 text-yellow-700', label: 'Almost Ready', bg: 'from-yellow-50 to-yellow-50/50' },
  market_ready: { color: 'bg-green-100 text-green-700', label: 'Market Ready ✓', bg: 'from-green-50 to-green-50/50' },
};

function ScoreRing({ score }) {
  const color = score >= 90 ? '#16a34a' : score >= 70 ? '#ca8a04' : score >= 40 ? '#ea580c' : '#dc2626';
  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="10" fill="none" />
        <circle cx="50" cy="50" r="42" stroke={color} strokeWidth="10" fill="none"
          strokeDasharray={`${(score / 100) * 263.9} 263.9`}
          strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">{score}</span>
        <span className="text-xs text-slate-500">/100</span>
      </div>
    </div>
  );
}

function IssueCard({ issue, onResolve }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.medium;
  const Icon = sev.icon;

  return (
    <div className={`rounded-xl border p-4 ${issue.resolved ? 'opacity-50 bg-slate-50' : 'bg-white'} ${issue.resolved ? 'border-slate-200' : sev.color}`}>
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${sev.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-slate-800 text-sm">{issue.title}</span>
            <Badge className={`text-[10px] ${sev.color} border`}>{sev.label}</Badge>
            <Badge className="text-[10px] bg-slate-100 text-slate-600 border-slate-200 border">
              {CATEGORY_LABELS[issue.category] || issue.category}
            </Badge>
            {issue.page_or_component && (
              <Badge className="text-[10px] bg-indigo-50 text-indigo-600 border-indigo-100 border">
                {issue.page_or_component}
              </Badge>
            )}
          </div>
          {expanded && (
            <div className="mt-2 space-y-2 text-sm">
              <p className="text-slate-600">{issue.description}</p>
              <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                <Sparkles className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700"><strong>Fix:</strong> {issue.recommendation}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button size="sm" variant="ghost" onClick={() => setExpanded(v => !v)} className="text-slate-400 p-1">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant={issue.resolved ? 'outline' : 'default'}
            onClick={() => onResolve(issue)}
            className={issue.resolved ? 'text-slate-500' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}
          >
            {issue.resolved ? 'Reopen' : <><CheckCircle2 className="w-3 h-3 mr-1" />Resolve</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BrandAuditTab() {
  const queryClient = useQueryClient();
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('open');
  const [selectedAuditId, setSelectedAuditId] = useState(null);

  const { data: audits = [], isLoading } = useQuery({
    queryKey: ['brandAudits'],
    queryFn: () => base44.entities.BrandAuditLog.list('-audit_date', 30),
  });

  const runAuditMutation = useMutation({
    mutationFn: () => base44.functions.invoke('runBrandAudit', { triggered_by: 'manual' }),
    onSuccess: () => {
      toast.success('Brand audit complete!');
      queryClient.invalidateQueries({ queryKey: ['brandAudits'] });
    },
    onError: (err) => toast.error('Audit failed: ' + err.message),
  });

  const updateAuditMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BrandAuditLog.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brandAudits'] }),
  });

  const activeAudit = selectedAuditId
    ? audits.find(a => a.id === selectedAuditId)
    : audits[0];

  const handleResolve = (issue) => {
    if (!activeAudit) return;
    const updatedIssues = (activeAudit.issues || []).map(i =>
      i.id === issue.id ? { ...i, resolved: !i.resolved } : i
    );
    updateAuditMutation.mutate({ id: activeAudit.id, data: { issues: updatedIssues } });
  };

  const filteredIssues = (activeAudit?.issues || []).filter(issue => {
    const sevMatch = filterSeverity === 'all' || issue.severity === filterSeverity;
    const catMatch = filterCategory === 'all' || issue.category === filterCategory;
    const statMatch = filterStatus === 'all' || (filterStatus === 'open' ? !issue.resolved : issue.resolved);
    return sevMatch && catMatch && statMatch;
  });

  const criticalCount = (activeAudit?.issues || []).filter(i => i.severity === 'critical' && !i.resolved).length;
  const highCount = (activeAudit?.issues || []).filter(i => i.severity === 'high' && !i.resolved).length;
  const resolvedCount = (activeAudit?.issues || []).filter(i => i.resolved).length;
  const totalCount = (activeAudit?.issues || []).length;

  const statusCfg = STATUS_CONFIG[activeAudit?.status] || STATUS_CONFIG.needs_work;

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-violet-600" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-violet-600" />
            Daily Brand Audit Log
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">AI-powered market-readiness evaluation — runs daily at midnight</p>
        </div>
        <div className="flex items-center gap-3">
          {audits.length > 1 && (
            <Select value={selectedAuditId || audits[0]?.id} onValueChange={setSelectedAuditId}>
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Select audit date" />
              </SelectTrigger>
              <SelectContent>
                {audits.map(a => (
                  <SelectItem key={a.id} value={a.id}>
                    {moment(a.audit_date).format('MMM D, YYYY')}
                    {a === audits[0] ? ' (latest)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            onClick={() => runAuditMutation.mutate()}
            disabled={runAuditMutation.isPending}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            {runAuditMutation.isPending
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running Audit...</>
              : <><RefreshCw className="w-4 h-4 mr-2" />Run Audit Now</>}
          </Button>
        </div>
      </div>

      {!activeAudit ? (
        <Card className="wizard-card border-0">
          <CardContent className="py-20 text-center">
            <ShieldCheck className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Audits Yet</h3>
            <p className="text-slate-500 mb-6">Run your first brand audit to get a market-readiness report.</p>
            <Button onClick={() => runAuditMutation.mutate()} disabled={runAuditMutation.isPending}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              {runAuditMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running...</> : <><Sparkles className="w-4 h-4 mr-2" />Run First Audit</>}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Score Overview */}
          <Card className={`wizard-card border-0 bg-gradient-to-br ${statusCfg.bg}`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <ScoreRing score={activeAudit.overall_score || 0} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-bold text-slate-900">
                      {moment(activeAudit.audit_date).format('MMMM D, YYYY')} Audit
                    </h3>
                    <Badge className={statusCfg.color}>{statusCfg.label}</Badge>
                    <Badge className="bg-slate-100 text-slate-600 text-xs capitalize">{activeAudit.triggered_by}</Badge>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{activeAudit.summary}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /><strong className="text-red-600">{criticalCount}</strong><span className="text-slate-500">Critical</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /><strong className="text-orange-600">{highCount}</strong><span className="text-slate-500">High</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><strong className="text-emerald-600">{resolvedCount}/{totalCount}</strong><span className="text-slate-500">Resolved</span></div>
                  </div>
                </div>

                {/* Category scores */}
                {activeAudit.category_scores && (
                  <div className="w-full md:w-72 space-y-2">
                    {Object.entries(activeAudit.category_scores).slice(0, 8).map(([cat, score]) => (
                      <div key={cat} className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-32 flex-shrink-0">{CATEGORY_LABELS[cat] || cat}</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${CATEGORY_COLORS[cat] || 'bg-violet-500'}`}
                            style={{ width: `${Math.min(100, score || 0)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 w-8 text-right">{score}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* History trend */}
          {audits.length > 1 && (
            <Card className="wizard-card border-0">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-slate-900 text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" />Score History</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-end gap-2 h-16">
                  {audits.slice(0, 14).reverse().map((a) => {
                    const h = Math.max(8, (a.overall_score / 100) * 64);
                    const color = a.overall_score >= 90 ? 'bg-emerald-500' : a.overall_score >= 70 ? 'bg-yellow-500' : a.overall_score >= 40 ? 'bg-orange-500' : 'bg-red-500';
                    return (
                      <div key={a.id} className="flex flex-col items-center gap-1 flex-1 cursor-pointer" onClick={() => setSelectedAuditId(a.id)}>
                        <span className="text-[9px] text-slate-400">{a.overall_score}</span>
                        <div className={`w-full rounded-t-sm ${color} ${a.id === (selectedAuditId || audits[0]?.id) ? 'opacity-100 ring-2 ring-violet-400' : 'opacity-60 hover:opacity-80'}`} style={{ height: `${h}px` }} />
                        <span className="text-[9px] text-slate-400">{moment(a.audit_date).format('M/D')}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters + Issues */}
          <Card className="wizard-card border-0">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  Issues ({filteredIssues.length})
                </CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-slate-500">No issues match your filters</p>
                </div>
              ) : (
                ['critical', 'high', 'medium', 'low'].map(sev => {
                  const sevIssues = filteredIssues.filter(i => i.severity === sev);
                  if (!sevIssues.length) return null;
                  return (
                    <div key={sev}>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{SEVERITY_CONFIG[sev].label} ({sevIssues.length})</p>
                      <div className="space-y-2">
                        {sevIssues.map(issue => (
                          <IssueCard key={issue.id} issue={issue} onResolve={handleResolve} />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
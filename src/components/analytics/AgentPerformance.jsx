import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { TrendingUp, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function AgentPerformance() {
  const agentMetrics = useMemo(() => [
    {
      name: 'Brand Consistency Guardian',
      executions: 1247,
      successRate: 98.5,
      avgTime: 2.4,
      status: 'optimal',
      trend: '+12%',
      lastRun: '2 minutes ago'
    },
    {
      name: 'Performance Monitor',
      executions: 3891,
      successRate: 99.2,
      avgTime: 1.8,
      status: 'optimal',
      trend: '+8%',
      lastRun: '1 minute ago'
    },
    {
      name: 'Infrastructure Sentinel',
      executions: 856,
      successRate: 97.1,
      avgTime: 5.2,
      status: 'good',
      trend: '+5%',
      lastRun: '5 minutes ago'
    },
    {
      name: 'SEO Growth Engine',
      executions: 634,
      successRate: 96.8,
      avgTime: 3.1,
      status: 'good',
      trend: '-2%',
      lastRun: '8 minutes ago'
    },
    {
      name: 'Brand Strategy Architect',
      executions: 412,
      successRate: 95.2,
      avgTime: 4.5,
      status: 'caution',
      trend: '-5%',
      lastRun: '15 minutes ago'
    }
  ], []);

  const efficiencyTrend = useMemo(() => [
    { time: '00:00', brand: 98, perf: 99, infra: 97, seo: 97 },
    { time: '04:00', brand: 98.2, perf: 99.1, infra: 96.8, seo: 96.9 },
    { time: '08:00', brand: 98.5, perf: 99.2, infra: 97.1, seo: 96.8 },
    { time: '12:00', brand: 98.8, perf: 99.3, infra: 97.2, seo: 97.1 },
    { time: '16:00', brand: 98.9, perf: 99.4, infra: 97.3, seo: 97.2 },
    { time: '20:00', brand: 98.7, perf: 99.2, infra: 97.1, seo: 96.9 },
  ], []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'optimal': return 'bg-emerald-50 border-emerald-200';
      case 'good': return 'bg-blue-50 border-blue-200';
      case 'caution': return 'bg-amber-50 border-amber-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'optimal': return 'bg-emerald-100 text-emerald-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'caution': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Efficiency Trend */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Agent Efficiency Trend
          </CardTitle>
          <CardDescription>Success rate over the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis domain={[95, 100]} stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value) => `${value.toFixed(1)}%`}
              />
              <Legend />
              <Line type="monotone" dataKey="brand" stroke="#f59e0b" strokeWidth={2} name="Brand Consistency" dot={false} />
              <Line type="monotone" dataKey="perf" stroke="#10b981" strokeWidth={2} name="Performance Monitor" dot={false} />
              <Line type="monotone" dataKey="infra" stroke="#3b82f6" strokeWidth={2} name="Infrastructure" dot={false} />
              <Line type="monotone" dataKey="seo" stroke="#8b5cf6" strokeWidth={2} name="SEO Engine" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Agent Cards */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold text-slate-900">Agent Status & Performance</h3>
        {agentMetrics.map((agent, i) => (
          <Card key={i} className={`border border-slate-200 shadow-lg ${getStatusColor(agent.status)}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-slate-900">{agent.name}</h4>
                    <Badge className={getStatusBadgeColor(agent.status)}>
                      {agent.status === 'optimal' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {agent.status === 'caution' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Last run: {agent.lastRun}</p>
                </div>
                <div className={`text-right ${agent.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                  <p className="text-2xl font-bold">{agent.successRate}%</p>
                  <p className="text-sm font-semibold flex items-center gap-1 justify-end">
                    <TrendingUp className="w-4 h-4" />
                    {agent.trend}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Executions</p>
                  <p className="text-lg font-bold text-slate-900">{agent.executions.toLocaleString()}</p>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Success Rate</p>
                  <p className="text-lg font-bold text-slate-900">{agent.successRate}%</p>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Avg Time</p>
                  <p className="text-lg font-bold text-slate-900">{agent.avgTime}s</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600">Efficiency Score</span>
                  <span className="text-xs font-bold text-slate-900">{agent.successRate}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${agent.successRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Execution Volume by Agent */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Execution Volume</CardTitle>
          <CardDescription>Total executions per agent (last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentMetrics} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis dataKey="name" type="category" stroke="#64748b" style={{ fontSize: '12px' }} width={180} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value) => value.toLocaleString()}
              />
              <Bar dataKey="executions" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
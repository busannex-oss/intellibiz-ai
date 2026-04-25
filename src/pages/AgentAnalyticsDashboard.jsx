import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';

export default function AgentAnalyticsDashboard() {
  const [agents, setAgents] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    loadAgents();
    loadMetrics();
  }, [timeRange]);

  const loadAgents = async () => {
    try {
      const data = await base44.entities.AIAgent.list();
      setAgents(data);
      if (data.length > 0) setSelectedAgent(data[0]);
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await base44.entities.AgentPerformanceMetric.list('-metric_date');
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const getAgentMetrics = (agentId) => {
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return metrics.filter(m => 
      m.agent_id === agentId && 
      new Date(m.metric_date) >= cutoffDate
    ).sort((a, b) => new Date(a.metric_date) - new Date(b.metric_date));
  };

  const getLatestMetric = (agentId) => {
    const agentMetrics = getAgentMetrics(agentId);
    return agentMetrics.length > 0 ? agentMetrics[agentMetrics.length - 1] : null;
  };

  const getSuccessRateData = () => {
    return agents.map(agent => ({
      name: `${agent.first_name} ${agent.last_name}`,
      successRate: getLatestMetric(agent.id)?.success_rate || 0,
      goalAlignment: getLatestMetric(agent.id)?.goal_alignment_score || 0,
      collaboration: getLatestMetric(agent.id)?.collaboration_effectiveness || 0
    }));
  };

  const getPerformanceOverTime = () => {
    if (!selectedAgent) return [];
    const agentMetrics = getAgentMetrics(selectedAgent.id);
    return agentMetrics.map(m => ({
      date: new Date(m.metric_date).toLocaleDateString(),
      successRate: m.success_rate,
      goalAlignment: m.goal_alignment_score,
      clarity: m.clarity_score,
      collaboration: m.collaboration_effectiveness,
      overall: m.overall_performance_score
    }));
  };

  const getRadarData = () => {
    if (!selectedAgent) return [];
    const latest = getLatestMetric(selectedAgent.id);
    if (!latest) return [];

    return [
      { metric: 'Success Rate', value: latest.success_rate },
      { metric: 'Goal Alignment', value: latest.goal_alignment_score },
      { metric: 'Clarity', value: latest.clarity_score },
      { metric: 'Collaboration', value: latest.collaboration_effectiveness },
      { metric: 'Deliverable Quality', value: latest.deliverable_quality },
      { metric: 'Knowledge Retention', value: latest.knowledge_retention }
    ];
  };

  const currentMetric = selectedAgent ? getLatestMetric(selectedAgent.id) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Agent Performance Analytics</h1>
          <p className="text-slate-600">Track success metrics, goal alignment, and collaborative effectiveness across all agents</p>
        </div>

        {/* Time Range Filter */}
        <div className="flex gap-2">
          {['7', '30', '90', '365'].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeRange === days
                  ? 'bg-violet-600 text-white'
                  : 'bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {days === '7' ? '7 Days' : days === '30' ? '30 Days' : days === '90' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>

        {/* Agent Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {agents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    selectedAgent?.id === agent.id
                      ? 'bg-violet-100 border-violet-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-medium text-sm">{agent.first_name}</p>
                  <p className="text-xs text-slate-600">{agent.job_title}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Metrics */}
        {currentMetric && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Success Rate', value: currentMetric.success_rate, suffix: '%' },
              { label: 'Goal Alignment', value: currentMetric.goal_alignment_score, suffix: '%' },
              { label: 'Collaboration', value: currentMetric.collaboration_effectiveness, suffix: '%' },
              { label: 'Overall Score', value: currentMetric.overall_performance_score, suffix: '%' }
            ].map(item => (
              <Card key={item.label}>
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-600 mb-2">{item.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{item.value}{item.suffix}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Performance Over Time */}
        {getPerformanceOverTime().length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getPerformanceOverTime()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="successRate" stroke="#8b5cf6" name="Success Rate" />
                  <Line type="monotone" dataKey="goalAlignment" stroke="#06b6d4" name="Goal Alignment" />
                  <Line type="monotone" dataKey="overall" stroke="#10b981" name="Overall Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Radar Chart for Current Agent */}
        {getRadarData().length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>All Agents Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getSuccessRateData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="successRate" fill="#8b5cf6" name="Success Rate" />
                    <Bar dataKey="goalAlignment" fill="#06b6d4" name="Goal Alignment" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Metrics Table */}
        {metrics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Agent</th>
                    <th className="px-4 py-2 text-center">Success Rate</th>
                    <th className="px-4 py-2 text-center">Goal Alignment</th>
                    <th className="px-4 py-2 text-center">Collaboration</th>
                    <th className="px-4 py-2 text-center">Clarity</th>
                    <th className="px-4 py-2 text-center">Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map(agent => {
                    const latest = getLatestMetric(agent.id);
                    return (
                      <tr key={agent.id} className="border-b hover:bg-slate-50">
                        <td className="px-4 py-2">{agent.first_name} {agent.last_name}</td>
                        <td className="px-4 py-2 text-center text-slate-700">{latest?.success_rate || '-'}%</td>
                        <td className="px-4 py-2 text-center text-slate-700">{latest?.goal_alignment_score || '-'}%</td>
                        <td className="px-4 py-2 text-center text-slate-700">{latest?.collaboration_effectiveness || '-'}%</td>
                        <td className="px-4 py-2 text-center text-slate-700">{latest?.clarity_score || '-'}%</td>
                        <td className="px-4 py-2 text-center font-medium text-slate-900">{latest?.overall_performance_score || '-'}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
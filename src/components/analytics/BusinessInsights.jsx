import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function BusinessInsights() {
  const conversionFunnelData = useMemo(() => [
    { stage: 'Visitors', count: 12500, percentage: 100 },
    { stage: 'Page Views', count: 8734, percentage: 69.8 },
    { stage: 'Leads', count: 2456, percentage: 19.7 },
    { stage: 'Conversions', count: 892, percentage: 7.1 },
  ], []);

  const engagementData = useMemo(() => [
    { metric: 'High Engagement', value: 45, fill: '#10b981' },
    { metric: 'Medium Engagement', value: 35, fill: '#f59e0b' },
    { metric: 'Low Engagement', value: 20, fill: '#ef4444' },
  ], []);

  const performanceTrend = useMemo(() => [
    { week: 'Week 1', conversions: 180, avgOrderValue: 245 },
    { week: 'Week 2', conversions: 220, avgOrderValue: 278 },
    { week: 'Week 3', conversions: 195, avgOrderValue: 256 },
    { week: 'Week 4', conversions: 280, avgOrderValue: 312 },
    { week: 'Week 5', conversions: 350, avgOrderValue: 385 },
  ], []);

  const keyInsights = useMemo(() => [
    {
      title: 'Conversion Rate Improvement',
      value: '+18.5%',
      description: 'Compared to last month',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Peak Traffic Time',
      value: '2-4 PM',
      description: 'Optimal time for campaigns',
      trend: 'info',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Target Audience Match',
      value: '87%',
      description: 'Message-audience alignment',
      trend: 'info',
      icon: Target,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'System Efficiency',
      value: '98.2%',
      description: 'Agent performance combined',
      trend: 'up',
      icon: Zap,
      color: 'from-amber-500 to-amber-600'
    },
  ], []);

  const insights = useMemo(() => [
    {
      title: 'Mobile Traffic Increasing',
      description: 'Mobile visitors account for 68% of total traffic, showing strong mobile preference',
      action: 'Optimize mobile experience',
      priority: 'high'
    },
    {
      title: 'Content Performance Peak',
      description: 'Blog content converts 3.2x better than product pages this week',
      action: 'Increase blog content creation',
      priority: 'medium'
    },
    {
      title: 'Abandoned Cart Opportunity',
      description: '$34,500 in potential revenue from abandoned carts',
      action: 'Launch retargeting campaign',
      priority: 'high'
    },
    {
      title: 'Seasonal Trend Detected',
      description: 'Q2 historically outperforms other quarters by 45%',
      action: 'Plan Q2 campaign in advance',
      priority: 'medium'
    },
  ], []);

  return (
    <div className="space-y-6">
      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyInsights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <Card key={i} className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-slate-600 font-medium">{insight.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{insight.value}</p>
                <p className="text-xs text-slate-500 mt-1">{insight.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Conversion Funnel */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Conversion Funnel Analysis</CardTitle>
          <CardDescription>User journey from visitor to conversion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionFunnelData.map((stage, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-800">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">{stage.count.toLocaleString()}</span>
                    <Badge className="bg-blue-100 text-blue-800">{stage.percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${stage.percentage}%` }}
                  >
                    {stage.percentage > 10 && (
                      <span className="text-xs font-bold text-white">{stage.percentage}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-1">💡 Insight</p>
            <p className="text-sm text-blue-800">
              Drop-off rate from leads to conversions is 63.8%. Implement targeted follow-up sequences to improve conversion efficiency.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Engagement & Performance */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Engagement Distribution */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold">User Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Performance */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Weekly Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="conversions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Insights */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Actionable Insights & Recommendations</CardTitle>
          <CardDescription>Based on data analysis by Intelligence Agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div key={i} className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                  </div>
                  <Badge className={insight.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}>
                    {insight.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                  </Badge>
                </div>
                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-700">
                    ➜ {insight.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, Users, 
  Target, AlertTriangle, Lightbulb, Sparkles, Loader2, Calendar
} from 'lucide-react';
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PerformanceReports() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [reportParams, setReportParams] = useState({
    report_type: 'monthly',
    period_start: '',
    period_end: ''
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['reports', projectId],
    queryFn: () => base44.entities.PerformanceReport.filter({ project_id: projectId }, '-created_date'),
    enabled: !!projectId
  });

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.BusinessProject.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  const generateReportMutation = useMutation({
    mutationFn: async (params) => {
      setGenerating(true);
      
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a comprehensive ${params.report_type} business performance report for ${project?.business_name} (${project?.industry}).

Period: ${params.period_start} to ${params.period_end}

Based on typical ${project?.industry} business metrics, provide:

1. Realistic performance metrics:
   - Revenue estimate
   - Expenses estimate  
   - Profit/loss
   - Customer metrics (total, new, churn rate)
   - Conversion rate
   - Average order value

2. AI-powered insights:
   - Executive summary (2-3 sentences)
   - Key opportunities (3-5 actionable items)
   - Potential risks (3-5 concerns)
   - Strategic recommendations (5-7 specific actions)

3. Predictive analytics:
   - Next month revenue prediction
   - Next quarter growth percentage prediction
   - Overall trend direction (growing/stable/declining)

Be specific, data-driven, and actionable.`,
        response_json_schema: {
          type: "object",
          properties: {
            metrics: {
              type: "object",
              properties: {
                revenue: { type: "number" },
                expenses: { type: "number" },
                profit: { type: "number" },
                customer_count: { type: "number" },
                new_customers: { type: "number" },
                churn_rate: { type: "number" },
                avg_order_value: { type: "number" },
                conversion_rate: { type: "number" }
              }
            },
            ai_insights: {
              type: "object",
              properties: {
                summary: { type: "string" },
                opportunities: { type: "array", items: { type: "string" } },
                risks: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                predictions: {
                  type: "object",
                  properties: {
                    next_month_revenue: { type: "number" },
                    next_quarter_growth: { type: "number" },
                    trend_direction: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });

      return base44.entities.PerformanceReport.create({
        project_id: projectId,
        ...params,
        ...aiResponse,
        status: 'generated'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reports', projectId]);
      setGenerating(false);
      toast.success('Performance report generated!');
    },
    onError: () => {
      setGenerating(false);
      toast.error('Failed to generate report');
    }
  });

  const latestReport = reports[0];

  const chartData = reports.slice(0, 6).reverse().map(r => ({
    period: new Date(r.period_start).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    revenue: r.metrics?.revenue || 0,
    expenses: r.metrics?.expenses || 0,
    profit: r.metrics?.profit || 0
  }));

  const customerChartData = reports.slice(0, 6).reverse().map(r => ({
    period: new Date(r.period_start).toLocaleDateString('en-US', { month: 'short' }),
    total: r.metrics?.customer_count || 0,
    new: r.metrics?.new_customers || 0
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-violet-600" />
              Performance Reports & Analytics
            </h1>
            <p className="text-slate-500">{project?.business_name}</p>
          </div>

          <div className="flex gap-2">
            <Select value={reportParams.report_type} onValueChange={(v) => setReportParams({ ...reportParams, report_type: v })}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={reportParams.period_start}
              onChange={(e) => setReportParams({ ...reportParams, period_start: e.target.value })}
              className="w-40"
            />
            <Input
              type="date"
              value={reportParams.period_end}
              onChange={(e) => setReportParams({ ...reportParams, period_end: e.target.value })}
              className="w-40"
            />
            <Button
              onClick={() => generateReportMutation.mutate(reportParams)}
              disabled={!reportParams.period_start || !reportParams.period_end || generating}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" />Generate Report</>
              )}
            </Button>
          </div>
        </div>

        {latestReport && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-500">Revenue</p>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    ${latestReport.metrics?.revenue?.toLocaleString()}
                  </p>
                  {latestReport.ai_insights?.predictions?.trend_direction === 'growing' && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Growing</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-500">Profit</p>
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    ${latestReport.metrics?.profit?.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {((latestReport.metrics?.profit / latestReport.metrics?.revenue) * 100).toFixed(1)}% margin
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-500">Customers</p>
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    {latestReport.metrics?.customer_count?.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    +{latestReport.metrics?.new_customers} new
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-500">Conversion</p>
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    {latestReport.metrics?.conversion_rate?.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    ${latestReport.metrics?.avg_order_value?.toFixed(0)} AOV
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Performance Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={customerChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#7c3aed" />
                        <Bar dataKey="new" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed">{latestReport.ai_insights?.summary}</p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-emerald-200 bg-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-900">
                        <Lightbulb className="w-5 h-5" />
                        Growth Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {latestReport.ai_insights?.opportunities?.map((opp, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-emerald-900">
                            <span className="text-emerald-600 mt-0.5">✓</span>
                            {opp}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-900">
                        <AlertTriangle className="w-5 h-5" />
                        Potential Risks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {latestReport.ai_insights?.risks?.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                            <span className="text-red-600 mt-0.5">⚠</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Strategic Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {latestReport.ai_insights?.recommendations?.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-slate-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="predictions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      AI-Powered Predictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <p className="text-sm text-blue-600 uppercase tracking-wide mb-2">Next Month</p>
                        <p className="text-3xl font-bold text-blue-900 mb-1">
                          ${latestReport.ai_insights?.predictions?.next_month_revenue?.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700">Projected Revenue</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                        <p className="text-sm text-emerald-600 uppercase tracking-wide mb-2">Next Quarter</p>
                        <p className="text-3xl font-bold text-emerald-900 mb-1">
                          {latestReport.ai_insights?.predictions?.next_quarter_growth?.toFixed(1)}%
                        </p>
                        <p className="text-sm text-emerald-700">Growth Rate</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                        <p className="text-sm text-purple-600 uppercase tracking-wide mb-2">Trend</p>
                        <p className="text-3xl font-bold text-purple-900 mb-1 capitalize">
                          {latestReport.ai_insights?.predictions?.trend_direction}
                        </p>
                        <p className="text-sm text-purple-700">Direction</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="capitalize">{report.report_type} Report</CardTitle>
                          <p className="text-sm text-slate-500">
                            {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">
                            ${report.metrics?.revenue?.toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-500">Revenue</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Profit</p>
                          <p className="font-bold text-slate-800">${report.metrics?.profit?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Customers</p>
                          <p className="font-bold text-slate-800">{report.metrics?.customer_count}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">New Customers</p>
                          <p className="font-bold text-emerald-600">+{report.metrics?.new_customers}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Conversion</p>
                          <p className="font-bold text-slate-800">{report.metrics?.conversion_rate?.toFixed(1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!latestReport && reports.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No performance reports yet</p>
              <p className="text-sm text-slate-400 mb-6">Generate your first AI-powered business report</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
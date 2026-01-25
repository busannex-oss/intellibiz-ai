import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function ConversionChart({ data }) {
  const funnelData = useMemo(() => {
    const pageViews = data.filter(d => d.metric_type === 'page_view').length;
    const leads = data.filter(d => d.metric_type === 'lead_generated').length;
    const conversions = data.filter(d => d.metric_type === 'conversion').length;

    return [
      { 
        stage: 'Visitors', 
        count: pageViews, 
        percentage: 100,
        color: '#3b82f6'
      },
      { 
        stage: 'Leads', 
        count: leads, 
        percentage: pageViews > 0 ? ((leads / pageViews) * 100).toFixed(1) : 0,
        color: '#10b981'
      },
      { 
        stage: 'Conversions', 
        count: conversions, 
        percentage: leads > 0 ? ((conversions / leads) * 100).toFixed(1) : 0,
        color: '#8b5cf6'
      }
    ];
  }, [data]);

  const conversionsByType = useMemo(() => {
    const types = {};
    data.filter(d => d.metric_type === 'conversion').forEach(item => {
      const type = item.metadata?.type || 'Other';
      types[type] = (types[type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="grid gap-4">
      {/* Funnel Visualization */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold" style={{ letterSpacing: '-0.025em' }}>Conversion Funnel</CardTitle>
          <CardDescription>Track user journey from visitor to conversion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-semibold text-slate-800">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-slate-900">{stage.count}</span>
                    <span className="text-sm text-slate-600 min-w-[60px] text-right">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
                <div className="relative h-16 bg-slate-100 rounded-lg overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 flex items-center justify-center text-white font-semibold"
                    style={{ 
                      width: `${stage.percentage}%`,
                      backgroundColor: stage.color
                    }}
                  >
                    {stage.percentage > 15 && `${stage.percentage}%`}
                  </div>
                </div>
                {index < funnelData.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversions by Type */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold" style={{ letterSpacing: '-0.025em' }}>Conversions by Type</CardTitle>
        </CardHeader>
        <CardContent>
          {conversionsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {conversionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No conversion data available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
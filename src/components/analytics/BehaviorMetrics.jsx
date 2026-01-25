import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ScrollText, Clock, MousePointer } from 'lucide-react';

export default function BehaviorMetrics({ data }) {
  const scrollDepthData = useMemo(() => {
    const scrollEvents = data.filter(d => d.metric_type === 'scroll_depth' && d.value);
    const ranges = { '0-25%': 0, '25-50%': 0, '50-75%': 0, '75-100%': 0 };
    
    scrollEvents.forEach(event => {
      const depth = event.value;
      if (depth <= 25) ranges['0-25%']++;
      else if (depth <= 50) ranges['25-50%']++;
      else if (depth <= 75) ranges['50-75%']++;
      else ranges['75-100%']++;
    });

    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  }, [data]);

  const timeOnPageData = useMemo(() => {
    const timeEvents = data.filter(d => d.metric_type === 'time_on_page' && d.value);
    const ranges = { '0-30s': 0, '30-60s': 0, '1-3min': 0, '3-5min': 0, '5min+': 0 };
    
    timeEvents.forEach(event => {
      const time = event.value;
      if (time <= 30) ranges['0-30s']++;
      else if (time <= 60) ranges['30-60s']++;
      else if (time <= 180) ranges['1-3min']++;
      else if (time <= 300) ranges['3-5min']++;
      else ranges['5min+']++;
    });

    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  }, [data]);

  const clickData = useMemo(() => {
    const clicks = data.filter(d => d.metric_type === 'button_click');
    const clickMap = {};
    
    clicks.forEach(click => {
      const element = click.metadata?.element || 'Unknown';
      clickMap[element] = (clickMap[element] || 0) + 1;
    });

    return Object.entries(clickMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, [data]);

  const avgScrollDepth = useMemo(() => {
    const scrollEvents = data.filter(d => d.metric_type === 'scroll_depth' && d.value);
    if (scrollEvents.length === 0) return 0;
    return Math.round(scrollEvents.reduce((sum, e) => sum + e.value, 0) / scrollEvents.length);
  }, [data]);

  const avgTimeOnPage = useMemo(() => {
    const timeEvents = data.filter(d => d.metric_type === 'time_on_page' && d.value);
    if (timeEvents.length === 0) return 0;
    return Math.round(timeEvents.reduce((sum, e) => sum + e.value, 0) / timeEvents.length);
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <ScrollText className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-600">Avg. Scroll Depth</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{avgScrollDepth}%</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-600">Avg. Time on Page</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{avgTimeOnPage}s</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-600">Total Clicks</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {data.filter(d => d.metric_type === 'button_click').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold" style={{ letterSpacing: '-0.025em' }}>Scroll Depth Distribution</CardTitle>
            <CardDescription>How far users scroll on your pages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scrollDepthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold" style={{ letterSpacing: '-0.025em' }}>Time on Page Distribution</CardTitle>
            <CardDescription>How long users spend on your pages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={timeOnPageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Click Heatmap */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold" style={{ letterSpacing: '-0.025em' }}>Most Clicked Elements</CardTitle>
          <CardDescription>Top interactions by users</CardDescription>
        </CardHeader>
        <CardContent>
          {clickData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clickData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No click data available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
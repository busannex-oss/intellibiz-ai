import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, eachDayOfInterval, startOfDay } from 'date-fns';

export default function TrafficChart({ data, dateRange }) {
  const chartData = useMemo(() => {
    const days = eachDayOfInterval({ start: dateRange.from, to: dateRange.to });
    
    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayData = data.filter(d => {
        const itemDate = startOfDay(new Date(d.created_date));
        return itemDate.getTime() === dayStart.getTime();
      });

      const pageViews = dayData.filter(d => d.metric_type === 'page_view').length;
      const leads = dayData.filter(d => d.metric_type === 'lead_generated').length;
      const conversions = dayData.filter(d => d.metric_type === 'conversion').length;

      return {
        date: format(day, 'MMM d'),
        pageViews,
        leads,
        conversions
      };
    });
  }, [data, dateRange]);

  const deviceData = useMemo(() => {
    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    data.forEach(item => {
      if (item.device_type) {
        devices[item.device_type] = (devices[item.device_type] || 0) + 1;
      }
    });
    return Object.entries(devices).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [data]);

  const referrerData = useMemo(() => {
    const referrers = {};
    data.forEach(item => {
      if (item.referrer) {
        const source = item.referrer === '(direct)' ? 'Direct' : new URL(item.referrer).hostname;
        referrers[source] = (referrers[source] || 0) + 1;
      }
    });
    return Object.entries(referrers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="grid gap-4">
      {/* Main Traffic Chart */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold" style={{ letterSpacing: '-0.025em' }}>Traffic Over Time</CardTitle>
          <CardDescription>Page views, leads, and conversions by day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="pageViews" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPageViews)" name="Page Views" />
              <Area type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" name="Leads" />
              <Area type="monotone" dataKey="conversions" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorConversions)" name="Conversions" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device & Referrer Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold" style={{ letterSpacing: '-0.025em' }}>Traffic by Device</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deviceData}>
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
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold" style={{ letterSpacing: '-0.025em' }}>Top Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={referrerData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" style={{ fontSize: '12px' }} width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
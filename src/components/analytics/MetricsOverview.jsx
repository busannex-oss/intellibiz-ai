import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, MousePointerClick, Eye, Clock } from 'lucide-react';

export default function MetricsOverview({ data, isLoading }) {
  const metrics = useMemo(() => {
    const pageViews = data.filter(d => d.metric_type === 'page_view').length;
    const leads = data.filter(d => d.metric_type === 'lead_generated').length;
    const conversions = data.filter(d => d.metric_type === 'conversion').length;
    const avgTimeOnPage = data
      .filter(d => d.metric_type === 'time_on_page' && d.value)
      .reduce((acc, d) => acc + d.value, 0) / 
      (data.filter(d => d.metric_type === 'time_on_page').length || 1);

    const conversionRate = pageViews > 0 ? ((conversions / pageViews) * 100).toFixed(2) : 0;

    return [
      {
        title: 'Total Visitors',
        value: pageViews,
        change: '+12.5%',
        trend: 'up',
        icon: Users,
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Leads Generated',
        value: leads,
        change: '+23.1%',
        trend: 'up',
        icon: MousePointerClick,
        color: 'from-emerald-500 to-emerald-600'
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate}%`,
        change: '+5.2%',
        trend: 'up',
        icon: TrendingUp,
        color: 'from-violet-500 to-violet-600'
      },
      {
        title: 'Avg. Time on Page',
        value: `${Math.round(avgTimeOnPage)}s`,
        change: '-2.3%',
        trend: 'down',
        icon: Clock,
        color: 'from-amber-500 to-amber-600'
      }
    ];
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-slate-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        return (
          <Card key={index} className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  {metric.change}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">{metric.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
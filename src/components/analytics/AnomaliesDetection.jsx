import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, TrendingDown, Zap, Activity } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function AnomaliesDetection() {
  const anomalies = useMemo(() => [
    {
      id: 1,
      type: 'performance_dip',
      title: 'Performance Monitor Efficiency Drop',
      description: 'Success rate dropped from 99.2% to 97.8% in the last 4 hours',
      severity: 'high',
      detected: '45 minutes ago',
      impact: 'High',
      suggestedAction: 'Review recent code changes and database performance',
      status: 'active'
    },
    {
      id: 2,
      type: 'unusual_spike',
      title: 'Unusual API Spike Detected',
      description: 'API requests increased by 340% compared to normal baseline',
      severity: 'medium',
      detected: '2 hours ago',
      impact: 'Medium',
      suggestedAction: 'Investigate if scheduled batch processing started early',
      status: 'investigating'
    },
    {
      id: 3,
      type: 'execution_delay',
      title: 'Agent Execution Delays',
      description: 'SEO Growth Engine average response time increased from 3.1s to 8.7s',
      severity: 'medium',
      detected: '1 hour ago',
      impact: 'Medium',
      suggestedAction: 'Check resource utilization and optimize queries',
      status: 'acknowledged'
    },
    {
      id: 4,
      type: 'error_rate_increase',
      title: 'Error Rate Increase',
      description: 'Brand Strategy Architect error rate up 8.3% - possible data validation issue',
      severity: 'low',
      detected: '30 minutes ago',
      impact: 'Low',
      suggestedAction: 'Review error logs and validate input data format',
      status: 'monitoring'
    }
  ], []);

  const anomalyTrendData = useMemo(() => [
    { time: '00:00', baseline: 100, actual: 101 },
    { time: '04:00', baseline: 100, actual: 98 },
    { time: '08:00', baseline: 100, actual: 102 },
    { time: '12:00', baseline: 100, actual: 145 },
    { time: '16:00', baseline: 100, actual: 142 },
    { time: '20:00', baseline: 100, actual: 103 },
  ], []);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      case 'low': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-orange-100 text-orange-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'monitoring': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'performance_dip': return <TrendingDown className="w-5 h-5" />;
      case 'unusual_spike': return <Activity className="w-5 h-5" />;
      case 'execution_delay': return <Zap className="w-5 h-5" />;
      case 'error_rate_increase': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Anomaly Trend Chart */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            System Behavior Analysis
          </CardTitle>
          <CardDescription>Actual vs baseline performance (last 24 hours)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={anomalyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <ReferenceLine y={100} stroke="#cbd5e1" strokeDasharray="5 5" label="Baseline" />
              <Line type="monotone" dataKey="baseline" stroke="#cbd5e1" strokeWidth={2} name="Baseline" dot={false} />
              <Line type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={2} name="Actual" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detected Anomalies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Detected Anomalies ({anomalies.length})
          </h3>
          <div className="flex gap-2">
            <Badge className="bg-red-100 text-red-800">Active: {anomalies.filter(a => a.status === 'active').length}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          {anomalies.map((anomaly) => (
            <Card key={anomaly.id} className={`border ${getSeverityColor(anomaly.severity)}`}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    anomaly.severity === 'high' ? 'bg-red-100 text-red-600' :
                    anomaly.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {getIcon(anomaly.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{anomaly.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{anomaly.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Badge className={getSeverityBadgeColor(anomaly.severity)}>
                          {anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1)}
                        </Badge>
                        <Badge className={getStatusBadgeColor(anomaly.status)}>
                          {anomaly.status.charAt(0).toUpperCase() + anomaly.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-white/50 rounded-lg">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Detected</p>
                        <p className="font-medium text-slate-900">{anomaly.detected}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Impact</p>
                        <p className="font-medium text-slate-900">{anomaly.impact}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Suggested Action</p>
                        <p className="font-medium text-slate-900 text-sm">{anomaly.suggestedAction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-2">Total Anomalies (24h)</p>
            <p className="text-3xl font-bold text-slate-900">{anomalies.length}</p>
            <p className="text-xs text-red-600 mt-2">↑ 3 new in last hour</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-2">Critical Issues</p>
            <p className="text-3xl font-bold text-red-600">{anomalies.filter(a => a.severity === 'high').length}</p>
            <p className="text-xs text-red-600 mt-2">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-2">Detection Accuracy</p>
            <p className="text-3xl font-bold text-slate-900">98.7%</p>
            <p className="text-xs text-emerald-600 mt-2">Low false positive rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
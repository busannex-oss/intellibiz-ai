import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrendingUp, Users, MousePointerClick, Clock, Eye, Download, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import MetricsOverview from '../components/analytics/MetricsOverview';
import TrafficChart from '../components/analytics/TrafficChart';
import ConversionChart from '../components/analytics/ConversionChart';
import BehaviorMetrics from '../components/analytics/BehaviorMetrics';
import AgentPerformance from '../components/analytics/AgentPerformance';
import AnomaliesDetection from '../components/analytics/AnomaliesDetection';
import BusinessInsights from '../components/analytics/BusinessInsights';

export default function Analytics() {
  const [selectedProject, setSelectedProject] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [timeframe, setTimeframe] = useState('30d');
  const [activeView, setActiveView] = useState('overview');

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.BusinessProject.list()
  });

  const { data: analyticsData = [], isLoading } = useQuery({
    queryKey: ['analytics', selectedProject, dateRange],
    queryFn: async () => {
      const query = selectedProject !== 'all' ? { project_id: selectedProject } : {};
      return base44.entities.Analytics.list();
    }
  });

  const filteredData = useMemo(() => {
    return analyticsData.filter(item => {
      const itemDate = new Date(item.created_date);
      return itemDate >= startOfDay(dateRange.from) && itemDate <= endOfDay(dateRange.to);
    });
  }, [analyticsData, dateRange]);

  const handleTimeframeChange = (value) => {
    setTimeframe(value);
    const now = new Date();
    switch (value) {
      case '7d':
        setDateRange({ from: subDays(now, 7), to: now });
        break;
      case '30d':
        setDateRange({ from: subDays(now, 30), to: now });
        break;
      case '90d':
        setDateRange({ from: subDays(now, 90), to: now });
        break;
      case 'custom':
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ letterSpacing: '-0.025em' }}>
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 mt-1" style={{ letterSpacing: '-0.011em', lineHeight: '1.7' }}>
              Track performance, conversions, and user behavior in real-time
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeframe} onValueChange={handleTimeframeChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>

              {timeframe === 'custom' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => range && setDateRange(range)}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metrics Overview */}
        <MetricsOverview data={filteredData} isLoading={isLoading} />

        {/* Main View Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agent Performance</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies & Alerts</TabsTrigger>
            <TabsTrigger value="insights">Business Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Tabs defaultValue="traffic" className="space-y-4">
              <TabsList className="bg-white border border-slate-200 p-1">
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
                <TabsTrigger value="conversions">Conversions</TabsTrigger>
                <TabsTrigger value="behavior">Behavior</TabsTrigger>
              </TabsList>

              <TabsContent value="traffic" className="space-y-4">
                <TrafficChart data={filteredData} dateRange={dateRange} />
              </TabsContent>

              <TabsContent value="conversions" className="space-y-4">
                <ConversionChart data={filteredData} />
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4">
                <BehaviorMetrics data={filteredData} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <AgentPerformance />
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-4">
            <AnomaliesDetection />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <BusinessInsights />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
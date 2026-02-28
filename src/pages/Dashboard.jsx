import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WelcomeTour from '@/components/onboarding/WelcomeTour';
import OnboardingChecklist from '@/components/onboarding/OnboardingChecklist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Briefcase, 
  FileBarChart, 
  Wand2, 
  Globe2, 
  Megaphone,
  ChevronRight,
  Calendar,
  MoreVertical,
  Trash2,
  Eye,
  Radar,
  FileDown,
  BookText,
  Loader2,
  Zap,
  TrendingUp,
  DollarSign,
  Package,
  Activity,
  PieChart,
  BarChart3,
  Target,
  Image as ImageIcon,
  Phone,
  Palette,
  Settings,
  Video,
  Search,
  Map as MapIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import BrandingKitDocument from '@/components/report/BrandingKitDocument';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [generatingKit, setGeneratingKit] = useState(null);
  const brandingKitRef = useRef(null);
  const [brandingKitProject, setBrandingKitProject] = useState(null);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const allProjects = await base44.entities.BusinessProject.list('-created_date');
      // Cache optimization: only fetch essential data
      return allProjects;
    },
    staleTime: 30000, // Cache for 30 seconds
    cacheTime: 300000 // Keep in cache for 5 minutes
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BusinessProject.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    }
  });

  const updateOnboardingMutation = useMutation({
    mutationFn: async (data) => {
      await base44.auth.updateMe(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
    }
  });

  useEffect(() => {
    if (user && !user.onboarding_completed && projects.length === 0) {
      setShowWelcomeTour(true);
    }
  }, [user, projects]);

  const handleTourComplete = () => {
    setShowWelcomeTour(false);
    updateOnboardingMutation.mutate({ onboarding_completed: true });
  };

  const downloadBrandingKit = async (project) => {
    setGeneratingKit(project.id);
    setBrandingKitProject(project);
    
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const element = brandingKitRef.current;
      if (!element) throw new Error('Could not render branding kit');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 800
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      let heightLeft = imgHeight * ratio;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${project.business_name}_Brand_Guidelines.pdf`);
      toast.success('Brand Guidelines downloaded!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingKit(null);
      setBrandingKitProject(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'in_progress': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStepProgress = (project) => {
    const steps = [
      { done: !!project.market_research, icon: Radar, label: 'Research' },
      { done: !!project.business_plan, icon: FileBarChart, label: 'Plan' },
      { done: !!project.logo_url, icon: Wand2, label: 'Logo' },
      { done: !!project.website_content, icon: Globe2, label: 'Website' },
      { done: project.social_media_assets?.length > 0, icon: Megaphone, label: 'Social' }
    ];
    return steps;
  };

  // Analytics calculations
  const getProjectStats = () => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const inProgress = projects.filter(p => p.status === 'in_progress').length;
    const draft = projects.filter(p => p.status === 'draft').length;
    
    return { total, completed, inProgress, draft };
  };

  const getFinancialSummary = () => {
    let totalRevenue = 0;
    let totalStartupCosts = 0;
    let totalFunding = 0;
    
    projects.forEach(project => {
      if (project.financial_data?.revenue_streams) {
        totalRevenue += project.financial_data.revenue_streams.reduce((sum, s) => sum + (s.year1_revenue || 0), 0);
      }
      if (project.financial_data?.startup_costs) {
        totalStartupCosts += Object.values(project.financial_data.startup_costs).reduce((sum, v) => sum + (v || 0), 0);
      }
      if (project.financial_data?.funding_rounds) {
        totalFunding += project.financial_data.funding_rounds.reduce((sum, r) => sum + (r.amount || 0), 0);
      }
    });
    
    return { totalRevenue, totalStartupCosts, totalFunding };
  };

  const getRecentActivities = () => {
    const activities = [];
    
    projects.forEach(project => {
      if (project.logo_url) {
        activities.push({
          id: `${project.id}-logo`,
          type: 'logo',
          project: project.business_name,
          date: project.updated_date,
          icon: Wand2,
          color: 'text-purple-400'
        });
      }
      if (project.business_plan) {
        activities.push({
          id: `${project.id}-plan`,
          type: 'business_plan',
          project: project.business_name,
          date: project.updated_date,
          icon: FileBarChart,
          color: 'text-blue-400'
        });
      }
      if (project.website_content) {
        activities.push({
          id: `${project.id}-website`,
          type: 'website',
          project: project.business_name,
          date: project.updated_date,
          icon: Globe2,
          color: 'text-green-400'
        });
      }
    });
    
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  };

  const stats = getProjectStats();
  const financials = getFinancialSummary();
  const recentActivities = getRecentActivities();

  const statusData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
    { name: 'Draft', value: stats.draft, color: '#64748b' }
  ];

  const completionData = (projects || []).map(p => ({
    name: (p.business_name || 'Untitled').substring(0, 15),
    completion: (getStepProgress(p).filter(s => s.done).length / 5) * 100
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <WelcomeTour 
        open={showWelcomeTour} 
        onClose={() => setShowWelcomeTour(false)}
        onComplete={handleTourComplete}
      />
      
      {/* Hidden branding kit renderer */}
      {brandingKitProject && (
        <div className="fixed left-[-9999px] top-0">
          <div ref={brandingKitRef} style={{ width: '800px' }}>
            <BrandingKitDocument project={brandingKitProject} />
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.02em]">Dashboard</h1>
            <p className="text-slate-400 mt-2 leading-[1.6] tracking-[-0.011em]">Overview of your business projects and performance</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowWelcomeTour(true)}
              className="border-slate-700 text-white hover:bg-slate-800"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View Tour
            </Button>
            <Link to={createPageUrl('CreateBusiness')}>
              <Button className="h-14 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/20 font-semibold">
                <Sparkles className="w-5 h-5 mr-2" />
                New Business
              </Button>
            </Link>
          </div>
        </div>

        {/* Onboarding Checklist - Show for users who haven't completed onboarding */}
        {user && !user.onboarding_completed && (
          <div className="mb-8">
            <OnboardingChecklist 
              checklist={user.onboarding_checklist || {}}
              projects={projects}
            />
          </div>
        )}

        {projects.length > 0 && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Projects</p>
                      <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Completed</p>
                      <p className="text-2xl font-bold text-white">{stats.completed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Year 1 Revenue</p>
                      <p className="text-2xl font-bold text-white">${(financials.totalRevenue / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Funding</p>
                      <p className="text-2xl font-bold text-white">${(financials.totalFunding / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Activities */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Project Status Chart */}
              <Card className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-amber-400" />
                    Project Status
                  </CardTitle>
                  <CardDescription className="text-slate-400">Distribution by completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPie>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {statusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-400">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Completion Progress */}
              <Card className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Completion Rate
                  </CardTitle>
                  <CardDescription className="text-slate-400">Project build progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={completionData}>
                      <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="completion" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-slate-400">Latest updates and assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.length > 0 ? recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className={`w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center ${activity.color}`}>
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{activity.project}</p>
                          <p className="text-xs text-slate-400 capitalize">{activity.type.replace('_', ' ')}</p>
                        </div>
                        <span className="text-xs text-slate-500">{format(new Date(activity.date), 'MMM d')}</span>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-400 text-center py-8">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-7 gap-4 mb-8">
          <Link to={createPageUrl('Resources')}>
            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <Phone className="w-9 h-9 text-purple-400 mb-2" />
                <h3 className="font-semibold text-white text-sm mb-0.5">Phone Services</h3>
                <p className="text-xs text-slate-400">RingCentral & Dialpad</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={createPageUrl('Advertising')}>
            <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <Megaphone className="w-9 h-9 text-orange-400 mb-2" />
                <h3 className="font-semibold text-white text-sm mb-0.5">Advertising</h3>
                <p className="text-xs text-slate-400">Adwizar.ai</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={createPageUrl('VideoCreation')}>
            <Card className="border-0 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <Video className="w-9 h-9 text-red-400 mb-2" />
                <h3 className="font-semibold text-white text-sm mb-0.5">Video Studio</h3>
                <p className="text-xs text-slate-400">Commercial creation</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={createPageUrl('KnowledgeBase')}>
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <BookText className="w-9 h-9 text-blue-400 mb-2" />
                <h3 className="font-semibold text-white text-sm mb-0.5">Knowledge Base</h3>
                <p className="text-xs text-slate-400">Help & Docs</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={createPageUrl('ColorThemes')}>
            <Card className="border-0 bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 hover:border-pink-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <Palette className="w-9 h-9 text-pink-400 mb-2" />
                <h3 className="font-semibold text-white text-sm mb-0.5">Color Themes</h3>
                <p className="text-xs text-slate-400">Appearance</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={createPageUrl('SEOTools')}>
            <Card className="border-0 bg-gradient-to-br from-teal-500/10 to-teal-600/10 border border-teal-500/20 hover:border-teal-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <Search className="w-9 h-9 text-teal-400 mb-2" />
                <h3 className="font-semibold text-white text-sm mb-0.5">SEO Tools</h3>
                <p className="text-xs text-slate-400">Optimize rankings</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={createPageUrl('CustomerJourney')}>
            <Card className="border-0 bg-gradient-to-br from-violet-500/10 to-violet-600/10 border border-violet-500/20 hover:border-violet-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <MapIcon className="w-9 h-9 text-violet-400 mb-2" />
                <h3 className="font-semibold text-white text-sm mb-0.5">Journey Map</h3>
                <p className="text-xs text-slate-400">Customer flow</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={createPageUrl('AccountSettings')}>
            <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <Settings className="w-9 h-9 text-emerald-400 mb-2" />
                <h3 className="font-semibold text-white text-sm mb-0.5">Settings</h3>
                <p className="text-xs text-slate-400">Account & API</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Projects Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Your Projects</h2>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 bg-slate-800/50 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-700 rounded w-2/3 mb-4" />
                  <div className="h-4 bg-slate-700/50 rounded w-1/2 mb-6" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="w-8 h-8 bg-slate-700/50 rounded" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mx-auto mb-6 flex items-center justify-center shadow-xl shadow-amber-500/20">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-[-0.02em]">Create Your First Business</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto leading-[1.6] tracking-[-0.011em]">Launch a complete brand with AI-powered market research, business planning, and design</p>
              <Link to={createPageUrl('CreateBusiness')}>
                <Button className="h-14 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl font-semibold">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const primaryColor = Array.isArray(project.brand_colors) 
                ? project.brand_colors.find(c => c.role === 'primary')?.hex || project.brand_colors[0]?.hex 
                : project.brand_colors?.primary || '#6366f1';
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-800/50 backdrop-blur-sm group overflow-hidden hover:border-slate-600 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {project.logo_url ? (
                            <div className="logo w-14 h-14 rounded-xl overflow-hidden shadow-lg" style={{ background: 'transparent' }}>
                              <img
                                src={project.logo_url}
                                alt={project.business_name}
                                className="w-full h-full object-contain"
                                style={{ background: 'transparent' }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `<div class="w-full h-full rounded-xl flex items-center justify-center text-white font-bold text-xl" style="background-color: ${primaryColor}">${project.business_name?.[0]?.toUpperCase() || 'B'}</div>`;
                                }}
                              />
                            </div>
                          ) : (
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                              style={{ backgroundColor: primaryColor }}
                            >
                              {project.business_name?.[0]?.toUpperCase() || 'B'}
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg text-white tracking-[-0.02em]">{project.business_name}</CardTitle>
                            <p className="text-sm text-slate-400 tracking-[-0.011em]">{project.industry}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <Link to={createPageUrl(`CreateBusiness?projectId=${project.id}`)}>
                              <DropdownMenuItem className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700">
                                <Eye className="w-4 h-4 mr-2" />
                                View / Edit
                              </DropdownMenuItem>
                            </Link>
                            <Link to={createPageUrl(`BusinessReport?projectId=${project.id}`)}>
                              <DropdownMenuItem className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700">
                                <FileDown className="w-4 h-4 mr-2" />
                                Business Report
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700"
                              onClick={() => downloadBrandingKit(project)}
                              disabled={generatingKit === project.id}
                            >
                              {generatingKit === project.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <BookText className="w-4 h-4 mr-2" />
                              )}
                              Brand Guidelines
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20"
                              onClick={() => deleteMutation.mutate(project.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={`${
                          project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                          project.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
                          'bg-slate-500/20 text-slate-400 border-slate-500/30'
                        } border`}>
                          {project.status === 'completed' ? 'Completed' : 
                           project.status === 'in_progress' ? 'In Progress' : 'Draft'}
                        </Badge>
                        <div className="flex items-center text-xs text-slate-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(project.created_date), 'MMM d, yyyy')}
                        </div>
                      </div>
                      
                      {/* Progress indicators */}
                      <div className="flex items-center gap-2 mb-4">
                        {getStepProgress(project).map((step, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              step.done 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-slate-700/50 text-slate-500'
                            }`}
                            title={step.label}
                          >
                            <step.icon className="w-4 h-4" />
                          </div>
                        ))}
                      </div>

                      <Link to={createPageUrl(`CreateBusiness?projectId=${project.id}`)}>
                        <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-slate-600 hover:border-slate-500">
                          {project.status === 'completed' ? 'View Project' : 'Continue Building'}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
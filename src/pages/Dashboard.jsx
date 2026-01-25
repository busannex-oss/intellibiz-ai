import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Zap
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

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [generatingKit, setGeneratingKit] = useState(null);
  const brandingKitRef = useRef(null);
  const [brandingKitProject, setBrandingKitProject] = useState(null);
  
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.BusinessProject.list('-created_date')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BusinessProject.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    }
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">My Projects</h1>
            <p className="text-slate-400 mt-2">Manage your business brands and assets</p>
          </div>
          <Link to={createPageUrl('CreateBusiness')}>
            <Button className="h-14 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/20 font-semibold">
              <Sparkles className="w-5 h-5 mr-2" />
              New Business
            </Button>
          </Link>
        </div>

        {/* Projects Grid */}
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
              <h3 className="text-2xl font-bold text-white mb-2">Create Your First Business</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Launch a complete brand with AI-powered market research, business planning, and design</p>
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
                            <img
                              src={project.logo_url}
                              alt={project.business_name}
                              className="w-14 h-14 rounded-xl object-cover shadow-lg ring-2 ring-white/10"
                            />
                          ) : (
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                              style={{ backgroundColor: primaryColor }}
                            >
                              {project.business_name?.[0]?.toUpperCase() || 'B'}
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg text-white">{project.business_name}</CardTitle>
                            <p className="text-sm text-slate-400">{project.industry}</p>
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
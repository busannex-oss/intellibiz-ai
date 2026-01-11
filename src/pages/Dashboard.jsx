import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Building2, 
  FileText, 
  Palette, 
  Globe, 
  Share2,
  ChevronRight,
  Calendar,
  MoreVertical,
  Trash2,
  Eye,
  Search
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function Dashboard() {
  const queryClient = useQueryClient();
  
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'in_progress': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStepProgress = (project) => {
    const steps = [
      { done: !!project.market_research, icon: Search, label: 'Research' },
      { done: !!project.business_plan, icon: FileText, label: 'Plan' },
      { done: !!project.logo_url, icon: Palette, label: 'Logo' },
      { done: !!project.website_content, icon: Globe, label: 'Website' },
      { done: project.social_media_assets?.length > 0, icon: Share2, label: 'Social' }
    ];
    return steps;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">My Projects</h1>
            <p className="text-slate-500 mt-1">Manage your business brands and assets</p>
          </div>
          <Link to={createPageUrl('CreateBusiness')}>
            <Button className="h-12 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              New Business
            </Button>
          </Link>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-200 rounded w-2/3 mb-4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2 mb-6" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="w-8 h-8 bg-slate-100 rounded" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-violet-100 mx-auto mb-6 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No projects yet</h3>
              <p className="text-slate-500 mb-6">Start building your first business with AI</p>
              <Link to={createPageUrl('CreateBusiness')}>
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Business
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {project.logo_url ? (
                          <img
                            src={project.logo_url}
                            alt={project.business_name}
                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                          />
                        ) : (
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: project.brand_colors?.primary || '#6366f1' }}
                          >
                            {project.business_name?.[0]?.toUpperCase() || 'B'}
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">{project.business_name}</CardTitle>
                          <p className="text-sm text-slate-500">{project.industry}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link to={createPageUrl(`CreateBusiness?projectId=${project.id}`)}>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View / Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="text-red-600"
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
                      <Badge className={getStatusColor(project.status)}>
                        {project.status === 'completed' ? 'Completed' : 
                         project.status === 'in_progress' ? 'In Progress' : 'Draft'}
                      </Badge>
                      <div className="flex items-center text-xs text-slate-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(project.created_date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    
                    {/* Progress indicators */}
                    <div className="flex items-center gap-2 mb-4">
                      {getStepProgress(project).map((step, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            step.done 
                              ? 'bg-emerald-100 text-emerald-600' 
                              : 'bg-slate-100 text-slate-400'
                          }`}
                          title={step.label}
                        >
                          <step.icon className="w-4 h-4" />
                        </div>
                      ))}
                    </div>

                    <Link to={createPageUrl(`CreateBusiness?projectId=${project.id}`)}>
                      <Button variant="outline" className="w-full group-hover:bg-violet-50 group-hover:border-violet-200 group-hover:text-violet-700 transition-colors">
                        {project.status === 'completed' ? 'View Project' : 'Continue Building'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
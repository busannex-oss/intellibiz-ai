import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import StepIndicator from '@/components/wizard/StepIndicator';
import MarketResearchStep from '@/components/wizard/MarketResearchStep';
import BusinessPlanStep from '@/components/wizard/BusinessPlanStep';
import LogoStep from '@/components/wizard/LogoStep';
import WebsiteStep from '@/components/wizard/WebsiteStep';
import SocialMediaStep from '@/components/wizard/SocialMediaStep';
import NewsletterStep from '@/components/wizard/NewsletterStep';
import OmnichannelStep from '@/components/wizard/OmnichannelStep';

import BusinessChatWidget from '@/components/chatbot/BusinessChatWidget';

export default function CreateBusiness() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [project, setProject] = useState(null);

  // Load existing project if ID is provided
  const { data: existingProject, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.BusinessProject.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  useEffect(() => {
    if (existingProject) {
      setProject(existingProject);
      setCurrentStep(existingProject.current_step || 1);
    }
  }, [existingProject]);

  const createProjectMutation = useMutation({
    mutationFn: (data) => base44.entities.BusinessProject.create(data),
    onSuccess: (newProject) => {
      setProject(newProject);
      setSearchParams({ projectId: newProject.id });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data) => base44.entities.BusinessProject.update(project.id, data),
    onSuccess: (updatedProject) => {
      setProject(updatedProject);
      queryClient.invalidateQueries(['project', projectId]);
    }
  });

  const handleUpdate = async (data) => {
    if (project?.id) {
      await updateProjectMutation.mutateAsync(data);
    } else {
      await createProjectMutation.mutateAsync({ ...data, status: 'in_progress' });
    }
  };

  const handleNext = async () => {
    const newStep = Math.min(currentStep + 1, 7);
    setCurrentStep(newStep);
    if (project?.id) {
      await updateProjectMutation.mutateAsync({ current_step: newStep });
    }
  };

  const handlePrev = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleStepClick = (step) => {
    if (step <= (project?.current_step || 1)) {
      setCurrentStep(step);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 text-violet-600 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Business Builder
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {project?.business_name ? `Building: ${project.business_name}` : 'Create Your Business'}
          </h1>
          <p className="text-slate-500">Follow the streamlined 7-step process to launch your brand</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} />

        {/* Step Content */}
        <div className="mt-8 pb-12">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <MarketResearchStep
                key="step1"
                project={project}
                onUpdate={handleUpdate}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <BusinessPlanStep
                key="step2"
                project={project}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 3 && (
              <LogoStep
                key="step3"
                project={project}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 4 && (
              <SocialMediaStep
                key="step4"
                project={project}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 5 && (
              <OmnichannelStep
                key="step5"
                project={project}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 6 && (
              <NewsletterStep
                key="step6"
                project={project}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 7 && (
              <WebsiteStep
                key="step7"
                project={project}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* AI Chat Widget */}
      {project && <BusinessChatWidget project={project} />}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';

import StepIndicator from '@/components/wizard/StepIndicator';
import MarketResearchStep from '@/components/wizard/MarketResearchStep';
import BusinessPlanStep from '@/components/wizard/BusinessPlanStep';
import LogoStep from '@/components/wizard/LogoStep';
import WebsiteStep from '@/components/wizard/WebsiteStep';
import SocialMediaStep from '@/components/wizard/SocialMediaStep';
import ResourcesStep from '@/components/wizard/ResourcesStep';
import NewsletterStep from '@/components/wizard/NewsletterStep';
import OmnichannelStep from '@/components/wizard/OmnichannelStep';

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
    const newStep = Math.min(currentStep + 1, 8);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {project?.business_name ? `Building: ${project.business_name}` : 'Create Your Business'}
          </h1>
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
              <WebsiteStep
                key="step4"
                project={project}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 5 && (
              <SocialMediaStep
                key="step5"
                project={project}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 6 && (
              <OmnichannelStep
                key="step6"
                project={project}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 7 && (
              <ResourcesStep
                key="step7"
                project={project}
                projectId={projectId}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 8 && (
              <NewsletterStep
                key="step8"
                project={project}
                onUpdate={handleUpdate}
                onPrev={handlePrev}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
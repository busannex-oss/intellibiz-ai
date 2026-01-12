import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import UnifiedInbox from '@/components/omnichannel/UnifiedInbox';
import ChannelSetup from '@/components/omnichannel/ChannelSetup';
import OmnichannelAnalytics from '@/components/omnichannel/OmnichannelAnalytics';
import ChatWidget from '@/components/omnichannel/ChatWidget';

export default function Omnichannel() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [activeTab, setActiveTab] = useState('inbox');
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['omnichannelConfig', projectId],
    queryFn: async () => {
      const configs = await base44.entities.OmnichannelConfig.filter({ project_id: projectId });
      return configs[0];
    },
    enabled: !!projectId
  });

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.BusinessProject.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  const createConfigMutation = useMutation({
    mutationFn: (data) => base44.entities.OmnichannelConfig.create(data),
    onSuccess: () => queryClient.invalidateQueries(['omnichannelConfig', projectId])
  });

  const updateConfigMutation = useMutation({
    mutationFn: (data) => base44.entities.OmnichannelConfig.update(config.id, data),
    onSuccess: () => queryClient.invalidateQueries(['omnichannelConfig', projectId])
  });

  const handleSaveConfig = async (data) => {
    if (config?.id) {
      await updateConfigMutation.mutateAsync(data);
    } else {
      await createConfigMutation.mutateAsync({ project_id: projectId, ...data });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl(`CreateBusiness?projectId=${projectId}`)}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Omnichannel Hub
                </h1>
                <p className="text-sm text-slate-500">{project?.business_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="inbox">Unified Inbox</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="widget">Chat Widget</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox">
            <UnifiedInbox projectId={projectId} config={config} />
          </TabsContent>
          <TabsContent value="channels">
            <ChannelSetup config={config} onSave={handleSaveConfig} project={project} />
          </TabsContent>
          <TabsContent value="widget">
            <ChatWidget config={config} project={project} onSave={handleSaveConfig} />
          </TabsContent>
          <TabsContent value="analytics">
            <OmnichannelAnalytics projectId={projectId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
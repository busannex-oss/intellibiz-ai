import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Phone, 
  MessageSquare, 
  Settings, 
  Users, 
  BarChart3, 
  Workflow,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import ProviderSetup from '@/components/phone/ProviderSetup';
import Switchboard from '@/components/phone/Switchboard';
import CallLogs from '@/components/phone/CallLogs';
import SMSInbox from '@/components/phone/SMSInbox';
import PhoneNumbers from '@/components/phone/PhoneNumbers';
import Extensions from '@/components/phone/Extensions';
import IVRBuilder from '@/components/phone/IVRBuilder';
import AISettings from '@/components/phone/AISettings';
import Analytics from '@/components/phone/Analytics';

export default function PhoneSystemPage() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [activeTab, setActiveTab] = useState('switchboard');
  const queryClient = useQueryClient();

  const { data: phoneSystem, isLoading } = useQuery({
    queryKey: ['phoneSystem', projectId],
    queryFn: async () => {
      const systems = await base44.entities.PhoneSystem.filter({ project_id: projectId });
      return systems[0];
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

  const createPhoneSystemMutation = useMutation({
    mutationFn: (data) => base44.entities.PhoneSystem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['phoneSystem', projectId]);
    }
  });

  const updatePhoneSystemMutation = useMutation({
    mutationFn: (data) => base44.entities.PhoneSystem.update(phoneSystem.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['phoneSystem', projectId]);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show provider setup if not configured
  if (!phoneSystem || !phoneSystem.provider_configured) {
    return (
      <ProviderSetup
        projectId={projectId}
        project={project}
        phoneSystem={phoneSystem}
        onCreate={createPhoneSystemMutation.mutate}
        onUpdate={(data) => updatePhoneSystemMutation.mutate(data)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-violet-600" />
                  {project?.business_name} Phone System
                </h1>
                <p className="text-sm text-slate-500">
                  Powered by {phoneSystem.provider?.charAt(0).toUpperCase() + phoneSystem.provider?.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Number
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-9 h-12 bg-white shadow-sm mb-6">
            <TabsTrigger value="switchboard" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">Switchboard</span>
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">Calls</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">SMS</span>
            </TabsTrigger>
            <TabsTrigger value="numbers" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">Numbers</span>
            </TabsTrigger>
            <TabsTrigger value="extensions" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="ivr" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              <span className="hidden md:inline">IVR</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">AI</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="switchboard">
            <Switchboard phoneSystem={phoneSystem} projectId={projectId} />
          </TabsContent>
          <TabsContent value="calls">
            <CallLogs phoneSystem={phoneSystem} projectId={projectId} />
          </TabsContent>
          <TabsContent value="sms">
            <SMSInbox phoneSystem={phoneSystem} projectId={projectId} />
          </TabsContent>
          <TabsContent value="numbers">
            <PhoneNumbers phoneSystem={phoneSystem} onUpdate={updatePhoneSystemMutation.mutate} />
          </TabsContent>
          <TabsContent value="extensions">
            <Extensions phoneSystem={phoneSystem} onUpdate={updatePhoneSystemMutation.mutate} />
          </TabsContent>
          <TabsContent value="ivr">
            <IVRBuilder phoneSystem={phoneSystem} onUpdate={updatePhoneSystemMutation.mutate} />
          </TabsContent>
          <TabsContent value="ai">
            <AISettings phoneSystem={phoneSystem} project={project} onUpdate={updatePhoneSystemMutation.mutate} />
          </TabsContent>
          <TabsContent value="analytics">
            <Analytics phoneSystem={phoneSystem} projectId={projectId} />
          </TabsContent>
          <TabsContent value="settings">
            <ProviderSetup
              projectId={projectId}
              project={project}
              phoneSystem={phoneSystem}
              onUpdate={(data) => updatePhoneSystemMutation.mutate(data)}
              isSettings={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
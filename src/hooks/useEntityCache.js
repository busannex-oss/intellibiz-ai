import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useAgents(enabled = true) {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const data = await base44.entities.AIAgent.list();
      return data.filter(a => a.is_active);
    },
    enabled,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.AgentConversation.list('-created_date'),
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
}

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: () => base44.entities.AgentWorkflow.list('-created_date'),
    staleTime: 5 * 60 * 1000
  });
}

export function useMetrics(agentId = null) {
  return useQuery({
    queryKey: ['metrics', agentId],
    queryFn: async () => {
      const data = await base44.entities.AgentPerformanceMetric.list('-metric_date');
      return agentId ? data.filter(m => m.agent_id === agentId) : data;
    },
    staleTime: 10 * 60 * 1000
  });
}

export function useActiveSessions() {
  return useQuery({
    queryKey: ['activeSessions'],
    queryFn: async () => {
      const [calls, sms, email] = await Promise.all([
        base44.entities.CallSession.filter({ status: { $in: ['ringing', 'active'] } }),
        base44.entities.SMSSession.filter({ requires_response: true }),
        base44.entities.EmailSession.filter({ requires_response: true })
      ]);
      return { calls, sms, email };
    },
    staleTime: 3 * 1000, // 3 seconds for real-time feel
    refetchInterval: 5000
  });
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => base44.entities.WorkflowReport.list('-created_date'),
    staleTime: 10 * 60 * 1000
  });
}

export function useSchedules() {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: () => base44.entities.ReportSchedule.list(),
    staleTime: 15 * 60 * 1000
  });
}

export function useVersionHistory(agentId) {
  return useQuery({
    queryKey: ['versions', agentId],
    queryFn: () => base44.entities.AgentVersionHistory.filter(
      { agent_id: agentId },
      '-created_date'
    ),
    staleTime: 10 * 60 * 1000,
    enabled: !!agentId
  });
}
import { base44 } from '@/api/base44Client';

// Assign session to agent
export async function assignSessionToAgent(sessionId, agentId, entityName) {
  const agent = await base44.entities.AIAgent.get(agentId);
  return base44.entities[entityName].update(sessionId, {
    assigned_agent_id: agentId,
    assigned_agent_name: `${agent.first_name} ${agent.last_name}`
  });
}

// Mark session as resolved
export async function markSessionResolved(sessionId, entityName, status = 'resolved') {
  return base44.entities[entityName].update(sessionId, {
    requires_response: false,
    status
  });
}

// Send response (SMS/Email)
export async function sendResponse(type, params) {
  return base44.functions.invoke(
    type === 'sms' ? 'sendSMSReply' : 'sendEmailReply',
    params
  );
}

// Format agent name
export function formatAgentName(agent) {
  return `${agent.first_name} ${agent.last_name}`;
}

// Get status badge classes
export function getStatusBadgeClasses(status) {
  const classes = {
    active: 'bg-green-100 text-green-700',
    ringing: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-blue-100 text-blue-700',
    resolved: 'bg-slate-100 text-slate-700',
    sent: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-slate-100 text-slate-700'
  };
  return classes[status] || 'bg-slate-100 text-slate-700';
}

// Format date/time
export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString();
}

// Format date only
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

// Calculate success rate
export function calculateSuccessRate(successful, total) {
  if (total === 0) return 0;
  return Math.round((successful / total) * 100);
}

// Get time ago string
export function getTimeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
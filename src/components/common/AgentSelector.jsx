import React from 'react';
import { useAgents } from '@/hooks/useEntityCache';
import { Loader2 } from 'lucide-react';

export default function AgentSelector({ selectedAgent, onSelect, multiple = false }) {
  const { data: agents, isLoading } = useAgents();

  if (isLoading) {
    return <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading agents...</div>;
  }

  if (multiple) {
    return (
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {agents?.map(agent => (
          <label key={agent.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedAgent.includes(agent.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  onSelect([...selectedAgent, agent.id]);
                } else {
                  onSelect(selectedAgent.filter(id => id !== agent.id));
                }
              }}
              className="w-4 h-4"
            />
            <span className="text-sm">{agent.first_name} {agent.last_name}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {agents?.map(agent => (
        <button
          key={agent.id}
          onClick={() => onSelect(agent.id)}
          className={`p-3 rounded-lg border transition-all text-center ${
            selectedAgent === agent.id
              ? 'bg-violet-100 border-violet-300'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <p className="font-medium text-sm">{agent.first_name}</p>
          <p className="text-xs text-slate-600">{agent.job_title}</p>
        </button>
      ))}
    </div>
  );
}
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2, Edit2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const statusColors = {
    todo: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'To Do', icon: Circle },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress', icon: Clock },
    done: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Done', icon: CheckCircle2 }
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const status = statusColors[task.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={task.status === 'done' ? 'line-through text-slate-500' : 'font-semibold text-slate-800'}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-8 w-8">
            <Edit2 className="w-4 h-4 text-slate-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="h-8 w-8">
            <Trash2 className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => onStatusChange(task.id, task.status === 'done' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'in_progress')}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
        >
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </button>

        <Badge className={`${priorityColors[task.priority]} text-xs`}>
          {task.priority}
        </Badge>

        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-slate-500 px-2 py-1 bg-slate-50 rounded-full">
            <Calendar className="w-3 h-3" />
            {format(new Date(task.due_date), 'MMM d')}
          </div>
        )}

        {task.assigned_to && (
          <div className="text-xs text-slate-500 px-2 py-1 bg-slate-50 rounded-full truncate">
            {task.assigned_to}
          </div>
        )}
      </div>
    </div>
  );
}
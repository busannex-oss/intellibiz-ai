import React from 'react';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskBoard({ tasks, onEdit, onDelete, onStatusChange, onNewTask }) {
  const columns = [
    { id: 'todo', label: 'To Do', color: 'bg-slate-50' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-blue-50' },
    { id: 'done', label: 'Done', color: 'bg-emerald-50' }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map(column => (
        <div key={column.id} className={`${column.color} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              {column.label}
              <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </h3>
          </div>

          <div className="space-y-3 min-h-[400px]">
            {tasks.filter(t => t.status === column.id).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>

          {column.id === 'todo' && (
            <Button
              onClick={onNewTask}
              variant="outline"
              className="w-full mt-3 text-slate-600"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}